# JettAI Frontend

This is the frontend client for **JettAI**, a multi-agent AI platform. It provides a modern, responsive, and interactive chat interface powered by React and Vite.

## Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS 4
- **State Management**: Redux Toolkit
- **Icons**: Lucide React
- **Markdown**: React Markdown (with syntax highlighting)

## Features
- ⚡ **Real-time Chat**: Connects to the JettAI API Gateway.
- 🤖 **Agent Selection**: Toggle between Auto, Coding, Vision, PDF RAG, PPT generation, and Search agents.
- 📱 **Responsive UI**: Fully optimized for mobile, tablet, and desktop devices.
- 🎙️ **Voice Input**: Integrated browser speech recognition.
- 📎 **File Uploads**: Supports attaching PDFs and images to prompts.

## Getting Started

Make sure you have Node.js v20+ installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root of the `frontend` directory:
```env
VITE_FIREBASE_API_KEY="your_firebase_web_api_key"
VITE_SERVER_URL="http://localhost:8000"
```
*(The server URL should point to your locally running JettAI API Gateway).*

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.
