<?php
// User Profile API - Get and update user profile
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/auth.php';

setupCORS();
validateMethod(['GET', 'PUT']);

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get user profile
        $userId = isset($_GET['userId']) ? sanitizeInput($_GET['userId']) : null;
        
        // If no userId provided, get current user
        if (!$userId) {
            $currentUser = requireAuth();
            $userId = $currentUser['id'];
        }
        
        $db = getDB();
        
        // Get detailed user profile
        $stmt = $db->prepare("
            SELECT u.*, 
                   cm.clan_id, cm.role as clan_role, cm.joined_at as clan_joined_at,
                   c.name as clan_name, c.tag as clan_tag, c.logo as clan_logo,
                   COUNT(DISTINCT fp.id) as forum_posts_count,
                   COUNT(DISTINCT fc.id) as forum_comments_count,
                   COUNT(DISTINCT tp.id) as tournament_count,
                   COUNT(DISTINCT ub.badge_id) as badge_count,
                   COUNT(DISTINCT m1.id) as messages_sent_count,
                   COUNT(DISTINCT m2.id) as messages_received_count
            FROM users u
            LEFT JOIN clan_members cm ON u.id = cm.user_id
            LEFT JOIN clans c ON cm.clan_id = c.id
            LEFT JOIN forum_posts fp ON u.id = fp.author_id
            LEFT JOIN forum_comments fc ON u.id = fc.author_id
            LEFT JOIN tournament_participants tp ON u.id = tp.user_id
            LEFT JOIN user_badges ub ON u.id = ub.user_id
            LEFT JOIN messages m1 ON u.id = m1.sender_id
            LEFT JOIN messages m2 ON u.id = m2.receiver_id
            WHERE u.id = ?
            GROUP BY u.id
        ");
        $stmt->bind_param("s", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            errorResponse('User not found', 404);
        }
        
        $userData = $result->fetch_assoc();
        
        // Get user's badges
        $stmt = $db->prepare("
            SELECT b.id, b.name, b.description, b.icon, b.category, ub.earned_at
            FROM user_badges ub
            JOIN badges b ON ub.badge_id = b.id
            WHERE ub.user_id = ?
            ORDER BY ub.earned_at DESC
        ");
        $stmt->bind_param("s", $userId);
        $stmt->execute();
        $badgesResult = $stmt->get_result();
        
        $badges = [];
        while ($badge = $badgesResult->fetch_assoc()) {
            $badges[] = [
                'id' => $badge['id'],
                'name' => $badge['name'],
                'description' => $badge['description'],
                'icon' => $badge['icon'],
                'category' => $badge['category'],
                'earnedAt' => $badge['earned_at']
            ];
        }
        
        // Calculate stats
        $totalGames = $userData['wins'] + $userData['losses'];
        $winRate = $totalGames > 0 ? round(($userData['wins'] / $totalGames) * 100, 2) : 0;
        
        // Prepare response
        $profile = [
            'id' => $userData['id'],
            'username' => $userData['username'],
            'name' => $userData['name'],
            'email' => $userData['email'],
            'image' => $userData['image'],
            'bio' => $userData['bio'],
            'rank' => $userData['rank'],
            'role' => $userData['role'],
            'points' => (int)$userData['points'],
            'wins' => (int)$userData['wins'],
            'losses' => (int)$userData['losses'],
            'xp' => (int)$userData['xp'],
            'level' => (int)$userData['level'],
            'status' => $userData['status'],
            'lastSeen' => $userData['last_seen'],
            'joinedAt' => $userData['joined_at'],
            'isVerified' => (bool)$userData['is_verified'],
            'isAdmin' => (bool)$userData['is_admin'],
            'isModerator' => (bool)$userData['is_moderator'],
            'winRate' => $winRate,
            'clan' => null,
            'badges' => $badges,
            'stats' => [
                'forumPosts' => (int)$userData['forum_posts_count'],
                'forumComments' => (int)$userData['forum_comments_count'],
                'tournaments' => (int)$userData['tournament_count'],
                'badgeCount' => (int)$userData['badge_count'],
                'messagesSent' => (int)$userData['messages_sent_count'],
                'messagesReceived' => (int)$userData['messages_received_count']
            ]
        ];
        
        // Add clan info if user is in a clan
        if ($userData['clan_id']) {
            $profile['clan'] = [
                'id' => $userData['clan_id'],
                'name' => $userData['clan_name'],
                'tag' => $userData['clan_tag'],
                'logo' => $userData['clan_logo'],
                'role' => $userData['clan_role'],
                'joinedAt' => $userData['clan_joined_at']
            ];
        }
        
        jsonResponse($profile, 200);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Update user profile
        $currentUser = requireAuth();
        $data = getRequestData();
        
        // Fields that can be updated
        $allowedFields = ['name', 'bio', 'image'];
        $updateFields = [];
        $params = [];
        $types = '';
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updateFields[] = "{$field} = ?";
                $params[] = sanitizeInput($data[$field]);
                $types .= 's';
            }
        }
        
        if (empty($updateFields)) {
            errorResponse('No valid fields to update', 400);
        }
        
        // Add user ID to parameters
        $params[] = $currentUser['id'];
        $types .= 's';
        
        $db = getDB();
        $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->bind_param($types, ...$params);
        
        if (!$stmt->execute()) {
            errorResponse('Failed to update profile', 500);
        }
        
        jsonResponse(['message' => 'Profile updated successfully'], 200);
    }
    
} catch (Exception $e) {
    error_log("Profile API error: " . $e->getMessage());
    errorResponse('Internal server error', 500);
}
?>