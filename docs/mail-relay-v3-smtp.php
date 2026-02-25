<?php
/**
 * E-Mail Relay Endpoint für Naturheilpraxis Rauch - VERSION 3 (SMTP Auth)
 * 
 * ÄNDERUNG: Verwendet authentifiziertes SMTP statt mail(), da Plesk/QMail
 * den Systembenutzer vom Sendmail-Zugriff ausschließt.
 * 
 * INSTALLATION:
 * 1. Diese Datei auf den Server kopieren nach:
 *    /var/www/vhosts/rauch-heilpraktiker.de/httpdocs/mail-relay.php
 * 2. RELAY_SECRET, SMTP_USER und SMTP_PASS unten konfigurieren
 * 3. Alte mail-relay.php vorher sichern (umbenennen in mail-relay.php.bak)
 */

$RELAY_VERSION = '2026-02-25-v3-smtp';

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

// SMTP-Zugangsdaten (dieselben wie im Plesk-Postfach)
$SMTP_HOST  = 'localhost';    // oder 'mail.rauch-heilpraktiker.de'
$SMTP_PORT  = 587;            // oder 25 oder 465 (SSL)
$SMTP_USER  = 'info@rauch-heilpraktiker.de';
$SMTP_PASS  = '';             // <-- HIER DAS PASSWORT DES POSTFACHS EINTRAGEN
$SMTP_SECURE = false;         // true für SSL/TLS auf Port 465

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
// SMTP-Versand via fsockopen (kein mail() nötig)
// ============================================
function smtp_send($host, $port, $user, $pass, $secure, $from, $to, $headers, $body) {
    $errors = [];
    
    $prefix = $secure ? 'ssl://' : '';
    $timeout = 30;
    
    relay_log("SMTP connecting to {$prefix}{$host}:{$port}");
    
    $sock = @fsockopen($prefix . $host, $port, $errno, $errstr, $timeout);
    if (!$sock) {
        return "Connection failed: $errstr ($errno)";
    }
    
    // Helper: read response
    $readResponse = function() use ($sock) {
        $response = '';
        while ($line = fgets($sock, 512)) {
            $response .= $line;
            if (isset($line[3]) && $line[3] === ' ') break;
        }
        return $response;
    };
    
    // Helper: send command and check response
    $sendCmd = function($cmd, $expectedCode) use ($sock, $readResponse, &$errors) {
        fwrite($sock, $cmd . "\r\n");
        $resp = $readResponse();
        $code = (int)substr($resp, 0, 3);
        if ($code !== $expectedCode) {
            $errors[] = "CMD '$cmd' expected $expectedCode got $code: " . trim($resp);
            return false;
        }
        return $resp;
    };
    
    // Read greeting
    $greeting = $readResponse();
    relay_log("SMTP greeting: " . trim($greeting));
    
    // EHLO
    $ehloResp = $sendCmd("EHLO " . gethostname(), 250);
    if (!$ehloResp) { fclose($sock); return implode('; ', $errors); }
    
    // STARTTLS if port 587 and not already SSL
    if (!$secure && $port == 587 && stripos($ehloResp, 'STARTTLS') !== false) {
        $sendCmd("STARTTLS", 220);
        if (!stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT)) {
            fclose($sock);
            return "STARTTLS crypto handshake failed";
        }
        // Re-EHLO after STARTTLS
        $sendCmd("EHLO " . gethostname(), 250);
    }
    
    // AUTH LOGIN
    $sendCmd("AUTH LOGIN", 334);
    $sendCmd(base64_encode($user), 334);
    $authResp = $sendCmd(base64_encode($pass), 235);
    if (!$authResp) {
        fclose($sock);
        return "AUTH failed: " . implode('; ', $errors);
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
    
    // Chunked fwrite to ensure all data is sent (critical for attachments)
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
    $hdrs .= "X-Mailer: NHP-Relay/3.0";
    
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
    $hdrs .= "X-Mailer: NHP-Relay/3.0";
    
    $body = $html;
}

// Senden
$result = smtp_send($SMTP_HOST, $SMTP_PORT, $SMTP_USER, $SMTP_PASS, $SMTP_SECURE, $from, $to, $hdrs, $body);

if ($result === true) {
    relay_log("SMTP OK: to=$to");
    echo json_encode([
        'success' => true,
        'message' => 'Email sent via SMTP',
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
