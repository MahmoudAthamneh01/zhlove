<?php
// Forum Statistics API - Get forum activity statistics
require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../config/auth.php';

setupCORS();
validateMethod(['GET']);

try {
    $db = getDB();
    
    // Get overall forum statistics
    $stats = [];
    
    // Total posts
    $stmt = $db->prepare("SELECT COUNT(*) as total_posts FROM forum_posts");
    $stmt->execute();
    $stats['totalPosts'] = (int)$stmt->get_result()->fetch_assoc()['total_posts'];
    
    // Total comments
    $stmt = $db->prepare("SELECT COUNT(*) as total_comments FROM forum_comments");
    $stmt->execute();
    $stats['totalComments'] = (int)$stmt->get_result()->fetch_assoc()['total_comments'];
    
    // Total likes
    $stmt = $db->prepare("SELECT COUNT(*) as total_likes FROM post_likes");
    $stmt->execute();
    $stats['totalLikes'] = (int)$stmt->get_result()->fetch_assoc()['total_likes'];
    
    // Posts by category
    $stmt = $db->prepare("
        SELECT category, COUNT(*) as count 
        FROM forum_posts 
        GROUP BY category 
        ORDER BY count DESC
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $stats['postsByCategory'] = [];
    while ($row = $result->fetch_assoc()) {
        $stats['postsByCategory'][] = [
            'category' => $row['category'],
            'count' => (int)$row['count']
        ];
    }
    
    // Recent activity (posts from last 7 days)
    $stmt = $db->prepare("
        SELECT DATE(created_at) as date, COUNT(*) as posts_count
        FROM forum_posts 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $stats['recentActivity'] = [];
    while ($row = $result->fetch_assoc()) {
        $stats['recentActivity'][] = [
            'date' => $row['date'],
            'postsCount' => (int)$row['posts_count']
        ];
    }
    
    // Most active users (by post count)
    $stmt = $db->prepare("
        SELECT u.id, u.username, u.name, u.image, COUNT(fp.id) as post_count
        FROM users u
        JOIN forum_posts fp ON u.id = fp.author_id
        GROUP BY u.id
        ORDER BY post_count DESC
        LIMIT 10
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $stats['mostActiveUsers'] = [];
    while ($row = $result->fetch_assoc()) {
        $stats['mostActiveUsers'][] = [
            'user' => [
                'id' => $row['id'],
                'username' => $row['username'],
                'name' => $row['name'],
                'image' => $row['image']
            ],
            'postCount' => (int)$row['post_count']
        ];
    }
    
    // Most popular posts (by views and likes)
    $stmt = $db->prepare("
        SELECT fp.id, fp.title, fp.views, fp.created_at,
               u.username, u.name, u.image,
               COUNT(DISTINCT pl.id) as like_count,
               COUNT(DISTINCT fc.id) as comment_count
        FROM forum_posts fp
        JOIN users u ON fp.author_id = u.id
        LEFT JOIN post_likes pl ON fp.id = pl.post_id
        LEFT JOIN forum_comments fc ON fp.id = fc.post_id
        WHERE fp.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY fp.id
        ORDER BY (fp.views + (like_count * 5) + (comment_count * 3)) DESC
        LIMIT 5
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $stats['popularPosts'] = [];
    while ($row = $result->fetch_assoc()) {
        $stats['popularPosts'][] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'views' => (int)$row['views'],
            'likes' => (int)$row['like_count'],
            'comments' => (int)$row['comment_count'],
            'createdAt' => $row['created_at'],
            'author' => [
                'username' => $row['username'],
                'name' => $row['name'],
                'image' => $row['image']
            ]
        ];
    }
    
    jsonResponse($stats, 200);
    
} catch (Exception $e) {
    error_log("Forum stats API error: " . $e->getMessage());
    errorResponse('Failed to fetch forum statistics', 500);
}
?>