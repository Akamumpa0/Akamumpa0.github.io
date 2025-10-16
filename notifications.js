// Mock notifications data
const mockNotifications = [
    {
        id: 1,
        type: 'Appointment',
        message: 'Your appointment on Oct 5, 2025, at 10:00 AM has been confirmed.',
        timestamp: '2025-10-01 09:00',
        read: false
    },
    {
        id: 2,
        type: 'Lab Result',
        message: 'Lab results for Blood Test uploaded on Oct 1, 2025.',
        timestamp: '2025-10-01 14:30',
        read: false
    },
    {
        id: 3,
        type: 'System',
        message: 'System update: New Healthtrack feature added.',
        timestamp: '2025-09-30 08:00',
        read: true
    },
    {
        id: 4,
        type: 'Account',
        message: 'Your profile was updated successfully.',
        timestamp: '2025-09-29 16:45',
        read: false
    }
];

// Mobile menu toggle
const mobileToggle = document.getElementById('mobile-menu-toggle');
const navList = document.getElementById('nav-list');

mobileToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    mobileToggle.classList.toggle('active');
});

// Smooth scrolling for in-page navigation links and allow page navigation
document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link, .submenu-link, .btn-primary');
    if (link) {
        const targetId = link.getAttribute('href');
        // Allow navigation to other pages
        if (targetId === 'home.html' || targetId === 'about.html' || targetId === 'diagnosis.html' || targetId === 'emergency.html' || targetId === 'appointment.html' || targetId === 'healthtrack.html' || targetId === 'account.html' || targetId === 'help.html' || targetId === 'notifications.html' || targetId === 'logout.html') {
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

// Notifications functionality
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        // Redirect to index.html if not logged in
        window.location.href = 'index.html';
    }

    const notificationList = document.getElementById('notification-list');
    const notificationBadge = document.getElementById('notification-badge');

    // Update notification badge
    const unreadCount = mockNotifications.filter(n => !n.read).length;
    notificationBadge.textContent = unreadCount;

    // Populate notification list
    notificationList.innerHTML = mockNotifications.map(notification => `
        <div class="notification-item ${notification.read ? 'read' : ''}">
            <div>
                <span class="type">${notification.type}</span>
                <span class="message">${notification.message}</span>
            </div>
            <span class="timestamp">${notification.timestamp}</span>
        </div>
    `).join('');

    // Mark notifications as read when viewed (simulate by clicking)
    notificationList.addEventListener('click', (e) => {
        const item = e.target.closest('.notification-item');
        if (item && !item.classList.contains('read')) {
            const id = parseInt(item.dataset.id);
            const notification = mockNotifications.find(n => n.id === id);
            if (notification) {
                notification.read = true;
                item.classList.add('read');
                const unreadCount = mockNotifications.filter(n => !n.read).length;
                notificationBadge.textContent = unreadCount;
                // Update badge on other pages via localStorage
                localStorage.setItem('unreadNotifications', unreadCount);
            }
        }
    });
});