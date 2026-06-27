import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message } = await req.json();
    let rawKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const apiKey = rawKey ? rawKey.replace(/['"]/g, '').trim() : null;
    let text = "";

    if (apiKey) {
      let validModels = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      try {
        const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, { signal: AbortSignal.timeout(3000) });
        if (modelsRes.ok) {
          const modelsData = await modelsRes.json();
          const discovered = (modelsData.models || [])
            .filter(m => m.supportedGenerationMethods?.includes('generateContent') && (m.name.includes('2.5') || m.name.includes('flash')))
            .map(m => m.name.replace('models/', ''));
          validModels = Array.from(new Set([...validModels, ...discovered])).slice(0, 4);
        }
      } catch {
        // Silent fallback
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const systemInstruction = `You are a cybersecurity expert mentor for an Indian platform called CyberSiksha. 
Your goal is to help elderly people, parents, and youth spot digital scams (like UPI frauds, digital arrests, fake parcel scams, WhatsApp links).

Provide a clear, simple, empathetic, and reassuring answer. Do not use complex technical jargon. 
Give them direct advice on whether it's safe or a scam, and tell them exactly what steps to take next. Keep it structured and under 150 words.
CRITICAL MANDATE: Output ONLY your direct response to the user. Do not output your role, analysis, constraints, or thought process.`;

      for (const modelName of validModels) {
        try {
          const model = genAI.getGenerativeModel({ 
            model: modelName,
            systemInstruction: systemInstruction
          }, { timeout: 4000 });
          const result = await model.generateContent(message);
          text = result.response.text();
          if (text) break;
        } catch {
          // Silently try next model
        }
      }
    }

    if (!text) {
      const lower = (message || "").toLowerCase();
      if (lower.includes('phishing')) {
        text = "🎣 PHISHING DEFINITION: Phishing is a digital scam where attackers disguise themselves as trusted institutions (like banks, courier companies, or government officials) via email, SMS, or WhatsApp. Their main goal is to trick you into clicking malicious links or revealing sensitive data like passwords, OTPs, or credit card details. Always double-check sender details!";
      } else if (lower.includes('deepfake') || lower.includes('ai voice') || lower.includes('clone')) {
        text = "🤖 DEEPFAKE ALERT: Scammers use AI technology to clone the voice or face of a loved one using audio/video from their social media. If you get a distressing emergency call asking for money, hang up and verify by calling back their original phone number!";
      } else if (lower.includes('arrest') || lower.includes('cbi') || lower.includes('police')) {
        text = "⚠️ DIGITAL ARREST FRAUD: CBI, Police, or RBI never conduct video call interrogations or demand money over Skype/WhatsApp to clear charges. Disconnect immediately and dial 1930!";
      } else {
        text = "🚨 Security Mentor Advisory: Always pause and verify unasked financial requests or suspicious links independently. Never share your bank OTP, passwords, or UPI PIN over phone calls. If you suspect fraud, report immediately to the National Helpline at 1930 or visit cybercrime.gov.in.";
      }
    }

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('API Chat Error:', error);
    return NextResponse.json({ 
      reply: "🎣 PHISHING & SCAM ADVISORY: Phishing is when scammers disguise themselves as trusted institutions to steal passwords or OTPs. Always pause and verify unasked financial requests independently. Report cyber fraud immediately to 1930." 
    });
  }
}
