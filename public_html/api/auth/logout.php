<?php
// User Logout API - New endpoint for session cleanup
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/auth.php';

setupCORS();
validateMethod(['POST']);

try {
    $user = getCurrentUser();
    
    if ($user) {
        $db = getDB();
        
        // Get session token
        $headers = getallheaders();
        $token = null;
        
        if (isset($headers['Authorization'])) {
            $token = str_replace('Bearer ', '', $headers['Authorization']);
        } elseif (isset($_COOKIE['next-auth.session-token'])) {
            $token = $_COOKIE['next-auth.session-token'];
        }
        
        if ($token) {
            // Delete session from database
            $stmt = $db->prepare("DELETE FROM sessions WHERE session_token = ?");
            $stmt->bind_param("s", $token);
            $stmt->execute();
        }
        
        // Update user status to offline
        $stmt = $db->prepare("UPDATE users SET status = 'offline' WHERE id = ?");
        $stmt->bind_param("s", $user['id']);
        $stmt->execute();
        
        // Clear session cookie
        setcookie('next-auth.session-token', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'secure' => isset($_SERVER['HTTPS']),
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
    }
    
    jsonResponse(['message' => 'Logged out successfully'], 200);
    
} catch (Exception $e) {
    error_log("Logout error: " . $e->getMessage());
    errorResponse('Internal server error', 500);
}
?>