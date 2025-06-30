import axios from 'axios';

interface MemoryItem {
  id: string;
  content: string;
  metadata: {
    source: string;
    timestamp: string;
  };
}

export class VectorService {
  private baseUrl = 'http://memory-api:8000';

  async saveSummary(summary: string): Promise<void> {
    const memoryItem: MemoryItem = {
      id: `memory-${Date.now()}`,
      content: summary,
      metadata: {
        source: 'summary',
        timestamp: new Date().toISOString(),
      }
    };

    try {
      await axios.post(`${this.baseUrl}/memory/add`, memoryItem);
      console.log('Summary saved to long-term memory.');
    } catch (error: any) {
      console.error('Failed to save summary:', error.message);
    }
  }

  async fetchRecentSummaries(n = 8): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/memory/recent?n=${n}`);
      return response.data.documents || [];
    } catch (error) {
      console.error("Failed to fetch recent memories:", error);
      return [];
    }
  }

  async fetchRelatedMemories(query: string): Promise<string[]> {
    try {
      const res = await axios.post(`${this.baseUrl}/query`, {
        query,
        n_results: 2
      });
      return res.data.documents?.[0] || [];
    } catch (err) {
      console.error('Failed to fetch RAG memories:', err);
      return [];
    }
  }
}
