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
        if (targetId === 'home.html' || targetId === 'about.html' || targetId === 'diagnosis.html' || targetId === 'emergency.html' || targetId === 'appointment.html' || targetId === 'healthtrack.html') {
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

// Health Track functionality (frontend simulation)
document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.getElementById('history-list');

    // Mock medical history data
    const medicalHistory = [
        {
            date: '2023-10-01',
            description: 'Routine Checkup',
            doctor: 'Dr. John Smith',
            labTest: null // No lab test
        },
        {
            date: '2023-09-15',
            description: 'Blood Test',
            doctor: 'Dr. Jane Doe',
            labTest: 'blood_test_report.pdf' // Lab test available
        },
        {
            date: '2023-08-20',
            description: 'X-Ray',
            doctor: 'Dr. Emily Brown',
            labTest: 'xray_report.pdf' // Lab test available
        },
        {
            date: '2023-07-10',
            description: 'Consultation for Flu',
            doctor: 'Dr. Michael Lee',
            labTest: null // No lab test
        }
    ];

    if (medicalHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No medical history available.</p>';
    } else {
        medicalHistory.forEach(entry => {
            const historyEntry = document.createElement('div');
            historyEntry.classList.add('history-entry');
            historyEntry.innerHTML = `
                <div class="history-info">
                    <h3>${entry.date} - ${entry.description}</h3>
                    <p>Doctor: ${entry.doctor}</p>
                </div>
                ${entry.labTest ? `<button class="download-btn" data-file="${entry.labTest}">Download Lab Test</button>` : ''}
            `;
            historyList.appendChild(historyEntry);
        });

        // Add event listeners to download buttons
        document.querySelectorAll('.download-btn').forEach(button => {
            button.addEventListener('click', () => {
                const file = button.getAttribute('data-file');
                // Simulate download (frontend only)
                console.log('Downloading lab test:', file);
                alert(`Downloading ${file}. (Simulated - in real implementation, this would download the file.)`);
            });
        });
    }
});