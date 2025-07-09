# 🧠 LaminaAI – Your Local AI Companion

**LaminaAI** is a developer-friendly framework for building local, conversational AI assistants and companions with **long-term memory**, **context awareness**, and a **customizable personality**.

> Ships with **Lamina** – a warm and playful AI persona – as the default character.

---

## ✨ Features

* 🧠 **Long-Term Memory** using local ChromaDB (no cloud)
* 🗞️ **Message Summarization** and semantic embedding
* 🔍 **Context Recall** via vector search (RAG-style)
* 💬 **Short-Term Memory Queue** (recent chat context)
* ⚙️ Built with **Node.js**, **TypeScript**, **FastAPI, ChromaDB (Python)**, and **Ollama LLM**
* 🔄 Easy to switch models via [Ollama](https://ollama.com/) (e.g. gemma3:1b, Hermes, Mistral, etc.)

---

## 🚀 Getting Started

### 🐳 Requirements

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/) (v2+)

---

### 📦 Installation & Setup (Using Docker)

```bash
# Clone the project
git clone https://github.com/rahul-lamkhade/LaminaAI.git
cd LaminaAI

# Build all services
docker-compose build

# Start all services
docker-compose up -d

# Run cli base chat
docker-compose run --rm --service-ports cli-ui

```

---

### 💠 How It Works

* Recent messages are kept in a short-term memory queue (up to 10).
* Older chats are summarized and stored in **ChromaDB** with metadata.
* On each new message:
  * Fetch recent summaries + active short-term queue
  * Perform semantic search if trigger words match (e.g., *"remember"*)
* Final prompt is sent to the LLM (via Ollama) for response generation.
* type 'exit' and enter which will exit the chat. 
---

### 🔌 API Endpoints (Python Memory Server)

| Endpoint             | Purpose                         |
| -------------------- | ------------------------------- |
| `POST /memory/add`   | Store a summarized memory       |
| `GET /memory/recent` | Get last N memory chunks        |
| `POST /query`        | Semantic memory search (vector) |

---

### 🧠 Character: Lamina

Lamina is a warm, emotionally intelligent AI companion. You can customize her personality, tone, and prompt behavior in:

```ts
services/orchestrator/src/agents/lamina.ts
```

---

### 🧱 Use Cases

* Personal AI assistant (local & private)
* Mental health journaling support
* Story-based NPCs or game characters
* Offline companions for low-resource environments

---

### 🌱 Contributing

This project is modular and designed to be extended or embedded in other tools. Fork it, remix it, or send a PR.

---

### License

MIT — open-source and free to use for personal or commercial projects.

---

### 📲 Coming Soon

* 🧘 Emotional state tracking
* 📱 Mobile UI (Ionic + Angular)
* 🎧 Voice integration (TTS/STT)
* 🌐 Web-based UI