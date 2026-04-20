// Log script load for debugging
console.log('notifications.js loaded');

// Error messages for user alerts
const errorMessages = {
    'notloggedin': 'Please log in to view notifications.',
    'usernotfound': 'User not found. Please log in again.',
    'stmtfailed': 'Database error. Please try again or contact support.',
    'invalidnotificationid': 'Invalid notification ID.',
    'notificationnotfound': 'Notification not found.'
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - Initializing notifications page');
    
    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const navList = document.querySelector('.nav-list');
    const serviceLinks = document.querySelectorAll('.nav-link.services');
    
    // Mobile menu toggle
    if (mobileMenuToggle && nav && navList) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            this.classList.toggle('active');
            nav.classList.toggle('active');
            navList.classList.toggle('active');
            
            // Close all submenus when closing main menu
            if (!navList.classList.contains('active')) {
                closeAllSubmenus();
            }
        });
    }

    // Services dropdown on mobile
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                const submenu = this.nextElementSibling;
                
                // Close other open submenus
                closeOtherSubmenus(submenu);
                
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
            !e.target.closest('.nav') && 
            !e.target.closest('.mobile-menu-toggle')) {
            closeMobileMenu();
        }
    });
    
    // Close menu function
    function closeMobileMenu() {
        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        if (nav) nav.classList.remove('active');
        if (navList) navList.classList.remove('active');
        closeAllSubmenus();
    }
    
    // Close all submenus function
    function closeAllSubmenus() {
        document.querySelectorAll('.submenu').forEach(submenu => {
            submenu.classList.remove('active');
        });
        document.querySelectorAll('.nav-link.services').forEach(link => {
            link.classList.remove('active');
        });
    }
    
    // Close other submenus function
    function closeOtherSubmenus(currentSubmenu) {
        document.querySelectorAll('.submenu').forEach(menu => {
            if (menu !== currentSubmenu) {
                menu.classList.remove('active');
            }
        });
        document.querySelectorAll('.nav-link.services').forEach(menuLink => {
            if (menuLink.nextElementSibling !== currentSubmenu) {
                menuLink.classList.remove('active');
            }
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Navigation handling
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
            
            // Close mobile menu when navigating (except for services dropdown)
            if (window.innerWidth <= 768 && !link.classList.contains('services')) {
                closeMobileMenu();
            }
        }
    });

    // Notifications functionality
    const markAllForm = document.getElementById('mark-all-form');
    const markReadForms = document.querySelectorAll('.mark-read-form');

    // Handle mark all as read form submission
    if (markAllForm) {
        markAllForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                const response = await fetch('includes/notifications.inc.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        'mark_all_as_read': true
                    })
                });
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();

                if (data.success) {
                    alert(data.message);
                    // Update UI: mark all as read
                    document.querySelectorAll('.notification-item').forEach(item => {
                        item.classList.remove('unread');
                        item.classList.add('read');
                        const form = item.querySelector('.mark-read-form');
                        if (form) form.remove();
                    });
                } else {
                    alert(errorMessages[data.error] || 'An unexpected error occurred.');
                    if (data.error === 'notloggedin') {
                        window.location.href = 'index.php?error=notloggedin';
                    }
                }
            } catch (error) {
                console.error('Mark all error:', error);
                alert('An error occurred while marking notifications as read. Please try again.');
            }
        });
    }

    // Handle individual mark as read submissions
    markReadForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const notificationId = form.querySelector('input[name="notification_id"]').value;

            try {
                const response = await fetch('includes/notifications.inc.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        'mark_as_read': true,
                        'notification_id': notificationId
                    })
                });
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();

                if (data.success) {
                    alert(data.message);
                    // Update UI: mark notification as read
                    const notificationItem = form.closest('.notification-item');
                    notificationItem.classList.remove('unread');
                    notificationItem.classList.add('read');
                    form.remove();
                } else {
                    alert(errorMessages[data.error] || 'An unexpected error occurred.');
                    if (data.error === 'notloggedin') {
                        window.location.href = 'index.php?error=notloggedin';
                    } else if (data.error === 'invalidnotificationid' || data.error === 'notificationnotfound') {
                        form.querySelector('button').focus();
                        form.querySelector('button').classList.add('error-highlight');
                        setTimeout(() => form.querySelector('button').classList.remove('error-highlight'), 6000);
                    }
                }
            } catch (error) {
                console.error('Mark as read error:', error);
                alert('An error occurred while marking the notification as read. Please try again.');
            }
        });
    });

    console.log('All functionalities initialized successfully');
});