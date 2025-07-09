<?php
// Session Check API - New endpoint for checking authentication status
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/auth.php';

setupCORS();
validateMethod(['GET']);

try {
    $user = getCurrentUser();
    
    if (!$user) {
        jsonResponse(['authenticated' => false], 200);
    }
    
    // Update last seen
    Auth::updateLastSeen($user['id']);
    
    // Get additional user data
    $db = getDB();
    $stmt = $db->prepare("
        SELECT u.*, 
               cm.clan_id,
               c.name as clan_name,
               c.tag as clan_tag,
               c.logo as clan_logo,
               COUNT(DISTINCT ub.badge_id) as badge_count
        FROM users u
        LEFT JOIN clan_members cm ON u.id = cm.user_id
        LEFT JOIN clans c ON cm.clan_id = c.id
        LEFT JOIN user_badges ub ON u.id = ub.user_id
        WHERE u.id = ?
        GROUP BY u.id
    ");
    $stmt->bind_param("s", $user['id']);
    $stmt->execute();
    $userData = $stmt->get_result()->fetch_assoc();
    
    // Prepare response data
    $responseData = [
        'id' => $userData['id'],
        'email' => $userData['email'],
        'name' => $userData['name'],
        'username' => $userData['username'],
        'image' => $userData['image'],
        'role' => $userData['role'],
        'rank' => $userData['rank'],
        'points' => (int)$userData['points'],
        'wins' => (int)$userData['wins'],
        'losses' => (int)$userData['losses'],
        'level' => (int)$userData['level'],
        'xp' => (int)$userData['xp'],
        'status' => $userData['status'],
        'isVerified' => (bool)$userData['is_verified'],
        'isAdmin' => (bool)$userData['is_admin'],
        'isModerator' => (bool)$userData['is_moderator'],
        'joinedAt' => $userData['joined_at'],
        'lastSeen' => $userData['last_seen'],
        'badgeCount' => (int)$userData['badge_count'],
        'clan' => null
    ];
    
    // Add clan info if user is in a clan
    if ($userData['clan_id']) {
        $responseData['clan'] = [
            'id' => $userData['clan_id'],
            'name' => $userData['clan_name'],
            'tag' => $userData['clan_tag'],
            'logo' => $userData['clan_logo']
        ];
    }
    
    // Calculate win rate
    $totalGames = $userData['wins'] + $userData['losses'];
    $responseData['winRate'] = $totalGames > 0 ? round(($userData['wins'] / $totalGames) * 100, 2) : 0;
    
    jsonResponse([
        'authenticated' => true,
        'user' => $responseData
    ], 200);
    
} catch (Exception $e) {
    error_log("Session check error: " . $e->getMessage());
    errorResponse('Internal server error', 500);
}
?>