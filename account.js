// Log script load for debugging
console.log('account.js loaded');

// Error messages for user alerts
const errorMessages = {
    'notloggedin': 'Please log in to manage your account.',
    'usernotfound': 'User not found. Please log in again.',
    'stmtfailed': 'Database error. Please try again or contact support.',
    'invalidfirstname': 'Please enter a valid first name (letters only, max 30 characters).',
    'invalidlastname': 'Please enter a valid last name (letters only, max 30 characters).',
    'invalidemail': 'Please enter a valid email address.',
    'emailtaken': 'This email is already in use by another account.',
    'invalidphone': 'Please enter a valid phone number.',
    'invaliddate': 'Please enter a valid date of birth (past date).',
    'invalidgender': 'Please select a valid gender.',
    'invalidaddress': 'Please enter a valid address (max 500 characters).',
    'invalidfile': 'Please upload a valid JPEG or PNG file (max 2MB).',
    'fileuploadfailed': 'Failed to upload profile picture. Please try again.',
    'invalidcurrentpassword': 'Current password is incorrect.',
    'invalidnewpassword': 'New password must be at least 8 characters.',
    'passwordmismatch': 'New password and confirmation do not match.',
    'emptyfields': 'Please fill in all required fields.'
};

// Global variable to track if we have a new profile picture
let hasNewProfilePicture = false;
let profilePictureFile = null;

