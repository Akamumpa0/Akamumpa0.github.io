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

    // Export diagnosis as PDF
    const exportButton = document.getElementById('export-diagnosis-pdf');
    if (exportButton) {
        exportButton.addEventListener('click', () => {
            const generatedAt = new Date();
            const yyyy = generatedAt.getFullYear();
            const mm = String(generatedAt.getMonth() + 1).padStart(2, '0');
            const dd = String(generatedAt.getDate()).padStart(2, '0');
            const hh = String(generatedAt.getHours()).padStart(2, '0');
            const min = String(generatedAt.getMinutes()).padStart(2, '0');

            const header = `Diagnosis Report`;
            const filename = `diagnosis_report_${yyyy}${mm}${dd}_${hh}${min}.pdf`;

            // Build content container
            const container = document.createElement('div');
            container.style.padding = '16px';
            container.style.fontFamily = 'Roboto, Arial, sans-serif';

            // Header
            const headerHtml = `
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
                    <div>
                        <div style="font-size:22px; font-weight:700;">Must Hospital</div>
                        <div style="font-size:12px; color:#666;">AI Doctor - ${header}</div>
                    </div>
                    <div style="text-align:right; font-size:12px; color:#666;">
                        <div>Generated: ${yyyy}-${mm}-${dd} ${hh}:${min}</div>
                    </div>
                </div>
                <hr style="border:none; border-top:1px solid #e5e7eb; margin: 0 0 16px 0;" />
            `;

            // Symptoms summary
            const symptomsSection = `
                <div style="margin-bottom:12px;">
                    <div style="font-size:16px; font-weight:600; margin-bottom:6px;">Symptoms Provided</div>
                    ${symptoms.length ? `<ul style="margin:0; padding-left:18px; font-size:13px; color:#111;">${symptoms.map(s => `<li>${s}</li>`).join('')}</ul>` : '<div style="font-size:13px; color:#555;">No symptoms entered yet.</div>'}
                </div>
            `;

            // Transcript
            const transcriptItems = Array.from(chatMessages.children).map(node => {
                const isAi = node.classList.contains('ai');
                const speaker = isAi ? 'AI' : 'You';
                const text = node.textContent || '';
                return `<div style="margin:0 0 6px 0;"><span style="font-weight:600;">${speaker}:</span> ${text}</div>`;
            }).join('');

            const transcriptSection = `
                <div style="margin-top:8px;">
                    <div style="font-size:16px; font-weight:600; margin-bottom:6px;">Conversation Transcript</div>
                    <div style="font-size:13px; color:#111; line-height:1.55;">${transcriptItems || '<div>No conversation yet.</div>'}</div>
                </div>
            `;

            container.innerHTML = headerHtml + symptomsSection + transcriptSection;

            const options = {
                margin: 10,
                filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            if (typeof html2pdf === 'function') {
                html2pdf().set(options).from(container).save();
            } else {
                alert('PDF generator not available. Please check your internet connection and try again.');
            }
        });
    }
});