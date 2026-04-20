<?php
// Start session to check login
session_start();

// Redirect to login if not logged in
if (!isset($_SESSION['userid'])) {
    header('Location: index.php?error=notloggedin');
    exit;
}

// Include classes to fetch notifications
include "classes/dbh.classes.php";
include "classes/notification.classes.php";
include "classes/notification_contr.classes.php";

// Fetch notifications for the logged-in user
$userId = $_SESSION['userid'];
$notification = new NotificationContr($userId);
try {
    $notifications = $notification->fetchNotifications();
} catch (Exception $e) {
    $notifications = [];
    error_log("Notifications.php: Failed to fetch notifications: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notifications - MUST E-Hospital</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="notifications.css">
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
                                    <li><a href="Help.html" class="submenu-link active">Help</a></li>
                                    <li><a href="includes/logout.inc.php" class="submenu-link">Logout</a></li>
                                </ul>
                            </div>
                        </li>
                        <li><a href="about.html" class="nav-link">About</a></li>
                        <li><a href="Notifications.php" class="nav-link active">Notifications</a></li>
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

    <!-- Notifications Section -->
    <section class="notifications">
        <div class="container">
            <div class="notifications-content">
                <div class="notifications-text">
                    <h1>Your Notifications</h1>
                    <p>View and manage your notifications below.</p>
                    <form id="mark-all-form">
                        <button type="submit" class="btn-primary" name="mark_all_as_read">Mark All as Read</button>
                    </form>
                </div>
                <div class="notifications-list">
                    <?php if (empty($notifications)): ?>
                        <p>No notifications found.</p>
                    <?php else: ?>
                        <?php foreach ($notifications as $notification): ?>
                            <div class="notification-item <?php echo $notification['is_read'] ? 'read' : 'unread'; ?>" data-notification-id="<?php echo htmlspecialchars($notification['id']); ?>">
                                <h3><?php echo htmlspecialchars($notification['type']); ?></h3>
                                <p><?php echo htmlspecialchars($notification['message']); ?></p>
                                <p><small><?php echo htmlspecialchars($notification['created_at']); ?></small></p>
                                <?php if (!$notification['is_read']): ?>
                                    <form class="mark-read-form">
                                        <input type="hidden" name="notification_id" value="<?php echo htmlspecialchars($notification['id']); ?>">
                                        <button type="submit" class="btn-secondary" name="mark_as_read">Mark as Read</button>
                                    </form>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>

    <script src="notifications.js"></script>
</body>
</html>