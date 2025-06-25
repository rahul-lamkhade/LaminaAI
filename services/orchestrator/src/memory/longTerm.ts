import axios from 'axios';

export async function saveSummaryToMemory(summary: string) {
  console.log('💾 Saving summary to long-term memory:', summary);
  const memoryItem = {
    id: `memory-${Date.now()}`,
    content: summary,
    metadata: { 
      source: 'summary',
      timestamp: new Date().toISOString(),
    }
  };

  try {
    await axios.post('http://memory-api:8000/memory/add', memoryItem);
    console.log('✅ Summary saved to long-term memory.');
  } catch (error: any) {
    console.error('❌ Failed to save summary:', error.message);
  }
}

export async function fetchRecentMemories(n = 8): Promise<string[]> {
  try {
    const response = await axios.get(`http://memory-api:8000/memory/recent?n=${n}`);
    //console.log('responses', response.data);
    return response.data.documents || [];
  } catch (error) {
    console.error("❌ Failed to fetch recent memories:", error);
    return [];
  }
}

export async function fetchDeepMemories(query: string): Promise<string[]> {
  try {
    const res = await axios.post('http://memory-api:8000/query', {
      query,
      n_results: 2
    });
    return res.data.documents?.[0] || [];
  } catch (err) {
    console.error('Failed to fetch RAG memories:', err);
    return [];
  }
}
