# YuniAI - Advanced AI Assistant

## Overview

YuniAI is a modern web-based AI assistant application that provides conversational AI capabilities with image generation features. The application is built as a Progressive Web App (PWA) with a focus on user experience, accessibility, and cross-platform compatibility. It features a clean, responsive interface with support for multiple conversation tones, voice interaction, and theme customization.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Pure HTML5, CSS3, and Vanilla JavaScript
- **Design Pattern**: Component-based architecture using ES6 classes
- **UI Framework**: Custom CSS with modern design principles
- **Responsive Design**: Mobile-first approach with flexible grid layouts
- **PWA Features**: Service worker support, manifest file for app installation

### Backend Integration
- **API Communication**: RESTful API calls using Fetch API
- **Primary AI Service**: External API hosted at `kaput-incandescent-printer.glitch.me/chat`
- **Image Generation**: Hugging Face Inference API with Stable Diffusion 2 model
- **Data Format**: JSON-based request/response structure

## Key Components

### Core Application Class (YuniAI)
- **Purpose**: Central controller managing all application state and interactions
- **Responsibilities**: Event handling, API communication, UI updates, and feature coordination
- **Architecture**: Singleton pattern with modular method organization

### User Interface Components
1. **Chat Interface**: Message display with user/AI message differentiation
2. **Input System**: Multi-line text input with character counting and auto-resize
3. **Control Panel**: Tone selection, voice toggle, theme switching, and chat management
4. **Progressive Enhancement**: Graceful degradation for older browsers

### Feature Modules
1. **Conversation Management**: Message history, tone adaptation, and context preservation
2. **Voice Integration**: Text-to-speech capabilities with toggle controls
3. **Image Generation**: AI-powered image creation with prompt processing
4. **Theme System**: Light/dark mode with persistent user preferences

## Data Flow

### User Interaction Flow
1. User inputs message through chat interface
2. Input validation and character limit enforcement
3. Message added to local chat history
4. API request sent with user message and selected tone
5. Loading state displayed during API processing
6. Response received and formatted for display
7. Optional voice synthesis of AI response
8. Chat history updated and persisted locally

### Image Generation Flow
1. User activates image generation mode
2. Text prompt processed and validated
3. Request sent to Hugging Face Stable Diffusion API
4. Image binary data received and processed
5. Image displayed in chat interface with download options

## External Dependencies

### Required Services
- **Primary AI API**: Glitch-hosted chat service for conversational AI
- **Image Generation**: Hugging Face Inference API for Stable Diffusion 2
- **Font Loading**: Google Fonts (Inter font family)
- **Icon System**: Feather Icons CDN for UI elements

### Browser APIs
- **Web Speech API**: For voice synthesis functionality
- **LocalStorage**: For chat history and user preferences persistence
- **Service Worker**: For PWA capabilities and offline support
- **Fetch API**: For all HTTP communications

## Deployment Strategy

### Static Hosting
- **Deployment Type**: Client-side only application suitable for static hosting
- **Hosting Options**: Compatible with GitHub Pages, Netlify, Vercel, or any static web server
- **Build Process**: No build step required - direct file serving
- **Performance**: Optimized for fast loading with minimal dependencies

### PWA Installation
- **Manifest Configuration**: Enables "Add to Home Screen" functionality
- **Icon System**: SVG-based icons for scalability across devices
- **Offline Capability**: Basic offline support through service worker registration

### Security Considerations
- **CORS Handling**: Relies on external API CORS policies
- **API Keys**: No sensitive keys exposed in client-side code
- **Content Security**: Basic XSS protection through input sanitization

## Changelog

```
Changelog:
- June 28, 2025. Initial setup
- June 28, 2025. Enhanced with professional AI-style icons and responsive design
- June 28, 2025. Fixed button layout issues and improved mobile compatibility
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

### Configuration Notes
- The application uses external APIs that may require additional setup for production use
- Voice features depend on browser support for Web Speech API
- Image generation requires valid Hugging Face API access
- Theme preferences are stored locally and persist across sessions
- The application supports multiple language interfaces (currently configured for Indonesian)