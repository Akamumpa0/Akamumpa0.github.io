console.log('index.js loaded');

// Error messages for alerts
const errorMessages = {
    'emptyinput': 'Please fill in all fields.',
    'usernotfound': 'Student ID not found.',
    'wrongpassword': 'Incorrect password.',
    'stmtfailed': 'Database error. Please try again or contact support.',
    'invalidemail': 'Invalid email format.',
    'emailnotfound': 'Email not found.',
    'codeinvalid': 'Invalid or expired verification code.',
    'passwordsdontmatch': 'Passwords do not match.',
    'weakpassword': 'Password must be at least 6 characters long.',
    'system_error': 'System temporarily unavailable. Please try again later.',
    'invalid_request': 'Invalid request. Please refresh the page and try again.'
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
    const link = e.target.closest('.nav-link, .submenu-link, .btn-login, .btn-signup, .btn-primary');
    if (link) {
        const targetId = link.getAttribute('href');
        console.log('Link clicked:', targetId);
        if (targetId === 'index.php' || targetId === 'signup.php') {
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

// Handle form submissions and error displays
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOMContentLoaded fired');
        const loginForm = document.getElementById('login-form');
        const forgotPasswordLink = document.getElementById('forgot-password-link');
        const forgotPasswordModal = document.getElementById('forgot-password-modal');
        const forgotPasswordForm = document.getElementById('forgot-password-form');
        const verifyCodeForm = document.getElementById('verify-code-form');
        const cancelButtons = document.querySelectorAll('.btn-cancel');
        let resetEmail = ''; // Store email for verify-code-form

        // Handle URL errors (for non-JavaScript fallback)
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        console.log('Error from URL:', error);
        if (error && errorMessages[error]) {
            console.log('Error message:', errorMessages[error]);
            alert(errorMessages[error]);
            const fieldMap = {
                'emptyinput': 'student-id',
                'usernotfound': 'student-id',
                'wrongpassword': 'password',
                'stmtfailed': 'student-id',
                'invalidemail': 'email',
                'emailnotfound': 'email',
                'codeinvalid': 'verification-code',
                'passwordsdontmatch': 'confirm-password'
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
            }
        } else if (error) {
            console.error('Unknown error code:', error);
            alert('An unexpected error occurred. Please try again.');
        }

        // Show forgot password modal
        if (forgotPasswordLink && forgotPasswordModal) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Forgot password link clicked');
                forgotPasswordModal.style.display = 'flex';
                forgotPasswordForm.style.display = 'block';
                verifyCodeForm.style.display = 'none';
                forgotPasswordForm.reset();
                verifyCodeForm.reset();
                resetEmail = '';
            });
        } else {
            console.error('Forgot password link or modal not found');
        }

        // Forgot password form submission
        if (forgotPasswordForm) {
            forgotPasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                resetEmail = document.getElementById('email').value;
                console.log('Forgot password email submitted:', resetEmail);

                fetch('includes/forgot_password.inc.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        'send_code': true,
                        'email': resetEmail
                    })
                })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(data => {
                    console.log('Forgot password response:', data);
                    if (data.success) {
                        alert(data.message);
                        forgotPasswordForm.style.display = 'none';
                        verifyCodeForm.style.display = 'block';
                        document.getElementById('reset-email').value = resetEmail;
                    } else {
                        alert(errorMessages[data.error] || 'An unexpected error occurred.');
                        const element = document.getElementById('email');
                        if (element) {
                            element.focus();
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            element.classList.add('error-highlight');
                            setTimeout(() => element.classList.remove('error-highlight'), 6000);
                        }
                    }
                })
                .catch(error => {
                    console.error('Forgot password error:', error);
                    alert('An error occurred while sending the verification code. Please try again.');
                });
            });
        }

        // In the verifyCodeForm event listener, replace the error handling:
if (verifyCodeForm) {
    verifyCodeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('verification-code').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        console.log('Password reset attempt:', { resetEmail, code });

        // Client-side validation
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match. Please check and try again.');
            document.getElementById('confirm-password').focus();
            return;
        }

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long.');
            document.getElementById('new-password').focus();
            return;
        }

        fetch('includes/forgot_password.inc.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'reset_password': true,
                'email': resetEmail,
                'code': code,
                'new-password': newPassword,
                'confirm-password': confirmPassword
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Reset password response:', data);
            if (data.success) {
                alert(data.message);
                forgotPasswordModal.style.display = 'none';
                forgotPasswordForm.style.display = 'block';
                verifyCodeForm.style.display = 'none';
                forgotPasswordForm.reset();
                verifyCodeForm.reset();
                resetEmail = '';
            } else {
                // Show specific error messages
                const errorMessage = errorMessages[data.error] || 'An unexpected error occurred.';
                alert(errorMessage);
                
                const fieldMap = {
                    'codeinvalid': 'verification-code',
                    'passwordsdontmatch': 'confirm-password',
                    'weakpassword': 'new-password',
                    'emailnotfound': 'reset-email',
                    'stmtfailed': 'verification-code'
                };
                
                const focusField = fieldMap[data.error] || 'verification-code';
                const element = document.getElementById(focusField);
                if (element) {
                    element.focus();
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('error-highlight');
                    setTimeout(() => element.classList.remove('error-highlight'), 6000);
                }
            }
        })
        .catch(error => {
            console.error('Password reset error:', error);
            alert('An error occurred while resetting the password. Please try again.');
        });
    });
}

        // Cancel buttons
        if (cancelButtons) {
            cancelButtons.forEach(button => {
                button.addEventListener('click', () => {
                    console.log('Cancel button clicked');
                    forgotPasswordModal.style.display = 'none';
                    forgotPasswordForm.style.display = 'block';
                    verifyCodeForm.style.display = 'none';
                    forgotPasswordForm.reset();
                    verifyCodeForm.reset();
                    resetEmail = '';
                });
            });
        }
    } catch (err) {
        console.error('Error in DOMContentLoaded:', err);
        alert('An unexpected error occurred. Please try again.');
    }
});