<?php
// Start session to check login
session_start();
$cssFile = 'healthtrack.css';
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
include "classes/healthtrack.classes.php";
include "classes/healthtrack_contr.classes.php";

// Fetch medical history
$userId = $_SESSION['userid'];
$healthTrack = new HealthTrackContr($userId);
try {
    $medicalHistory = $healthTrack->fetchMedicalHistory();
} catch (Exception $e) {
    $medicalHistory = [];
    error_log("healthtrack.php: Failed to fetch medical history: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Track - MUST E-Hospital</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="healthtrack.css">
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
                                    <li><a href="Healthtrack.php" class="submenu-link active">Healthtrack</a></li>
                                    <li><a href="Account.php" class="submenu-link">Account</a></li>
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
                <div class="mobile-menu-toggle" id="mobile-menu-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    </header>

    <!-- Health Track Section -->
    <section class="healthtrack">
        <div class="container">
            <div class="healthtrack-content">
                <div class="healthtrack-text">
                    <h1>Your Health Track</h1>
                    <p>View your medical history and upload lab test reports below.</p>
                </div>
                <div class="healthtrack-form">
                    <h2>Upload Lab Test</h2>
                    <form id="lab-test-form" enctype="multipart/form-data">
                        <label for="history_id">Medical History Entry:</label>
                        <select id="history_id" name="history_id" required>
                            <option value="">Select Medical History</option>
                            <?php foreach ($medicalHistory as $entry): ?>
                                <option value="<?php echo htmlspecialchars($entry['id']); ?>">
                                    <?php echo htmlspecialchars($entry['date'] . ' - ' . substr($entry['description'], 0, 30) . (strlen($entry['description']) > 30 ? '...' : '')); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <label for="test_name">Test Name:</label>
                        <input type="text" id="test_name" name="test_name" required placeholder="e.g., Blood Test">
                        <label for="lab_test_file">Lab Test File (PDF, max 5MB):</label>
                        <input type="file" id="lab_test_file" name="lab_test_file" accept="application/pdf" required>
                        <button type="submit" class="btn-primary" name="upload_lab_test">Upload Lab Test</button>
                    </form>
                </div>
                <div class="healthtrack-list">
                    <h2>Your Medical History</h2>
                    <?php if (empty($medicalHistory)): ?>
                        <p>No medical history found.</p>
                    <?php else: ?>
                        <?php foreach ($medicalHistory as $entry): ?>
                            <div class="history-item" data-history-id="<?php echo htmlspecialchars($entry['id']); ?>">
                                <h3>
                                    <?php echo htmlspecialchars($entry['date']); ?> 
                                    - <?php echo htmlspecialchars(substr($entry['description'], 0, 50) . (strlen($entry['description']) > 50 ? '...' : '')); ?>
                                    <span class="toggle-details">▼</span>
                                </h3>
                                <div class="history-details" style="display: none;">
                                    <p><strong>Description:</strong> <?php echo htmlspecialchars($entry['description']); ?></p>
                                    <p><strong>Doctor:</strong> <?php echo htmlspecialchars($entry['doctor_name'] ?: 'N/A'); ?></p>
                                    <p><strong>Created:</strong> <?php echo htmlspecialchars($entry['created_at']); ?></p>
                                    <?php if (!empty($entry['lab_tests'])): ?>
                                        <h4>Lab Tests:</h4>
                                        <ul>
                                            <?php foreach ($entry['lab_tests'] as $test): ?>
                                                <li>
                                                    <a href="<?php echo htmlspecialchars($test['file_path']); ?>" target="_blank">
                                                        <?php echo htmlspecialchars($test['test_name']); ?> (Uploaded: <?php echo htmlspecialchars($test['upload_date']); ?>)
                                                    </a>
                                                </li>
                                            <?php endforeach; ?>
                                        </ul>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>

    <script src="healthtrack.js"></script>
</body>
</html>