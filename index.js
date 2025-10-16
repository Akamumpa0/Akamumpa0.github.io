// Shared mock user data (used by index.js and signup.js)
const mockUsers = {
    '12345678': {
        password: '123456789',
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
    const link = e.target.closest('.nav-link, .submenu-link, .btn-login, .btn-signup, .btn-primary');
    if (link) {
        const targetId = link.getAttribute('href');
        // Allow navigation to other pages
        if (targetId === 'index.html' || targetId === 'home.html' || targetId === 'about.html' || targetId === 'diagnosis.html' || targetId === 'emergency.html' || targetId === 'appointment.html' || targetId === 'healthtrack.html' || targetId === 'account.html' || targetId === 'help.html' || targetId === 'notifications.html' || targetId === 'signup.html' || targetId === 'logout.html') {
            e.preventDefault();
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

// Login and Forgot Password functionality (frontend simulation)
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const verifyCodeForm = document.getElementById('verify-code-form');
    const cancelButtons = document.querySelectorAll('.btn-cancel');
    const navList = document.getElementById('nav-list');
    const authButtons = document.getElementById('auth-buttons');

    // Mock verification code
    let mockVerificationCode = '123456';

    // Function to update navigation for non-logged-in users
    function updateNavigation() {
        const unreadCount = localStorage.getItem('unreadNotifications') || 0;
        navList.innerHTML = '';
        authButtons.innerHTML = `
            <a href="#login" class="btn-login">Log In</a>
            <a href="signup.html" class="btn-signup">Sign Up</a>
        `;
    }

    // Initialize navigation
    updateNavigation();

    // Handle Log In button click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-login')) {
            e.preventDefault();
            document.querySelector('.login').scrollIntoView({
                behavior: 'smooth'
            });
        }
    });

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const studentId = document.getElementById('student-id').value;
        const password = document.getElementById('password').value;

        if (mockUsers[studentId] && mockUsers[studentId].password === password) {
            console.log('Login successful:', { studentId });
            alert('Login successful! Redirecting to home page... (Simulated)');
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'home.html';
        } else {
            alert('Invalid student ID or password.');
        }
    });

    // Show forgot password modal
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordModal.style.display = 'flex';
        forgotPasswordForm.style.display = 'block';
        verifyCodeForm.style.display = 'none';
    });

    // Forgot password form submission
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const user = Object.values(mockUsers).find(u => u.email === email);

        if (user) {
            console.log('Verification code sent to:', email);
            alert(`Verification code sent to ${email}. (Simulated - code is ${mockVerificationCode})`);
            forgotPasswordForm.style.display = 'none';
            verifyCodeForm.style.display = 'block';
        } else {
            alert('Email not found.');
        }
    });

    // Verify code and reset password
    verifyCodeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('verification-code').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (code === mockVerificationCode) {
            if (newPassword === confirmPassword) {
                console.log('Password reset successful:', { newPassword });
                alert('Password reset successful! Please log in with your new password. (Simulated)');
                forgotPasswordModal.style.display = 'none';
                mockUsers[Object.keys(mockUsers).find(key => mockUsers[key].email === document.getElementById('email').value)].password = newPassword;
                loginForm.reset();
                forgotPasswordForm.reset();
                verifyCodeForm.reset();
            } else {
                alert('Passwords do not match.');
            }
        } else {
            alert('Invalid verification code.');
        }
    });

    // Cancel buttons
    cancelButtons.forEach(button => {
        button.addEventListener('click', () => {
            forgotPasswordModal.style.display = 'none';
            forgotPasswordForm.style.display = 'block';
            verifyCodeForm.style.display = 'none';
            forgotPasswordForm.reset();
            verifyCodeForm.reset();
        });
    });
});