<?php
// Start session to check login
session_start();
$cssFile = 'appointment.css';
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
include "classes/appointment.classes.php";
include "classes/appointment_contr.classes.php";

// Fetch departments and appointments
$userId = $_SESSION['userid'];
$appointment = new AppointmentContr($userId);
try {
    $departments = $appointment->fetchDepartments();
    $appointments = $appointment->fetchAppointments();
} catch (Exception $e) {
    $departments = [];
    $appointments = [];
    error_log("appointment.php: Failed to fetch data: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointments - MUST E-Hospital</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="appointment.css">
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
                                    <li><a href="Appointment.php" class="submenu-link active">Appointment</a></li>
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

    <!-- Appointments Section -->
    <section class="appointments">
        <div class="container">
            <div class="appointments-content">
                <div class="appointments-text">
                    <h1>Book an Appointment</h1>
                    <p>Schedule your visit with a doctor below.</p>
                </div>
                <div class="appointment-form">
                    <form id="appointment-form">
                        <label for="department_id">Department:</label>
                        <select id="department_id" name="department_id" required>
                            <option value="">Select Department</option>
                            <?php foreach ($departments as $dept): ?>
                                <option value="<?php echo htmlspecialchars($dept['id']); ?>">
                                    <?php echo htmlspecialchars($dept['name']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <label for="doctor_id">Doctor:</label>
                        <select id="doctor_id" name="doctor_id" required>
                            <option value="">Select Doctor</option>
                            <!-- Populated by JavaScript -->
                        </select>
                        <label for="appointment_date">Date:</label>
                        <input type="date" id="appointment_date" name="appointment_date" required min="<?php echo date('Y-m-d'); ?>">
                        <label for="appointment_time">Time:</label>
                        <input type="time" id="appointment_time" name="appointment_time" required>
                        <button type="submit" class="btn-primary" name="create_appointment">Book Appointment</button>
                    </form>
                </div>
                <div class="appointments-list">
                    <h2>Your Appointments</h2>
                    <?php if (empty($appointments)): ?>
                        <p>No appointments found.</p>
                    <?php else: ?>
                        <?php foreach ($appointments as $appt): ?>
                            <div class="appointment-item <?php echo strtolower($appt['status']); ?>" data-appointment-id="<?php echo htmlspecialchars($appt['id']); ?>">
                                <h3><?php echo htmlspecialchars($appt['department_name']); ?> - <?php echo htmlspecialchars($appt['doctor_name']); ?></h3>
                                <p><strong>Date:</strong> <?php echo htmlspecialchars($appt['appointment_date']); ?></p>
                                <p><strong>Time:</strong> <?php echo htmlspecialchars($appt['appointment_time']); ?></p>
                                <p><strong>Status:</strong> <?php echo htmlspecialchars($appt['status']); ?></p>
                                <?php if ($appt['response_message']): ?>
                                    <p><strong>Response:</strong> <?php echo htmlspecialchars($appt['response_message']); ?></p>
                                <?php endif; ?>
                                <?php if ($appt['status'] === 'Requested'): ?>
                                    <form class="cancel-appointment-form">
                                        <input type="hidden" name="appointment_id" value="<?php echo htmlspecialchars($appt['id']); ?>">
                                        <button type="submit" class="btn-secondary" name="cancel_appointment">Cancel Appointment</button>
                                    </form>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>

    <script src="appointment.js"></script>
    
</body>
</html>