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
        if (targetId === 'home.html' || targetId === 'about.html') {
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

// Emergency functionality
document.addEventListener('DOMContentLoaded', () => {
    // Ambulance form
    const ambulanceForm = document.getElementById('ambulance-form');
    const locationInput = document.getElementById('location');
    const getLocationBtn = document.getElementById('get-location');

    getLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                locationInput.value = `${latitude}, ${longitude}`;
            }, (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to get location. Please enter manually.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    ambulanceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(ambulanceForm);
        const data = {
            location: formData.get('location')
        };
        // Simulate sending to hospital (frontend only)
        console.log('Ambulance request sent:', data);
        alert(`Ambulance request sent with location: ${data.location}. A copy has been logged.`);
        ambulanceForm.reset();
    });
});