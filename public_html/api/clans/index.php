<?php
// Clans API - Migrated from Next.js API route
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/auth.php';

setupCORS();
validateMethod(['GET', 'POST']);

try {
    $db = getDB();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get clans
        $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : '';
        $limit = isset($_GET['limit']) ? min(100, max(1, intval($_GET['limit']))) : 20;
        $offset = isset($_GET['offset']) ? max(0, intval($_GET['offset'])) : 0;
        $orderBy = isset($_GET['orderBy']) ? sanitizeInput($_GET['orderBy']) : 'points';
        $order = isset($_GET['order']) && $_GET['order'] === 'asc' ? 'ASC' : 'DESC';
        
        // Validate orderBy to prevent SQL injection
        $allowedOrderBy = ['points', 'wins', 'founded_at', 'name', 'member_count'];
        if (!in_array($orderBy, $allowedOrderBy)) {
            $orderBy = 'points';
        }
        
        // Build WHERE clause for search
        $whereClause = '';
        $params = [];
        $types = '';
        
        if (!empty($search)) {
            $whereClause = 'WHERE (c.name LIKE ? OR c.tag LIKE ? OR c.description LIKE ?)';
            $searchTerm = "%{$search}%";
            $params = [$searchTerm, $searchTerm, $searchTerm];
            $types = 'sss';
        }
        
        // Get clans with member count and owner info
        $orderColumn = $orderBy === 'member_count' ? 'member_count' : "c.{$orderBy}";
        $sql = "
            SELECT c.*, 
                   owner.id as owner_id, owner.username as owner_username,
                   owner.name as owner_name, owner.image as owner_image,
                   COUNT(cm.id) as member_count
            FROM clans c
            JOIN users owner ON c.owner_id = owner.id
            LEFT JOIN clan_members cm ON c.id = cm.clan_id
            {$whereClause}
            GROUP BY c.id
            ORDER BY {$orderColumn} {$order}
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
        
        $clans = [];
        while ($row = $result->fetch_assoc()) {
            $clan = [
                'id' => $row['id'],
                'name' => $row['name'],
                'tag' => $row['tag'],
                'description' => $row['description'],
                'logo' => $row['logo'],
                'points' => (int)$row['points'],
                'wins' => (int)$row['wins'],
                'losses' => (int)$row['losses'],
                'foundedAt' => $row['founded_at'],
                'isRecruiting' => (bool)$row['is_recruiting'],
                'maxMembers' => (int)$row['max_members'],
                'memberCount' => (int)$row['member_count'],
                'owner' => [
                    'id' => $row['owner_id'],
                    'username' => $row['owner_username'],
                    'name' => $row['owner_name'],
                    'image' => $row['owner_image']
                ],
                'members' => [] // Will be populated if detailed view is requested
            ];
            
            // Calculate win rate
            $totalWars = $row['wins'] + $row['losses'];
            $clan['winRate'] = $totalWars > 0 ? round(($row['wins'] / $totalWars) * 100, 2) : 0;
            
            $clans[] = $clan;
        }
        
        // Get members for each clan if detailed view is requested
        $includeMembers = isset($_GET['includeMembers']) && $_GET['includeMembers'] === 'true';
        if ($includeMembers && !empty($clans)) {
            foreach ($clans as &$clan) {
                $stmt = $db->prepare("
                    SELECT cm.role, cm.joined_at, u.id, u.username, u.name, u.image, u.rank, u.points
                    FROM clan_members cm
                    JOIN users u ON cm.user_id = u.id
                    WHERE cm.clan_id = ?
                    ORDER BY 
                        CASE cm.role 
                            WHEN 'owner' THEN 1 
                            WHEN 'leader' THEN 2 
                            ELSE 3 
                        END, cm.joined_at ASC
                ");
                $stmt->bind_param("s", $clan['id']);
                $stmt->execute();
                $membersResult = $stmt->get_result();
                
                $members = [];
                while ($member = $membersResult->fetch_assoc()) {
                    $members[] = [
                        'role' => $member['role'],
                        'joinedAt' => $member['joined_at'],
                        'user' => [
                            'id' => $member['id'],
                            'username' => $member['username'],
                            'name' => $member['name'],
                            'image' => $member['image'],
                            'rank' => $member['rank'],
                            'points' => (int)$member['points']
                        ]
                    ];
                }
                
                $clan['members'] = $members;
            }
        }
        
        // Get total count for pagination
        $countSql = "SELECT COUNT(DISTINCT c.id) as total FROM clans c {$whereClause}";
        $stmt = $db->prepare($countSql);
        if (!empty($search)) {
            $stmt->bind_param('sss', $searchTerm, $searchTerm, $searchTerm);
        }
        $stmt->execute();
        $total = $stmt->get_result()->fetch_assoc()['total'];
        
        jsonResponse([
            'clans' => $clans,
            'total' => (int)$total,
            'hasMore' => $offset + $limit < $total
        ], 200);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create a new clan
        $currentUser = requireAuth();
        $data = getRequestData();
        
        // Check if user is already in a clan
        $stmt = $db->prepare("SELECT clan_id FROM clan_members WHERE user_id = ?");
        $stmt->bind_param("s", $currentUser['id']);
        $stmt->execute();
        
        if ($stmt->get_result()->num_rows > 0) {
            errorResponse('You are already a member of a clan', 400);
        }
        
        // Validate required fields
        if (empty($data['name']) || empty($data['tag'])) {
            errorResponse('Clan name and tag are required', 400);
        }
        
        $name = sanitizeInput($data['name']);
        $tag = sanitizeInput($data['tag']);
        $description = isset($data['description']) ? sanitizeInput($data['description']) : null;
        $logo = isset($data['logo']) ? sanitizeInput($data['logo']) : null;
        $maxMembers = isset($data['maxMembers']) ? min(50, max(2, intval($data['maxMembers']))) : 4;
        
        // Validate name and tag
        if (strlen($name) < 3 || strlen($name) > 50) {
            errorResponse('Clan name must be between 3 and 50 characters', 400);
        }
        
        if (strlen($tag) < 2 || strlen($tag) > 6) {
            errorResponse('Clan tag must be between 2 and 6 characters', 400);
        }
        
        if (!preg_match('/^[a-zA-Z0-9_-]+$/', $tag)) {
            errorResponse('Clan tag can only contain letters, numbers, hyphens and underscores', 400);
        }
        
        // Check if name or tag already exists
        $stmt = $db->prepare("SELECT id FROM clans WHERE name = ? OR tag = ?");
        $stmt->bind_param("ss", $name, $tag);
        $stmt->execute();
        
        if ($stmt->get_result()->num_rows > 0) {
            errorResponse('Clan name or tag already exists', 400);
        }
        
        // Check if user has enough points to create clan (cost: 1000 points)
        $clanCreationCost = 1000;
        if ($currentUser['points'] < $clanCreationCost) {
            errorResponse('Insufficient points to create clan (1000 points required)', 400);
        }
        
        // Create clan
        $clanId = generateId();
        $stmt = $db->prepare("
            INSERT INTO clans (id, name, tag, description, logo, max_members, owner_id, founded_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->bind_param("sssssis", $clanId, $name, $tag, $description, $logo, $maxMembers, $currentUser['id']);
        
        if (!$stmt->execute()) {
            errorResponse('Failed to create clan', 500);
        }
        
        // Add creator as clan member with owner role
        $membershipId = generateId();
        $stmt = $db->prepare("
            INSERT INTO clan_members (id, user_id, clan_id, role, joined_at) 
            VALUES (?, ?, ?, 'owner', NOW())
        ");
        $stmt->bind_param("sss", $membershipId, $currentUser['id'], $clanId);
        $stmt->execute();
        
        // Deduct clan creation cost
        $stmt = $db->prepare("UPDATE users SET points = points - ? WHERE id = ?");
        $stmt->bind_param("is", $clanCreationCost, $currentUser['id']);
        $stmt->execute();
        
        // Get the created clan with owner details
        $stmt = $db->prepare("
            SELECT c.*, 
                   owner.id as owner_id, owner.username as owner_username,
                   owner.name as owner_name, owner.image as owner_image
            FROM clans c
            JOIN users owner ON c.owner_id = owner.id
            WHERE c.id = ?
        ");
        $stmt->bind_param("s", $clanId);
        $stmt->execute();
        $clanData = $stmt->get_result()->fetch_assoc();
        
        $response = [
            'id' => $clanData['id'],
            'name' => $clanData['name'],
            'tag' => $clanData['tag'],
            'description' => $clanData['description'],
            'logo' => $clanData['logo'],
            'points' => (int)$clanData['points'],
            'wins' => (int)$clanData['wins'],
            'losses' => (int)$clanData['losses'],
            'foundedAt' => $clanData['founded_at'],
            'isRecruiting' => (bool)$clanData['is_recruiting'],
            'maxMembers' => (int)$clanData['max_members'],
            'memberCount' => 1,
            'winRate' => 0,
            'owner' => [
                'id' => $clanData['owner_id'],
                'username' => $clanData['owner_username'],
                'name' => $clanData['owner_name'],
                'image' => $clanData['owner_image']
            ]
        ];
        
        jsonResponse($response, 201);
    }
    
} catch (Exception $e) {
    error_log("Clans API error: " . $e->getMessage());
    errorResponse('Failed to process clans', 500);
}
?>