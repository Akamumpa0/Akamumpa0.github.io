<?php
// Start session and set JSON response
session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['userid'])) {
    echo json_encode(['success' => false, 'error' => 'notloggedin']);
    exit;
}

// Include classes
include "../classes/dbh.classes.php";
include "../classes/healthtrack.classes.php";
include "../classes/healthtrack_contr.classes.php";

// Initialize controller
$userId = $_SESSION['userid'];
$healthTrack = new HealthTrackContr($userId);

// Handle lab test upload
if (isset($_POST['upload_lab_test']) && isset($_FILES['lab_test_file'])) {
    $historyId = isset($_POST['history_id']) ? trim($_POST['history_id']) : '';
    $testName = isset($_POST['test_name']) ? trim($_POST['test_name']) : '';
    error_log("healthtrack.inc.php: Upload lab test request, userID=$userId, historyID=$historyId, testName=$testName");

    try {
        $labTestId = $healthTrack->uploadNewLabTest($historyId, $testName, $_FILES['lab_test_file']);
        echo json_encode(['success' => true, 'message' => 'Lab test uploaded successfully.', 'lab_test_id' => $labTestId]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// Invalid request
echo json_encode(['success' => false, 'error' => 'Invalid request']);