export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { token, model, messages } = req.body;
  if (!token || !model || !messages) {
    return res.status(400).json({ error: 'token, model এবং messages দরকার' });
  }
  try {
    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ model, messages, max_tokens: 2048, temperature: 0.7 }),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || `HTTP ${response.status}` });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
         }