// Initialize account page
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOMContentLoaded fired');

        // Profile picture upload preview
        const profileUpload = document.getElementById('profile-upload');
        const profilePreview = document.getElementById('profile-img-preview');

        if (profileUpload && profilePreview) {
            profileUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    if (file.type === 'image/jpeg' || file.type === 'image/png') {
                        if (file.size <= 2 * 1024 * 1024) { // 2MB limit
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                profilePreview.src = e.target.result;
                                // Store the file for form submission
                                profilePictureFile = file;
                                hasNewProfilePicture = true;
                                console.log('Profile picture selected and ready for upload');
                            };
                            reader.readAsDataURL(file);
                        } else {
                            showMessage('File size must be less than 2MB.', 'error');
                            this.value = '';
                        }
                    } else {
                        showMessage('Please upload only JPEG or PNG images.', 'error');
                        this.value = '';
                    }
                }
            });
        }

        // Mobile menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navList = document.querySelector('.nav-list');

        if (mobileMenuToggle && navList) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenuToggle.classList.toggle('active');
                navList.classList.toggle('active');
            });
        }

        // Handle account form submission
        const accountForm = document.getElementById('account-form');
        if (accountForm) {
            accountForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(accountForm);
                formData.append('update_type', 'profile');
                
                // Add the profile picture file to FormData if a new one was selected
                if (hasNewProfilePicture && profilePictureFile) {
                    formData.append('profile_picture', profilePictureFile);
                    console.log('Adding profile picture to form submission');
                }
                
                console.log('Account form submitted with profile picture:', hasNewProfilePicture);

                try {
                    const response = await fetch('includes/account.inc.php', {
                        method: 'POST',
                        body: formData,
                        signal: AbortSignal.timeout(15000) // 15s timeout for file upload
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log('Update profile response:', data);

                    if (data.success) {
                        showMessage(data.message || 'Profile updated successfully!', 'success');
                        // Update age if DOB was changed
                        if (formData.get('dob')) {
                            const newDob = new Date(formData.get('dob'));
                            const today = new Date();
                            const age = today.getFullYear() - newDob.getFullYear();
                            document.getElementById('age').value = age;
                        }
                        
                        // Reset profile picture flags after successful upload
                        if (hasNewProfilePicture) {
                            hasNewProfilePicture = false;
                            profilePictureFile = null;
                            console.log('Profile picture uploaded successfully');
                        }
                    } else {
                        const errorMsg = errorMessages[data.error] || data.message || 'An unexpected error occurred.';
                        showMessage(errorMsg, 'error');
                        highlightErrorField(data.error);
                        
                        if (data.error === 'notloggedin' || data.error === 'usernotfound') {
                            setTimeout(() => {
                                window.location.href = 'index.php?error=' + data.error;
                            }, 2000);
                        }
                    }
                } catch (error) {
                    console.error('Update profile error:', error);
                    if (error.name === 'AbortError') {
                        showMessage('Request timeout. Please try again.', 'error');
                    } else {
                        showMessage('An error occurred while updating the profile. Please try again.', 'error');
                    }
                }
            });
        }

        // Handle password form submission
        const passwordForm = document.getElementById('password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(passwordForm);
                formData.append('update_type', 'password');
                
                const currentPassword = formData.get('current_password');
                const newPassword = formData.get('new_password');
                const confirmPassword = formData.get('confirm_password');

                // Client-side validation
                if (!currentPassword || !newPassword || !confirmPassword) {
                    showMessage('Please fill in all password fields.', 'error');
                    return;
                }

                if (newPassword.length < 8) {
                    showMessage('New password must be at least 8 characters long.', 'error');
                    document.getElementById('new_password').focus();
                    return;
                }

                if (newPassword !== confirmPassword) {
                    showMessage('New password and confirmation do not match.', 'error');
                    document.getElementById('confirm_password').focus();
                    return;
                }

                console.log('Password form submitted');

                try {
                    const response = await fetch('includes/account.inc.php', {
                        method: 'POST',
                        body: formData,
                        signal: AbortSignal.timeout(10000)
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log('Change password response:', data);

                    if (data.success) {
                        showMessage(data.message || 'Password changed successfully!', 'success');
                        passwordForm.reset();
                    } else {
                        const errorMsg = errorMessages[data.error] || data.message || 'An unexpected error occurred.';
                        showMessage(errorMsg, 'error');
                        highlightErrorField(data.error);
                        
                        if (data.error === 'notloggedin' || data.error === 'usernotfound') {
                            setTimeout(() => {
                                window.location.href = 'index.php?error=' + data.error;
                            }, 2000);
                        }
                    }
                } catch (error) {
                    console.error('Change password error:', error);
                    if (error.name === 'AbortError') {
                        showMessage('Request timeout. Please try again.', 'error');
                    } else {
                        showMessage('An error occurred while changing the password. Please try again.', 'error');
                    }
                }
            });
        }

        // Update age when DOB changes
        const dobInput = document.getElementById('dob');
        const ageInput = document.getElementById('age');
        
        if (dobInput && ageInput) {
            dobInput.addEventListener('change', function() {
                const dob = new Date(this.value);
                const today = new Date();
                let age = today.getFullYear() - dob.getFullYear();
                const monthDiff = today.getMonth() - dob.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                    age--;
                }
                
                ageInput.value = age;
            });
        }

        // Add scroll effect to header
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

    } catch (err) {
        console.error('Error in DOMContentLoaded:', err);
        showMessage('An unexpected error occurred. Please refresh the page and try again.', 'error');
    }
});

// Helper function to show messages
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;

    // Insert message at the top of account content
    const accountContent = document.querySelector('.account-content');
    if (accountContent) {
        accountContent.insertBefore(messageDiv, accountContent.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    } else {
        // Fallback alert if DOM insertion fails
        alert(message);
    }
}

// Helper function to highlight error fields
function highlightErrorField(errorType) {
    const fieldMap = {
        'invalidfirstname': 'first_name',
        'invalidlastname': 'last_name',
        'invalidemail': 'email',
        'emailtaken': 'email',
        'invalidphone': 'phone',
        'invaliddate': 'dob',
        'invalidgender': 'gender',
        'invalidaddress': 'address',
        'invalidfile': 'profile-upload',
        'fileuploadfailed': 'profile-upload',
        'invalidcurrentpassword': 'current_password',
        'invalidnewpassword': 'new_password',
        'passwordmismatch': 'confirm_password',
        'stmtfailed': 'first_name',
        'usernotfound': 'first_name',
        'notloggedin': 'first_name'
    };
    
    const focusField = fieldMap[errorType];
    if (focusField) {
        const element = document.getElementById(focusField);
        if (element) {
            element.focus();
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('error-highlight');
            setTimeout(() => {
                if (element.classList.contains('error-highlight')) {
                    element.classList.remove('error-highlight');
                }
            }, 6000);
        }
    }
}