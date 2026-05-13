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
include "../classes/notification.classes.php";
include "../classes/notification_contr.classes.php";

// Initialize controller
$userId = $_SESSION['userid'];
$notification = new NotificationContr($userId);

// Handle mark as read request
if (isset($_POST['mark_as_read'])) {
    $notificationId = isset($_POST['notification_id']) ? trim($_POST['notification_id']) : '';
    error_log("notification.inc.php: Mark as read request, notificationID=$notificationId, userID=$userId");

    try {
        $notification->markNotificationAsRead($notificationId);
        echo json_encode(['success' => true, 'message' => 'Notification marked as read.']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// Handle mark all as read request
if (isset($_POST['mark_all_as_read'])) {
    error_log("notification.inc.php: Mark all as read request, userID=$userId");

    try {
        $notification->markAllNotificationsAsRead();
        echo json_encode(['success' => true, 'message' => 'All notifications marked as read.']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// Invalid request
echo json_encode(['success' => false, 'error' => 'Invalid request']);