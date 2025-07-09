<?php
// CORS and Headers configuration for ZH-Love APIs

function setupCORS() {
    // Allowed origins for production
    $allowedOrigins = [
        'https://yourdomain.com',
        'https://www.yourdomain.com',
        'https://zh-love.vercel.app', // إذا كنت تستخدم Vercel
        'http://localhost:3000', // للتطوير فقط
    ];
    
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        if (in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        }
    } else {
        header("Access-Control-Allow-Origin: https://yourdomain.com");
    }
    
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400");    // cache for 1 day
    
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        }
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        }
        
        exit(0);
    }
    
    // Set content type to JSON
    header('Content-Type: application/json; charset=utf-8');
}

function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function errorResponse($message, $statusCode = 500) {
    http_response_code($statusCode);
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function validateMethod($allowedMethods) {
    if (!in_array($_SERVER['REQUEST_METHOD'], $allowedMethods)) {
        errorResponse('Method not allowed', 405);
    }
}

function getRequestData() {
    $input = file_get_contents('php://input');
    return json_decode($input, true);
}

function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}
?>