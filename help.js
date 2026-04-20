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
        if (targetId === 'home.php' || targetId === 'about.html' || targetId === 'Diagnosis.php' || targetId === 'Emergency.php' || targetId === 'Appointment.php' || targetId === 'Healthtrack.php' || targetId === 'Account.php' || targetId === 'Help.html') {
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

// Help functionality (frontend simulation)
document.addEventListener('DOMContentLoaded', () => {
    const contactList = document.getElementById('contact-list');

    // Mock developer data
    const developers = [
        {
            name: 'Alice Johnson',
            phone: '+256987654321',
            email: 'alice.johnson@musthospital.com'
        },
        {
            name: 'Bob Smith',
            phone: '+256876543210',
            email: 'bob.smith@musthospital.com'
        },
        {
            name: 'Carol Williams',
            phone: '+256765432109',
            email: 'carol.williams@musthospital.com'
        }
    ];

    if (developers.length === 0) {
        contactList.innerHTML = '<p class="no-contacts">No developer contacts available.</p>';
    } else {
        developers.forEach(developer => {
            const contactEntry = document.createElement('div');
            contactEntry.classList.add('contact-entry');
            contactEntry.innerHTML = `
                <div class="contact-info">
                    <h3>${developer.name}</h3>
                    <p>Phone: <a href="tel:${developer.phone}" class="contact-phone">${developer.phone}</a></p>
                    <p>Email: <a href="mailto:${developer.email}" class="contact-email">${developer.email}</a></p>
                </div>
                <div class="contact-buttons">
                    <a href="tel:${developer.phone}" class="contact-btn call-btn" data-phone="${developer.phone}">Call</a>
                    <a href="mailto:${developer.email}" class="contact-btn email-btn" data-email="${developer.email}">Email</a>
                </div>
            `;
            contactList.appendChild(contactEntry);
        });

        // Add event listeners to call and email buttons
        document.querySelectorAll('.call-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const phone = button.getAttribute('data-phone');
                console.log('Initiating call to:', phone);
                alert(`Calling ${phone}. (Simulated - in real implementation, this would initiate a phone call.)`);
            });
        });

        document.querySelectorAll('.email-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const email = button.getAttribute('data-email');
                console.log('Opening email client for:', email);
                alert(`Opening email client to send to ${email}. (Simulated - in real implementation, this would open your email client.)`);
            });
        });
    }
});