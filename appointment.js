// Log script load for debugging
console.log('appointment.js loaded');

// Error messages for user alerts
const errorMessages = {
    'notloggedin': 'Please log in to manage appointments.',
    'usernotfound': 'User not found. Please log in again.',
    'stmtfailed': 'Database error. Please try again or contact support.',
    'invaliddepartment': 'Please select a valid department.',
    'invaliddoctor': 'Please select a valid doctor.',
    'invaliddate': 'Please select a future date.',
    'invalidtime': 'Please select a valid time.',
    'invalidappointmentid': 'Invalid appointment ID.',
    'appointmentnotfound': 'Appointment not found or cannot be cancelled.'
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

// Initialize appointments page
document.addEventListener('DOMContentLoaded', () => {
    // Wrap in try-catch to catch initialization errors
    try {
        console.log('DOMContentLoaded fired');

        // Initialize mobile menu first
        initializeMobileMenu();

        // Get DOM elements
        const appointmentForm = document.getElementById('appointment-form');
        const departmentSelect = document.getElementById('department_id');
        const doctorSelect = document.getElementById('doctor_id');
        const cancelForms = document.querySelectorAll('.cancel-appointment-form');

        // Populate doctors when department changes
        if (departmentSelect && doctorSelect) {
            departmentSelect.addEventListener('change', async () => {
                const departmentId = departmentSelect.value;
                console.log('Department selected:', departmentId);

                try {
                    const response = await fetch('includes/appointment.inc.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({
                            'get_doctors': true,
                            'department_id': departmentId
                        }),
                        signal: AbortSignal.timeout(5000)
                    });
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const data = await response.json();
                    console.log('Doctors response:', data);

                    if (data.success) {
                        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
                        data.doctors.forEach(doctor => {
                            const option = document.createElement('option');
                            option.value = doctor.id;
                            option.textContent = `${doctor.name} (${doctor.specialty})`;
                            doctorSelect.appendChild(option);
                        });
                    } else {
                        alert(errorMessages[data.error] || 'Failed to load doctors.');
                        departmentSelect.focus();
                        departmentSelect.classList.add('error-highlight');
                        setTimeout(() => departmentSelect.classList.remove('error-highlight'), 6000);
                    }
                } catch (error) {
                    console.error('Fetch doctors error:', error);
                    alert('An error occurred while loading doctors. Please try again.');
                }
            });
        }

        // Handle appointment form submission
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const departmentId = departmentSelect.value;
                const doctorId = doctorSelect.value;
                const appointmentDate = document.getElementById('appointment_date').value;
                const appointmentTime = document.getElementById('appointment_time').value;
                console.log('Appointment form submitted:', { departmentId, doctorId, appointmentDate, appointmentTime });

                try {
                    const response = await fetch('includes/appointment.inc.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({
                            'create_appointment': true,
                            'department_id': departmentId,
                            'doctor_id': doctorId,
                            'appointment_date': appointmentDate,
                            'appointment_time': appointmentTime
                        }),
                        signal: AbortSignal.timeout(5000)
                    });
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const data = await response.json();
                    console.log('Create appointment response:', data);

                    if (data.success) {
                        alert(data.message);
                        // Reload page to update appointments list
                        window.location.reload();
                    } else {
                        alert(errorMessages[data.error] || 'An unexpected error occurred.');
                        const fieldMap = {
                            'invaliddepartment': 'department_id',
                            'invaliddoctor': 'doctor_id',
                            'invaliddate': 'appointment_date',
                            'invalidtime': 'appointment_time',
                            'stmtfailed': 'department_id',
                            'usernotfound': 'department_id',
                            'notloggedin': 'department_id'
                        };
                        const focusField = fieldMap[data.error] || 'department_id';
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
                    console.error('Create appointment error:', error);
                    alert('An error occurred while creating the appointment. Please try again.');
                }
            });
        }

        // Handle cancel appointment submissions
        cancelForms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const appointmentId = form.querySelector('input[name="appointment_id"]').value;
                console.log('Cancel appointment submitted for appointmentID:', appointmentId);

                try {
                    const response = await fetch('includes/appointment.inc.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({
                            'cancel_appointment': true,
                            'appointment_id': appointmentId
                        }),
                        signal: AbortSignal.timeout(5000)
                    });
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const data = await response.json();
                    console.log('Cancel appointment response:', data);

                    if (data.success) {
                        alert(data.message);
                        // Update UI: mark as cancelled
                        const appointmentItem = form.closest('.appointment-item');
                        appointmentItem.classList.remove('requested');
                        appointmentItem.classList.add('cancelled');
                        const status = appointmentItem.querySelector('p:nth-child(3)');
                        status.textContent = 'Status: Cancelled';
                        form.remove();
                    } else {
                        alert(errorMessages[data.error] || 'An unexpected error occurred.');
                        if (data.error === 'notloggedin') {
                            window.location.href = 'index.php?error=notloggedin';
                        } else if (data.error === 'invalidappointmentid' || data.error === 'appointmentnotfound') {
                            form.querySelector('button').focus();
                            form.querySelector('button').classList.add('error-highlight');
                            setTimeout(() => form.querySelector('button').classList.remove('error-highlight'), 6000);
                        }
                    }
                } catch (error) {
                    console.error('Cancel appointment error:', error);
                    alert('An error occurred while cancelling the appointment. Please try again.');
                }
            });
        });

        console.log('All appointment functionalities initialized successfully');
    } catch (err) {
        console.error('Error in DOMContentLoaded:', err);
        alert('An unexpected error occurred. Please try again.');
    }
});