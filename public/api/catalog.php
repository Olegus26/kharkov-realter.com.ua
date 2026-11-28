<?php
declare(strict_types=1);

@ini_set('display_errors', '0');
@ini_set('memory_limit', '256M');
@set_time_limit(60);

const API_BASE = 'https://novostoy.com.ua/api/json';
const PAGE_LIMIT = 100;
const MAX_PRICE = 100000000;
const PRICE_STEP = 0.01;
const MAX_CONCURRENT = 8;
const MAX_RETRIES = 3;
const CACHE_TTL_SEC = 300; // 5 minutes

function getNovostoyApiKey(): string
{
    static $cachedKey = null;
    if ($cachedKey !== null) {
        return $cachedKey;
    }
    $secretsFile = __DIR__ . DIRECTORY_SEPARATOR . 'secrets.php';
    $secrets = is_file($secretsFile) ? require $secretsFile : [];
    $cachedKey = trim((string)($secrets['novostoy_api_key'] ?? getenv('NOVOSTOY_API_KEY') ?: ''));
    return $cachedKey;
}

const SALE_PRICE_EDGES = [
    5500, 7500, 10000, 12000, 13900, 15000, 16000, 17300, 18000, 19000, 20000, 20700, 22000, 23000, 23500,
    24000, 25000, 25500, 26500, 27000, 28000, 28500, 29900, 30000, 31500, 32000, 33000, 34000, 35000, 36000,
    37000, 38000, 39000, 40000, 42000, 43000, 44500, 45000, 46500, 48000, 50000, 52500, 55000, 56000, 58000,
    60000, 62000, 65000, 67500, 71000, 75000, 80000, 85000, 95000, 110000, 120000, 150000, 180000, 350000,
];

const PARENT_TYPE = [
    '2' => 'apartment',
    '4' => 'commercial',
    '6' => 'house',
];

const ROOM_SUBFILTERS = [
    ['rooms' => '1'],
    ['rooms' => '2'],
    ['rooms' => '3'],
    ['rooms' => '4'],
    ['rooms' => '5'],
    ['parent_id' => '4'],
    ['parent_id' => '6'],
];

function getHandleId($ch): int
{
    return is_object($ch) ? spl_object_id($ch) : (int)$ch;
}

