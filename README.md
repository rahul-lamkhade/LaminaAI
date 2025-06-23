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
* 🔄 Easy to switch models via [Ollama](https://ollama.com/) (e.g. Hermes, Mistral, etc.)

---

## 🚀 Getting Started

### 🖥 Requirements

* Node.js ≥ 18
* Python ≥ 3.10
* [Ollama](https://ollama.com/) installed locally

---

### 📦 Installation

```bash
# Clone the project
git clone https://github.com/rahul-lamkhade/LaminaAI.git
cd LaminaAI

# Set up orchestrator app
cd services/orchestrator
npm install

# Set up Python memory service
cd services/memory-api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Now start all services
# in terminal
ollama serve
# in services/memory-api
uvicorn src.vector_store:app --reload --reload-dir=src
# in services/orchestrator
npx ts-node src/index.ts
```

---

### 💠 How It Works

* Recent messages are kept in a short-term memory queue (up to 10).
* Older chats are summarized and stored in **ChromaDB** with metadata.
* On each new message:

  * Fetch recent summaries + active short-term queue
  * Perform semantic search if trigger words match (e.g., *"remember"*)
* Final prompt is sent to the LLM (via Ollama) for response generation.

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

### �� License

MIT — open-source and free to use for personal or commercial projects.

---

### 📲 Coming Soon

* 🐳 Docker integration
* 🧘 Emotional state tracking
* 📱 Mobile UI (Ionic + Angular)
* 🎧 Voice integration (TTS/STT)
* 🌐 Web-based UI