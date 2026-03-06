# n8n AI Web Chatbot

A customer support FAQ chatbot powered by n8n AI Agent workflows with RAG (Retrieval-Augmented Generation). The web chatbot communicates with an n8n webhook that triggers an AI agent to respond using a knowledge base.

## Architecture

```
Browser Chatbot (HTML/JS)
        │
        ▼  POST /webhook/ai-chatbot
┌─────────────────────────────────────────────┐
│  n8n Workflow: Customer FAQ Chatbot         │
│                                             │
│  [Webhook] → [AI Agent] → [Respond]        │
│                  ↑                          │
│    [Groq LLM]  [Memory]  [Vector Store Tool]│
│                             ↑               │
│                    [In-Memory Vector Store]  │
│                    [Gemini Embeddings]       │
│                    [Groq LLM for Tool]      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  n8n Workflow: FAQ Document Uploader        │
│                                             │
│  [Form Upload] → [Extract Text]            │
│       → [In-Memory Vector Store (insert)]   │
│         [Gemini Embeddings] [Text Splitter] │
└─────────────────────────────────────────────┘
```

## Components

### Web Chatbot (Frontend)
- `index.html` - Chat UI with message input
- `app.js` - Sends messages to n8n webhook, displays responses
- `style.css` - Dark theme styling

### n8n Workflows (Backend)

**1. Customer FAQ Chatbot - AI Agent**
- Webhook trigger (POST) receives chat messages
- AI Agent with Groq (llama-3.3-70b-versatile) processes queries
- Vector Store Tool performs RAG retrieval from uploaded FAQ documents
- Simple Memory maintains conversation context per session
- Responds with JSON `{ reply: "..." }`

**2. BELLS FAQ - Upload & Load to Vector Store**
- Form-based file upload (accepts .docx and .pdf)
- Extracts text and loads into In-Memory Vector Store
- Uses Gemini text-embedding-004 for embeddings
- Chunks documents with recursive text splitter

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Workflow Engine**: n8n (self-hosted on Hostinger)
- **LLM**: Groq - Llama 3.3 70B Versatile
- **Embeddings**: Google Gemini text-embedding-004
- **Vector Store**: n8n In-Memory Vector Store
- **Memory**: n8n Simple Memory (Buffer Window)

## Setup

### Prerequisites
- n8n instance (self-hosted or cloud)
- Groq API key
- Google Gemini API key (for embeddings)

### 1. Import n8n Workflows
Import the two workflows into your n8n instance or recreate them following the architecture above.

### 2. Configure Credentials in n8n
- **Groq API**: Add your Groq API key as a `groqApi` credential
- **Google Gemini**: Add your Gemini API key as a `googlePalmApi` credential

### 3. Upload FAQ Documents
Navigate to your n8n form URL (e.g., `https://your-instance/form/bells-faq-upload`) and upload your FAQ document (.docx or .pdf).

### 4. Update Webhook URL
In `app.js`, update the default webhook URL to match your n8n instance:
```javascript
"https://your-n8n-instance/webhook/ai-chatbot";
```

### 5. Serve the Frontend
```bash
python3 -m http.server 8080
```
Open `http://localhost:8080` in your browser.

## Usage

1. Upload your FAQ document through the form upload workflow
2. Open the chatbot in your browser
3. Type a question and the AI agent will search the knowledge base and respond
4. Conversation memory maintains context within a session

## Notes

- The In-Memory Vector Store resets when n8n restarts. Re-upload FAQ documents after a restart.
- The webhook URL can be overridden via `?webhook=<url>` query parameter or `localStorage.webhookUrl`.
- Session IDs can be passed in the request body as `sessionId` for per-user memory isolation.