function getCacheDir(): string
{
    $localDir = __DIR__ . DIRECTORY_SEPARATOR . 'cache';
    if (!is_dir($localDir)) {
        @mkdir($localDir, 0755, true);
    }
    if (is_dir($localDir) && is_writable($localDir)) {
        $htaccess = $localDir . DIRECTORY_SEPARATOR . '.htaccess';
        if (!is_file($htaccess)) {
            @file_put_contents($htaccess, "Order deny,allow\nDeny from all\n");
        }
        return $localDir;
    }

    $tmpDir = @sys_get_temp_dir();
    if (is_string($tmpDir) && $tmpDir !== '') {
        $fallback = rtrim($tmpDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'kharkov_realter_cache';
        if (!is_dir($fallback)) {
            @mkdir($fallback, 0755, true);
        }
        if (is_dir($fallback) && is_writable($fallback)) {
            return $fallback;
        }
    }

    return __DIR__;
}

function buildPriceRanges(array $edges): array
{
    $bounds = array_merge([0], $edges, [MAX_PRICE]);
    $ranges = [];
    $count = count($bounds) - 1;
    for ($i = 0; $i < $count; $i++) {
        $ranges[] = [
            'min' => $i === 0 ? (float)$bounds[$i] : round((float)$bounds[$i] + PRICE_STEP, 2),
            'max' => (float)$bounds[$i + 1],
            'extra' => [],
            'hasSubdivided' => false,
            'retries' => 0,
            'insecureRetry' => false,
        ];
    }
    return $ranges;
}

function splitRange(array $range, array $items): array
{
    $min = (float)$range['min'];
    $max = (float)$range['max'];
    $prices = [];
    foreach ($items as $item) {
        $p = isset($item['price']) ? (float)$item['price'] : -1.0;
        if ($p >= $min && $p <= $max) {
            $prices[] = $p;
        }
    }
    sort($prices, SORT_NUMERIC);

    $minP = $prices[0] ?? $min;
    $maxP = count($prices) > 0 ? $prices[count($prices) - 1] : $max;

    if ($minP >= maxP) {
        return [['min' => $minP, 'max' => $maxP, 'extra' => [], 'hasSubdivided' => false, 'retries' => 0, 'insecureRetry' => $range['insecureRetry']]];
    }

    $median = $prices[(int)floor(count($prices) / 2)];
    if ($median <= $minP) {
        return [
            ['min' => $minP, 'max' => $minP, 'extra' => [], 'hasSubdivided' => false, 'retries' => 0, 'insecureRetry' => $range['insecureRetry']],
            ['min' => round($minP + PRICE_STEP, 2), 'max' => $maxP, 'extra' => [], 'hasSubdivided' => false, 'retries' => 0, 'insecureRetry' => $range['insecureRetry']],
        ];
    }
    if ($median >= $maxP) {
        return [
            ['min' => $minP, 'max' => round($maxP - PRICE_STEP, 2), 'extra' => [], 'hasSubdivided' => false, 'retries' => 0, 'insecureRetry' => $range['insecureRetry']],
            ['min' => $maxP, 'max' => $maxP, 'extra' => [], 'hasSubdivided' => false, 'retries' => 0, 'insecureRetry' => $range['insecureRetry']],
        ];
    }
    return [
        ['min' => $minP, 'max' => $median, 'extra' => [], 'hasSubdivided' => false, 'retries' => 0, 'insecureRetry' => $range['insecureRetry']],
        ['min' => round($median + PRICE_STEP, 2), 'max' => $maxP, 'extra' => [], 'hasSubdivided' => false, 'retries' => 0, 'insecureRetry' => $range['insecureRetry']],
    ];
}

function fetchAllObjects(?string $sellType): array
{
    $queue = buildPriceRanges(SALE_PRICE_EDGES);
    $results = [];
    $mh = curl_multi_init();
    $activeHandles = [];
    $disableSslVerify = false;

    $apiKey = getNovostoyApiKey();
    if ($apiKey === '') {
        throw new RuntimeException('API key is not configured');
    }

    $enqueueHandle = static function (array $range) use ($mh, &$activeHandles, $sellType, &$disableSslVerify, $apiKey): void {
        $payloadData = array_merge(
            [
                'limit' => PAGE_LIMIT,
                'price_from' => $range['min'],
                'price_to' => $range['max'],
            ],
            $sellType !== null ? ['sell_type' => $sellType] : [],
            $range['extra']
        );

        $body = json_encode(['key' => $apiKey, 'data' => $payloadData], JSON_UNESCAPED_UNICODE);
        $ch = curl_init(API_BASE . '/getObjects');
        $verifySsl = !$disableSslVerify && empty($range['insecureRetry']);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
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
        curl_multi_add_handle($mh, $ch);
        $activeHandles[getHandleId($ch)] = ['handle' => $ch, 'range' => $range];
    };

    while (count($queue) > 0 || count($activeHandles) > 0) {
        while (count($queue) > 0 && count($activeHandles) < MAX_CONCURRENT) {
            $nextRange = array_shift($queue);
            $enqueueHandle($nextRange);
        }

        do {
            $status = curl_multi_exec($mh, $running);
        } while ($status === CURLM_CALL_MULTI_PERFORM);

        while ($done = curl_multi_info_read($mh)) {
            $ch = $done['handle'];
            $key = getHandleId($ch);
            if (!isset($activeHandles[$key])) {
                curl_multi_remove_handle($mh, $ch);
                curl_close($ch);
                continue;
            }
            $range = $activeHandles[$key]['range'];
            unset($activeHandles[$key]);

            $rawBody = curl_multi_getcontent($ch);
            $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlErr = curl_errno($ch);
            curl_multi_remove_handle($mh, $ch);
            curl_close($ch);

            // Auto-recover if server OS has outdated CA bundle (curl error 60 / 77)
            if (($curlErr === 60 || $curlErr === 77) && empty($range['insecureRetry'])) {
                $disableSslVerify = true;
                $range['insecureRetry'] = true;
                $queue[] = $range;
                continue;
            }

            $decoded = ($httpCode >= 200 && $httpCode < 300 && is_string($rawBody))
                ? json_decode($rawBody, true)
                : null;

            if (!is_array($decoded) || (($decoded['status'] ?? '') === 'false')) {
                if ($range['retries'] < MAX_RETRIES) {
                    $range['retries']++;
                    $queue[] = $range;
                }
                continue;
            }

            $items = is_array($decoded['data'] ?? null) ? $decoded['data'] : [];
            if (count($items) >= PAGE_LIMIT) {
                if ($range['min'] < $range['max']) {
                    foreach (splitRange($range, $items) as $sub) {
                        $queue[] = $sub;
                    }
                    continue;
                }
                if (!$range['hasSubdivided']) {
                    foreach (ROOM_SUBFILTERS as $subFilter) {
                        $queue[] = [
                            'min' => $range['min'],
                            'max' => $range['max'],
                            'extra' => $subFilter,
                            'hasSubdivided' => true,
                            'retries' => 0,
                            'insecureRetry' => $range['insecureRetry'],
                        ];
                    }
                    continue;
                }
            }

            foreach ($items as $item) {
                if (isset($item['id'])) {
                    $results[(string)$item['id']] = $item;
                }
            }
        }

        if ($running > 0) {
            curl_multi_select($mh, 0.2);
        }
    }

    curl_multi_close($mh);
    return array_values($results);
}

function mapAndTrimObject(array $obj): array
{
    $parentId = isset($obj['parent_id']) ? (string)$obj['parent_id'] : '2';
    $type = PARENT_TYPE[$parentId] ?? 'apartment';
    $rooms = !empty($obj['rooms']) ? (int)$obj['rooms'] : null;

    if ($type === 'apartment') {
        $label = $rooms ? "{$rooms}-кімн. квартира" : 'Квартира';
    } elseif ($type === 'house') {
        $label = $rooms ? "{$rooms}-кімн. будинок" : 'Будинок';
    } elseif ($type === 'commercial') {
        $label = $rooms ? "{$rooms}-кімн. приміщення" : 'Комерційне приміщення';
    } else {
        $label = "Об'єкт";
    }

    $street = (string)($obj['street'] ?? '');
    $building = !empty($obj['building']) ? ', ' . $obj['building'] : '';
    $region = !empty($obj['region']) ? ' (' . $obj['region'] . ')' : '';
    $title = preg_replace('/^, /', '', "{$label}, {$street}{$building}{$region}");

    $locationParts = array_values(array_filter([
        $obj['region'] ?? '',
        $obj['mregion'] ?? '',
        $obj['street'] ?? '',
        $obj['building'] ?? '',
    ], static fn ($v) => $v !== '' && $v !== null));

    $geoParts = [];
    if ($street !== '') {
        $geoParts[] = $street;
    }
    if (!empty($obj['building'])) {
        $geoParts[] = (string)$obj['building'];
    }
    $geoParts[] = 'Харків';
    $geoParts[] = 'Україна';

    $images = is_array($obj['images'] ?? null) ? array_values($obj['images']) : [];
    $agentPhones = is_array($obj['agent_phones'] ?? null) ? array_values($obj['agent_phones']) : [];

    return [
        'id' => (string)($obj['id'] ?? ''),
        'title' => $title,
        'price' => isset($obj['price']) ? (float)$obj['price'] : 0,
        'location' => implode(', ', $locationParts),
        'address_full' => implode(', ', $geoParts),
        'type' => $type,
        'deal' => ((string)($obj['sell_type'] ?? '2') === '1') ? 'rent' : 'sale',
        'area' => !empty($obj['area']) ? (float)$obj['area'] : null,
        'area_live' => !empty($obj['area_live']) ? (float)$obj['area_live'] : null,
        'area_kitchen' => !empty($obj['area_kitchen']) ? (float)$obj['area_kitchen'] : null,
        'rooms' => $rooms,
        'floor' => !empty($obj['stage']) ? (int)$obj['stage'] : null,
        'floors_total' => !empty($obj['stages']) ? (int)$obj['stages'] : null,
        'description' => (string)($obj['info'] ?? ''),
        'image_url' => $images[0] ?? null,
        'images' => $images,
        'agent_phones' => $agentPhones,
        'featured' => false,
        'new_building' => false,
        'year_built' => !empty($obj['building_year']) ? (int)$obj['building_year'] : null,
        'state' => $obj['state'] ?? null,
        'region' => (string)($obj['region'] ?? ''),
        'mregion' => (string)($obj['mregion'] ?? ''),
        'street' => $street,
        'building' => (string)($obj['building'] ?? ''),
        'source_url' => $obj['url'] ?? null,
        'views' => isset($obj['views']) ? (int)$obj['views'] : 0,
        'date_edit' => isset($obj['date_edit']) ? (int)$obj['date_edit'] : 0,
        'eoselia' => ($obj['eoselia'] ?? null) === '1' || ($obj['eoselia'] ?? null) === true,
        'erecovery' => ($obj['erecovery'] ?? null) === '1' || ($obj['erecovery'] ?? null) === true,
        'tender' => ($obj['tender'] ?? null) === '1' || ($obj['tender'] ?? null) === true,
        'deposit' => ($obj['deposit'] ?? null) === '1' || ($obj['deposit'] ?? null) === true,
        'is_sold' => ($obj['is_sold'] ?? null) === '1' || ($obj['is_sold'] ?? null) === true,
        'metro' => $obj['metro'] ?? null,
    ];
}

function getCatalogFile(string $deal): string
{
    $cacheDir = getCacheDir();
    $jsonFile = $cacheDir . DIRECTORY_SEPARATOR . "catalog_{$deal}.json";
    $lockFile = $cacheDir . DIRECTORY_SEPARATOR . "catalog_{$deal}.lock";

    $hasCache = is_file($jsonFile) && filesize($jsonFile) > 2;
    if ($hasCache && (time() - filemtime($jsonFile)) < CACHE_TTL_SEC) {
        return $jsonFile;
    }

    $lockFp = @fopen($lockFile, 'c+');
    if ($lockFp !== false) {
        if ($hasCache) {
            // Non-blocking lock: if another request is already refreshing, serve existing cache immediately
            if (!@flock($lockFp, LOCK_EX | LOCK_NB)) {
                fclose($lockFp);
                return $jsonFile;
            }
        } else {
            // Cold start: wait for single worker to populate cache instead of stampeding upstream API
            @flock($lockFp, LOCK_EX);
            clearstatcache(true, $jsonFile);
            if (is_file($jsonFile) && filesize($jsonFile) > 2 && (time() - filemtime($jsonFile)) < CACHE_TTL_SEC) {
                @flock($lockFp, LOCK_UN);
                fclose($lockFp);
                return $jsonFile;
            }
        }
    }

    $sellType = $deal === 'rent' ? '1' : ($deal === 'sale' ? '2' : null);

    try {
        $rawItems = fetchAllObjects($sellType);
        if (count($rawItems) > 0) {
            $mapped = array_map('mapAndTrimObject', $rawItems);
            usort($mapped, static function (array $a, array $b): int {
                if ($b['date_edit'] !== $a['date_edit']) {
                    return $b['date_edit'] <=> $a['date_edit'];
                }
                return (int)$b['id'] <=> (int)$a['id'];
            });

            $json = json_encode($mapped, JSON_UNESCAPED_UNICODE);
            if (is_string($json)) {
                $tmpJson = $jsonFile . '.' . uniqid('', true);
                if (@file_put_contents($tmpJson, $json, LOCK_EX) !== false) {
                    @rename($tmpJson, $jsonFile);
                }
            }
        }
    } catch (Throwable $e) {
        // Fall back to stale cache if available
    } finally {
        if ($lockFp !== false) {
            @flock($lockFp, LOCK_UN);
            fclose($lockFp);
        }
    }

    clearstatcache(true, $jsonFile);
    if (is_file($jsonFile) && filesize($jsonFile) > 2) {
        return $jsonFile;
    }

    throw new RuntimeException('Failed to fetch catalog');
}

try {
    if (!function_exists('curl_multi_init')) {
        http_response_code(503);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'cURL extension unavailable']);
        exit;
    }

    $idParam = isset($_GET['id']) ? preg_replace('/[^0-9A-Za-z_-]/', '', trim((string)$_GET['id'])) : '';

    if ($idParam !== '') {
        $needle = '"id":"' . $idParam . '"';

        foreach (['sale', 'rent'] as $dealKey) {
            $candidate = getCatalogFile($dealKey);
            $raw = @file_get_contents($candidate);
            if (!is_string($raw) || strpos($raw, $needle) === false) {
                continue;
            }
            $items = json_decode($raw, true);
            if (!is_array($items)) {
                continue;
            }
            foreach ($items as $item) {
                if ((string)($item['id'] ?? '') === $idParam) {
                    header('Content-Type: application/json; charset=utf-8');
                    header('Cache-Control: public, max-age=300, stale-while-revalidate=3600');
                    echo json_encode($item, JSON_UNESCAPED_UNICODE);
                    exit;
                }
            }
        }

        http_response_code(404);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Not found']);
        exit;
    }

    $dealParam = isset($_GET['deal']) ? (string)$_GET['deal'] : 'sale';
    $deal = in_array($dealParam, ['sale', 'rent', 'all'], true) ? $dealParam : 'sale';
    $jsonFile = getCatalogFile($deal);

    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: public, max-age=300, stale-while-revalidate=3600');
    readfile($jsonFile);
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => $e->getMessage()]);
}
