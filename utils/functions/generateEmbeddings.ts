export async function generateEmbeddings(input: string): Promise<string> {
  try {
    if (!input.trim()) {
      throw new Error('Input text is required.');
    }

    const response = await fetch('/api/openai/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error generating embeddings:', error);
    return 'Error generating embeddings';
  }
}