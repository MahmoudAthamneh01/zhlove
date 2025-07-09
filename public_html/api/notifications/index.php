<?php
// Notifications API - New endpoint for managing notifications
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/auth.php';

setupCORS();
validateMethod(['GET', 'PUT', 'DELETE']);

try {
    $currentUser = requireAuth();
    $db = getDB();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get user notifications
        $limit = isset($_GET['limit']) ? min(100, max(1, intval($_GET['limit']))) : 20;
        $offset = isset($_GET['offset']) ? max(0, intval($_GET['offset'])) : 0;
        $unreadOnly = isset($_GET['unread']) && $_GET['unread'] === 'true';
        
        $whereClause = 'WHERE user_id = ?';
        $params = [$currentUser['id']];
        $types = 's';
        
        if ($unreadOnly) {
            $whereClause .= ' AND is_read = FALSE';
        }
        
        $stmt = $db->prepare("
            SELECT * FROM notifications 
            {$whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        ");
        $params[] = $limit;
        $params[] = $offset;
        $types .= 'ii';
        
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $notifications = [];
        while ($row = $result->fetch_assoc()) {
            $notifications[] = [
                'id' => $row['id'],
                'title' => $row['title'],
                'message' => $row['message'],
                'type' => $row['type'],
                'isRead' => (bool)$row['is_read'],
                'createdAt' => $row['created_at']
            ];
        }
        
        // Get unread count
        $stmt = $db->prepare("
            SELECT COUNT(*) as unread_count 
            FROM notifications 
            WHERE user_id = ? AND is_read = FALSE
        ");
        $stmt->bind_param("s", $currentUser['id']);
        $stmt->execute();
        $unreadCount = $stmt->get_result()->fetch_assoc()['unread_count'];
        
        jsonResponse([
            'notifications' => $notifications,
            'unreadCount' => (int)$unreadCount
        ], 200);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Mark notifications as read
        $data = getRequestData();
        
        if (isset($data['markAllAsRead']) && $data['markAllAsRead']) {
            // Mark all notifications as read
            $stmt = $db->prepare("
                UPDATE notifications 
                SET is_read = TRUE 
                WHERE user_id = ? AND is_read = FALSE
            ");
            $stmt->bind_param("s", $currentUser['id']);
            $stmt->execute();
            
            jsonResponse(['message' => 'All notifications marked as read'], 200);
            
        } elseif (isset($data['notificationId'])) {
            // Mark specific notification as read
            $notificationId = sanitizeInput($data['notificationId']);
            
            $stmt = $db->prepare("
                UPDATE notifications 
                SET is_read = TRUE 
                WHERE id = ? AND user_id = ?
            ");
            $stmt->bind_param("ss", $notificationId, $currentUser['id']);
            
            if ($stmt->execute() && $stmt->affected_rows > 0) {
                jsonResponse(['message' => 'Notification marked as read'], 200);
            } else {
                errorResponse('Notification not found', 404);
            }
        } else {
            errorResponse('Invalid request', 400);
        }
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Delete notification
        $notificationId = isset($_GET['id']) ? sanitizeInput($_GET['id']) : null;
        
        if (!$notificationId) {
            errorResponse('Notification ID is required', 400);
        }
        
        $stmt = $db->prepare("
            DELETE FROM notifications 
            WHERE id = ? AND user_id = ?
        ");
        $stmt->bind_param("ss", $notificationId, $currentUser['id']);
        
        if ($stmt->execute() && $stmt->affected_rows > 0) {
            jsonResponse(['message' => 'Notification deleted'], 200);
        } else {
            errorResponse('Notification not found', 404);
        }
    }
    
} catch (Exception $e) {
    error_log("Notifications API error: " . $e->getMessage());
    errorResponse('Failed to process notifications', 500);
}
?>