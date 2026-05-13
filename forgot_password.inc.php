<?php
session_start();
header('Content-Type: application/json');

// Include classes with error handling
try {
    include "../classes/dbh.classes.php";
    include "../classes/forgot_password.classes.php";
    include "../classes/forgot_password_contr.classes.php";
} catch (Exception $e) {
    error_log("Class inclusion error: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'system_error']);
    exit();
}

// Handle send code request
if (isset($_POST['send_code'])) {
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    
    if (empty($email)) {
        echo json_encode(['success' => false, 'error' => 'emptyinput']);
        exit();
    }
    
    $forgotPassword = new ForgotPasswordContr($email);
    $result = $forgotPassword->sendReset();
    
    if ($result === true) {
        // Check if email was actually sent or just logged
        $message = isset($_SESSION['email_send_failed']) 
            ? 'Email service temporarily unavailable. Please contact support with code from logs.'
            : 'Verification code sent to your email.';
        
        echo json_encode(['success' => true, 'message' => $message]);
    } else {
        echo json_encode(['success' => false, 'error' => $result]);
    }
    
// Handle password reset request
} elseif (isset($_POST['reset_password'])) {
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $code = filter_var($_POST['code'], FILTER_SANITIZE_STRING);
    $newPassword = $_POST['new-password'];
    $confirmPassword = $_POST['confirm-password'];
    
    $forgotPassword = new ForgotPasswordContr($email, $code, $newPassword, $confirmPassword);
    $result = $forgotPassword->resetPassword();
    
    if ($result === true) {
        // Clear any session variables
        unset($_SESSION['last_reset_code'], $_SESSION['last_reset_email'], $_SESSION['email_send_failed']);
        echo json_encode(['success' => true, 'message' => 'Password reset successful.']);
    } else {
        echo json_encode(['success' => false, 'error' => $result]);
    }
    
} else {
    echo json_encode(['success' => false, 'error' => 'invalid_request']);
}
?>