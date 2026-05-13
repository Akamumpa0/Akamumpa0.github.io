<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['userid'])) {
    echo json_encode(['success' => false, 'error' => 'notloggedin']);
    exit;
}

include "../classes/dbh.classes.php";
include "../classes/emergency.classes.php";
include "../classes/emergency_contr.classes.php";

if (isset($_POST['submit_emergency'])) {
    $type = isset($_POST['type']) ? trim($_POST['type']) : '';
    $location = isset($_POST['location']) ? trim($_POST['location']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
    $userId = $_SESSION['userid'];

    try {
        $emergency = new EmergencyContr($userId, $type, $location, $message);
        $requestId = $emergency->processRequest();
        echo json_encode(['success' => true, 'message' => 'Emergency request created successfully.', 'request_id' => $requestId]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

echo json_encode(['success' => false, 'error' => 'Invalid request']);