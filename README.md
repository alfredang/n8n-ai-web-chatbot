# n8n AI Web Chatbot

A customer support FAQ chatbot powered by n8n AI Agent workflows with RAG (Retrieval-Augmented Generation). The web chatbot communicates with an n8n webhook that triggers an AI agent to respond using a dynamic knowledge base.

## Architecture

```
Browser Chatbot (HTML/JS)
        │
        ▼  POST /webhook/ai-chatbot
┌──────────────────────────────────────────────┐
│  n8n Workflow: Customer FAQ Chatbot          │
│                                              │
│  [Webhook] → [AI Agent] → [Respond]         │
│                  ↑                           │
│  [Groq LLM]  [Simple Memory]  [Vector Store]│
│                                    ↑         │
│                           [Gemini Embeddings]│
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  n8n Workflow: FAQ Document Uploader         │
│                                              │
│  [Upload Form] → [Vector Store (insert)]    │
│                       ↑                      │
│          [Gemini Embeddings]                 │
│          [Default Data Loader]               │
│              ↑                               │
│          [Text Splitter]                     │
└──────────────────────────────────────────────┘
```

## Components

### Web Chatbot (Frontend)
- `index.html` - Chat UI with message input
- `app.js` - Sends messages to n8n webhook, displays responses
- `style.css` - Dark theme styling

### n8n Workflows (Backend)

**1. Customer FAQ Chatbot - AI Agent** (`Customer FAQ Chatbot - AI Agent.json`)
- Webhook trigger (POST) receives chat messages
- AI Agent with Groq (llama-3.3-70b-versatile) processes queries
- Simple Vector Store in `retrieve-as-tool` mode — the AI agent uses it directly as a RAG tool to search the FAQ knowledge base
- Simple Memory (Buffer Window) maintains conversation context per session
- Responds with JSON `{ reply: "..." }`

**2. BELLS FAQ - Upload & Load to Vector Store** (`Upload & Load to Vector Store.json`)
- Form-based file upload (accepts .docx and .pdf)
- Loads directly into Simple Vector Store (insert mode) — no separate text extraction step needed
- Gemini Embeddings for vector generation
- Default Data Loader with Recursive Text Splitter (500 char chunks, 50 char overlap)

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Workflow Engine**: n8n (self-hosted or cloud)
- **LLM**: Groq - Llama 3.3 70B Versatile
- **Embeddings**: Google Gemini (text-embedding-004)
- **Vector Store**: n8n In-Memory Vector Store
- **Memory**: n8n Simple Memory (Buffer Window)

## Setup

### Prerequisites
- n8n instance (self-hosted or cloud)
- Groq API key ([console.groq.com](https://console.groq.com))
- Google Gemini API key ([aistudio.google.com/apikey](https://aistudio.google.com/apikey))

### 1. Import n8n Workflows
Import the two JSON files into your n8n instance:
- `Customer FAQ Chatbot - AI Agent.json`
- `Upload & Load to Vector Store.json`

In n8n: **Workflows → Import from File**

### 2. Configure Credentials in n8n
- **Groq API**: Settings → Credentials → Add → Groq API (enter your API key)
- **Google Gemini**: Settings → Credentials → Add → Google PaLM API (enter your Gemini API key)

### 3. Activate Both Workflows
Toggle both workflows to **Active** in n8n.

### 4. Upload FAQ Documents
Navigate to your n8n form URL:
```
https://your-n8n-instance/form/bells-faq-upload
```
Upload your FAQ document (.docx or .pdf). You can upload multiple documents.

### 5. Update Webhook URL
In `app.js`, update the default webhook URL to match your n8n instance:
```javascript
"https://your-n8n-instance/webhook/ai-chatbot";
```

### 6. Serve the Frontend
```bash
python3 -m http.server 8080
```
Open `http://localhost:8080` in your browser.

## Usage

1. Upload your FAQ document(s) through the form upload workflow
2. Open the chatbot in your browser
3. Type a question — the AI agent searches the knowledge base via RAG and responds
4. Conversation memory maintains context within a session

## Notes

- The In-Memory Vector Store resets when n8n restarts — re-upload FAQ documents after a restart.
- The webhook URL can be overridden via `?webhook=<url>` query parameter or `localStorage.webhookUrl`.
- Pass `sessionId` in the request body for per-user memory isolation.
- The sample FAQ document (`📌 General BELLS FAQs.docx`) is included as a reference.
