<?php
/**
 * E-Mail Relay Endpoint für Naturheilpraxis Rauch - VERSION 3.1 (QMail SMTP Auth)
 * 
 * Optimiert für Plesk + QMail mit aktiviertem SMTP-Service auf Port 587.
 * Verwendet authentifiziertes SMTP via fsockopen mit STARTTLS.
 * 
 * INSTALLATION:
 * 1. Diese Datei auf den Server kopieren nach:
 *    /var/www/vhosts/rauch-heilpraktiker.de/httpdocs/mail-relay.php
 * 2. RELAY_SECRET, SMTP_USER und SMTP_PASS unten konfigurieren
 * 3. Alte mail-relay.php vorher sichern (umbenennen in mail-relay.php.bak)
 */

$RELAY_VERSION = '2026-02-26-v3.1-qmail';

// CORS Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Relay-Token');

// Debug-Log
function relay_log($message) {
    $line = '[' . date('c') . '] ' . $message . "\n";
    @file_put_contents(__DIR__ . '/mail-debug.log', $line, FILE_APPEND);
}

// OPTIONS Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Nur POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed', 'version' => $RELAY_VERSION]);
    exit;
}

// ============================================
// KONFIGURATION - BITTE ANPASSEN!
// ============================================
$RELAY_SECRET = '998a476a-cf1c-7443-ea47-3e329d70e934';

// SMTP-Zugangsdaten (Plesk-Postfach, QMail SMTP auf Port 587)
$SMTP_HOST  = 'localhost';                 // QMail lauscht auf allen IPs, localhost ist korrekt
$SMTP_PORT  = 587;                         // Submission-Port (Plesk QMail SMTP-Service)
$SMTP_USER  = 'info@rauch-heilpraktiker.de';
$SMTP_PASS  = '';                          // <-- HIER DAS POSTFACH-PASSWORT EINTRAGEN
$SMTP_SECURE = false;                      // false = STARTTLS wird automatisch verhandelt auf 587

// Token validieren
$token = $_SERVER['HTTP_X_RELAY_TOKEN'] ?? '';
if (empty($token) || !hash_equals($RELAY_SECRET, $token)) {
    http_response_code(401);
    relay_log('Unauthorized: remote=' . ($_SERVER['REMOTE_ADDR'] ?? '-'));
    echo json_encode(['success' => false, 'error' => 'Unauthorized', 'version' => $RELAY_VERSION]);
    exit;
}

// JSON Body lesen
$input = file_get_contents('php://input');
if (empty($input)) {
    http_response_code(400);
    relay_log('Empty input! CONTENT_LENGTH=' . ($_SERVER['CONTENT_LENGTH'] ?? 'unknown'));
    echo json_encode(['success' => false, 'error' => 'Empty request body', 'version' => $RELAY_VERSION]);
    exit;
}

$data = json_decode($input, true);
if (!$data) {
    http_response_code(400);
    relay_log('Invalid JSON: len=' . strlen($input));
    echo json_encode(['success' => false, 'error' => 'Invalid JSON', 'version' => $RELAY_VERSION]);
    exit;
}

// Pflichtfelder
$to      = filter_var($data['to'] ?? '', FILTER_VALIDATE_EMAIL);
$subject = trim($data['subject'] ?? '');
$html    = $data['html'] ?? '';
$from    = filter_var($data['from'] ?? 'info@rauch-heilpraktiker.de', FILTER_VALIDATE_EMAIL);

if (!$to || !$subject || !$html) {
    http_response_code(400);
    relay_log('Missing fields: to=' . ($data['to'] ?? '-'));
    echo json_encode(['success' => false, 'error' => 'Missing required fields', 'version' => $RELAY_VERSION]);
    exit;
}

$attachment = $data['attachment'] ?? null;
$attachInfo = 'no';
if ($attachment) {
    $b64len = strlen($attachment['base64'] ?? '');
    $attachInfo = "yes (filename={$attachment['filename']}, base64_len=$b64len, decoded_bytes=" . intval($b64len * 0.75) . ")";
}
relay_log("Accepted: to=$to from=$from subject=$subject attachment=$attachInfo");

// Subject UTF-8 encoding
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

