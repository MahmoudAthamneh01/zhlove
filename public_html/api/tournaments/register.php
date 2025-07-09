<?php
// Tournament Registration API - Handle tournament registration/unregistration
require_once '../config/database.php';
require_once '../config/cors.php';
require_once '../config/auth.php';

setupCORS();
validateMethod(['POST', 'DELETE']);

try {
    $currentUser = requireAuth();
    $db = getDB();
    
    // Get tournament ID
    $data = getRequestData();
    $tournamentId = isset($data['tournamentId']) ? sanitizeInput($data['tournamentId']) : null;
    
    if (!$tournamentId) {
        errorResponse('Tournament ID is required', 400);
    }
    
    // Get tournament details
    $stmt = $db->prepare("SELECT * FROM tournaments WHERE id = ?");
    $stmt->bind_param("s", $tournamentId);
    $stmt->execute();
    $tournament = $stmt->get_result()->fetch_assoc();
    
    if (!$tournament) {
        errorResponse('Tournament not found', 404);
    }
    
    // Check if tournament is open for registration
    if ($tournament['status'] !== 'upcoming' && $tournament['status'] !== 'registration') {
        errorResponse('Tournament registration is closed', 400);
    }
    
    // Check registration deadline
    if ($tournament['registration_deadline']) {
        $deadline = new DateTime($tournament['registration_deadline']);
        $now = new DateTime();
        if ($now > $deadline) {
            errorResponse('Registration deadline has passed', 400);
        }
    }
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Register for tournament
        
        // Check if already registered
        $stmt = $db->prepare("
            SELECT id FROM tournament_participants 
            WHERE user_id = ? AND tournament_id = ?
        ");
        $stmt->bind_param("ss", $currentUser['id'], $tournamentId);
        $stmt->execute();
        
        if ($stmt->get_result()->num_rows > 0) {
            errorResponse('Already registered for this tournament', 400);
        }
        
        // Check if tournament is full
        $stmt = $db->prepare("
            SELECT COUNT(*) as participant_count 
            FROM tournament_participants 
            WHERE tournament_id = ?
        ");
        $stmt->bind_param("s", $tournamentId);
        $stmt->execute();
        $participantCount = $stmt->get_result()->fetch_assoc()['participant_count'];
        
        if ($participantCount >= $tournament['max_participants']) {
            errorResponse('Tournament is full', 400);
        }
        
        // Check if user can afford entry fee (if applicable)
        if ($tournament['entry_fee'] > 0) {
            if ($currentUser['points'] < $tournament['entry_fee']) {
                errorResponse('Insufficient points for entry fee', 400);
            }
            
            // Deduct entry fee from user's points
            $stmt = $db->prepare("
                UPDATE users 
                SET points = points - ? 
                WHERE id = ?
            ");
            $stmt->bind_param("ds", $tournament['entry_fee'], $currentUser['id']);
            $stmt->execute();
        }
        
        // Register user for tournament
        $participantId = generateId();
        $stmt = $db->prepare("
            INSERT INTO tournament_participants (id, user_id, tournament_id, registered_at, status) 
            VALUES (?, ?, ?, NOW(), 'registered')
        ");
        $stmt->bind_param("sss", $participantId, $currentUser['id'], $tournamentId);
        
        if (!$stmt->execute()) {
            // Refund points if registration fails
            if ($tournament['entry_fee'] > 0) {
                $stmt = $db->prepare("
                    UPDATE users 
                    SET points = points + ? 
                    WHERE id = ?
                ");
                $stmt->bind_param("ds", $tournament['entry_fee'], $currentUser['id']);
                $stmt->execute();
            }
            errorResponse('Failed to register for tournament', 500);
        }
        
        // Create notification for tournament organizer
        $notificationId = generateId();
        $stmt = $db->prepare("
            INSERT INTO notifications (id, user_id, title, message, type, created_at) 
            VALUES (?, ?, 'New Tournament Registration', ?, 'tournament', NOW())
        ");
        $notificationMessage = $currentUser['name'] . ' has registered for your tournament: ' . $tournament['title'];
        $stmt->bind_param("sss", $notificationId, $tournament['organizer_id'], $notificationMessage);
        $stmt->execute();
        
        // Get updated participant count
        $stmt = $db->prepare("
            SELECT COUNT(*) as participant_count 
            FROM tournament_participants 
            WHERE tournament_id = ?
        ");
        $stmt->bind_param("s", $tournamentId);
        $stmt->execute();
        $newParticipantCount = $stmt->get_result()->fetch_assoc()['participant_count'];
        
        jsonResponse([
            'message' => 'Successfully registered for tournament',
            'registered' => true,
            'participantCount' => (int)$newParticipantCount,
            'entryFeePaid' => $tournament['entry_fee']
        ], 200);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Unregister from tournament
        
        // Check if registered
        $stmt = $db->prepare("
            SELECT id FROM tournament_participants 
            WHERE user_id = ? AND tournament_id = ?
        ");
        $stmt->bind_param("ss", $currentUser['id'], $tournamentId);
        $stmt->execute();
        
        if ($stmt->get_result()->num_rows === 0) {
            errorResponse('Not registered for this tournament', 400);
        }
        
        // Check if cancellation is allowed (e.g., not too close to start time)
        $startDate = new DateTime($tournament['start_date']);
        $now = new DateTime();
        $hoursDifference = ($startDate->getTimestamp() - $now->getTimestamp()) / 3600;
        
        if ($hoursDifference < 24) {
            errorResponse('Cannot unregister less than 24 hours before tournament start', 400);
        }
        
        // Remove registration
        $stmt = $db->prepare("
            DELETE FROM tournament_participants 
            WHERE user_id = ? AND tournament_id = ?
        ");
        $stmt->bind_param("ss", $currentUser['id'], $tournamentId);
        
        if (!$stmt->execute()) {
            errorResponse('Failed to unregister from tournament', 500);
        }
        
        // Refund entry fee if applicable
        if ($tournament['entry_fee'] > 0) {
            $stmt = $db->prepare("
                UPDATE users 
                SET points = points + ? 
                WHERE id = ?
            ");
            $stmt->bind_param("ds", $tournament['entry_fee'], $currentUser['id']);
            $stmt->execute();
        }
        
        // Get updated participant count
        $stmt = $db->prepare("
            SELECT COUNT(*) as participant_count 
            FROM tournament_participants 
            WHERE tournament_id = ?
        ");
        $stmt->bind_param("s", $tournamentId);
        $stmt->execute();
        $newParticipantCount = $stmt->get_result()->fetch_assoc()['participant_count'];
        
        jsonResponse([
            'message' => 'Successfully unregistered from tournament',
            'registered' => false,
            'participantCount' => (int)$newParticipantCount,
            'entryFeeRefunded' => $tournament['entry_fee']
        ], 200);
    }
    
} catch (Exception $e) {
    error_log("Tournament registration API error: " . $e->getMessage());
    errorResponse('Failed to process tournament registration', 500);
}
?>