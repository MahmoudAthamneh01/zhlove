-- ZH-Love MySQL Database Schema
-- Converted from Prisma SQLite schema for Hostinger Premium hosting

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified DATETIME NULL,
    image TEXT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NULL,
    bio TEXT NULL,
    rank VARCHAR(50) DEFAULT 'Recruit',
    role VARCHAR(20) DEFAULT 'user',
    points INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'offline',
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE,
    is_moderator BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_points (points),
    INDEX idx_rank (rank)
);

-- Accounts table (for NextAuth)
CREATE TABLE accounts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token TEXT NULL,
    access_token TEXT NULL,
    expires_at INT NULL,
    token_type VARCHAR(255) NULL,
    scope TEXT NULL,
    id_token TEXT NULL,
    session_state TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY provider_account (provider, provider_account_id)
);

-- Sessions table (for NextAuth)
CREATE TABLE sessions (
    id VARCHAR(36) PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    expires DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Verification tokens table
CREATE TABLE verification_tokens (
    identifier VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires DATETIME NOT NULL,
    UNIQUE KEY identifier_token (identifier, token)
);

-- Clans table
CREATE TABLE clans (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    tag VARCHAR(10) UNIQUE NOT NULL,
    description TEXT NULL,
    logo TEXT NULL,
    points INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    founded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_recruiting BOOLEAN DEFAULT TRUE,
    max_members INT DEFAULT 4,
    owner_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    INDEX idx_points (points),
    INDEX idx_name (name)
);

-- Clan members table
CREATE TABLE clan_members (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL,
    clan_id VARCHAR(36) NOT NULL,
    role VARCHAR(20) DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (clan_id) REFERENCES clans(id) ON DELETE CASCADE
);

-- Clan wars table
CREATE TABLE clan_wars (
    id VARCHAR(36) PRIMARY KEY,
    clan1_id VARCHAR(36) NOT NULL,
    clan2_id VARCHAR(36) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    winner_id VARCHAR(36) NULL,
    loser_id VARCHAR(36) NULL,
    points_awarded INT NULL,
    scheduled_at DATETIME NOT NULL,
    completed_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clan1_id) REFERENCES clans(id),
    FOREIGN KEY (clan2_id) REFERENCES clans(id)
);

-- Tournaments table
CREATE TABLE tournaments (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    type VARCHAR(50) NOT NULL,
    format VARCHAR(50) NULL,
    max_participants INT NOT NULL,
    prize_pool DECIMAL(10,2) NULL,
    prize_description TEXT NULL,
    entry_fee DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'upcoming',
    start_date DATETIME NOT NULL,
    end_date DATETIME NULL,
    registration_deadline DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    rules TEXT NULL,
    requirements TEXT NULL,
    map_pool TEXT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    allow_spectators BOOLEAN DEFAULT TRUE,
    stream_url TEXT NULL,
    bracket_url TEXT NULL,
    organizer_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_start_date (start_date)
);

-- Tournament participants table
CREATE TABLE tournament_participants (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    tournament_id VARCHAR(36) NOT NULL,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'registered',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    UNIQUE KEY user_tournament (user_id, tournament_id)
);

-- Forum posts table
CREATE TABLE forum_posts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    tags TEXT NULL,
    views INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_created_at (created_at),
    INDEX idx_pinned (is_pinned)
);

-- Forum comments table
CREATE TABLE forum_comments (
    id VARCHAR(36) PRIMARY KEY,
    content TEXT NOT NULL,
    post_id VARCHAR(36) NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    parent_id VARCHAR(36) NULL,
    likes INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES forum_comments(id)
);

-- Post likes table
CREATE TABLE post_likes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    post_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    UNIQUE KEY user_post (user_id, post_id)
);

-- Messages table
CREATE TABLE messages (
    id VARCHAR(36) PRIMARY KEY,
    content TEXT NOT NULL,
    sender_id VARCHAR(36) NOT NULL,
    receiver_id VARCHAR(36) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation (sender_id, receiver_id),
    INDEX idx_created_at (created_at)
);

-- Badges table
CREATE TABLE badges (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL
);

-- User badges table
CREATE TABLE user_badges (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    badge_id VARCHAR(36) NOT NULL,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE KEY user_badge (user_id, badge_id)
);

-- Notifications table
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_created_at (created_at)
);

-- Pages table (CMS)
CREATE TABLE pages (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    meta_title VARCHAR(255) NULL,
    meta_description TEXT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    language VARCHAR(5) DEFAULT 'ar',
    author_id VARCHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at DATETIME NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_slug (slug),
    INDEX idx_status (status)
);

-- CMS Content table
CREATE TABLE cms_content (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NULL,
    content TEXT NOT NULL,
    slug VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36) NOT NULL,
    updated_by VARCHAR(36) NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    UNIQUE KEY type_active (type, is_active)
);

-- Support tickets table
CREATE TABLE support_tickets (
    id VARCHAR(36) PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    priority VARCHAR(20) DEFAULT 'medium',
    user_id VARCHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_category (category)
);

-- User bookmarks table
CREATE TABLE user_bookmarks (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    post_id VARCHAR(36) NULL,
    type VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE
);

-- Create default admin user (password: admin123)
INSERT INTO users (
    id, name, email, username, password, role, is_admin, rank, points, level, xp
) VALUES (
    'admin-user-id-2024', 
    'Administrator', 
    'admin@zh-love.com', 
    'admin', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeYHQMBf8TQpIhXqK', -- admin123
    'admin', 
    TRUE, 
    'General', 
    10000, 
    50, 
    25000
);