// ============================================
// SMTP-Versand via fsockopen (QMail-kompatibel)
// ============================================
function smtp_send($host, $port, $user, $pass, $secure, $from, $to, $headers, $body) {
    $errors = [];
    
    $prefix = $secure ? 'ssl://' : '';
    $timeout = 30;
    
    relay_log("SMTP connecting to {$prefix}{$host}:{$port} (QMail)");
    
    $sock = @fsockopen($prefix . $host, $port, $errno, $errstr, $timeout);
    if (!$sock) {
        return "Connection failed: $errstr ($errno)";
    }
    
    // Timeouts für Socket-Reads setzen (wichtig für QMail)
    stream_set_timeout($sock, 30);
    
    // Helper: read response (QMail-kompatibel, mit Timeout-Schutz)
    $readResponse = function() use ($sock) {
        $response = '';
        while ($line = fgets($sock, 512)) {
            $response .= $line;
            // Multiline response endet wenn 4. Zeichen ein Leerzeichen ist
            if (isset($line[3]) && $line[3] === ' ') break;
            // Einzeilige Antwort ohne Continuation
            if (strlen($line) < 4) break;
        }
        return $response;
    };
    
    // Helper: send command and check response
    $sendCmd = function($cmd, $expectedCode) use ($sock, $readResponse, &$errors) {
        fwrite($sock, $cmd . "\r\n");
        $resp = $readResponse();
        $code = (int)substr($resp, 0, 3);
        relay_log("SMTP >> " . trim($cmd) . " → $code");
        if ($code !== $expectedCode) {
            $errors[] = "CMD '" . (strpos($cmd, 'AUTH') === 0 ? 'AUTH...' : $cmd) . "' expected $expectedCode got $code: " . trim($resp);
            return false;
        }
        return $resp;
    };
    
    // Read greeting
    $greeting = $readResponse();
    relay_log("SMTP greeting: " . trim($greeting));
    
    // Prüfe ob Greeting gültig (2xx)
    $greetCode = (int)substr($greeting, 0, 3);
    if ($greetCode < 200 || $greetCode >= 300) {
        fclose($sock);
        return "Bad greeting ($greetCode): " . trim($greeting);
    }
    
    // EHLO mit dem eigenen Domain-Namen (QMail bevorzugt FQDN)
    $ehloHost = 'rauch-heilpraktiker.de';
    $ehloResp = $sendCmd("EHLO $ehloHost", 250);
    if (!$ehloResp) {
        // Fallback: HELO statt EHLO (ältere QMail-Versionen)
        relay_log("EHLO failed, trying HELO");
        $errors = [];
        $heloResp = $sendCmd("HELO $ehloHost", 250);
        if (!$heloResp) { fclose($sock); return "HELO failed: " . implode('; ', $errors); }
        $ehloResp = $heloResp;
    }
    
    // STARTTLS wenn verfügbar (Port 587 Standard bei QMail Submission)
    if (!$secure && $port == 587 && stripos($ehloResp, 'STARTTLS') !== false) {
        relay_log("STARTTLS initiating...");
        $starttlsResp = $sendCmd("STARTTLS", 220);
        if (!$starttlsResp) {
            // Manche QMail-Konfigurationen unterstützen kein STARTTLS – weitermachen ohne
            relay_log("STARTTLS not available, continuing without encryption");
            $errors = [];
        } else {
            // TLS-Handshake – breites Spektrum für maximale Kompatibilität
            $cryptoMethod = STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
                $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
            }
            $cryptoOk = @stream_socket_enable_crypto($sock, true, $cryptoMethod);
            if (!$cryptoOk) {
                // Fallback: auch TLSv1.1 versuchen (ältere Plesk-Installationen)
                relay_log("TLS 1.2/1.3 failed, trying broader crypto methods");
                $cryptoOk = @stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
                if (!$cryptoOk) {
                    fclose($sock);
                    return "STARTTLS crypto handshake failed";
                }
            }
            relay_log("STARTTLS OK");
            // Re-EHLO nach STARTTLS (Pflicht laut RFC)
            $ehloResp = $sendCmd("EHLO $ehloHost", 250);
            if (!$ehloResp) {
                $errors = [];
                $sendCmd("HELO $ehloHost", 250);
            }
        }
    } elseif (!$secure && $port == 587) {
        relay_log("STARTTLS not advertised by server, continuing unencrypted");
    }
    
    // ============================================
    // AUTH – QMail unterstützt typischerweise PLAIN und LOGIN
    // Wir versuchen zuerst AUTH PLAIN, dann AUTH LOGIN als Fallback
    // ============================================
    $authenticated = false;
    
    // Methode 1: AUTH PLAIN (von QMail bevorzugt)
    if (stripos($ehloResp, 'AUTH') !== false && stripos($ehloResp, 'PLAIN') !== false) {
        relay_log("Trying AUTH PLAIN");
        // AUTH PLAIN: base64("\0user\0pass")
        $authString = base64_encode("\0" . $user . "\0" . $pass);
        $authResp = $sendCmd("AUTH PLAIN $authString", 235);
        if ($authResp) {
            $authenticated = true;
            relay_log("AUTH PLAIN OK");
        } else {
            relay_log("AUTH PLAIN failed, trying LOGIN");
            $errors = [];
        }
    }
    
    // Methode 2: AUTH LOGIN (Fallback)
    if (!$authenticated) {
        relay_log("Trying AUTH LOGIN");
        $loginResp = $sendCmd("AUTH LOGIN", 334);
        if ($loginResp) {
            $userResp = $sendCmd(base64_encode($user), 334);
            if ($userResp) {
                $passResp = $sendCmd(base64_encode($pass), 235);
                if ($passResp) {
                    $authenticated = true;
                    relay_log("AUTH LOGIN OK");
                }
            }
        }
        if (!$authenticated) {
            fclose($sock);
            return "AUTH failed (PLAIN+LOGIN): " . implode('; ', $errors);
        }
    }
    
    relay_log("SMTP authenticated as $user");
    
    // MAIL FROM
    if (!$sendCmd("MAIL FROM:<$from>", 250)) { fclose($sock); return implode('; ', $errors); }
    
    // RCPT TO
    if (!$sendCmd("RCPT TO:<$to>", 250)) { fclose($sock); return implode('; ', $errors); }
    
    // DATA
    if (!$sendCmd("DATA", 354)) { fclose($sock); return implode('; ', $errors); }
    
    // Send headers + body
    $message = $headers . "\r\n\r\n" . $body;
    // Dot-stuffing (RFC 5321)
    $message = str_replace("\r\n.", "\r\n..", $message);
    $fullMessage = $message . "\r\n.\r\n";
    
    // Chunked fwrite in 8KB Blöcken (kritisch für große PDF-Anhänge)
    $totalLen = strlen($fullMessage);
    $written = 0;
    $chunkSize = 8192;
    while ($written < $totalLen) {
        $chunk = substr($fullMessage, $written, $chunkSize);
        $bytes = fwrite($sock, $chunk);
        if ($bytes === false || $bytes === 0) {
            $errors[] = "fwrite failed at offset $written/$totalLen";
            fclose($sock);
            return implode('; ', $errors);
        }
        $written += $bytes;
    }
    relay_log("SMTP DATA sent: $written bytes total");
    
    $dataResp = $readResponse();
    $dataCode = (int)substr($dataResp, 0, 3);
    
    // QUIT
    fwrite($sock, "QUIT\r\n");
    fclose($sock);
    
    if ($dataCode !== 250) {
        return "DATA rejected ($dataCode): " . trim($dataResp);
    }
    
    return true; // success
}

