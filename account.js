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
        if (targetId === 'home.html' || targetId === 'about.html' || targetId === 'diagnosis.html' || targetId === 'emergency.html' || targetId === 'appointment.html' || targetId === 'healthtrack.html' || targetId === 'account.html') {
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

// Account functionality (frontend simulation)
document.addEventListener('DOMContentLoaded', () => {
    const accountForm = document.getElementById('account-form');
    const profileUpload = document.getElementById('profile-upload');
    const profileImg = document.getElementById('profile-img');
    const uploadBtn = document.querySelector('.upload-btn');

    // Mock user data
    const userData = {
        name: 'John Doe',
        age: 20,
        birthday: '2003-05-15',
        status: 'Single',
        gender: 'Male',
        residence: 'Kampala',
        campus: 'Main Campus',
        email: 'john.doe@must.ac.ug',
        studentId: 'STU123456',
        phone: '+256123456789',
        district: 'Mbarara'
    };

    // Populate form with mock data
    document.getElementById('name').value = userData.name;
    document.getElementById('age').value = userData.age;
    document.getElementById('birthday').value = userData.birthday;
    document.getElementById('status').value = userData.status;
    document.getElementById('gender').value = userData.gender;
    document.getElementById('residence').value = userData.residence;
    document.getElementById('campus').value = userData.campus;
    document.getElementById('email').value = userData.email;
    document.getElementById('student-id').value = userData.studentId;
    document.getElementById('phone').value = userData.phone;
    document.getElementById('district').value = userData.district;

    // Profile picture upload
    uploadBtn.addEventListener('click', () => {
        const file = profileUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImg.src = e.target.result;
                console.log('Profile picture uploaded:', file.name);
                alert(`Profile picture ${file.name} uploaded successfully. (Simulated)`);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select an image to upload.');
        }
    });

    // Form submission
    accountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(accountForm);
        const updatedData = {
            name: formData.get('name'),
            age: formData.get('age'),
            birthday: formData.get('birthday'),
            status: formData.get('status'),
            gender: formData.get('gender'),
            residence: formData.get('residence'),
            campus: formData.get('campus'),
            email: formData.get('email'),
            studentId: formData.get('student-id'),
            phone: formData.get('phone'),
            district: formData.get('district')
        };
        console.log('Updated account information:', updatedData);
        alert('Account information updated successfully. (Simulated)');
    });
});