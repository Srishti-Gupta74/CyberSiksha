import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key_for_build");

const SYSTEM_PROMPT = `
You are CyberSiksha's AI Mentor. Your job is to explain cybersecurity concepts and digital scams to elderly Indians and children in very simple, friendly language.
RULES:
1. Use simple analogies they understand (e.g., locks, doors, keys, physical wallets).
2. Never use jargon (like 'phishing', 'malware', '2FA') without explaining it simply first.
3. Be warm, patient, and respectful (like a grandchild explaining a phone feature to a grandparent).
4. If they describe a suspicious message or call, explain the scam pattern and give clear steps to stay safe.
5. Keep answers concise (3-5 sentences maximum). No long essays.
6. You can respond in Hindi, English, or Hinglish based on the user's language.
`;

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    // For local dev without API key, send a mock response
    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ 
        role: 'assistant', 
        content: "Namaste! I am your CyberSiksha AI mentor. (Note: Gemini API key is missing, so this is a mock response. Please add GEMINI_API_KEY to your .env file to enable real AI responses!)"
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: SYSTEM_PROMPT });
    
    const formattedHistory = messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
    
    const chat = model.startChat({
      history: formattedHistory,
    });
    
    const latestMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(latestMessage);
    const response = await result.response;
    const text = response.text();
    
    return Response.json({ role: 'assistant', content: text });
    
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
