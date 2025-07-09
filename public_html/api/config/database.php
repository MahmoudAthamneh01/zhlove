<?php
// Database configuration for ZH-Love Platform
// Update these values with your Hostinger MySQL credentials

class Database {
    private static $instance = null;
    private $connection;
    
    // Database configuration - UPDATE THESE VALUES
    private $host = 'localhost';
    private $database = 'u123456789_zh_love_db'; // استبدل u123456789 برقم حسابك الفعلي
    private $username = 'u123456789_zh_love_user'; // استبدل u123456789 برقم حسابك الفعلي  
    private $password = 'YOUR_STRONG_PASSWORD'; // استبدل بكلمة المرور التي أنشأتها
    private $charset = 'utf8mb4';
    
    private function __construct() {
        try {
            $this->connection = new mysqli(
                $this->host,
                $this->username,
                $this->password,
                $this->database
            );
            
            if ($this->connection->connect_error) {
                throw new Exception("Connection failed: " . $this->connection->connect_error);
            }
            
            $this->connection->set_charset($this->charset);
            
        } catch (Exception $e) {
            error_log("Database connection error: " . $e->getMessage());
            throw $e;
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function close() {
        if ($this->connection) {
            $this->connection->close();
        }
    }
    
    // Generate UUID for new records
    public static function generateUUID() {
        return sprintf(
            '%08x-%04x-%04x-%04x-%012x',
            mt_rand(0, 0xffffffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffffffffffff)
        );
    }
}

// Utility function to get database connection
function getDB() {
    return Database::getInstance()->getConnection();
}

// Utility function to generate UUID
function generateId() {
    return Database::generateUUID();
}
?>