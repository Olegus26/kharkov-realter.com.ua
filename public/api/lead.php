<?php
declare(strict_types=1);

@ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$secretsFile = __DIR__ . DIRECTORY_SEPARATOR . 'secrets.php';
$secrets = is_file($secretsFile) ? require $secretsFile : [];
$botToken = trim((string)($secrets['telegram_bot_token'] ?? getenv('TELEGRAM_BOT_TOKEN') ?: ''));
$chatId = trim((string)($secrets['telegram_chat_id'] ?? getenv('TELEGRAM_CHAT_ID') ?: ''));

if ($botToken === '' || $chatId === '') {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Сервіс заявок тимчасово недоступний']);
    exit;
}

// Simple per-IP rate limit: max 5 leads per 60 seconds
$cacheDir = __DIR__ . DIRECTORY_SEPARATOR . 'cache';
if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0755, true);
}
if (is_dir($cacheDir) && is_writable($cacheDir)) {
    $htaccess = $cacheDir . DIRECTORY_SEPARATOR . '.htaccess';
    if (!is_file($htaccess)) {
        @file_put_contents($htaccess, "Order deny,allow\nDeny from all\n");
    }
    $clientIp = (string)($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $ipKey = md5(explode(',', $clientIp)[0]);
    $rateFile = $cacheDir . DIRECTORY_SEPARATOR . "rate_{$ipKey}.json";
    $now = time();
    $timestamps = [];
    if (is_file($rateFile)) {
        $decodedRate = json_decode((string)@file_get_contents($rateFile), true);
        if (is_array($decodedRate)) {
            foreach ($decodedRate as $ts) {
                if (is_int($ts) && ($now - $ts) < 60) {
                    $timestamps[] = $ts;
                }
            }
        }
    }
    if (count($timestamps) >= 5) {
        http_response_code(429);
        echo json_encode(['ok' => false, 'error' => 'Забагато запитів. Спробуйте через хвилину.']);
        exit;
    }
    $timestamps[] = $now;
    @file_put_contents($rateFile, json_encode($timestamps), LOCK_EX);
}

$rawInput = (string)file_get_contents('php://input');
$payload = json_decode($rawInput, true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Некоректні дані форми']);
    exit;
}

$type = trim((string)($payload['type'] ?? 'consult'));
$name = trim((string)($payload['name'] ?? ''));
$phone = trim((string)($payload['phone'] ?? ''));
$email = trim((string)($payload['email'] ?? ''));
$message = trim((string)($payload['message'] ?? ''));
$propertyId = trim((string)($payload['propertyId'] ?? ''));
$propertyTitle = trim((string)($payload['propertyTitle'] ?? ''));

$phoneDigits = preg_replace('/\D+/', '', $phone);
if ($name === '' || $phone === '' || strlen((string)$phoneDigits) < 10) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => "Будь ласка, перевірте ім'я та номер телефону"]);
    exit;
}

$esc = static fn (string $val): string => htmlspecialchars($val, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$topicLabels = [
    'buy' => 'Купівля нерухомості',
    'rent' => 'Оренда житла',
    'sell' => 'Продаж нерухомості',
    'consult' => 'Загальна консультація',
    'viewing' => "Запис на перегляд об'єкта",
    'vacancy' => 'Відгук на вакансію',
    'eoselia_consultation' => 'Консультація по програмі «єОселя»',
    'evidnovlennya_consultation' => 'Консультація по програмі «єВідновлення»',
];

$topic = $topicLabels[$type] ?? $esc($type);
$lines = [
    '🏢 <b>Нова заявка з сайту kharkov-realter.com.ua</b>',
    '📌 <b>Тема:</b> ' . $topic,
    "👤 <b>Ім'я:</b> " . $esc($name),
    '📞 <b>Телефон:</b> ' . $esc($phone),
];

if ($email !== '') {
    $lines[] = '✉️ <b>Email:</b> ' . $esc($email);
}
if ($propertyId !== '') {
    $lines[] = "🔑 <b>ID об'єкта:</b> #" . $esc($propertyId);
}
if ($propertyTitle !== '') {
    $lines[] = "🏠 <b>Об'єкт:</b> " . $esc($propertyTitle);
}
if ($message !== '') {
    $lines[] = "💬 <b>Повідомлення:</b>\n" . $esc($message);
}
$lines[] = '⏰ <i>' . date('d.m.Y H:i:s') . '</i>';

$tgUrl = "https://api.telegram.org/bot{$botToken}/sendMessage";
$tgBody = json_encode([
    'chat_id' => $chatId,
    'text' => implode("\n", $lines),
    'parse_mode' => 'HTML',
], JSON_UNESCAPED_UNICODE);

$sendTelegram = static function (bool $verifySsl) use ($tgUrl, $tgBody): array {
    $ch = curl_init($tgUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $tgBody,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => $verifySsl,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT => 15,
        CURLOPT_CONNECTTIMEOUT => 8,
    ]);
    $resp = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $errNo = curl_errno($ch);
    curl_close($ch);
    return ['resp' => $resp, 'code' => $code, 'errNo' => $errNo];
};

$attempt = $sendTelegram(true);
if ($attempt['errNo'] === 60 || $attempt['errNo'] === 77) {
    $attempt = $sendTelegram(false);
}

$decodedResp = is_string($attempt['resp']) ? json_decode($attempt['resp'], true) : null;
if ($attempt['code'] < 200 || $attempt['code'] >= 300 || !is_array($decodedResp) || empty($decodedResp['ok'])) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Не вдалося надіслати заявку онлайн']);
    exit;
}

echo json_encode(['ok' => true]);
