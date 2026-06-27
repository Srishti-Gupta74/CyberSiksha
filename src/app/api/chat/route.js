import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message } = await req.json();
    let rawKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const apiKey = rawKey ? rawKey.replace(/['"]/g, '').trim() : null;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server Gemini API key is missing. Please add GEMINI_API_KEY to your .env file.' },
        { status: 500 }
      );
    }

    let validModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    try {
      const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, { signal: AbortSignal.timeout(3000) });
      if (modelsRes.ok) {
        const modelsData = await modelsRes.json();
        const discovered = (modelsData.models || [])
          .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
          .map(m => m.name.replace('models/', ''));
        if (discovered.length > 0) validModels = discovered;
      }
    } catch (e) {
      console.warn("Model discovery timeout or error, fallback to defaults");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const systemInstruction = `You are a cybersecurity expert mentor for an Indian platform called CyberSiksha. 
Your goal is to help elderly people, parents, and youth spot digital scams (like UPI frauds, digital arrests, fake parcel scams, WhatsApp links).

Provide a clear, simple, empathetic, and reassuring answer. Do not use complex technical jargon. 
Give them direct advice on whether it's safe or a scam, and tell them exactly what steps to take next. Keep it structured and under 150 words.
CRITICAL MANDATE: Output ONLY your direct response to the user. Do not output your role, analysis, constraints, or thought process.`;

    let text = "";
    let lastErr = null;

    for (const modelName of validModels) {
      try {
        console.log(`Attempting generation with model: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: systemInstruction
        }, { timeout: 4000 });
        const result = await model.generateContent(message);
        text = result.response.text();
        break;
      } catch (err) {
        console.warn(`Model ${modelName} failed (${err.message}), trying next valid model...`);
        lastErr = err;
        if (err.message?.includes('429') || err.message?.includes('Quota') || err.message?.includes('403') || err.message?.includes('400')) {
          break;
        }
      }
    }

    if (!text) {
      text = "🚨 Security Mentor Advisory: Always pause and verify unasked financial requests or suspicious links independently. Never share your bank OTP, passwords, or UPI PIN over phone calls. If you suspect fraud, report immediately to the National Helpline at 1930 or visit cybercrime.gov.in.";
    }

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('API Chat Error:', error);
    return NextResponse.json(
      { error: `Google AI Error: ${error.message}` },
      { status: 500 }
    );
  }
}
