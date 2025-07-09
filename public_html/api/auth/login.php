<?php
// User Login API - Migrated from Next.js API route
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/auth.php';

setupCORS();
validateMethod(['POST']);

try {
    $data = getRequestData();
    
    // Validate required fields
    if (empty($data['email']) || empty($data['password'])) {
        errorResponse('Email and password are required', 400);
    }
    
    $email = sanitizeInput($data['email']);
    $password = $data['password'];
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        errorResponse('Invalid email format', 400);
    }
    
    $db = getDB();
    
    // Find user by email
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        errorResponse('Invalid credentials', 401);
    }
    
    $user = $result->fetch_assoc();
    
    // Verify password
    if (!$user['password'] || !Auth::verifyPassword($password, $user['password'])) {
        errorResponse('Invalid credentials', 401);
    }
    
    // Update last seen and status
    Auth::updateLastSeen($user['id']);
    
    // Create session
    $sessionToken = Auth::createSession($user['id']);
    
    // Set session cookie
    setcookie('next-auth.session-token', $sessionToken, [
        'expires' => time() + (30 * 24 * 60 * 60), // 30 days
        'path' => '/',
        'secure' => isset($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    
    // Prepare user data for response (exclude sensitive info)
    $userData = [
        'id' => $user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'username' => $user['username'],
        'image' => $user['image'],
        'role' => $user['role'],
        'rank' => $user['rank'],
        'points' => (int)$user['points'],
        'wins' => (int)$user['wins'],
        'losses' => (int)$user['losses'],
        'level' => (int)$user['level'],
        'xp' => (int)$user['xp'],
        'status' => $user['status'],
        'isVerified' => (bool)$user['is_verified'],
        'joinedAt' => $user['joined_at']
    ];
    
    jsonResponse([
        'message' => 'Login successful',
        'user' => $userData,
        'sessionToken' => $sessionToken
    ], 200);
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    errorResponse('Internal server error', 500);
}
?>