// Mobile Menu Functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const navList = document.querySelector('.nav-list');
    const serviceLinks = document.querySelectorAll('.nav-link.services');
    
    if (!mobileMenuToggle || !nav || !navList) {
        console.log('❌ Mobile menu elements not found');
        return;
    }
    
    console.log('📱 Initializing mobile menu');

    // Toggle main mobile menu
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('🍔 Mobile menu toggle clicked');
        
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
                console.log('📱 Services link clicked on mobile');
                const submenu = this.nextElementSibling;
                
                // Close other open submenus
                closeOtherSubmenus(submenu);
                
                // Toggle current submenu
                this.classList.toggle('active');
                if (submenu && submenu.classList.contains('submenu')) {
                    submenu.classList.toggle('active');
                    console.log('📱 Submenu toggled:', submenu.classList.contains('active'));
                }
            }
        });
    });
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !e.target.closest('.nav') && 
            !e.target.closest('.mobile-menu-toggle')) {
            console.log('📱 Click outside - closing mobile menu');
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
        console.log('📱 Closing mobile menu');
        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        if (nav) nav.classList.remove('active');
        if (navList) navList.classList.remove('active');
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

    console.log('✅ Mobile menu initialized successfully');
}

// AI Doctor Chat System - Complete Version
class AIDoctorChat {
    constructor() {
        this.chatHistory = [];
        this.conversationId = 'conv-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        this.isProcessing = false;
        
        // DOM Elements
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.suggestionButtons = document.getElementById('suggestion-buttons');
        this.diagnosisResult = document.getElementById('diagnosis-result');
        
        console.log('🚀 AI Doctor Chat Initialized');
        console.log('💬 Conversation ID:', this.conversationId);
        
        this.initializeChat();
    }
    
