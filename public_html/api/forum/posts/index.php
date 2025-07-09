<?php
// Forum Posts API - Migrated from Next.js API route
require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../config/auth.php';

setupCORS();
validateMethod(['GET', 'POST']);

try {
    $db = getDB();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get forum posts
        $category = isset($_GET['category']) ? sanitizeInput($_GET['category']) : 'all';
        $sort = isset($_GET['sort']) ? sanitizeInput($_GET['sort']) : 'recent';
        $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : '';
        $language = isset($_GET['language']) ? sanitizeInput($_GET['language']) : 'ar';
        $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
        $limit = isset($_GET['limit']) ? min(50, max(1, intval($_GET['limit']))) : 10;
        $offset = ($page - 1) * $limit;
        
        // Build WHERE clause
        $whereConditions = [];
        $params = [];
        $types = '';
        
        if ($category !== 'all') {
            $whereConditions[] = 'fp.category = ?';
            $params[] = $category;
            $types .= 's';
        }
        
        if (!empty($search)) {
            $whereConditions[] = '(fp.title LIKE ? OR fp.content LIKE ?)';
            $searchTerm = "%{$search}%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $types .= 'ss';
        }
        
        $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
        
        // Build ORDER BY clause
        $orderBy = '';
        switch ($sort) {
            case 'popular':
                $orderBy = 'ORDER BY fp.is_pinned DESC, fp.views DESC, fp.created_at DESC';
                break;
            case 'liked':
                $orderBy = 'ORDER BY fp.is_pinned DESC, likes_count DESC, fp.created_at DESC';
                break;
            case 'replied':
                $orderBy = 'ORDER BY fp.is_pinned DESC, comments_count DESC, fp.created_at DESC';
                break;
            default:
                $orderBy = 'ORDER BY fp.is_pinned DESC, fp.created_at DESC';
        }
        
        // Get posts with aggregated data
        $sql = "
            SELECT fp.*, 
                   author.id as author_id, author.username as author_username, 
                   author.name as author_name, author.image as author_image,
                   COUNT(DISTINCT fc.id) as comments_count,
                   COUNT(DISTINCT pl.id) as likes_count
            FROM forum_posts fp
            JOIN users author ON fp.author_id = author.id
            LEFT JOIN forum_comments fc ON fp.id = fc.post_id
            LEFT JOIN post_likes pl ON fp.id = pl.post_id
            {$whereClause}
            GROUP BY fp.id
            {$orderBy}
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
        
        $posts = [];
        while ($row = $result->fetch_assoc()) {
            $posts[] = [
                'id' => $row['id'],
                'title' => $row['title'],
                'content' => $row['content'],
                'author' => [
                    'id' => $row['author_id'],
                    'username' => $row['author_username'],
                    'name' => $row['author_name'],
                    'image' => $row['author_image']
                ],
                'createdAt' => $row['created_at'],
                'updatedAt' => $row['updated_at'],
                'replies' => (int)$row['comments_count'],
                'likes' => (int)$row['likes_count'],
                'views' => (int)$row['views'],
                'isPinned' => (bool)$row['is_pinned'],
                'isLocked' => (bool)$row['is_locked'],
                'tags' => json_decode($row['tags'] ?: '[]', true),
                'category' => $row['category'],
                'isLiked' => false, // Will be determined if user is authenticated
                'isBookmarked' => false
            ];
        }
        
        // If user is authenticated, check likes and bookmarks
        $currentUser = getCurrentUser();
        if ($currentUser && !empty($posts)) {
            $postIds = array_column($posts, 'id');
            $placeholders = str_repeat('?,', count($postIds) - 1) . '?';
            
            // Check likes
            $stmt = $db->prepare("
                SELECT post_id FROM post_likes 
                WHERE user_id = ? AND post_id IN ({$placeholders})
            ");
            $stmt->bind_param('s' . str_repeat('s', count($postIds)), $currentUser['id'], ...$postIds);
            $stmt->execute();
            $likedPosts = array_column($stmt->get_result()->fetch_all(MYSQLI_ASSOC), 'post_id');
            
            // Check bookmarks
            $stmt = $db->prepare("
                SELECT post_id FROM user_bookmarks 
                WHERE user_id = ? AND post_id IN ({$placeholders})
            ");
            $stmt->bind_param('s' . str_repeat('s', count($postIds)), $currentUser['id'], ...$postIds);
            $stmt->execute();
            $bookmarkedPosts = array_column($stmt->get_result()->fetch_all(MYSQLI_ASSOC), 'post_id');
            
            // Update posts with user-specific data
            foreach ($posts as &$post) {
                $post['isLiked'] = in_array($post['id'], $likedPosts);
                $post['isBookmarked'] = in_array($post['id'], $bookmarkedPosts);
            }
        }
        
        // Get total count for pagination
        $countSql = "
            SELECT COUNT(DISTINCT fp.id) as total 
            FROM forum_posts fp 
            JOIN users author ON fp.author_id = author.id 
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
            'posts' => $posts,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => (int)$total,
                'totalPages' => ceil($total / $limit)
            ]
        ], 200);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create a new forum post
        $currentUser = requireAuth();
        $data = getRequestData();
        
        // Validate required fields
        if (empty($data['title']) || empty($data['content'])) {
            errorResponse('Title and content are required', 400);
        }
        
        $title = sanitizeInput($data['title']);
        $content = sanitizeInput($data['content']);
        $category = isset($data['category']) ? sanitizeInput($data['category']) : 'general';
        $tags = isset($data['tags']) ? $data['tags'] : [];
        
        // Validate title length
        if (strlen($title) < 5 || strlen($title) > 200) {
            errorResponse('Title must be between 5 and 200 characters', 400);
        }
        
        // Validate content length
        if (strlen($content) < 10) {
            errorResponse('Content must be at least 10 characters', 400);
        }
        
        // Validate category
        $allowedCategories = ['general', 'strategy', 'tournaments', 'technical', 'discussion'];
        if (!in_array($category, $allowedCategories)) {
            $category = 'general';
        }
        
        // Create post
        $postId = generateId();
        $stmt = $db->prepare("
            INSERT INTO forum_posts (id, title, content, category, tags, author_id, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        ");
        $tagsJson = json_encode($tags);
        $stmt->bind_param("ssssss", $postId, $title, $content, $category, $tagsJson, $currentUser['id']);
        
        if (!$stmt->execute()) {
            errorResponse('Failed to create post', 500);
        }
        
        // Get the created post with author details
        $stmt = $db->prepare("
            SELECT fp.*, 
                   author.id as author_id, author.username as author_username, 
                   author.name as author_name, author.image as author_image
            FROM forum_posts fp
            JOIN users author ON fp.author_id = author.id
            WHERE fp.id = ?
        ");
        $stmt->bind_param("s", $postId);
        $stmt->execute();
        $postData = $stmt->get_result()->fetch_assoc();
        
        $response = [
            'post' => [
                'id' => $postData['id'],
                'title' => $postData['title'],
                'content' => $postData['content'],
                'author' => [
                    'id' => $postData['author_id'],
                    'username' => $postData['author_username'],
                    'name' => $postData['author_name'],
                    'image' => $postData['author_image']
                ],
                'createdAt' => $postData['created_at'],
                'updatedAt' => $postData['updated_at'],
                'replies' => 0,
                'likes' => 0,
                'views' => 0,
                'isPinned' => false,
                'isLocked' => false,
                'tags' => json_decode($postData['tags'] ?: '[]', true),
                'category' => $postData['category'],
                'isLiked' => false,
                'isBookmarked' => false
            ]
        ];
        
        jsonResponse($response, 201);
    }
    
} catch (Exception $e) {
    error_log("Forum posts API error: " . $e->getMessage());
    errorResponse('Failed to process forum posts', 500);
}
?>