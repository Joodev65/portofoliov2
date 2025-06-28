class YuniAI {
    constructor() {
        this.elements = {
            chatForm: document.getElementById('chat-form'),
            userInput: document.getElementById('user-input'),
            messages: document.getElementById('messages'),
            toneSelect: document.getElementById('tone-select'),
            voiceToggle: document.getElementById('voice-toggle'),
            themeToggle: document.getElementById('theme-toggle'),
            clearChat: document.getElementById('clear-chat'),
            sendBtn: document.getElementById('send-btn'),
            imageGenBtn: document.getElementById('image-gen-btn'),
            charCounter: document.querySelector('.char-counter'),
            welcomeMessage: document.querySelector('.welcome-message'),
            toastContainer: document.getElementById('toast-container')
        };

        this.state = {
            voiceEnabled: false,
            isLoading: false,
            messageCount: 0
        };

        this.config = {
            apiUrl: 'https://kaput-incandescent-printer.glitch.me/chat',
            imageApiUrl: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2',
            maxMessageLength: 2000,
            autoResizeMaxHeight: 200
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupAutoResize();
        this.loadChatHistory();
    }

    setupEventListeners() {
        // Chat form submission
        this.elements.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Input character counter
        this.elements.userInput.addEventListener('input', () => this.updateCharCounter());
        
        // Voice toggle
        this.elements.voiceToggle.addEventListener('click', () => this.toggleVoice());
        
        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Clear chat
        this.elements.clearChat.addEventListener('click', () => this.clearChat());
        
        // Image generation
        this.elements.imageGenBtn.addEventListener('click', () => this.generateImage());
        
        // Suggestion chips
        document.addEventListener('click', (e) => {
            if (e.target.closest('.suggestion-chip')) {
                const prompt = e.target.closest('.suggestion-chip').dataset.prompt;
                this.elements.userInput.value = prompt;
                this.updateSendButton();
                this.updateCharCounter();
                this.elements.userInput.focus();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'Enter':
                        e.preventDefault();
                        if (!this.state.isLoading) {
                            this.handleSubmit(e);
                        }
                        break;
                    case 'k':
                        e.preventDefault();
                        this.clearChat();
                        break;
                    case '/':
                        e.preventDefault();
                        this.elements.userInput.focus();
                        break;
                }
            }
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('yuniAI-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    setupAutoResize() {
        this.elements.userInput.addEventListener('input', () => {
            this.autoResizeTextarea();
            this.updateSendButton();
        });
    }

    autoResizeTextarea() {
        const textarea = this.elements.userInput;
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, this.config.autoResizeMaxHeight);
        textarea.style.height = newHeight + 'px';
    }

    updateSendButton() {
        const hasText = this.elements.userInput.value.trim().length > 0;
        this.elements.sendBtn.disabled = !hasText || this.state.isLoading;
    }

    updateCharCounter() {
        const currentLength = this.elements.userInput.value.length;
        this.elements.charCounter.textContent = `${currentLength}/${this.config.maxMessageLength}`;
        
        if (currentLength > this.config.maxMessageLength * 0.9) {
            this.elements.charCounter.style.color = 'var(--text-error)';
        } else {
            this.elements.charCounter.style.color = 'var(--text-tertiary)';
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const text = this.elements.userInput.value.trim();
        const tone = this.elements.toneSelect.value;
        
        if (!text || this.state.isLoading) return;
        
        if (text.length > this.config.maxMessageLength) {
            this.showToast('Message too long. Please keep it under 2000 characters.', 'error');
            return;
        }

        this.hideWelcomeMessage();
        this.addMessage(text, 'user');
        this.elements.userInput.value = '';
        this.updateSendButton();
        this.updateCharCounter();
        this.autoResizeTextarea();

        await this.sendMessage(text, tone);
    }

    async sendMessage(text, tone) {
        this.setLoading(true);
        const loadingMessage = this.addLoadingMessage();

        try {
            const response = await fetch(this.config.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: text, 
                    tone: tone 
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.removeMessage(loadingMessage);
            
            const reply = data.reply || 'Sorry, I couldn\'t generate a response.';
            this.addMessage(reply, 'ai');
            
            if (this.state.voiceEnabled) {
                this.speak(reply);
            }

            this.saveChatHistory();
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.removeMessage(loadingMessage);
            this.addMessage('❌ Failed to connect to YuniAI. Please try again.', 'ai');
            this.showToast('Connection failed. Please check your internet connection.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async generateImage() {
        const prompt = window.prompt('Describe the image you want to generate:');
        if (!prompt) return;

        this.hideWelcomeMessage();
        this.addMessage(`Generate image: ${prompt}`, 'user');
        
        this.setLoading(true);
        const loadingMessage = this.addLoadingMessage('Generating image...');

        try {
            const apiKey = 'hf_ISI_TOKEN_KAMU'; // This should be in environment variables
            const response = await fetch(this.config.imageApiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inputs: prompt })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            
            this.removeMessage(loadingMessage);
            this.addImageMessage(imageUrl, prompt);
            
            this.saveChatHistory();
            
        } catch (error) {
            console.error('Error generating image:', error);
            this.removeMessage(loadingMessage);
            this.addMessage('❌ Failed to generate image. Please try again.', 'ai');
            this.showToast('Image generation failed. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    addMessage(content, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}-message`;
        messageEl.textContent = content;
        
        this.elements.messages.appendChild(messageEl);
        this.scrollToBottom();
        this.state.messageCount++;
        
        return messageEl;
    }

    addImageMessage(imageUrl, alt) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message ai-message';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = alt;
        img.className = 'generated-image';
        img.loading = 'lazy';
        
        messageEl.appendChild(img);
        this.elements.messages.appendChild(messageEl);
        this.scrollToBottom();
        this.state.messageCount++;
        
        return messageEl;
    }

    addLoadingMessage(text = 'YuniAI is thinking...') {
        const messageEl = document.createElement('div');
        messageEl.className = 'message ai-message loading';
        messageEl.textContent = text;
        
        this.elements.messages.appendChild(messageEl);
        this.scrollToBottom();
        
        return messageEl;
    }

    removeMessage(messageEl) {
        if (messageEl && messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }

    hideWelcomeMessage() {
        if (this.elements.welcomeMessage && this.state.messageCount === 0) {
            this.elements.welcomeMessage.style.opacity = '0';
            this.elements.welcomeMessage.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                this.elements.welcomeMessage.style.display = 'none';
            }, 300);
        }
    }

    scrollToBottom() {
        const chatWrapper = document.querySelector('.chat-wrapper');
        chatWrapper.scrollTop = chatWrapper.scrollHeight;
    }

    setLoading(isLoading) {
        this.state.isLoading = isLoading;
        this.elements.sendBtn.classList.toggle('loading', isLoading);
        this.updateSendButton();
    }

    toggleVoice() {
        this.state.voiceEnabled = !this.state.voiceEnabled;
        this.elements.voiceToggle.classList.toggle('active', this.state.voiceEnabled);
        
        const status = this.state.voiceEnabled ? 'enabled' : 'disabled';
        this.showToast(`Voice ${status}`, 'info');
        
        localStorage.setItem('yuniAI-voice', this.state.voiceEnabled);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('yuniAI-theme', newTheme);
        
        this.showToast(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme activated`, 'info');
    }

    clearChat() {
        this.elements.messages.innerHTML = '';
        this.state.messageCount = 0;
        
        // Restore welcome message
        this.elements.messages.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h2>Welcome to YuniAI</h2>
                <p>I'm your intelligent AI assistant. Ask me anything or generate images with natural language descriptions.</p>
                <div class="suggestion-chips">
                    <button class="suggestion-chip" data-prompt="Explain quantum computing in simple terms">
                        <svg class="chip-icon">
                            <use href="#cpu"></use>
                        </svg>
                        Quantum Computing
                    </button>
                    <button class="suggestion-chip" data-prompt="Help me write a professional email">
                        <svg class="chip-icon">
                            <use href="#mail"></use>
                        </svg>
                        Write Email
                    </button>
                    <button class="suggestion-chip" data-prompt="Create a study plan for learning JavaScript">
                        <svg class="chip-icon">
                            <use href="#book"></use>
                        </svg>
                        Study Plan
                    </button>
                </div>
            </div>
        `;
        
        this.elements.welcomeMessage = document.querySelector('.welcome-message');
        localStorage.removeItem('yuniAI-chat-history');
        this.showToast('Chat cleared', 'info');
    }

    speak(text) {
        if (!window.speechSynthesis) {
            this.showToast('Speech synthesis not supported', 'error');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 1;
        utterance.pitch = 1;
        
        utterance.onerror = () => {
            this.showToast('Speech synthesis error', 'error');
        };

        window.speechSynthesis.speak(utterance);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = document.createElement('div');
        icon.className = 'toast-icon';
        
        let iconSvg = '';
        switch (type) {
            case 'success':
                iconSvg = '<svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"></polyline></svg>';
                break;
            case 'error':
                iconSvg = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
                break;
            default:
                iconSvg = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
        }
        
        icon.innerHTML = iconSvg;
        
        const messageEl = document.createElement('div');
        messageEl.className = 'toast-message';
        messageEl.textContent = message;
        
        toast.appendChild(icon);
        toast.appendChild(messageEl);
        
        this.elements.toastContainer.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }
        }, 4000);
    }

    saveChatHistory() {
        const messages = Array.from(this.elements.messages.children)
            .filter(el => !el.classList.contains('welcome-message') && !el.classList.contains('loading'))
            .map(el => ({
                type: el.classList.contains('user-message') ? 'user' : 'ai',
                content: el.textContent,
                isImage: el.querySelector('.generated-image') !== null
            }));
        
        localStorage.setItem('yuniAI-chat-history', JSON.stringify(messages));
    }

    loadChatHistory() {
        try {
            const history = JSON.parse(localStorage.getItem('yuniAI-chat-history') || '[]');
            const voiceEnabled = localStorage.getItem('yuniAI-voice') === 'true';
            
            if (voiceEnabled) {
                this.state.voiceEnabled = true;
                this.elements.voiceToggle.classList.add('active');
            }
            
            if (history.length > 0) {
                this.hideWelcomeMessage();
                history.forEach(msg => {
                    if (msg.isImage) {
                        // Skip loading images from history for now
                        this.addMessage('🖼️ Previously generated image', 'ai');
                    } else {
                        this.addMessage(msg.content, msg.type);
                    }
                });
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new YuniAI();
});

// Service Worker Registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
