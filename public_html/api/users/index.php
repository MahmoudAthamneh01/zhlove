<?php
// Users API - Migrated from Next.js API route
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/auth.php';

setupCORS();
validateMethod(['GET']);

try {
    // Get query parameters
    $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : '';
    $limit = isset($_GET['limit']) ? min(100, max(1, intval($_GET['limit']))) : 20;
    $offset = isset($_GET['offset']) ? max(0, intval($_GET['offset'])) : 0;
    $orderBy = isset($_GET['orderBy']) ? sanitizeInput($_GET['orderBy']) : 'points';
    $order = isset($_GET['order']) && $_GET['order'] === 'asc' ? 'ASC' : 'DESC';
    
    // Validate orderBy to prevent SQL injection
    $allowedOrderBy = ['points', 'wins', 'level', 'xp', 'joined_at', 'username', 'rank'];
    if (!in_array($orderBy, $allowedOrderBy)) {
        $orderBy = 'points';
    }
    
    $db = getDB();
    
    // Build WHERE clause for search
    $whereClause = '';
    $params = [];
    $types = '';
    
    if (!empty($search)) {
        $whereClause = 'WHERE (u.username LIKE ? OR u.name LIKE ? OR u.email LIKE ?)';
        $searchTerm = "%{$search}%";
        $params = [$searchTerm, $searchTerm, $searchTerm];
        $types = 'sss';
    }
    
    // Get users with related data
    $sql = "
        SELECT u.id, u.username, u.name, u.email, u.image, u.rank, u.points, 
               u.wins, u.losses, u.xp, u.level, u.status, u.last_seen, 
               u.joined_at, u.is_verified,
               cm.clan_id,
               c.name as clan_name, c.tag as clan_tag, c.logo as clan_logo,
               COUNT(DISTINCT fp.id) as forum_posts_count,
               COUNT(DISTINCT fc.id) as forum_comments_count,
               COUNT(DISTINCT tp.id) as tournament_participants_count,
               COUNT(DISTINCT ub.badge_id) as badge_count
        FROM users u
        LEFT JOIN clan_members cm ON u.id = cm.user_id
        LEFT JOIN clans c ON cm.clan_id = c.id
        LEFT JOIN forum_posts fp ON u.id = fp.author_id
        LEFT JOIN forum_comments fc ON u.id = fc.author_id
        LEFT JOIN tournament_participants tp ON u.id = tp.user_id
        LEFT JOIN user_badges ub ON u.id = ub.user_id
        {$whereClause}
        GROUP BY u.id
        ORDER BY u.{$orderBy} {$order}
        LIMIT ? OFFSET ?
    ";
    
    // Add limit and offset to parameters
    $params[] = $limit;
    $params[] = $offset;
    $types .= 'ii';
    
    $stmt = $db->prepare($sql);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $totalGames = $row['wins'] + $row['losses'];
        $winRate = $totalGames > 0 ? round(($row['wins'] / $totalGames) * 100, 2) : 0;
        
        $user = [
            'id' => $row['id'],
            'username' => $row['username'],
            'name' => $row['name'],
            'email' => $row['email'],
            'image' => $row['image'],
            'rank' => $row['rank'],
            'points' => (int)$row['points'],
            'wins' => (int)$row['wins'],
            'losses' => (int)$row['losses'],
            'xp' => (int)$row['xp'],
            'level' => (int)$row['level'],
            'status' => $row['status'],
            'lastSeen' => $row['last_seen'],
            'joinedAt' => $row['joined_at'],
            'isVerified' => (bool)$row['is_verified'],
            'winRate' => $winRate,
            'clan' => null,
            '_count' => [
                'forumPosts' => (int)$row['forum_posts_count'],
                'forumComments' => (int)$row['forum_comments_count'],
                'tournamentParticipants' => (int)$row['tournament_participants_count']
            ],
            'badges' => [], // Will be populated separately if needed
            'badgeCount' => (int)$row['badge_count']
        ];
        
        // Add clan info if user is in a clan
        if ($row['clan_id']) {
            $user['clan'] = [
                'id' => $row['clan_id'],
                'name' => $row['clan_name'],
                'tag' => $row['clan_tag'],
                'logo' => $row['clan_logo']
            ];
        }
        
        $users[] = $user;
    }
    
    // Get total count for pagination
    $countSql = "SELECT COUNT(DISTINCT u.id) as total FROM users u {$whereClause}";
    $stmt = $db->prepare($countSql);
    if (!empty($search)) {
        $stmt->bind_param('sss', $searchTerm, $searchTerm, $searchTerm);
    }
    $stmt->execute();
    $total = $stmt->get_result()->fetch_assoc()['total'];
    
    jsonResponse([
        'users' => $users,
        'total' => (int)$total,
        'hasMore' => $offset + $limit < $total
    ], 200);
    
} catch (Exception $e) {
    error_log("Users API error: " . $e->getMessage());
    errorResponse('Failed to fetch users', 500);
}
?>