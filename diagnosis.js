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
        if (targetId === 'home.html' || targetId === 'about.html' || targetId === 'emergency.html') {
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

// Diagnosis chat functionality (frontend simulation)
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-message');

    let conversationStep = 0;
    const symptoms = [];
    const questions = [
        "Hello, I'm the AI Doctor. What's your main symptom?",
        "How long have you had this symptom?",
        "Are you experiencing any pain? If yes, where?",
        "Do you have fever, cough, or shortness of breath?",
        "Any other symptoms?"
    ];

    function addMessage(text, sender) {
        const message = document.createElement('div');
        message.classList.add('message', sender);
        message.textContent = text;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function askQuestion() {
        if (conversationStep < questions.length) {
            addMessage(questions[conversationStep], 'ai');
            conversationStep++;
        } else {
            diagnose();
        }
    }

    function diagnose() {
        // Simple simulation based on symptoms
        let diagnosis = 'Mild illness, likely a common cold.';
        let prescription = 'Take paracetamol for pain and rest.';
        let severe = false;

        // Check for severe symptoms (simulated)
        const severeKeywords = ['shortness of breath', 'high fever', 'severe pain'];
        for (const symptom of symptoms) {
            if (severeKeywords.some(keyword => symptom.toLowerCase().includes(keyword))) {
                severe = true;
                break;
            }
        }

        if (severe) {
            diagnosis = 'Symptoms indicate a severe condition.';
            prescription = 'Seek immediate medical attention.';
            const refNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
            addMessage(`${diagnosis} Prescription: ${prescription} Reference Number: ${refNumber}`, 'ai');
            console.log('Alert sent to hospital:', { symptoms, refNumber });
            alert(`Reference Number: ${refNumber} - Show this at the hospital for discounted services.`);
        } else {
            addMessage(`${diagnosis} Prescription: ${prescription}`, 'ai');
        }
    }

    sendButton.addEventListener('click', () => {
        const response = userInput.value.trim();
        if (response) {
            addMessage(response, 'user');
            symptoms.push(response);
            userInput.value = '';
            askQuestion();
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    // Start conversation
    askQuestion();
});