// emergency.js - Clean version without Google Maps
console.log('Emergency system loaded');

const errorMessages = {
    'notloggedin': 'Please log in to request emergency assistance.',
    'usernotfound': 'User not found. Please log in again.',
    'stmtfailed': 'Database error. Please try again or contact support.',
    'invalidtype': 'Invalid emergency type.',
    'invalidlocation': 'Please enter a valid location.',
    'invalidmessage': 'Please enter a valid message.'
};

let currentLiveLocation = '';

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

// Geolocation functions
function getCurrentLocation() {
    const locationInput = document.getElementById('location');
    const getLocationBtn = document.getElementById('get-location');
    
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser. Please enter location manually.');
        return;
    }

    const originalText = getLocationBtn.textContent;
    getLocationBtn.textContent = 'Getting Location...';
    getLocationBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            currentLiveLocation = `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`;
            locationInput.value = currentLiveLocation;
            
            alert('Live location retrieved successfully.');
            
            getLocationBtn.textContent = originalText;
            getLocationBtn.disabled = false;
        },
        (error) => {
            let errorMessage = 'Unable to retrieve live location. ';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location access was denied. Please enable location permissions and try again.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable. Please check your connection and try again.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out. Please try again.';
                    break;
                default:
                    errorMessage = 'Please enter location manually.';
                    break;
            }
            
            alert(errorMessage);
            getLocationBtn.textContent = originalText;
            getLocationBtn.disabled = false;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Form submission handler
function handleAmbulanceForm() {
    const ambulanceForm = document.getElementById('ambulance-form');
    const locationInput = document.getElementById('location');

    if (!ambulanceForm) return;

    ambulanceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const locationToSend = currentLiveLocation || locationInput.value;

        if (!locationToSend.trim()) {
            alert('Please enter your location or use "Get Live Location"');
            locationInput.focus();
            return;
        }

        try {
            const response = await fetch('includes/emergency.inc.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    'submit_emergency': true,
                    'type': 'Ambulance',
                    'location': locationToSend,
                    'message': ''
                })
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            if (data.success) {
                alert('Ambulance requested successfully! Your current location has been sent.');
                ambulanceForm.reset();
                currentLiveLocation = '';
            } else {
                const errorMsg = errorMessages[data.error] || 'An unexpected error occurred.';
                alert(errorMsg);
                
                if (data.error === 'notloggedin' || data.error === 'usernotfound') {
                    window.location.href = 'index.php?error=' + data.error;
                }
            }
        } catch (error) {
            console.error('Ambulance request error:', error);
            alert('An error occurred while requesting the ambulance. Please try again.');
        }
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Emergency page initialized');
    
    try {
        // Initialize mobile menu
        initializeMobileMenu();
        
        // Initialize ambulance form
        handleAmbulanceForm();
        
        // Initialize get location button
        const getLocationBtn = document.getElementById('get-location');
        if (getLocationBtn) {
            getLocationBtn.addEventListener('click', getCurrentLocation);
        }
        
        console.log('All emergency functionalities initialized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});