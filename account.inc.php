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
include "../classes/account.classes.php";
include "../classes/account_contr.classes.php";

// Initialize controller
$userId = $_SESSION['userid'];
$account = new AccountContr($userId);

// Get the update type
$updateType = isset($_POST['update_type']) ? trim($_POST['update_type']) : '';

// Handle profile update
if ($updateType === 'profile') {
    $firstName = isset($_POST['first_name']) ? trim($_POST['first_name']) : '';
    $lastName = isset($_POST['last_name']) ? trim($_POST['last_name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $dob = isset($_POST['dob']) ? trim($_POST['dob']) : '';
    $gender = isset($_POST['gender']) ? trim($_POST['gender']) : '';
    $address = isset($_POST['address']) ? trim($_POST['address']) : '';
    $file = isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] !== UPLOAD_ERR_NO_FILE ? $_FILES['profile_picture'] : null;
    
    error_log("account.inc.php: Update profile request, userID=$userId, email=$email");

    try {
        $account->updateProfile($firstName, $lastName, $email, $phone, $dob, $gender, $address, $file);
        echo json_encode(['success' => true, 'message' => 'Profile updated successfully.']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// Handle password change
if ($updateType === 'password') {
    $currentPassword = isset($_POST['current_password']) ? trim($_POST['current_password']) : '';
    $newPassword = isset($_POST['new_password']) ? trim($_POST['new_password']) : '';
    $confirmPassword = isset($_POST['confirm_password']) ? trim($_POST['confirm_password']) : '';
    error_log("account.inc.php: Change password request, userID=$userId");

    try {
        $account->changePassword($currentPassword, $newPassword, $confirmPassword);
        echo json_encode(['success' => true, 'message' => 'Password changed successfully.']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// Invalid request
echo json_encode(['success' => false, 'error' => 'Invalid request']);