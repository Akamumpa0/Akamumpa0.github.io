// Log script load for debugging
console.log('healthtrack.js loaded');

// Error messages for user alerts
const errorMessages = {
    'notloggedin': 'Please log in to manage health track.',
    'usernotfound': 'User not found. Please log in again.',
    'stmtfailed': 'Database error. Please try again or contact support.',
    'invalidhistory': 'Please select a valid medical history entry.',
    'invalidtestname': 'Please enter a valid test name (alphanumeric, max 100 characters).',
    'invalidfile': 'Please upload a valid PDF file (max 5MB).',
    'fileuploadfailed': 'Failed to upload file. Please try again.'
};

// Mobile Menu Functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const navList = document.querySelector('.nav-list');
    const serviceLinks = document.querySelectorAll('.nav-link.services');
    
    if (!mobileMenuToggle || !nav || !navList) return;
    
    // Toggle main mobile menu
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
    
    // Toggle submenus on mobile
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
    
    // Close menu function
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        nav.classList.remove('active');
        navList.classList.remove('active');
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
}

// Initialize health track page
document.addEventListener('DOMContentLoaded', () => {
    // Wrap in try-catch to catch initialization errors
    try {
        console.log('DOMContentLoaded fired');

        // Initialize mobile menu first
        initializeMobileMenu();

        // Get DOM elements
        const labTestForm = document.getElementById('lab-test-form');
        const historyItems = document.querySelectorAll('.history-item');

        // Handle lab test form submission
        if (labTestForm) {
            labTestForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(labTestForm);
                console.log('Lab test form submitted:', formData.get('test_name'), formData.get('history_id'));

                try {
                    const response = await fetch('includes/healthtrack.inc.php', {
                        method: 'POST',
                        body: formData,
                        signal: AbortSignal.timeout(10000) // 10s timeout for file upload
                    });
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const data = await response.json();
                    console.log('Upload lab test response:', data);

                    if (data.success) {
                        alert(data.message);
                        // Reload page to update history list
                        window.location.reload();
                    } else {
                        alert(errorMessages[data.error] || 'An unexpected error occurred.');
                        const fieldMap = {
                            'invalidhistory': 'history_id',
                            'invalidtestname': 'test_name',
                            'invalidfile': 'lab_test_file',
                            'fileuploadfailed': 'lab_test_file',
                            'stmtfailed': 'history_id',
                            'usernotfound': 'history_id',
                            'notloggedin': 'history_id'
                        };
                        const focusField = fieldMap[data.error] || 'history_id';
                        const element = document.getElementById(focusField);
                        if (element) {
                            element.focus();
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            element.classList.add('error-highlight');
                            setTimeout(() => element.classList.remove('error-highlight'), 6000);
                        }
                        if (data.error === 'notloggedin') {
                            window.location.href = 'index.php?error=notloggedin';
                        }
                    }
                } catch (error) {
                    console.error('Upload lab test error:', error);
                    alert('An error occurred while uploading the lab test. Please try again.');
                }
            });
        }

        // Toggle history details
        historyItems.forEach(item => {
            const toggle = item.querySelector('.toggle-details');
            const details = item.querySelector('.history-details');
            if (toggle && details) {
                toggle.addEventListener('click', () => {
                    const isHidden = details.style.display === 'none';
                    details.style.display = isHidden ? 'block' : 'none';
                    toggle.textContent = isHidden ? '▲' : '▼';
                    console.log('Toggled details for historyID:', item.dataset.historyId);
                });
            }
        });

        console.log('All health track functionalities initialized successfully');
    } catch (err) {
        console.error('Error in DOMContentLoaded:', err);
        alert('An unexpected error occurred. Please try again.');
    }
});