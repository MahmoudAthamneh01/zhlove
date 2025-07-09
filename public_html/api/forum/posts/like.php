<?php
// Forum Post Like API - Handle liking/unliking posts
require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../config/auth.php';

setupCORS();
validateMethod(['POST', 'DELETE']);

try {
    $currentUser = requireAuth();
    $db = getDB();
    
    // Get post ID from URL or request body
    $postId = null;
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = getRequestData();
        $postId = isset($data['postId']) ? sanitizeInput($data['postId']) : null;
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $postId = isset($_GET['postId']) ? sanitizeInput($_GET['postId']) : null;
    }
    
    if (!$postId) {
        errorResponse('Post ID is required', 400);
    }
    
    // Check if post exists
    $stmt = $db->prepare("SELECT id FROM forum_posts WHERE id = ?");
    $stmt->bind_param("s", $postId);
    $stmt->execute();
    
    if ($stmt->get_result()->num_rows === 0) {
        errorResponse('Post not found', 404);
    }
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Like the post
        
        // Check if already liked
        $stmt = $db->prepare("SELECT id FROM post_likes WHERE user_id = ? AND post_id = ?");
        $stmt->bind_param("ss", $currentUser['id'], $postId);
        $stmt->execute();
        
        if ($stmt->get_result()->num_rows > 0) {
            errorResponse('Post already liked', 400);
        }
        
        // Add like
        $likeId = generateId();
        $stmt = $db->prepare("INSERT INTO post_likes (id, user_id, post_id) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $likeId, $currentUser['id'], $postId);
        
        if (!$stmt->execute()) {
            errorResponse('Failed to like post', 500);
        }
        
        // Get updated like count
        $stmt = $db->prepare("SELECT COUNT(*) as like_count FROM post_likes WHERE post_id = ?");
        $stmt->bind_param("s", $postId);
        $stmt->execute();
        $likeCount = $stmt->get_result()->fetch_assoc()['like_count'];
        
        jsonResponse([
            'message' => 'Post liked successfully',
            'liked' => true,
            'likeCount' => (int)$likeCount
        ], 200);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Unlike the post
        
        $stmt = $db->prepare("DELETE FROM post_likes WHERE user_id = ? AND post_id = ?");
        $stmt->bind_param("ss", $currentUser['id'], $postId);
        
        if (!$stmt->execute() || $stmt->affected_rows === 0) {
            errorResponse('Like not found', 404);
        }
        
        // Get updated like count
        $stmt = $db->prepare("SELECT COUNT(*) as like_count FROM post_likes WHERE post_id = ?");
        $stmt->bind_param("s", $postId);
        $stmt->execute();
        $likeCount = $stmt->get_result()->fetch_assoc()['like_count'];
        
        jsonResponse([
            'message' => 'Post unliked successfully',
            'liked' => false,
            'likeCount' => (int)$likeCount
        ], 200);
    }
    
} catch (Exception $e) {
    error_log("Forum like API error: " . $e->getMessage());
    errorResponse('Failed to process like action', 500);
}
?>