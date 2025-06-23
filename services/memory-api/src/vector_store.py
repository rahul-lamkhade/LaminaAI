# memory/chroma_memory.py

from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
import chromadb
#from chromadb.config import Settings
from datetime import datetime

app = FastAPI()

# Setup ChromaDB with persistent storage
client = chromadb.PersistentClient(path="./chroma_data")
collection = client.get_or_create_collection(name="lamina_memories")

# ----- Request Schemas -----

class MemoryItem(BaseModel):
    id: str
    content: str
    metadata: dict = {}

class QueryItem(BaseModel):
    query: str
    n_results: int = 3

# ----- API Endpoints -----

@app.post("/memory/add")
def add_memory(item: MemoryItem = Body(...)):
    try:
        collection.add(
            documents=[item.content],
            ids=[item.id],
            metadatas=[item.metadata]
        )
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
def search_memory(query: QueryItem):
    try:
        results = collection.query(query_texts=[query.query], n_results=query.n_results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/memory/recent")
def get_recent_memories(n: int = 8):
    try:
        all_data = collection.get()

        documents = all_data.get("documents", [])
        metadatas = all_data.get("metadatas", [])
        ids = all_data.get("ids", [])

        if not documents or not metadatas or not ids:
            return {"documents": []}

        combined = list(zip(ids, documents, metadatas))

        # Debug output
        print(f"📦 Total memory items found: {len(combined)}")

        filtered = []
        for _id, doc, meta in combined:
            try:
                ts = meta.get("timestamp")
                if ts:
                    # Will raise ValueError if not ISO format
                    ts = ts.replace("Z", "+00:00")
                    dt = datetime.fromisoformat(ts)
                    filtered.append((dt, doc))
            except Exception as e:
                print(f"⚠️ Skipping invalid item (ID: {_id}): {e}")

        if not filtered:
            return {"documents": []}

        # Sort by timestamp descending
        filtered.sort(key=lambda x: x[0], reverse=True)

        # Select top N documents
        recent_docs = [doc for _, doc in filtered[:n]]

        return {"documents": recent_docs}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch recent memories: {str(e)}")

@app.post("/clear")
def clear_memory():
    try:
        ids = collection.get()['ids']
        collection.delete(ids=ids)
        return {"status": "cleared", "count": len(ids)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/memory/debug")
def debug_memory():
    all_data = collection.get()
    docs = all_data.get("documents", [])
    metas = all_data.get("metadatas", [])
    
    print(f"🔍 Total docs: {len(docs)}")
    for i, (doc, meta) in enumerate(zip(docs, metas[:10])):
        print(f"Doc {i+1}: {doc}")
        print(f"Metadata: {meta}")

    return {"count": len(docs), "samples": list(zip(docs[:10], metas[:10]))}

