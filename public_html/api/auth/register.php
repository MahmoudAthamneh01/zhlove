<?php
// User Registration API - Migrated from Next.js API route
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/auth.php';

setupCORS();
validateMethod(['POST']);

try {
    $data = getRequestData();
    
    // Validate required fields
    if (empty($data['email']) || empty($data['password']) || empty($data['username'])) {
        errorResponse('Email, password, and username are required', 400);
    }
    
    $email = sanitizeInput($data['email']);
    $password = $data['password']; // Don't sanitize password
    $username = sanitizeInput($data['username']);
    $name = isset($data['name']) ? sanitizeInput($data['name']) : $username;
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        errorResponse('Invalid email format', 400);
    }
    
    // Validate password strength
    if (strlen($password) < 6) {
        errorResponse('Password must be at least 6 characters', 400);
    }
    
    // Validate username
    if (strlen($username) < 3 || strlen($username) > 30) {
        errorResponse('Username must be between 3 and 30 characters', 400);
    }
    
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
        errorResponse('Username can only contain letters, numbers and underscores', 400);
    }
    
    $db = getDB();
    
    // Check if user already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
    $stmt->bind_param("ss", $email, $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        errorResponse('User with this email or username already exists', 400);
    }
    
    // Hash password
    $hashedPassword = Auth::hashPassword($password);
    $userId = generateId();
    
    // Create user
    $stmt = $db->prepare("
        INSERT INTO users (id, email, password, username, name, joined_at, last_seen) 
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    ");
    $stmt->bind_param("sssss", $userId, $email, $hashedPassword, $username, $name);
    
    if (!$stmt->execute()) {
        errorResponse('Failed to create user account', 500);
    }
    
    // Get created user data
    $stmt = $db->prepare("
        SELECT id, email, username, name, joined_at, rank, points, level, xp 
        FROM users WHERE id = ?
    ");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    
    // Create session
    $sessionToken = Auth::createSession($userId);
    
    // Set session cookie
    setcookie('next-auth.session-token', $sessionToken, [
        'expires' => time() + (30 * 24 * 60 * 60), // 30 days
        'path' => '/',
        'secure' => isset($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    
    jsonResponse([
        'message' => 'User created successfully',
        'user' => $user,
        'sessionToken' => $sessionToken
    ], 201);
    
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    errorResponse('Internal server error', 500);
}
?>