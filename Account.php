<?php
// Start session to check login
session_start();
$cssFile = 'account.css';
if (!file_exists($cssFile)) {
    error_log("CSS file not found: " . realpath($cssFile));
} else {
    error_log("CSS file found: " . realpath($cssFile));
}
if (!isset($_SESSION['userid'])) {
    header('Location: index.php?error=notloggedin');
    exit;
}

// Include classes to fetch data
include "classes/dbh.classes.php";
include "classes/account.classes.php";
include "classes/account_contr.classes.php";

// Fetch user details
$userId = $_SESSION['userid'];
$account = new AccountContr($userId);
try {
    $user = $account->fetchUserDetails();
    // Calculate age from dob
    $dob = new DateTime($user['dob']);
    $today = new DateTime();
    $age = $today->diff($dob)->y;
    
    // Debug: Check what profile picture path is retrieved
    error_log("Account.php: Retrieved profile_picture: " . ($user['profile_picture'] ?? 'NULL'));
    
} catch (Exception $e) {
    $user = [];
    error_log("account.php: Failed to fetch user details: " . $e->getMessage());
    header('Location: index.php?error=usernotfound');
    exit;
}

// Function to get profile picture URL
function getProfilePictureUrl($profilePicturePath) {
    if (empty($profilePicturePath)) {
        return 'https://via.placeholder.com/150';
    }
    
    // If it's already a full URL, return as is
    if (filter_var($profilePicturePath, FILTER_VALIDATE_URL)) {
        return $profilePicturePath;
    }
    
    // For relative paths, just return as is (browser will resolve relative to current page)
    return $profilePicturePath;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account - MUST E-Hospital</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="account.css">
</head>
<body>
    <!-- Header Section -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <h2>MUST E-Hospital</h2>
                </div>
                <nav class="nav">
                    <ul class="nav-list">
                        <li><a href="home.php" class="nav-link">Home</a></li>
                        <li>
                            <a href="#services" class="nav-link services">Services</a>
                            <div class="submenu">
                                <ul>
                                    <li><a href="Appointment.php" class="submenu-link">Appointment</a></li>
                                    <li><a href="Healthtrack.php" class="submenu-link">Healthtrack</a></li>
                                    <li><a href="Account.php" class="submenu-link active">Account</a></li>
                                    <li><a href="Help.html" class="submenu-link">Help</a></li>
                                    <li><a href="includes/logout.inc.php" class="submenu-link">Logout</a></li>
                                </ul>
                            </div>
                        </li>
                        <li><a href="about.html" class="nav-link">About</a></li>
                        <li><a href="Notifications.php" class="nav-link">Notifications</a></li>
                        <li><a href="Diagnosis.php" class="nav-link">Diagnosis</a></li>
                        <li><a href="Emergency.php" class="nav-link">Emergency</a></li>
                    </ul>
                </nav>
                <div class="mobile-menu-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    </header>

    <!-- Account Section -->
    <section class="account">
        <div class="container">
            <div class="account-content">
                <div class="account-text">
                    <h1>Your Account</h1>
                    <p>View and edit your personal information below. Upload a profile picture to personalize your account.</p>
                </div>
                
                <!-- Profile Information Section -->
                <div class="account-form-section">
                    <h2>Profile Information</h2>
                    <div class="account-form profile-section">
                        <div class="profile-picture">
                            <img id="profile-img-preview" src="<?php echo htmlspecialchars(getProfilePictureUrl($user['profile_picture'] ?? '')); ?>" alt="Profile Picture" onerror="this.src='https://via.placeholder.com/150'">
                            <input type="file" id="profile-upload" accept="image/jpeg,image/png" style="display: none;">
                            <button type="button" class="upload-btn" onclick="document.getElementById('profile-upload').click()">Upload Picture</button>
                        </div>
                        <form id="account-form" enctype="multipart/form-data">
                            <input type="hidden" name="update_type" value="profile">
                            
                            <label for="student_id">Student ID:</label>
                            <input type="text" id="student_id" name="student_id" value="<?php echo htmlspecialchars($user['student_id']); ?>" required readonly>
                            
                            <label for="first_name">First Name:</label>
                            <input type="text" id="first_name" name="first_name" value="<?php echo htmlspecialchars($user['first_name']); ?>" required>
                            
                            <label for="last_name">Last Name:</label>
                            <input type="text" id="last_name" name="last_name" value="<?php echo htmlspecialchars($user['last_name']); ?>" required>
                            
                            <label for="age">Age:</label>
                            <input type="number" id="age" name="age" value="<?php echo htmlspecialchars($age); ?>" min="1" readonly>
                            
                            <label for="dob">Date of Birth:</label>
                            <input type="date" id="dob" name="dob" value="<?php echo htmlspecialchars($user['dob']); ?>" required>
                            
                            <label for="gender">Gender:</label>
                            <select id="gender" name="gender" required>
                                <option value="Male" <?php echo $user['gender'] === 'Male' ? 'selected' : ''; ?>>Male</option>
                                <option value="Female" <?php echo $user['gender'] === 'Female' ? 'selected' : ''; ?>>Female</option>
                                <option value="Other" <?php echo $user['gender'] === 'Other' ? 'selected' : ''; ?>>Other</option>
                            </select>
                            
                            <label for="email">Email Address:</label>
                            <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" required>
                            
                            <label for="phone">Phone Number:</label>
                            <input type="tel" id="phone" name="phone" value="<?php echo htmlspecialchars($user['phone']); ?>" required>
                            
                            <label for="address">Area of Residence:</label>
                            <input type="text" id="address" name="address" value="<?php echo htmlspecialchars($user['address']); ?>" required>
                            
                            <button type="submit" class="btn-primary">Save Changes</button>
                        </form>
                    </div>
                </div>

                <!-- Password Change Section -->
                <div class="account-form-section">
                    <h2>Change Password</h2>
                    <div class="account-form password-section">
                        <form id="password-form">
                            <input type="hidden" name="update_type" value="password">
                            
                            <label for="current_password">Current Password:</label>
                            <input type="password" id="current_password" name="current_password" required>
                            
                            <label for="new_password">New Password:</label>
                            <input type="password" id="new_password" name="new_password" required>
                            
                            <label for="confirm_password">Confirm New Password:</label>
                            <input type="password" id="confirm_password" name="confirm_password" required>
                            
                            <button type="submit" class="btn-primary">Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script src="account.js"></script>
</body>
</html>