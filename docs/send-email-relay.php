<?php
/**
 * E-Mail Relay Endpoint für Naturheilpraxis Rauch
 * 
 * Dieses Skript empfängt HTTPS-Anfragen von der Lovable Cloud Edge Function
 * und versendet E-Mails lokal über den Server.
 * 
 * INSTALLATION:
 * 1. Diese Datei auf Ihren Server kopieren nach: /var/www/vhosts/rauch-heilpraktiker.de/httpdocs/api/send-email.php
 * 2. Den RELAY_SECRET Wert unten durch denselben Wert ersetzen, den Sie in Lovable Cloud eingegeben haben
 * 3. Sicherstellen, dass das Verzeichnis /api/ existiert
 * 
 * SICHERHEIT:
 * - Das Skript akzeptiert nur POST-Anfragen
 * - Nur Anfragen mit gültigem X-Relay-Token werden verarbeitet
 * - Alle Eingaben werden validiert und sanitized
 */

// CORS Headers für Edge Function Zugriff
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Relay-Token');

// OPTIONS Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Nur POST erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// ============================================
// WICHTIG: Ersetzen Sie diesen Wert durch Ihr Secret!
// ============================================
$RELAY_SECRET = '998a476a-cf1c-7443-ea47-3e329d70e934';

// Token validieren
$token = $_SERVER['HTTP_X_RELAY_TOKEN'] ?? '';
if (empty($token) || !hash_equals($RELAY_SECRET, $token)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

// JSON Body lesen
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

// Pflichtfelder prüfen
$to = filter_var($data['to'] ?? '', FILTER_VALIDATE_EMAIL);
$subject = trim($data['subject'] ?? '');
$html = $data['html'] ?? '';
$from = filter_var($data['from'] ?? 'info@rauch-heilpraktiker.de', FILTER_VALIDATE_EMAIL);

if (!$to || !$subject || !$html) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields: to, subject, html']);
    exit;
}

// E-Mail Header
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: Naturheilpraxis Rauch <' . $from . '>',
    'Reply-To: ' . $from,
    'X-Mailer: PHP/' . phpversion()
];

// Envelope-Sender setzen (5. Parameter) - verhindert Umleitung durch Postfix/Plesk
// Verwendet 'noreply@rauch-heilpraktiker.de' als technischen Absender
$envelope_sender = '-f noreply@rauch-heilpraktiker.de';

// E-Mail senden mit explizitem Envelope-Sender
$success = mail($to, $subject, $html, implode("\r\n", $headers), $envelope_sender);

// Debug-Logging für Fehlersuche
$log_entry = date('Y-m-d H:i:s') . " | TO: $to | FROM: $from | SUBJECT: $subject | SUCCESS: " . ($success ? 'YES' : 'NO') . "\n";
@file_put_contents(__DIR__ . '/mail-debug.log', $log_entry, FILE_APPEND);

if ($success) {
    echo json_encode(['success' => true, 'message' => 'Email sent', 'to' => $to, 'from' => $from]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send email', 'to' => $to]);
}
