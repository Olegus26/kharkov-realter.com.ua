<?php
declare(strict_types=1);

if (basename((string)($_SERVER['SCRIPT_FILENAME'] ?? '')) === basename(__FILE__)) {
    http_response_code(403);
    exit;
}

return [
    'novostoy_api_key' => 'YOUR_NOVOSTOY_API_KEY',
    'telegram_bot_token' => 'YOUR_TELEGRAM_BOT_TOKEN',
    'telegram_chat_id' => 'YOUR_TELEGRAM_CHAT_ID',
];