// Build email
$boundary = '----=_Part_' . md5(uniqid(microtime(true)));

if ($attachment && !empty($attachment['base64']) && !empty($attachment['filename'])) {
    // Multipart mit Anhang
    $hdrs  = "From: Naturheilpraxis Rauch <$from>\r\n";
    $hdrs .= "To: $to\r\n";
    $hdrs .= "Subject: $encodedSubject\r\n";
    $hdrs .= "MIME-Version: 1.0\r\n";
    $hdrs .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
    $hdrs .= "Reply-To: $from\r\n";
    $hdrs .= "X-Mailer: NHP-Relay/3.1-QMail";
    
    $body  = "--$boundary\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $body .= $html . "\r\n\r\n";
    
    $contentType = $attachment['contentType'] ?? 'application/octet-stream';
    $filename    = $attachment['filename'];
    $body .= "--$boundary\r\n";
    $body .= "Content-Type: $contentType; name=\"$filename\"\r\n";
    $body .= "Content-Disposition: attachment; filename=\"$filename\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split($attachment['base64']) . "\r\n";
    $body .= "--$boundary--";
    
} else {
    // Einfache HTML-Mail
    $hdrs  = "From: Naturheilpraxis Rauch <$from>\r\n";
    $hdrs .= "To: $to\r\n";
    $hdrs .= "Subject: $encodedSubject\r\n";
    $hdrs .= "MIME-Version: 1.0\r\n";
    $hdrs .= "Content-Type: text/html; charset=UTF-8\r\n";
    $hdrs .= "Content-Transfer-Encoding: 8bit\r\n";
    $hdrs .= "Reply-To: $from\r\n";
    $hdrs .= "X-Mailer: NHP-Relay/3.1-QMail";
    
    $body = $html;
}

// Senden
$result = smtp_send($SMTP_HOST, $SMTP_PORT, $SMTP_USER, $SMTP_PASS, $SMTP_SECURE, $from, $to, $hdrs, $body);

if ($result === true) {
    relay_log("SMTP OK: to=$to");
    echo json_encode([
        'success' => true,
        'message' => 'Email sent via SMTP (QMail)',
        'version' => $RELAY_VERSION,
        'has_attachment' => !empty($attachment),
    ]);
} else {
    // Fallback: Falls SMTP fehlschlägt, versuche mail() als letzten Ausweg
    relay_log("SMTP FAIL: $result – trying mail() fallback");
    
    $mailHeaders = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        "From: Naturheilpraxis Rauch <$from>",
        "Reply-To: $from",
    ];
    $mailSuccess = @mail($to, $encodedSubject, $html, implode("\r\n", $mailHeaders));
    
    if ($mailSuccess) {
        relay_log("mail() fallback OK: to=$to");
        echo json_encode([
            'success' => true,
            'message' => 'Email sent via mail() fallback',
            'version' => $RELAY_VERSION,
            'smtp_error' => $result,
        ]);
    } else {
        http_response_code(500);
        relay_log("BOTH SMTP and mail() FAILED: to=$to smtp_error=$result");
        echo json_encode([
            'success' => false,
            'error' => 'Failed to send email',
            'version' => $RELAY_VERSION,
            'smtp_error' => $result,
        ]);
    }
}
