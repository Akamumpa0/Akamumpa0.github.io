// Mobile menu toggle
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const navList = document.querySelector('.nav-list');

mobileToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    mobileToggle.classList.toggle('active');
});

// Smooth scrolling for in-page navigation links and allow page navigation
document.querySelectorAll('.nav-link, .submenu-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        // Allow navigation to other pages
        if (targetId === 'home.html' || targetId === 'about.html' || targetId === 'diagnosis.html' || targetId === 'emergency.html' || targetId === 'appointment.html') {
            window.location.href = targetId;
            return;
        }
        // Handle in-page anchor links
        if (targetId.startsWith('#')) {
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
    });
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

// Appointment functionality
document.addEventListener('DOMContentLoaded', () => {
    const departmentSelect = document.getElementById('department');
    const doctorList = document.getElementById('doctor-list');

    // Mock data for doctors by department
    const doctors = {
        'general-medicine': [
            { name: 'Dr. John Smith', specialty: 'General Practitioner', email: 'john.smith@musthospital.com' },
            { name: 'Dr. Jane Doe', specialty: 'Family Medicine', email: 'jane.doe@musthospital.com' }
        ],
        'pediatrics': [
            { name: 'Dr. Emily Brown', specialty: 'Pediatrician', email: 'emily.brown@musthospital.com' },
            { name: 'Dr. Michael Lee', specialty: 'Child Health Specialist', email: 'michael.lee@musthospital.com' }
        ],
        'orthopedics': [
            { name: 'Dr. Sarah Johnson', specialty: 'Orthopedic Surgeon', email: 'sarah.johnson@musthospital.com' },
            { name: 'Dr. David Kim', specialty: 'Sports Medicine', email: 'david.kim@musthospital.com' }
        ],
        'cardiology': [
            { name: 'Dr. Lisa Chen', specialty: 'Cardiologist', email: 'lisa.chen@musthospital.com' },
            { name: 'Dr. Robert Patel', specialty: 'Heart Specialist', email: 'robert.patel@musthospital.com' }
        ]
    };

    departmentSelect.addEventListener('change', () => {
        const department = departmentSelect.value;
        doctorList.innerHTML = ''; // Clear previous doctors

        if (department && doctors[department]) {
            doctors[department].forEach(doctor => {
                const doctorCard = document.createElement('div');
                doctorCard.classList.add('doctor-card');
                doctorCard.innerHTML = `
                    <div class="doctor-info">
                        <h3>${doctor.name}</h3>
                        <p>${doctor.specialty}</p>
                    </div>
                    <button class="btn-primary book-doctor" data-email="${doctor.email}" data-name="${doctor.name}">Book Appointment</button>
                `;
                doctorList.appendChild(doctorCard);
            });

            // Add event listeners to booking buttons
            document.querySelectorAll('.book-doctor').forEach(button => {
                button.addEventListener('click', () => {
                    const doctorEmail = button.getAttribute('data-email');
                    const doctorName = button.getAttribute('data-name');
                    // Simulate sending email to doctor and notification to student
                    console.log('Appointment request sent:', { doctorName, doctorEmail });
                    alert(`Appointment request sent to ${doctorName}. You will receive a notification with the appointment time and day.`);
                });
            });
        }
    });
});