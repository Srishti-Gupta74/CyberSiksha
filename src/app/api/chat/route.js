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

    // Step 1: Query Google's REST endpoint to dynamically discover active models for this key!
    const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const modelsData = await modelsRes.json();

    if (!modelsRes.ok) {
      throw new Error(`Failed to list models: ${modelsData.error?.message || modelsRes.statusText}`);
    }

    // Step 2: Filter models that specifically support text generation (generateContent)
    const validModels = (modelsData.models || [])
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name.replace('models/', ''));

    if (validModels.length === 0) {
      throw new Error("No models supporting generateContent found for your API key clearance.");
    }

    console.log("Dynamically discovered active Gemini models:", validModels);

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
        });
        const result = await model.generateContent(message);
        text = result.response.text();
        break;
      } catch (err) {
        console.warn(`Model ${modelName} failed (${err.message}), trying next valid model...`);
        lastErr = err;
      }
    }

    if (!text) {
      throw new Error(`All discovered models (${validModels.slice(0, 3).join(', ')}) failed. Last error: ${lastErr?.message}`);
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
