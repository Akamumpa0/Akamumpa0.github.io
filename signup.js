console.log('signup.js loaded');

// Error messages for alerts
const errorMessages = {
    'emptyinput': 'Please fill in all fields.',
    'invalidnames': 'First and Last Name should only contain letters and spaces.',
    'invalidstudentID': 'Student ID should only contain numbers.',
    'invalidemail': 'Please enter a valid email address.',
    'invalidphone': 'Phone number should be 10-15 digits (e.g., +256123456789).',
    'invaliddob': 'Date of Birth must be in YYYY-MM-DD format and not in the future.',
    'passwordsdontmatch': 'Passwords do not match.',
    'useralreadyexists': 'Student ID or Email already exists.',
    'stmtfailed': 'Database error. Please try again or contact support.'
};

// Mobile menu toggle
const mobileToggle = document.getElementById('mobile-menu-toggle');
const navList = document.getElementById('nav-list');

if (mobileToggle && navList) {
    mobileToggle.addEventListener('click', () => {
        console.log('Mobile toggle clicked');
        navList.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
} else {
    console.error('Mobile toggle or nav list not found');
}

// Smooth scrolling for in-page navigation links and allow page navigation
document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link, .submenu-link');
    if (link) {
        const targetId = link.getAttribute('href');
        console.log('Link clicked:', targetId);
        if (targetId === 'index.php' || targetId === 'signup.php' || targetId === 'home.html' || targetId === 'about.html' || targetId === 'diagnosis.php' || targetId === 'emergency.html' || targetId === 'appointment.html' || targetId === 'healthtrack.html' || targetId === 'account.html' || targetId === 'help.html' || targetId === 'notifications.html' || targetId === 'logout.php') {
            window.location.href = targetId;
            return;
        }
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
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
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Focus on erroneous field and show alert
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    console.log('Error from URL:', error);
    if (error && errorMessages[error]) {
        console.log('Error message:', errorMessages[error]);
        alert(errorMessages[error]); // Show alert to user
        const fieldMap = {
            'emptyinput': 'first-name',
            'invalidnames': 'first-name',
            'invalidstudentID': 'student-id',
            'invalidemail': 'email',
            'invalidphone': 'phone',
            'invaliddob': 'dob',
            'passwordsdontmatch': 'password',
            'useralreadyexists': 'email',
            'stmtfailed': 'first-name'
        };
        const focusField = fieldMap[error];
        console.log('Focus field:', focusField);
        if (focusField) {
            const element = document.getElementById(focusField);
            if (element) {
                console.log('Focusing element:', focusField);
                element.focus();
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('error-highlight');
                setTimeout(() => element.classList.remove('error-highlight'), 6000);
            } else {
                console.error('Element not found for ID:', focusField);
            }
        } else {
            console.error('No focus field mapped for error:', error);
        }
    } else if (error) {
        console.error('Unknown error code:', error);
        alert('An unexpected error occurred. Please try again.');
    }
});