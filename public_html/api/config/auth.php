<?php
// Authentication utilities for ZH-Love Platform

require_once 'database.php';

class Auth {
    
    // Verify JWT token or session
    public static function getCurrentUser() {
        // Check for session token in Authorization header
        $headers = getallheaders();
        $token = null;
        
        if (isset($headers['Authorization'])) {
            $token = str_replace('Bearer ', '', $headers['Authorization']);
        }
        
        // Check for session cookie
        if (!$token && isset($_COOKIE['next-auth.session-token'])) {
            $token = $_COOKIE['next-auth.session-token'];
        }
        
        if (!$token) {
            return null;
        }
        
        // Get user from session token
        $db = getDB();
        $stmt = $db->prepare("
            SELECT u.* FROM users u 
            JOIN sessions s ON u.id = s.user_id 
            WHERE s.session_token = ? AND s.expires > NOW()
        ");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            return null;
        }
        
        return $result->fetch_assoc();
    }
    
    // Require authentication
    public static function requireAuth() {
        $user = self::getCurrentUser();
        if (!$user) {
            errorResponse('Unauthorized', 401);
        }
        return $user;
    }
    
    // Require admin role
    public static function requireAdmin() {
        $user = self::requireAuth();
        if (!$user['is_admin'] && $user['role'] !== 'admin') {
            errorResponse('Admin access required', 403);
        }
        return $user;
    }
    
    // Create session token
    public static function createSession($userId) {
        $sessionToken = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+30 days'));
        
        $db = getDB();
        $stmt = $db->prepare("
            INSERT INTO sessions (id, session_token, user_id, expires) 
            VALUES (?, ?, ?, ?)
        ");
        $sessionId = generateId();
        $stmt->bind_param("ssss", $sessionId, $sessionToken, $userId, $expires);
        $stmt->execute();
        
        return $sessionToken;
    }
    
    // Hash password
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }
    
    // Verify password
    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
    
    // Update user's last seen
    public static function updateLastSeen($userId) {
        $db = getDB();
        $stmt = $db->prepare("
            UPDATE users 
            SET last_seen = NOW(), status = 'online' 
            WHERE id = ?
        ");
        $stmt->bind_param("s", $userId);
        $stmt->execute();
    }
}

// Utility functions
function getCurrentUser() {
    return Auth::getCurrentUser();
}

function requireAuth() {
    return Auth::requireAuth();
}

function requireAdmin() {
    return Auth::requireAdmin();
}
?>