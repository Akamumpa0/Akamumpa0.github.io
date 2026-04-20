<?php
session_start()
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - MUST E-Hospital</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="signup.css">
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
              <!--  <div class="auth-buttons" id="auth-buttons">
                    <a href="index.html#login" class="btn-login">Log In</a>
                    <a href="signup.html" class="btn-signup active">Sign Up</a>
                </div>-->
                <div class="mobile-menu-toggle" id="mobile-menu-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    </header>

    <!-- Sign Up Section -->
    <section class="signup">
        <div class="container">
            <div class="signup-content">
                <div class="signup-text">
                    <h1>Sign Up</h1>
                    <p>Create your Must Hospital account to access personalized medical services.</p>
                </div>
                <div class="signup-form">
                    <?php
                   $errors = array(
                        'emptyinput' => 'Please fill in all fields.',
                        'invalidnames' => 'First and Last Name should only contain letters.',
                        'invalidstudentID' => 'Student ID should only contain numbers.',
                        'invalidemail' => 'Please enter a valid email address.',
                        'invalidphone' => 'Phone number should be 10-15 digits (e.g., +256123456789).',
                        'invaliddob' => 'Date of Birth must be in YYYY-MM-DD format and not in the future.',
                        'passwordsdontmatch' => 'Passwords do not match.',
                        'useralreadyexists' => 'Student ID or Email already exists.',
                        'stmtfailed' => 'Database error. Please try again or contact support.'
                    );
                    $error = isset($_GET['error']) ? $_GET['error'] : '';
                    if ($error && isset($errors[$error])) {
                        echo '<p class="error-message general-error">' . htmlspecialchars($errors[$error]) . '</p>';
                    }
                    $formData = isset($_SESSION['form_data']) ? $_SESSION['form_data'] : array();
                    ?>
                    <form id="signup-form" action="includes/signup.inc.php" method="POST">
                        <label for="first-name">First Name:</label>
                        <?php if ($error == 'invalidnames') echo '<p class="error-message">' . htmlspecialchars($errors['invalidnames']) . '</p>'; ?>
                        <input type="text" id="first-name" name="first-name" value="<?php echo htmlspecialchars($formData['first-name'] ?? ''); ?>" required>
                        <label for="last-name">Last Name:</label>
                        <?php if ($error == 'invalidnames') echo '<p class="error-message">' . htmlspecialchars($errors['invalidnames']) . '</p>'; ?>
                        <input type="text" id="last-name" name="last-name" value="<?php echo htmlspecialchars($formData['last-name'] ?? ''); ?>" required>
                        <label for="student-id">Student ID:</label>
                        <?php if ($error == 'invalidstudentID' || $error == 'useralreadyexists') echo '<p class="error-message">' . htmlspecialchars($errors[$error]) . '</p>'; ?>
                        <input type="text" id="student-id" name="student-id" value="<?php echo htmlspecialchars($formData['student-id'] ?? ''); ?>" required>
                        <label for="email">Email Address:</label>
                        <?php if ($error == 'invalidemail' || $error == 'useralreadyexists') echo '<p class="error-message">' . htmlspecialchars($errors[$error]) . '</p>'; ?>
                        <input type="email" id="email" name="email"  value="<?php echo htmlspecialchars($formData['email'] ?? ''); ?>" required>
                        <label for="phone">Phone Number:</label>
                        <?php if ($error == 'invalidphone') echo '<p class="error-message">' . htmlspecialchars($errors['invalidphone']) . '</p>'; ?>
                        <input type="tel" id="phone" name="phone" value="<?php echo htmlspecialchars($formData['phone'] ?? ''); ?>" required>
                        <label for="dob">Date of Birth:</label>
                        <?php if ($error == 'invaliddob') echo '<p class="error-message">' . htmlspecialchars($errors['invaliddob']) . '</p>'; ?>
                        <input type="text" id="dob" name="dob" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}"  value="<?php echo htmlspecialchars($formData['dob'] ?? ''); ?>" required>
                        <label for="gender">Gender:</label>
                        <select id="gender" name="gender" required>
                            <option value="" disabled selected>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <label for="address">Address:</label>
                        <textarea id="address" name="address" required><?php echo htmlspecialchars($formData['address'] ?? ''); ?></textarea>
                        <label for="password">Password:</label>
                        <?php if ($error == 'passwordsdontmatch') echo '<p class="error-message">' . htmlspecialchars($errors['passwordsdontmatch']) . '</p>'; ?>
                        <input type="password" id="password" name="password" required>
                        <label for="confirm-password">Confirm Password:</label>
                        <?php if ($error == 'passwordsdontmatch') echo '<p class="error-message">' . htmlspecialchars($errors['passwordsdontmatch']) . '</p>'; ?>
                        <input type="password" id="confirm-password" name="confirm-password" required>
                        <button type="submit" class="btn-primary" name="submit">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <script>
        console.log('signup.js loading...');
    </script>
    <script src="signup.js"></script>
</body>
</html>