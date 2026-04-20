<?php
// Start session to check login
session_start();
$cssFile = 'emergency.css';
if (!file_exists($cssFile)) {
    error_log("CSS file not found: " . realpath($cssFile));
} else {
    error_log("CSS file found: " . realpath($cssFile));
}
if (!isset($_SESSION['userid'])) {
    header('Location: index.php?error=notloggedin');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emergency - MUST E-Hospital</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="emergency.css">
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
                                    <li><a href="Account.php" class="submenu-link">Account</a></li>
                                    <li><a href="Help.html" class="submenu-link">Help</a></li>
                                    <li><a href="includes/logout.inc.php" class="submenu-link">Logout</a></li>
                                </ul>
                            </div>
                        </li>
                        <li><a href="about.html" class="nav-link">About</a></li>
                        <li><a href="Notifications.php" class="nav-link">Notifications</a></li>
                        <li><a href="Diagnosis.php" class="nav-link">Diagnosis</a></li>
                        <li><a href="Emergency.php" class="nav-link active">Emergency</a></li>
                    </ul>
                </nav>
               
                <div class="mobile-menu-toggle" id="mobile-menu-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    </header>

    <!-- Emergency Section -->
    <section class="emergency">
        <div class="container">
            <div class="emergency-content">
                <div class="emergency-text">
                    <h1>Emergency Assistance</h1>
                    <p>In case of an emergency, choose one of the options below to get immediate help. Call a medical professional for counseling or request an ambulance by providing your location.</p>
                </div>
                <div class="emergency-options">
                    <div class="option counseling">
                        <h2>Contact for Counseling</h2>
                        <a href="tel:+256775452573" class="btn-primary call-counselor">Call Counselor</a>
                    </div>
                    <div class="option ambulance">
                        <h2>Request Ambulance</h2>
                        <form id="ambulance-form">
                            <label for="location">Location:</label>
                            <input type="text" id="location" name="location" placeholder="Enter your location" required>
                            <button type="button" id="get-location" class="btn-secondary">Get Live Location</button>
                            <button type="submit" class="btn-primary">Request Ambulance</button>
                        </form>
                    <div id="map-container" style="display: none; margin-top: 1rem;">
                    <div id="map" style="height: 200px; width: 100%; border-radius: 8px;"></div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script src="emergency.js"></script>
</body>
</html>