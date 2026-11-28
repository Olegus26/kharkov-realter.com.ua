<?php
declare(strict_types=1);

@ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'false', 'errors' => ['Method not allowed']]);
    exit;
}

$secretsFile = __DIR__ . DIRECTORY_SEPARATOR . 'secrets.php';
$secrets = is_file($secretsFile) ? require $secretsFile : [];
$apiKey = trim((string)($secrets['novostoy_api_key'] ?? getenv('NOVOSTOY_API_KEY') ?: ''));

if ($apiKey === '') {
    http_response_code(503);
    echo json_encode(['status' => 'false', 'errors' => ['API key is not configured']]);
    exit;
}

$payload = json_decode((string)file_get_contents('php://input'), true);
$method = is_array($payload) ? trim((string)($payload['method'] ?? '')) : '';
$data = is_array($payload) && isset($payload['data']) ? $payload['data'] : [];

if (!in_array($method, ['getObjects', 'getConfig'], true)) {
    http_response_code(400);
    echo json_encode(['status' => 'false', 'errors' => ['Unsupported method']]);
    exit;
}

$upstreamUrl = 'https://novostoy.com.ua/api/json/' . $method;
$upstreamBody = json_encode(['key' => $apiKey, 'data' => $data], JSON_UNESCAPED_UNICODE);

$callUpstream = static function (bool $verifySsl) use ($upstreamUrl, $upstreamBody): array {
    $ch = curl_init($upstreamUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $upstreamBody,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_SSL_VERIFYPEER => $verifySsl,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Accept: application/json',
        ],
        CURLOPT_TIMEOUT => 20,
        CURLOPT_CONNECTTIMEOUT => 8,
    ]);
    $resp = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $errNo = curl_errno($ch);
    curl_close($ch);
    return ['resp' => $resp, 'code' => $code, 'errNo' => $errNo];
};

$res = $callUpstream(true);
if ($res['errNo'] === 60 || $res['errNo'] === 77) {
    $res = $callUpstream(false);
}

if ($res['code'] < 200 || $res['code'] >= 300 || !is_string($res['resp'])) {
    http_response_code(502);
    echo json_encode(['status' => 'false', 'errors' => ['Upstream API error']]);
    exit;
}

echo $res['resp'];
