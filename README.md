# ⚡ JettAI — Multi-Agent AI Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-orange.svg)](https://js.langchain.com/)
[![Docker](https://img.shields.io/badge/Docker-Redis-2496ED.svg)](https://www.docker.com/)
[![AWS S3](https://img.shields.io/badge/AWS-S3%20Storage-FF9900.svg)](https://aws.amazon.com/s3/)
[![Qdrant](https://img.shields.io/badge/Qdrant-Vector%20DB-DC2626.svg)](https://qdrant.tech/)

**JettAI** is a scalable, distributed AI platform architected with microservices and a dynamic **LangGraph Multi-Agent** engine. It autonomously classifies and routes user prompts to specialized AI agents—spanning conversational assistance, real-time web search, production-grade coding, multimodal vision analysis, RAG-powered PDF document Q&A, and on-demand PDF & PowerPoint presentation generation with cloud storage.

---

## 📚 Table of Contents

- [System Architecture](#system-architecture)
- [Multi-Agent Capabilities](#multi-agent-capabilities)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)

- [License](#license)

---

## 🏗️ System Architecture <a id="system-architecture"></a>

```mermaid
graph TD
    Client["💻 Frontend Client (React 19 + Vite)<br/>Port: 5173"] -->|HTTP / REST + Cookies| Gateway["🚪 API Gateway (Express Reverse Proxy)<br/>Port: 8000"]

    Gateway -->|/api/auth/* & /api/chat/*| AuthChatSvc["🔑💬 Auth & Chat Service (Firebase, Mongo, Redis)<br/>Port: 8002"]
    Gateway -->|/api/agent/*| AgentSvc["🧠 Agent Service (LangGraph Engine)<br/>Port: 8003"]

    subgraph "LangGraph Agent Workflow"
        AgentSvc --> Router["🎯 Intent Router Agent"]
        Router -->|Chat Query| ChatAgent["💬 Chat Agent (Groq / GPT-OSS)"]
        Router -->|Live Info| SearchAgent["🌐 Web Search Agent (Tavily)"]
        Router -->|Programming| CodingAgent["💻 Coding Agent (DeepSeek via OpenRouter)"]
        Router -->|Image Upload| ImgAnalyzer["👁️ Image Analyzer (Google Gemini 3.6 Flash)"]
        Router -->|PDF Upload / Q&A| PDFRag["📑 PDF RAG Agent (Qdrant + Groq)"]
        Router -->|Generate PPT| PPTAgent["📊 PPT Generator (PptxGenJS + S3)"]
        Router -->|Generate Visuals| VisionAgent["🎨 Vision Prompt Agent (Pollinations + S3)"]
        SearchAgent --> ChatAgent
    end

    subgraph "External & Infrastructure Layers"
        AuthChatSvc --- Redis[("⚡ Redis Session & Memory Cache<br/>Port: 6379")]
        Gateway --- Redis
        AgentSvc --- Redis
        AuthChatSvc --- MongoChat[("🍃 MongoDB (Chat DB)")]
        AgentSvc --- MongoAgent[("🍃 MongoDB (Agent Documents DB)")]
        PDFRag --- Qdrant[("🎯 Qdrant Vector Cloud")]
        PPTAgent --- S3
        VisionAgent --- S3
    end
```

---

## 🤖 Multi-Agent Capabilities <a id="multi-agent-capabilities"></a>

| Agent | Engine / Model | Trigger / Role | Output / Storage |
| :--- | :--- | :--- | :--- |
| 🎯 **Router Agent** | ChatGroq | Classifies user intent or inspects attachments to route the query | Dispatches to target agent node |
| 💬 **Chat Agent** | ChatGroq (`openai/gpt-oss-20b`) | General conversations, explanations, and synthesized answers | Markdown formatting with sliding window memory |
| 🌐 **Search Agent** | Tavily Search API + ChatGroq | Real-time queries needing current, live web data | Search results & image citations fed into Chat Agent |
| 💻 **Coding Agent** | ChatOpenRouter (`deepseek/deepseek-chat`) | System architecture, debugging, clean code generation | Production-grade code blocks with file path headers |
| 👁️ **Image Analyzer** | ChatGoogleGenerativeAI (`gemini-3.6-flash`) | Multimodal analysis of uploaded images (charts, text, photos) | Grounded visual analysis strictly based on image |
| 📑 **PDF RAG Agent** | Qdrant Cloud + ChatGroq | Semantic Q&A over uploaded PDF documents | Embeds chunks into Qdrant vector collection for retrieval |
| 📊 **PPT Generator** | ChatGroq + PptxGenJS | Multi-slide presentation creation with tailored slide layouts | Uploads to AWS S3; returns presigned download link |
| 🎨 **Vision Agent** | ChatGroq + Pollinations.ai | Transforms descriptive ideas into 8K photo-realistic image prompts | Generates image, uploads to S3, returns download link |

---

## 🌟 Core Features <a id="core-features"></a>

- ⚡ **Microservices Architecture with API Gateway**:
  - **Single Entry Point (`Port 8000`)**: Centralized reverse proxy dispatching traffic to downstream services while handling CORS, rate limiting, and cookie headers.
  - **Auth & Chat Service (`Port 8002`)**: Handles Google Sign-In with Firebase, Redis session caching, and MongoDB Atlas persistence for conversation threads and messages.
  - **LangGraph Multi-Agent Engine (`Port 8003`)**: Stateful orchestration of multi-step AI agents and multimodal execution graphs.
- 🧠 **Two-Tier Smart Memory System**:
  - In-memory Redis buffer caching the last 20 messages for instantaneous conversational response times.
  - Automatic fallback to MongoDB Atlas for cold-start history retrieval.
  - Sliding-window token estimation (`MAX_HISTORY_TOKENS = 2000`) ensuring prompts stay within model context bounds.
- 🎯 **RAG (Retrieval-Augmented Generation) & Vector Database**:
  - Full semantic search for PDF documents using text splitters and **Qdrant Vector Cloud**.
  - Document lifecycle management with active/inactive status and vector collection cleanup.
- ☁️ **Cloud Storage Integration**:
  - Generated PDFs, presentations, and images are streamed directly to **AWS S3** with time-expiring presigned download URLs.
- 📱 **Fully Responsive UI**:
  - Built with React 19, TailwindCSS, and Redux Toolkit.
  - Fully optimized for Mobile (320px+), Tablet (640px+), and Desktop (1024px+) viewports.
  - Collapsible sidebar, interactive agent selector, code copy utilities, and Markdown rendering.

---

## 🛠️ Tech Stack <a id="tech-stack"></a>

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, TailwindCSS 4, Redux Toolkit, Lucide Icons, React Markdown |
| **Backend Framework** | Node.js (ES Modules), Express 5, `express-http-proxy`, Multer |
| **Agent Orchestration** | `@langchain/langgraph`, `@langchain/core`, `@langchain/groq`, `@langchain/google-genai`, `@langchain/openrouter` |
| **Authentication** | Firebase Admin SDK, Redis Session Store, HTTP-Only Cookie Sessions |
| **Databases & Storage** | MongoDB Atlas (Mongoose), Redis (`ioredis`), Qdrant Vector Cloud (`@langchain/qdrant`), AWS S3 (`@aws-sdk/client-s3`) |
| **Document Processing** | PDFParse, PDFKit, PptxGenJS |
| **External APIs** | Groq, Google Gemini API, OpenRouter, Tavily Search API, Pollinations.ai |

---

## 📁 Project Structure <a id="project-structure"></a>

```
jettAI/
├── .vscode/
│   └── tasks.json                     # Automated multi-service task runner
├── backend/
│   ├── docker-compose.yml             # Redis Docker configuration
│   ├── gateway/                       # API Gateway & Reverse Proxy (Port 8000)
│   │   ├── index.js                   # Gateway routes, CORS, cookie parser
│   │   ├── middleware/auth.middleware.js # Session validation from Redis
│   │   └── utils/ProxyWithHeader.js   # Proxies user headers to microservices
│   ├── shared/                        # Shared Redis client connection
│   └── services/
│       ├── auth-chat/                 # Auth & Chat Service (Port 8002)
│       │   ├── controllers/           # Auth (Firebase) and Chat (MongoDB) controllers
│       │   ├── models/                # User, Conversation, and Message schemas
│       │   └── routes/                # API route definitions
│       └── agent/                     # LangGraph Multi-Agent Service (Port 8003)
│           ├── agents/                # Agent definitions (chat, coding, pdf, ppt, vision, etc.)
│           ├── config/                # LLM models, S3, Qdrant, Redis memory, DB connection
│           ├── controllers/           # Agent controller & document management
│           ├── graph/                 # LangGraph state annotations & dynamic router
│           └── utils/                 # PDF/PPT generators, S3 helpers
└── frontend/                          # React 19 + Vite Frontend (Port 5173)
    ├── src/
    │   ├── components/                # ChatArea, ChatInput, MessageList, Nav, SideBar
    │   ├── features/                  # API client functions with VITE_SERVER_URL
    │   ├── pages/                     # Main Home layout & authentication modal
    │   └── redux/                     # Slices for user, chat, messages, and UI state
```

---

## 🚀 Getting Started <a id="getting-started"></a>

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [Docker Desktop](https://www.docker.com/) (for local Redis)
- [MongoDB Atlas](https://www.mongodb.com/) cluster URI
- API Keys:
  - [Groq API](https://groq.com/)
  - [Google AI Studio](https://aistudio.google.com/)
  - [OpenRouter](https://openrouter.ai/)
  - [Tavily Search](https://tavily.com/)
  - [Firebase Console](https://firebase.google.com/)
  - [AWS S3](https://aws.amazon.com/s3/) (Bucket + Access Keys)
  - [Qdrant Cloud](https://cloud.qdrant.io/) (Cluster URL + API Key)

---

### 2. Environment Configuration

Create a `.env` file in each respective service directory:

#### **`backend/gateway/.env`**
```env
PORT=8000
AUTH_SERVICE=http://localhost:8002
CHAT_SERVICE=http://localhost:8002
AGENT_SERVICE=http://localhost:8003
FRONTEND_URL="http://localhost:5173"
REDIS_URL="redis://localhost:6379"
```

#### **`backend/services/auth-chat/.env`**
```env
PORT=8002
MONGODB_URI="your_mongodb_atlas_auth_chat_uri"
REDIS_URL="redis://localhost:6379"
INTERNAL_SERVICE_KEY="your_internal_secret"
```
*(Also place your Firebase `serviceAccountKey.json` inside `backend/services/auth-chat/`)*

#### **`backend/services/agent/.env`**
```env
PORT=8003
MONGODB_URI="your_mongodb_atlas_agent_uri"
REDIS_URL="redis://localhost:6379"
GROQ_API_KEY="your_groq_api_key"
GOOGLE_API_KEY="your_google_api_key"
OPENROUTER_API_KEY="your_openrouter_api_key"
TAVILY_API_KEY="your_tavily_api_key"
CHAT_SERVICE="http://localhost:8002"

# AWS S3 Storage
AWS_REGION="your_aws_region"
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_KEY="your_aws_secret_key"
AWS_BUCKET_NAME="your_s3_bucket_name"

# Qdrant Vector Cloud
QDRANT_URL="your_qdrant_cloud_cluster_url"
QDRANT_API_KEY="your_qdrant_api_key"
```

#### **`frontend/.env`**
```env
VITE_FIREBASE_API_KEY="your_firebase_web_api_key"
VITE_SERVER_URL="http://localhost:8000"
```

---

### 3. Installation

Install dependencies across all services:

```powershell
# Backend microservices
cd backend/gateway && npm install
cd ../services/auth-chat && npm install
cd ../services/agent && npm install

# Frontend
cd ../../../frontend && npm install
```

---

### 4. Running the Services

#### ⚡ **One-Shortcut Launch in VS Code (Pre-configured via `.vscode/tasks.json`)**
This repository includes a pre-configured [`.vscode/tasks.json`](.vscode/tasks.json) build task.

Simply press:
```
Ctrl + Shift + B
```
*(Or navigate to **Terminal** $\rightarrow$ **Run Build Task...** $\rightarrow$ **Start All Services**)*

VS Code will automatically open **5 dedicated terminal tabs**:
1. 📑 **`Redis (Docker 6379)`** — Runs `docker compose up` to start Redis
2. 📑 **`Auth & Chat Service (8002)`** — Runs `npm run dev`
3. 📑 **`Agent Service (8003)`** — Runs `npm run dev`
4. 📑 **`Gateway (8000)`** — Runs `npm run dev`
5. 📑 **`Frontend (5173)`** — Runs `npm run dev`

---

#### 💻 **Manual Launch**

If running without VS Code tasks, run each service in a separate terminal:

```powershell
# 1. Start Redis container
cd backend && docker compose up -d

# 2. Start Auth & Chat Service (8002)
cd backend/services/auth-chat && npm run dev

# 3. Start Agent Service (8003)
cd backend/services/agent && npm run dev

# 4. Start Gateway (8000)
cd backend/gateway && npm run dev

# 5. Start Frontend (5173)
cd frontend && npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser to start chatting with JettAI!

---

## 📜 License <a id="license"></a>
This project is open source and available under the [ISC License](LICENSE).