    initializeChat() {
        // Add event listeners
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isProcessing) {
                this.sendMessage();
            }
        });

        // Focus on input
        this.userInput.focus();
        
        // Welcome message
        setTimeout(() => {
            this.addAIMessage("👋 Hello! I'm your AI doctor assistant. Please describe your symptoms to begin.");
        }, 500);
        
        // Start with empty suggestions
        this.updateSuggestions([]);
    }
    
    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message || this.isProcessing) {
            console.log('❌ Empty message or still processing');
            return;
        }

        console.log('📤 Sending message:', message);
        
        // Add user message to chat
        this.addUserMessage(message);
        this.userInput.value = '';
        this.showTypingIndicator();
        this.disableInput();
        
        try {
            // Send message to backend
            const response = await this.sendToBackend(message);
            console.log('📥 Backend response:', response);
            
            if (response.success) {
                // Add AI response to chat with typing delay
                setTimeout(() => {
                    this.hideTypingIndicator();
                    this.addAIMessage(response.message);
                    
                    // Update conversation ID if returned from backend
                    if (response.conversation_id) {
                        this.conversationId = response.conversation_id;
                        console.log('🆔 Updated conversation ID:', this.conversationId);
                    }
                    
                    // If diagnosis is complete, show results
                    if (response.diagnosis_complete && response.diagnosis_data) {
                        console.log('🎯 Diagnosis complete:', response.diagnosis_data);
                        this.showDiagnosisResult(response.diagnosis_data);
                    }
                    
                    // Update suggestions based on context
                    this.updateSuggestions(response.suggestions);
                    this.enableInput();
                }, 1000 + Math.random() * 1000);
                
            } else {
                // Handle backend errors
                console.error('💥 Backend error:', response.error);
                this.hideTypingIndicator();
                this.addAIMessage(response.message || "I apologize, but I encountered an error. Please try again.");
                this.enableInput();
            }
            
        } catch (error) {
            console.error('💥 Network error:', error);
            this.hideTypingIndicator();
            this.addAIMessage("🔌 I'm having trouble connecting to the server. Please check your internet connection and try again.");
            this.enableInput();
        }
    }
    
    async sendToBackend(userMessage) {
        const formData = new URLSearchParams({
            'chat_message': userMessage,
            'conversation_id': this.conversationId,
            'chat_history': JSON.stringify(this.chatHistory)
        });

        console.log('🔗 Sending to backend with:', {
            conversationId: this.conversationId,
            message: userMessage,
            chatHistoryLength: this.chatHistory.length
        });

        const response = await fetch('includes/diagnosis.inc.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    }
    
    addUserMessage(message) {
        console.log('👤 Adding user message:', message);
        this.addMessage(message, 'user');
        this.chatHistory.push({ role: 'user', content: message });
    }
    
    addAIMessage(message) {
        console.log('🤖 Adding AI message:', message.substring(0, 100) + '...');
        this.addMessage(message, 'ai');
        this.chatHistory.push({ role: 'assistant', content: message });
    }
    
    addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        // Format message with line breaks and basic formatting
        const formattedMessage = message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
            .replace(/\n/g, '<br>') // Line breaks
            .replace(/💊/g, '💊 ') // Prescription icon
            .replace(/⚠️/g, '⚠️ ') // Warning icon
            .replace(/🔍/g, '🔍 ') // Search icon
            .replace(/📋/g, '📋 ') // Reference icon
            .replace(/💡/g, '💡 '); // Tip icon
        
        messageDiv.innerHTML = formattedMessage;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        console.log(`💬 ${sender.toUpperCase()} message added to chat`);
    }
    
    showTypingIndicator() {
        console.log('⌨️ Showing typing indicator');
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        console.log('⌨️ Hiding typing indicator');
        this.typingIndicator.style.display = 'none';
    }
    
    disableInput() {
        console.log('⏸️ Disabling input');
        this.isProcessing = true;
        this.userInput.disabled = true;
        this.sendBtn.disabled = true;
        this.suggestionButtons.style.opacity = '0.5';
        this.suggestionButtons.style.pointerEvents = 'none';
    }
    
    enableInput() {
        console.log('▶️ Enabling input');
        this.isProcessing = false;
        this.userInput.disabled = false;
        this.sendBtn.disabled = false;
        this.suggestionButtons.style.opacity = '1';
        this.suggestionButtons.style.pointerEvents = 'auto';
        this.userInput.focus();
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    updateSuggestions(suggestions) {
        console.log('💡 Raw suggestions from API:', suggestions);
        
        // Only show suggestions if they come from API and are not empty
        if (suggestions && Array.isArray(suggestions) && suggestions.length > 0) {
            console.log('💡 Updating suggestions from API:', suggestions);
            this.suggestionButtons.innerHTML = suggestions.map(suggestion => 
                `<button class="suggestion-btn" onclick="chat.sendQuickSuggestion('${this.escapeHtml(suggestion)}')">${suggestion}</button>`
            ).join('');
        } else {
            console.log('💡 No suggestions from API - showing empty');
            this.suggestionButtons.innerHTML = ''; // Completely empty, no fallbacks
        }
    }
    
    sendQuickSuggestion(suggestion) {
        console.log('⚡ Quick suggestion:', suggestion);
        this.userInput.value = suggestion;
        this.sendMessage();
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showDiagnosisResult(diagnosisData) {
        console.log('🏥 Showing diagnosis result:', diagnosisData);
        
        if (diagnosisData) {
            document.getElementById('result-diagnosis').textContent = diagnosisData.diagnosis || 'Not specified';
            document.getElementById('result-prescription').textContent = diagnosisData.prescription || 'Not specified';
            document.getElementById('result-reference').textContent = diagnosisData.reference_number || 'Not generated';
            
            const severityElement = document.getElementById('result-severity');
            if (diagnosisData.is_severe) {
                severityElement.textContent = '🟥 Severe - Please consult a doctor immediately';
                severityElement.style.color = '#dc3545';
                severityElement.style.fontWeight = 'bold';
            } else {
                severityElement.textContent = '🟩 Non-severe - Monitor symptoms';
                severityElement.style.color = '#28a745';
            }
            
            this.diagnosisResult.style.display = 'block';
            
            // Scroll to results
            setTimeout(() => {
                this.diagnosisResult.scrollIntoView({ behavior: 'smooth' });
            }, 500);
            
            // Disable further input after diagnosis
            this.userInput.placeholder = "Diagnosis complete. Refresh page to start a new conversation.";
            this.userInput.disabled = true;
            this.sendBtn.disabled = true;
            this.suggestionButtons.innerHTML = '<button class="suggestion-btn" onclick="location.reload()">🔄 Start New Conversation</button>';
            
            console.log('✅ Diagnosis display completed');
        }
    }

    // Method to clear chat (for testing)
    clearChat() {
        this.chatMessages.innerHTML = '';
        this.chatHistory = [];
        this.conversationId = 'conv-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        console.log('🧹 Chat cleared, new conversation ID:', this.conversationId);
        
        // Reset to initial state
        this.userInput.disabled = false;
        this.sendBtn.disabled = false;
        this.userInput.placeholder = "Type your symptoms or response here...";
        this.diagnosisResult.style.display = 'none';
        
        // Show welcome message again
        setTimeout(() => {
            this.addAIMessage("👋 Hello! I'm your AI doctor assistant. Please describe your symptoms to begin.");
        }, 500);
        
        // Start with empty suggestions
        this.updateSuggestions([]);
    }
}

// Initialize everything when page loads
let chat;
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, initializing Diagnosis page...');
    try {
        // Initialize mobile menu first
        initializeMobileMenu();
        
        // Initialize AI chat
        chat = new AIDoctorChat();
        
        console.log('✅ All functionalities initialized successfully');
        
        // Add global method for debugging
        window.debugChat = () => {
            console.log('🔍 Chat Debug Info:', {
                conversationId: chat.conversationId,
                chatHistory: chat.chatHistory,
                isProcessing: chat.isProcessing
            });
        };
        
        // Add method to clear chat from console
        window.clearChat = () => chat.clearChat();
        
    } catch (error) {
        console.error('❌ Error initializing Diagnosis page:', error);
        alert('Error initializing the page. Please refresh and try again.');
    }
});