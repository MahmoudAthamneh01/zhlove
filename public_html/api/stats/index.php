<?php
// Statistics API - Platform overview statistics
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/auth.php';

setupCORS();
validateMethod(['GET']);

try {
    $db = getDB();
    
    // Get overall platform statistics
    $stats = [];
    
    // User statistics
    $stmt = $db->prepare("SELECT COUNT(*) as total_users FROM users");
    $stmt->execute();
    $stats['totalUsers'] = (int)$stmt->get_result()->fetch_assoc()['total_users'];
    
    $stmt = $db->prepare("SELECT COUNT(*) as online_users FROM users WHERE status = 'online'");
    $stmt->execute();
    $stats['onlineUsers'] = (int)$stmt->get_result()->fetch_assoc()['online_users'];
    
    $stmt = $db->prepare("
        SELECT COUNT(*) as new_users_today 
        FROM users 
        WHERE DATE(joined_at) = CURDATE()
    ");
    $stmt->execute();
    $stats['newUsersToday'] = (int)$stmt->get_result()->fetch_assoc()['new_users_today'];
    
    // Tournament statistics
    $stmt = $db->prepare("SELECT COUNT(*) as total_tournaments FROM tournaments");
    $stmt->execute();
    $stats['totalTournaments'] = (int)$stmt->get_result()->fetch_assoc()['total_tournaments'];
    
    $stmt = $db->prepare("
        SELECT COUNT(*) as active_tournaments 
        FROM tournaments 
        WHERE status IN ('upcoming', 'registration', 'active')
    ");
    $stmt->execute();
    $stats['activeTournaments'] = (int)$stmt->get_result()->fetch_assoc()['active_tournaments'];
    
    // Clan statistics
    $stmt = $db->prepare("SELECT COUNT(*) as total_clans FROM clans");
    $stmt->execute();
    $stats['totalClans'] = (int)$stmt->get_result()->fetch_assoc()['total_clans'];
    
    $stmt = $db->prepare("
        SELECT COUNT(*) as recruiting_clans 
        FROM clans 
        WHERE is_recruiting = TRUE
    ");
    $stmt->execute();
    $stats['recruitingClans'] = (int)$stmt->get_result()->fetch_assoc()['recruiting_clans'];
    
    // Forum statistics
    $stmt = $db->prepare("SELECT COUNT(*) as total_posts FROM forum_posts");
    $stmt->execute();
    $stats['totalForumPosts'] = (int)$stmt->get_result()->fetch_assoc()['total_posts'];
    
    $stmt = $db->prepare("SELECT COUNT(*) as total_comments FROM forum_comments");
    $stmt->execute();
    $stats['totalForumComments'] = (int)$stmt->get_result()->fetch_assoc()['total_comments'];
    
    // Message statistics
    $stmt = $db->prepare("SELECT COUNT(*) as total_messages FROM messages");
    $stmt->execute();
    $stats['totalMessages'] = (int)$stmt->get_result()->fetch_assoc()['total_messages'];
    
    // Recent activity (last 7 days)
    $stmt = $db->prepare("
        SELECT 
            DATE(joined_at) as date,
            COUNT(*) as user_registrations
        FROM users 
        WHERE joined_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(joined_at)
        ORDER BY date ASC
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $stats['userRegistrations'] = [];
    while ($row = $result->fetch_assoc()) {
        $stats['userRegistrations'][] = [
            'date' => $row['date'],
            'count' => (int)$row['user_registrations']
        ];
    }
    
    // Tournament activity (last 30 days)
    $stmt = $db->prepare("
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as tournaments_created
        FROM tournaments 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $stats['tournamentActivity'] = [];
    while ($row = $result->fetch_assoc()) {
        $stats['tournamentActivity'][] = [
            'date' => $row['date'],
            'count' => (int)$row['tournaments_created']
        ];
    }
    
    // Top users by points
    $stmt = $db->prepare("
        SELECT id, username, name, image, points, rank, wins, losses
        FROM users 
        ORDER BY points DESC 
        LIMIT 10
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $stats['topUsers'] = [];
    while ($row = $result->fetch_assoc()) {
        $totalGames = $row['wins'] + $row['losses'];
        $stats['topUsers'][] = [
            'id' => $row['id'],
            'username' => $row['username'],
            'name' => $row['name'],
            'image' => $row['image'],
            'points' => (int)$row['points'],
            'rank' => $row['rank'],
            'wins' => (int)$row['wins'],
            'losses' => (int)$row['losses'],
            'winRate' => $totalGames > 0 ? round(($row['wins'] / $totalGames) * 100, 2) : 0
        ];
    }
    
    // Top clans by points
    $stmt = $db->prepare("
        SELECT c.id, c.name, c.tag, c.logo, c.points, c.wins, c.losses,
               COUNT(cm.id) as member_count
        FROM clans c
        LEFT JOIN clan_members cm ON c.id = cm.clan_id
        GROUP BY c.id
        ORDER BY c.points DESC 
        LIMIT 10
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $stats['topClans'] = [];
    while ($row = $result->fetch_assoc()) {
        $totalWars = $row['wins'] + $row['losses'];
        $stats['topClans'][] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'tag' => $row['tag'],
            'logo' => $row['logo'],
            'points' => (int)$row['points'],
            'wins' => (int)$row['wins'],
            'losses' => (int)$row['losses'],
            'memberCount' => (int)$row['member_count'],
            'winRate' => $totalWars > 0 ? round(($row['wins'] / $totalWars) * 100, 2) : 0
        ];
    }
    
    // Recent tournaments
    $stmt = $db->prepare("
        SELECT t.id, t.title, t.status, t.start_date, t.max_participants,
               u.username as organizer_username, u.name as organizer_name,
               COUNT(tp.id) as participant_count
        FROM tournaments t
        JOIN users u ON t.organizer_id = u.id
        LEFT JOIN tournament_participants tp ON t.id = tp.tournament_id
        GROUP BY t.id
        ORDER BY t.created_at DESC
        LIMIT 5
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $stats['recentTournaments'] = [];
    while ($row = $result->fetch_assoc()) {
        $stats['recentTournaments'][] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'status' => $row['status'],
            'startDate' => $row['start_date'],
            'maxParticipants' => (int)$row['max_participants'],
            'participantCount' => (int)$row['participant_count'],
            'organizer' => [
                'username' => $row['organizer_username'],
                'name' => $row['organizer_name']
            ]
        ];
    }
    
    jsonResponse($stats, 200);
    
} catch (Exception $e) {
    error_log("Statistics API error: " . $e->getMessage());
    errorResponse('Failed to fetch statistics', 500);
}
?>