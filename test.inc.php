<?php
session_start();
header('Content-Type: application/json');

error_log("=== TEST API CALLED ===");

// Simple test response
echo json_encode([
    'success' => true,
    'message' => 'Test API is working!',
    'test_data' => [
        'session_exists' => isset($_SESSION['userid']),
        'user_id' => $_SESSION['userid'] ?? 'none',
        'post_data' => $_POST
    ]
]);