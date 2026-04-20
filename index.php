<?php
session_start();
if (!isset($_GET['error'])) {
    unset($_SESSION['login_form_data']);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MUST E-Hospital</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="index.css">
</head>
<body>
    <!-- Header Section -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <h2>MUST E-Hospital</h2>
                </div>
                <nav class="nav" id="nav">
                    <ul class="nav-list" id="nav-list">
                        <!-- Navigation links populated dynamically after login -->
                    </ul>
                </nav>
                <div class="auth-buttons" id="auth-buttons">
                    <a href="#login" class="btn-login">Log In</a>
                    <a href="signup.php" class="btn-signup">Sign Up</a>
                </div>
                <div class="mobile-menu-toggle" id="mobile-menu-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <h1>Welcome to MUST E-Hospital</h1>
                    <p>Your trusted partner in health. Log in to access personalized medical services, book appointments, and manage your health records.</p>
                    <a href="signup.php"> <button class="btn-primary">Learn More</button></a>
                </div>
               
            </div>
        </div>
    </section>

    <!-- Login Section -->
    <section class="login" id="login">
        <div class="container">
            <div class="login-content">
                <div class="login-text">
                    <h1>Log In</h1>
                    <p>Enter your student number and password to access your MUST E-Hospital account.</p>
                </div>
                <div class="login-form">
                    <?php
                    $errors = [
                        'emptyinput' => 'Please fill in all fields.',
                        'usernotfound' => 'Student ID not found.',
                        'wrongpassword' => 'Incorrect password.',
                        'stmtfailed' => 'Database error. Please try again or contact support.',
                        'invalidemail' => 'Invalid email format.',
                        'emailnotfound' => 'Email not found.',
                        'codeinvalid' => 'Invalid or expired verification code.',
                        'passwordsdontmatch' => 'Passwords do not match.',
                        'weakpassword'=> 'Password must be at least 6 characters long.',
                        'system_error'=>'System temporarily unavailable. Please try again later.',
                        'invalid_request'=> 'Invalid request. Please refresh the page and try again.'
                    ];
                    $error = isset($_GET['error']) ? $_GET['error'] : '';
                    if ($error && isset($errors[$error])) {
                        echo '<p class="error-message general-error">' . htmlspecialchars($errors[$error]) . '</p>';
                    }
                    $formData = isset($_SESSION['login_form_data']) ? $_SESSION['login_form_data'] : [];
                    ?>
                    <form id="login-form" action="includes/login.inc.php" method="POST">
                        <label for="student-id">Student ID:</label>
                        <?php if ($error == 'usernotfound' || $error == 'emptyinput') echo '<p class="error-message">' . htmlspecialchars($errors[$error]) . '</p>'; ?>
                        <input type="text" id="student-id" name="student-id" value="<?php echo htmlspecialchars(isset($formData['student-id']) ? $formData['student-id'] : ''); ?>" required>
                        <label for="password">Password:</label>
                        <?php if ($error == 'wrongpassword') echo '<p class="error-message">' . htmlspecialchars($errors['wrongpassword']) . '</p>'; ?>
                        <input type="password" id="password" name="password" required>
                        <button type="submit" class="btn-primary" name="submit">Log In</button>
                        <a href="#" id="forgot-password-link">Forgot Password?</a>
                    </form>
                </div>
                <div class="forgot-password-modal" id="forgot-password-modal" style="display: none;">
                    <div class="modal-content">
                        <h2>Forgot Password</h2>
                        <form id="forgot-password-form" action="includes/forgot_password.inc.php" method="POST">
                            <label for="email">Email Address:</label>
                            <?php if ($error == 'invalidemail' || $error == 'emailnotfound') echo '<p class="error-message">' . htmlspecialchars($errors[$error]) . '</p>'; ?>
                            <input type="email" id="email" name="email" required>
                            <button type="submit" class="btn-primary" name="send_code">Send Verification Code</button>
                            <button type="button" class="btn-cancel">Cancel</button>
                        </form>
                        <form id="verify-code-form" style="display: none;" action="includes/forgot_password.inc.php" method="POST">
                            <input type="hidden" id="reset-email" name="email">
                            <label for="verification-code">Verification Code:</label>
                            <?php if ($error == 'codeinvalid') echo '<p class="error-message">' . htmlspecialchars($errors['codeinvalid']) . '</p>'; ?>
                            <input type="text" id="verification-code" name="verification-code" required>
                            <label for="new-password">New Password:</label>
                            <input type="password" id="new-password" name="new-password" required>
                            <label for="confirm-password">Confirm New Password:</label>
                            <?php if ($error == 'passwordsdontmatch') echo '<p class="error-message">' . htmlspecialchars($errors['passwordsdontmatch']) . '</p>'; ?>
                            <input type="password" id="confirm-password" name="confirm-password" required>
                            <button type="submit" class="btn-primary">Reset Password</button>
                            <button type="button" class="btn-cancel">Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script>
        console.log('signup.js loading...');
    </script>
    <script src="index.js"></script>
</body>
</html>