<?php
// Messages API - Migrated from Next.js API route
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/auth.php';

setupCORS();
validateMethod(['GET', 'POST']);

try {
    $currentUser = requireAuth();
    $db = getDB();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get messages/conversations
        $conversationWith = isset($_GET['with']) ? sanitizeInput($_GET['with']) : null;
        $limit = isset($_GET['limit']) ? min(100, max(1, intval($_GET['limit']))) : 20;
        $offset = isset($_GET['offset']) ? max(0, intval($_GET['offset'])) : 0;
        
        if ($conversationWith) {
            // Get messages in a specific conversation
            $stmt = $db->prepare("
                SELECT m.*,
                       sender.id as sender_id, sender.username as sender_username, 
                       sender.name as sender_name, sender.image as sender_image,
                       receiver.id as receiver_id, receiver.username as receiver_username,
                       receiver.name as receiver_name, receiver.image as receiver_image
                FROM messages m
                JOIN users sender ON m.sender_id = sender.id
                JOIN users receiver ON m.receiver_id = receiver.id
                WHERE (m.sender_id = ? AND m.receiver_id = ?) 
                   OR (m.sender_id = ? AND m.receiver_id = ?)
                ORDER BY m.created_at DESC
                LIMIT ? OFFSET ?
            ");
            $stmt->bind_param("ssssii", 
                $currentUser['id'], $conversationWith, 
                $conversationWith, $currentUser['id'],
                $limit, $offset
            );
            $stmt->execute();
            $result = $stmt->get_result();
            
            $messages = [];
            while ($row = $result->fetch_assoc()) {
                $messages[] = [
                    'id' => $row['id'],
                    'content' => $row['content'],
                    'isRead' => (bool)$row['is_read'],
                    'createdAt' => $row['created_at'],
                    'sender' => [
                        'id' => $row['sender_id'],
                        'username' => $row['sender_username'],
                        'name' => $row['sender_name'],
                        'image' => $row['sender_image']
                    ],
                    'receiver' => [
                        'id' => $row['receiver_id'],
                        'username' => $row['receiver_username'],
                        'name' => $row['receiver_name'],
                        'image' => $row['receiver_image']
                    ]
                ];
            }
            
            // Mark messages as read
            $stmt = $db->prepare("
                UPDATE messages 
                SET is_read = TRUE 
                WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE
            ");
            $stmt->bind_param("ss", $conversationWith, $currentUser['id']);
            $stmt->execute();
            
            // Reverse to show oldest first
            jsonResponse(array_reverse($messages), 200);
            
        } else {
            // Get all conversations (latest message with each user)
            $stmt = $db->prepare("
                SELECT DISTINCT
                    CASE 
                        WHEN m.sender_id = ? THEN m.receiver_id
                        ELSE m.sender_id
                    END as other_user_id,
                    MAX(m.created_at) as last_message_date
                FROM messages m 
                WHERE m.sender_id = ? OR m.receiver_id = ?
                GROUP BY other_user_id
                ORDER BY last_message_date DESC
                LIMIT ? OFFSET ?
            ");
            $stmt->bind_param("sssii", 
                $currentUser['id'], $currentUser['id'], $currentUser['id'],
                $limit, $offset
            );
            $stmt->execute();
            $result = $stmt->get_result();
            
            $conversations = [];
            while ($row = $result->fetch_assoc()) {
                $otherUserId = $row['other_user_id'];
                
                // Get user details
                $userStmt = $db->prepare("
                    SELECT id, username, name, image, status 
                    FROM users WHERE id = ?
                ");
                $userStmt->bind_param("s", $otherUserId);
                $userStmt->execute();
                $user = $userStmt->get_result()->fetch_assoc();
                
                // Get latest message
                $msgStmt = $db->prepare("
                    SELECT content, sender_id, created_at
                    FROM messages 
                    WHERE (sender_id = ? AND receiver_id = ?) 
                       OR (sender_id = ? AND receiver_id = ?)
                    ORDER BY created_at DESC
                    LIMIT 1
                ");
                $msgStmt->bind_param("ssss", 
                    $currentUser['id'], $otherUserId,
                    $otherUserId, $currentUser['id']
                );
                $msgStmt->execute();
                $latestMessage = $msgStmt->get_result()->fetch_assoc();
                
                // Get unread count
                $unreadStmt = $db->prepare("
                    SELECT COUNT(*) as unread_count
                    FROM messages 
                    WHERE sender_id = ? AND receiver_id = ? AND is_read = FALSE
                ");
                $unreadStmt->bind_param("ss", $otherUserId, $currentUser['id']);
                $unreadStmt->execute();
                $unreadCount = $unreadStmt->get_result()->fetch_assoc()['unread_count'];
                
                $conversations[] = [
                    'user' => $user,
                    'latestMessage' => $latestMessage,
                    'unreadCount' => (int)$unreadCount,
                    'lastMessageDate' => $row['last_message_date']
                ];
            }
            
            jsonResponse($conversations, 200);
        }
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Send a message
        $data = getRequestData();
        
        // Validate required fields
        if (empty($data['receiverId']) || empty($data['content'])) {
            errorResponse('Missing required fields: receiverId, content', 400);
        }
        
        $receiverId = sanitizeInput($data['receiverId']);
        $content = sanitizeInput($data['content']);
        
        // Validate content length
        if (strlen($content) > 1000) {
            errorResponse('Message cannot exceed 1,000 characters', 400);
        }
        
        // Check if receiver exists
        $stmt = $db->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->bind_param("s", $receiverId);
        $stmt->execute();
        
        if ($stmt->get_result()->num_rows === 0) {
            errorResponse('Receiver not found', 404);
        }
        
        // Cannot send message to self
        if ($receiverId === $currentUser['id']) {
            errorResponse('Cannot send message to yourself', 400);
        }
        
        // Create message
        $messageId = generateId();
        $stmt = $db->prepare("
            INSERT INTO messages (id, content, sender_id, receiver_id, created_at) 
            VALUES (?, ?, ?, ?, NOW())
        ");
        $stmt->bind_param("ssss", $messageId, $content, $currentUser['id'], $receiverId);
        
        if (!$stmt->execute()) {
            errorResponse('Failed to send message', 500);
        }
        
        // Get the created message with user details
        $stmt = $db->prepare("
            SELECT m.*,
                   sender.id as sender_id, sender.username as sender_username, 
                   sender.name as sender_name, sender.image as sender_image,
                   receiver.id as receiver_id, receiver.username as receiver_username,
                   receiver.name as receiver_name, receiver.image as receiver_image
            FROM messages m
            JOIN users sender ON m.sender_id = sender.id
            JOIN users receiver ON m.receiver_id = receiver.id
            WHERE m.id = ?
        ");
        $stmt->bind_param("s", $messageId);
        $stmt->execute();
        $messageData = $stmt->get_result()->fetch_assoc();
        
        // Create notification for receiver
        $notificationId = generateId();
        $stmt = $db->prepare("
            INSERT INTO notifications (id, user_id, title, message, type, created_at) 
            VALUES (?, ?, 'New Message', ?, 'message', NOW())
        ");
        $notificationTitle = 'You have a new message from ' . ($currentUser['name'] ?: $currentUser['username']);
        $stmt->bind_param("sss", $notificationId, $receiverId, $notificationTitle);
        $stmt->execute();
        
        $response = [
            'id' => $messageData['id'],
            'content' => $messageData['content'],
            'isRead' => (bool)$messageData['is_read'],
            'createdAt' => $messageData['created_at'],
            'sender' => [
                'id' => $messageData['sender_id'],
                'username' => $messageData['sender_username'],
                'name' => $messageData['sender_name'],
                'image' => $messageData['sender_image']
            ],
            'receiver' => [
                'id' => $messageData['receiver_id'],
                'username' => $messageData['receiver_username'],
                'name' => $messageData['receiver_name'],
                'image' => $messageData['receiver_image']
            ]
        ];
        
        jsonResponse($response, 201);
    }
    
} catch (Exception $e) {
    error_log("Messages API error: " . $e->getMessage());
    errorResponse('Failed to process messages', 500);
}
?>