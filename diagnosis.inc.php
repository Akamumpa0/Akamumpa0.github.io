<?php
session_start();
header('Content-Type: application/json');

// Enable detailed error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

error_log("=== DIAGNOSIS.INC.PHP STARTED ===");

// Check if user is logged in
if (!isset($_SESSION['userid'])) {
    error_log("❌ User not logged in");
    echo json_encode(['success' => false, 'error' => 'notloggedin', 'message' => 'Please log in to use this feature.']);
    exit;
}

// Check if message is provided
if (!isset($_POST['chat_message'])) {
    error_log("❌ No chat_message in POST");
    echo json_encode(['success' => false, 'error' => 'No message provided', 'message' => 'Please enter a message.']);
    exit;
}

$userMessage = trim($_POST['chat_message']);
$conversationId = $_POST['conversation_id'] ?? 'conv-' . uniqid();
$chatHistory = isset($_POST['chat_history']) ? json_decode($_POST['chat_history'], true) : [];
$userId = $_SESSION['userid'];

error_log("User ID: $userId");
error_log("Conversation ID: $conversationId");
error_log("User Message: $userMessage");
error_log("Chat History length: " . count($chatHistory));

try {
    // Set base path and include required files
    $basePath = __DIR__ . '/../classes/';
    error_log("Base path: $basePath");

    // Check if files exist
    $requiredFiles = [
        'dbh.classes.php',
        'diagnosis.classes.php', 
        'diagnosis_contr.classes.php'
    ];

    foreach ($requiredFiles as $file) {
        $fullPath = $basePath . $file;
        if (!file_exists($fullPath)) {
            throw new Exception("Required file not found: $file");
        }
        error_log("✅ File found: $file");
    }

    // Include the files
    include $basePath . 'dbh.classes.php';
    include $basePath . 'diagnosis.classes.php';
    include $basePath . 'diagnosis_contr.classes.php';

    error_log("✅ All files included successfully");

    // Create diagnosis controller and process message
    $diagnosis = new DiagnosisContr([], $userId);
    $result = $diagnosis->processChatMessage($userMessage, $chatHistory, $conversationId);
    
    error_log("✅ Diagnosis processed successfully");

    // Return successful response
    echo json_encode([
        'success' => true,
        'message' => $result['response'],
        'diagnosis_complete' => $result['diagnosis_complete'],
        'diagnosis_data' => $result['diagnosis_data'] ?? null,
        'suggestions' => $result['suggestions'] ?? [],
        'conversation_id' => $conversationId
    ]);

} catch (Exception $e) {
    error_log("❌ ERROR in diagnosis.inc.php: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage(),
        'message' => 'Sorry, there was an error processing your request. Please try again.'
    ]);
}