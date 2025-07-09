<?php
// Tournaments API - Migrated from Next.js API route
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/auth.php';

setupCORS();
validateMethod(['GET', 'POST']);

try {
    $db = getDB();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get tournaments
        $status = isset($_GET['status']) ? sanitizeInput($_GET['status']) : null;
        $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : '';
        $limit = isset($_GET['limit']) ? min(100, max(1, intval($_GET['limit']))) : 20;
        $offset = isset($_GET['offset']) ? max(0, intval($_GET['offset'])) : 0;
        
        // Build WHERE clause
        $whereConditions = [];
        $params = [];
        $types = '';
        
        if ($status) {
            $whereConditions[] = 't.status = ?';
            $params[] = $status;
            $types .= 's';
        }
        
        if (!empty($search)) {
            $whereConditions[] = '(t.title LIKE ? OR t.description LIKE ?)';
            $searchTerm = "%{$search}%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $types .= 'ss';
        }
        
        $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
        
        // Get tournaments with organizer and participant data
        $sql = "
            SELECT t.*, 
                   organizer.id as organizer_id, organizer.username as organizer_username,
                   organizer.name as organizer_name, organizer.image as organizer_image,
                   COUNT(DISTINCT tp.id) as participants_count
            FROM tournaments t
            JOIN users organizer ON t.organizer_id = organizer.id
            LEFT JOIN tournament_participants tp ON t.id = tp.tournament_id
            {$whereClause}
            GROUP BY t.id
            ORDER BY t.created_at DESC
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
        
        $tournaments = [];
        while ($row = $result->fetch_assoc()) {
            $tournament = [
                'id' => $row['id'],
                'title' => $row['title'],
                'description' => $row['description'],
                'type' => $row['type'],
                'format' => $row['format'],
                'maxParticipants' => (int)$row['max_participants'],
                'prizePool' => $row['prize_pool'] ? (float)$row['prize_pool'] : null,
                'prizeDescription' => $row['prize_description'],
                'entryFee' => (float)$row['entry_fee'],
                'status' => $row['status'],
                'startDate' => $row['start_date'],
                'endDate' => $row['end_date'],
                'registrationDeadline' => $row['registration_deadline'],
                'createdAt' => $row['created_at'],
                'updatedAt' => $row['updated_at'],
                'rules' => $row['rules'],
                'requirements' => $row['requirements'],
                'mapPool' => $row['map_pool'] ? json_decode($row['map_pool'], true) : null,
                'isPublic' => (bool)$row['is_public'],
                'allowSpectators' => (bool)$row['allow_spectators'],
                'streamUrl' => $row['stream_url'],
                'bracketUrl' => $row['bracket_url'],
                'organizer' => [
                    'id' => $row['organizer_id'],
                    'username' => $row['organizer_username'],
                    'name' => $row['organizer_name'],
                    'image' => $row['organizer_image']
                ],
                'participants' => [], // Will be populated if needed
                '_count' => [
                    'participants' => (int)$row['participants_count']
                ]
            ];
            
            $tournaments[] = $tournament;
        }
        
        // Get participants for each tournament if detailed view is requested
        $includeParticipants = isset($_GET['includeParticipants']) && $_GET['includeParticipants'] === 'true';
        if ($includeParticipants && !empty($tournaments)) {
            foreach ($tournaments as &$tournament) {
                $stmt = $db->prepare("
                    SELECT tp.*, u.id, u.username, u.name, u.image, u.rank
                    FROM tournament_participants tp
                    JOIN users u ON tp.user_id = u.id
                    WHERE tp.tournament_id = ?
                    ORDER BY tp.registered_at ASC
                ");
                $stmt->bind_param("s", $tournament['id']);
                $stmt->execute();
                $participantsResult = $stmt->get_result();
                
                $participants = [];
                while ($participant = $participantsResult->fetch_assoc()) {
                    $participants[] = [
                        'id' => $participant['id'],
                        'registeredAt' => $participant['registered_at'],
                        'status' => $participant['status'],
                        'user' => [
                            'id' => $participant['id'],
                            'username' => $participant['username'],
                            'name' => $participant['name'],
                            'image' => $participant['image'],
                            'rank' => $participant['rank']
                        ]
                    ];
                }
                
                $tournament['participants'] = $participants;
            }
        }
        
        // Get total count for pagination
        $countSql = "
            SELECT COUNT(DISTINCT t.id) as total 
            FROM tournaments t 
            JOIN users organizer ON t.organizer_id = organizer.id 
            {$whereClause}
        ";
        $stmt = $db->prepare($countSql);
        if (!empty($whereConditions)) {
            $countParams = array_slice($params, 0, -2); // Remove limit and offset
            $countTypes = substr($types, 0, -2);
            $stmt->bind_param($countTypes, ...$countParams);
        }
        $stmt->execute();
        $total = $stmt->get_result()->fetch_assoc()['total'];
        
        jsonResponse([
            'tournaments' => $tournaments,
            'total' => (int)$total,
            'hasMore' => $offset + $limit < $total
        ], 200);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create a new tournament
        $currentUser = requireAuth();
        $data = getRequestData();
        
        // Validate required fields
        if (empty($data['title']) || empty($data['type']) || empty($data['format']) || empty($data['startDate'])) {
            errorResponse('Missing required fields: title, type, format, startDate', 400);
        }
        
        $title = sanitizeInput($data['title']);
        $description = isset($data['description']) ? sanitizeInput($data['description']) : null;
        $type = sanitizeInput($data['type']);
        $format = sanitizeInput($data['format']);
        $maxParticipants = isset($data['maxParticipants']) ? intval($data['maxParticipants']) : 16;
        $prizePool = isset($data['prizePool']) ? floatval($data['prizePool']) : 0;
        $prizeDescription = isset($data['prizeDescription']) ? sanitizeInput($data['prizeDescription']) : null;
        $entryFee = isset($data['entryFee']) ? floatval($data['entryFee']) : 0;
        $startDate = sanitizeInput($data['startDate']);
        $endDate = isset($data['endDate']) ? sanitizeInput($data['endDate']) : null;
        $registrationDeadline = isset($data['registrationDeadline']) ? sanitizeInput($data['registrationDeadline']) : null;
        $rules = isset($data['rules']) ? sanitizeInput($data['rules']) : null;
        $requirements = isset($data['requirements']) ? sanitizeInput($data['requirements']) : null;
        $isPublic = isset($data['isPublic']) ? (bool)$data['isPublic'] : true;
        $allowSpectators = isset($data['allowSpectators']) ? (bool)$data['allowSpectators'] : true;
        $streamUrl = isset($data['streamUrl']) ? sanitizeInput($data['streamUrl']) : null;
        $mapPool = isset($data['mapPool']) ? json_encode($data['mapPool']) : null;
        
        // Validate dates
        $startDateTime = new DateTime($startDate);
        $now = new DateTime();
        
        if ($startDateTime <= $now) {
            errorResponse('Start date must be in the future', 400);
        }
        
        if ($endDate) {
            $endDateTime = new DateTime($endDate);
            if ($endDateTime <= $startDateTime) {
                errorResponse('End date must be after start date', 400);
            }
        }
        
        if ($registrationDeadline) {
            $regDeadlineDateTime = new DateTime($registrationDeadline);
            if ($regDeadlineDateTime >= $startDateTime) {
                errorResponse('Registration deadline must be before start date', 400);
            }
        }
        
        // Validate tournament type and format
        $allowedTypes = ['1v1', '2v2', '4v4', 'FFA'];
        $allowedFormats = ['single elimination', 'double elimination', 'round robin'];
        
        if (!in_array($type, $allowedTypes)) {
            errorResponse('Invalid tournament type', 400);
        }
        
        if (!in_array($format, $allowedFormats)) {
            errorResponse('Invalid tournament format', 400);
        }
        
        // Create tournament
        $tournamentId = generateId();
        $stmt = $db->prepare("
            INSERT INTO tournaments (
                id, title, description, type, format, max_participants, 
                prize_pool, prize_description, entry_fee, start_date, end_date, 
                registration_deadline, rules, requirements, is_public, 
                allow_spectators, stream_url, map_pool, organizer_id, 
                status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'upcoming', NOW(), NOW())
        ");
        
        $stmt->bind_param("ssssissssssssssisss", 
            $tournamentId, $title, $description, $type, $format, $maxParticipants,
            $prizePool, $prizeDescription, $entryFee, $startDate, $endDate,
            $registrationDeadline, $rules, $requirements, $isPublic,
            $allowSpectators, $streamUrl, $mapPool, $currentUser['id']
        );
        
        if (!$stmt->execute()) {
            errorResponse('Failed to create tournament', 500);
        }
        
        // Get the created tournament with organizer details
        $stmt = $db->prepare("
            SELECT t.*, 
                   organizer.id as organizer_id, organizer.username as organizer_username,
                   organizer.name as organizer_name, organizer.image as organizer_image
            FROM tournaments t
            JOIN users organizer ON t.organizer_id = organizer.id
            WHERE t.id = ?
        ");
        $stmt->bind_param("s", $tournamentId);
        $stmt->execute();
        $tournamentData = $stmt->get_result()->fetch_assoc();
        
        $response = [
            'id' => $tournamentData['id'],
            'title' => $tournamentData['title'],
            'description' => $tournamentData['description'],
            'type' => $tournamentData['type'],
            'format' => $tournamentData['format'],
            'maxParticipants' => (int)$tournamentData['max_participants'],
            'prizePool' => $tournamentData['prize_pool'] ? (float)$tournamentData['prize_pool'] : null,
            'prizeDescription' => $tournamentData['prize_description'],
            'entryFee' => (float)$tournamentData['entry_fee'],
            'status' => $tournamentData['status'],
            'startDate' => $tournamentData['start_date'],
            'endDate' => $tournamentData['end_date'],
            'registrationDeadline' => $tournamentData['registration_deadline'],
            'createdAt' => $tournamentData['created_at'],
            'updatedAt' => $tournamentData['updated_at'],
            'organizer' => [
                'id' => $tournamentData['organizer_id'],
                'username' => $tournamentData['organizer_username'],
                'name' => $tournamentData['organizer_name'],
                'image' => $tournamentData['organizer_image']
            ]
        ];
        
        jsonResponse($response, 201);
    }
    
} catch (Exception $e) {
    error_log("Tournaments API error: " . $e->getMessage());
    errorResponse('Failed to process tournaments', 500);
}
?>