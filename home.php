<?php
session_start();
if (!isset($_SESSION['userid'])) {
    header("location: index.php");
    exit();
}
unset($_SESSION['login_form_data']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MUST E-Hospital - Student Healthcare Platform</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="home.css">
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
                        <li><a href="home.php" class="nav-link active">Home</a></li>
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

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <h1>Get Medical Help Online Without Leaving Campus</h1>
                    <p>Access professional healthcare guidance through our secure platform. Fill out medical forms, get preliminary assessments, and understand if your symptoms require immediate attention - all from the comfort of your dorm room.</p>
                   <!---- <div class="hero-buttons">
                        <button class="btn-primary">Get Started</button>
                        <button class="btn-secondary">Learn More</button>
                    </div> --->
                    <div class="trust-indicators">
                        <div class="trust-item">
                            <div class="trust-icon">⚕️</div>
                            <div class="trust-text">
                                <span class="trust-number">24/7</span>
                                <span class="trust-label">Available</span>
                            </div>
                        </div>
                        <div class="trust-item">
                            <div class="trust-icon">🔒</div>
                            <div class="trust-text">
                                <span class="trust-number">100%</span>
                                <span class="trust-label">Secure</span>
                            </div>
                        </div>
                        <div class="trust-item">
                            <div class="trust-icon">👥</div>
                            <div class="trust-text">
                                <span class="trust-number">5000+</span>
                                <span class="trust-label">Students Helped</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="hero-visual">
                    <div class="floating-card card-1">
                        <div class="card-icon">📋</div>
                        <div class="card-content">
                            <h4>Quick Assessment</h4>
                            <p>Fill medical forms in minutes</p>
                        </div>
                    </div>
                    <div class="floating-card card-2">
                        <div class="card-icon">🏥</div>
                        <div class="card-content">
                            <h4>Professional Review</h4>
                            <p>Healthcare experts analyze your symptoms</p>
                        </div>
                    </div>
                    <div class="floating-card card-3">
                        <div class="card-icon">✅</div>
                        <div class="card-content">
                            <h4>Get Results</h4>
                            <p>Know if you need immediate care</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script>
        // Mobile menu functionality
        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            const navList = document.querySelector('.nav-list');
            const serviceLinks = document.querySelectorAll('.nav-link.services');
            
            // Toggle main mobile menu
            mobileMenuToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                navList.classList.toggle('active');
                
                // Close all submenus when closing main menu
                if (!navList.classList.contains('active')) {
                    document.querySelectorAll('.submenu').forEach(submenu => {
                        submenu.classList.remove('active');
                    });
                    document.querySelectorAll('.nav-link.services').forEach(link => {
                        link.classList.remove('active');
                    });
                }
            });
            
            // Toggle submenus on mobile
            serviceLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        const submenu = this.nextElementSibling;
                        
                        // Close other open submenus
                        document.querySelectorAll('.submenu').forEach(menu => {
                            if (menu !== submenu) {
                                menu.classList.remove('active');
                            }
                        });
                        document.querySelectorAll('.nav-link.services').forEach(menuLink => {
                            if (menuLink !== this) {
                                menuLink.classList.remove('active');
                            }
                        });
                        
                        // Toggle current submenu
                        this.classList.toggle('active');
                        if (submenu && submenu.classList.contains('submenu')) {
                            submenu.classList.toggle('active');
                        }
                    }
                });
            });
            
            // Close menu when clicking outside on mobile
            document.addEventListener('click', function(e) {
                if (window.innerWidth <= 768 && 
                    !e.target.closest('.nav-list') && 
                    !e.target.closest('.mobile-menu-toggle') &&
                    navList.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    navList.classList.remove('active');
                    
                    // Close all submenus
                    document.querySelectorAll('.submenu').forEach(submenu => {
                        submenu.classList.remove('active');
                    });
                    document.querySelectorAll('.nav-link.services').forEach(link => {
                        link.classList.remove('active');
                    });
                }
            });
            
            // Header scroll effect
            window.addEventListener('scroll', function() {
                const header = document.querySelector('.header');
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

            // Navigation handling for all links
            document.addEventListener('click', function(e) {
                const link = e.target.closest('.nav-link, .submenu-link');
                if (link) {
                    const targetUrl = link.getAttribute('href');
                    
                    // Handle logout separately
                    if (targetUrl === 'includes/logout.inc.php') {
                        e.preventDefault();
                        window.location.href = targetUrl;
                        return;
                    }
                    
                    // Handle page navigation
                    if (targetUrl && !targetUrl.startsWith('#')) {
                        // Allow default navigation for all page links
                        return;
                    }
                    
                    // Handle in-page anchor links
                    if (targetUrl && targetUrl.startsWith('#')) {
                        e.preventDefault();
                        const targetElement = document.querySelector(targetUrl);
                        if (targetElement) {
                            targetElement.scrollIntoView({
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            });

            // Update notification badge (if exists)
            const notificationBadge = document.getElementById('notification-badge');
            if (notificationBadge) {
                const unreadCount = localStorage.getItem('unreadNotifications') || 0;
                notificationBadge.textContent = unreadCount;
            }
        });
    </script>
</body>
</html>