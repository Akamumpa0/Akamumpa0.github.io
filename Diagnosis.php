<?php
// Start session to check login
session_start();
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
    <title>AI Doctor Chat - MUST E-Hospital</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="diagnosis.css">
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
                        <li><a href="Diagnosis.php" class="nav-link active">Diagnosis</a></li>
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

    <!-- AI Doctor Chat Section -->
    <section class="diagnosis">
        <div class="container">
            <div class="diagnosis-content">
                <div class="diagnosis-text">
                    <h1>AI Doctor Assistant</h1>
                    <p>Chat with our AI doctor to describe your symptoms and get a preliminary diagnosis.</p>
                    <p><small>Note: This is for informational purposes only. Always consult a healthcare professional for medical advice.</small></p>
                </div>
                
                <div class="chat-container">
                    <div class="chat-header">
                        <h3>AI Doctor</h3>
                        <p>How can I help you today?</p>
                    </div>
                    
                    <div class="chat-messages" id="chat-messages">
                        <div class="message ai-message">
                            Hello! I'm your AI doctor assistant. Please describe your symptoms or how you're feeling today.
                        </div>
                    </div>
                    
                    <div class="typing-indicator" id="typing-indicator">
                        AI Doctor is typing...
                    </div>
                    
                    <div class="chat-input">
                        <div class="input-group">
                            <input type="text" id="user-input" placeholder="Type your symptoms or response here..." autocomplete="off">
                            <button type="button" id="send-btn" class="btn-primary">Send</button>
                        </div>
                        <div class="suggestion-buttons" id="suggestion-buttons">
                            <!-- Quick suggestion buttons will be added here by JavaScript -->
                        </div>
                    </div>
                </div>
                
                <div class="diagnosis-result" id="diagnosis-result" style="display: none;">
                    <h3>Diagnosis Summary</h3>
                    <p><strong>Condition:</strong> <span id="result-diagnosis"></span></p>
                    <p><strong>Recommendation:</strong> <span id="result-prescription"></span></p>
                    <p><strong>Reference Number:</strong> <span id="result-reference"></span></p>
                    <p><strong>Severity:</strong> <span id="result-severity"></span></p>
                </div>
            </div>
        </div>
    </section>

    <script src="diagnosis.js"></script>
</body>
</html>