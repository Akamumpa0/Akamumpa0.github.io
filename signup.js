// Shared mock user data (used by index.js and signup.js)
const mockUsers = {
    'STU123456': {
        password: 'password123',
        email: 'john.doe@must.ac.ug'
    }
};

// Mobile menu toggle
const mobileToggle = document.getElementById('mobile-menu-toggle');
const navList = document.getElementById('nav-list');

mobileToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    mobileToggle.classList.toggle('active');
});

// Smooth scrolling for in-page navigation links and allow page navigation
document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link, .submenu-link, .btn-login, .btn-signup');
    if (link) {
        const targetId = link.getAttribute('href');
        // Allow navigation to other pages
        if (targetId === 'index.html' || targetId === 'home.html' || targetId === 'about.html' || targetId === 'diagnosis.html' || targetId === 'emergency.html' || targetId === 'appointment.html' || targetId === 'healthtrack.html' || targetId === 'account.html' || targetId === 'help.html' || targetId === 'notifications.html' || targetId === 'signup.html' || targetId === 'logout.html') {
            window.location.href = targetId;
            return;
        }
        // Handle in-page anchor links
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                // Fallback: scroll to top for non-existent anchors
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }
    }
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Sign Up form submission
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const navList = document.getElementById('nav-list');
    const authButtons = document.getElementById('auth-buttons');

    // Mock login status (replace with real session check later)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Function to update navigation based on login status
    function updateNavigation() {
        const unreadCount = localStorage.getItem('unreadNotifications') || 0;
        if (isLoggedIn) {
            navList.innerHTML = `
                <li><a href="home.html" class="nav-link active">Home</a></li>
                <li>
                    <a href="#services" class="nav-link services">Services</a>
                    <div class="submenu">
                        <ul>
                            <li><a href="appointment.html" class="submenu-link">Appointment</a></li>
                            <li><a href="healthtrack.html" class="submenu-link">Healthtrack</a></li>
                            <li><a href="account.html" class="submenu-link">Account</a></li>
                            <li><a href="help.html" class="submenu-link">Help</a></li>
                            <li><a href="logout.html" class="submenu-link">Logout</a></li>
                        </ul>
                    </div>
                </li>
                <li><a href="about.html" class="nav-link">About</a></li>
                <li><a href="notifications.html" class="nav-link">Notifications <span class="badge" id="notification-badge">${unreadCount}</span></a></li>
                <li><a href="diagnosis.html" class="nav-link">Diagnosis</a></li>
                <li><a href="emergency.html" class="nav-link">Emergency</a></li>
            `;
            authButtons.innerHTML = `
                <a href="signup.html" class="btn-signup">Sign Up</a>
            `;
        } else {
            navList.innerHTML = '';
            authButtons.innerHTML = `
                <a href="index.html#login" class="btn-login">Log In</a>
                <a href="signup.html" class="btn-signup active">Sign Up</a>
            `;
        }
    }

    // Initialize navigation
    updateNavigation();

    // Handle Sign Up form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const studentId = document.getElementById('student-id').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const dob = document.getElementById('dob').value;
        const gender = document.getElementById('gender').value;
        const address = document.getElementById('address').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validate all fields are filled
        if (!firstName || !lastName || !studentId || !email || !phone || !dob || !gender || !address || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Validate phone format (basic example, adjust as needed)
        const phoneRegex = /^\+?\d{10,15}$/;
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid phone number (10-15 digits).');
            return;
        }

        // Validate student ID and email uniqueness
        for (const key of Object.keys(mockUsers)) {
            if (key === studentId) {
                alert('Student ID already exists.');
                return;
            }
            if (mockUsers[key].email === email) {
                alert('Email already exists.');
                return;
            }
        }

        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // Simulate storing user data
        mockUsers[studentId] = {
            firstName,
            lastName,
            email,
            phone,
            dob,
            gender,
            address,
            password
        };

        console.log('Sign up successful:', mockUsers[studentId]);
        alert('Sign up successful! Redirecting to login... (Simulated)');

        // Redirect to login section of index.html
        window.location.href = 'index.html#login';
    });
});