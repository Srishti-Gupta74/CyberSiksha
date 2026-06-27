import { NextResponse } from 'next/server';
import { PHISH_SEEDS } from '@/lib/phishSeeds';

export async function GET() {
  let isLive = false;
  let seeds = [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch('https://urlhaus-api.abuse.ch/v1/urls/recent/', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.urls)) {
        const filtered = data.urls.filter(entry => 
          (entry.threat === "malware_download") || 
          (Array.isArray(entry.tags) && entry.tags.includes("phishing"))
        );

        if (filtered.length >= 5) {
          isLive = true;
          // Defang URLs and map to internal seeds
          seeds = filtered.slice(0, 15).map(u => ({
            url: (u.url || '').replace(/\./g, '[.]'),
            vector: u.threat || 'Malware Phishing Vector',
            target: 'General Internet User',
            redFlags: ['Suspicious Unofficial Domain', 'Direct Executable Payload Request', 'Unsolicited Communication Vector']
          }));
        }
      }
    }
  } catch (err) {
    // Silently catch timeout or network failure
    console.log('URLhaus fetch fallback triggered:', err.message);
  }

  if (!isLive || seeds.length === 0) {
    seeds = [...PHISH_SEEDS];
  }

  return NextResponse.json({
    isLiveIntel: isLive,
    intelSource: isLive ? "Live URLhaus Threat Intelligence" : "Curated Forensic Threat Archives",
    badgeText: "Scenarios seeded from live URLhaus threat intelligence",
    seeds
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { persona, vector, message } = body;

    if (!message || message.trim().length < 1) {
      return NextResponse.json({ error: 'Message payload required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const prompt = `You are a cyber security expert evaluating a simulated phishing attack vector crafted by a student.
Target Persona: "${persona}"
Attack Vector: "${vector}"
Crafted Message Text: "${message}"

Evaluate how manipulative, dangerous, or realistic this trap message is. CRITICAL RULE: If the message is innocent, friendly, or harmless (like 'hi', 'hello', 'how are you', or simple conversational text without scam links or financial demands), assign a lethalityScore under 15, rating must be "🟢 Harmless Message (No Threat Detected)", triggersExploited must be ["None (Friendly Casual Message)"], and forensicAnalysis must clearly state in a friendly tone that this message does not look like an attacker trap and poses zero harm!

Return ONLY valid JSON (no markdown formatting, no backticks, no markdown blocks) with exact keys:
"lethalityScore": number between 10 and 98,
"rating": string (e.g. "🟢 Harmless Message (No Threat Detected)" or "🟡 Tactical Phishing Vector" or "🔴 Supreme Lethality Trap"),
"triggersExploited": array of strings (e.g. ["None (Friendly Casual Message)"] or ["Time Urgency", "Authority Impersonation"]),
"forensicAnalysis": string detailed analysis explaining why this message is dangerous or completely harmless against the persona,
"ethicalFlipChallenge": {
  "prompt": "Now flip your mindset! As a cyber defender, evaluate how a vigilant citizen analyzes this text.",
  "redFlagsToSpot": [string, string, string]
}`;

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

        for (const modelName of validModels) {
          try {
            const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
              }),
              signal: AbortSignal.timeout(20000)
            });

            if (geminiRes.ok) {
              const geminiData = await geminiRes.json();
              let rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
              rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
              const parsed = JSON.parse(rawText);
              if (parsed && typeof parsed.lethalityScore === 'number') {
                return NextResponse.json(parsed);
              }
            } else if (geminiRes.status === 429 || geminiRes.status === 403 || geminiRes.status === 400) {
              console.warn(`API Quota/Auth error (${geminiRes.status}) on ${modelName}, breaking loop for instant heuristic fallback.`);
              continue;
            }
          } catch (modelErr) {
            console.warn(`Timeout or error on ${modelName}:`, modelErr.message);
          }
        }
      } catch (gemErr) {
        console.error("Gemini RedZone error:", gemErr);
      }
    }

    const lowerMsg = message.toLowerCase();
    let score = 45;
    const triggers = [];

    // Psychological Trigger Evaluation
    if (lowerMsg.includes('urgent') || lowerMsg.includes('immediately') || lowerMsg.includes('expire') || lowerMsg.includes('hour') || lowerMsg.includes('now')) {
      score += 18;
      triggers.push('High-Pressure Time Urgency');
    }
    if (lowerMsg.includes('bank') || lowerMsg.includes('sbi') || lowerMsg.includes('rbi') || lowerMsg.includes('kyc') || lowerMsg.includes('cbi') || lowerMsg.includes('police')) {
      score += 20;
      triggers.push('Institutional Authority Impersonation');
    }
    if (lowerMsg.includes('win') || lowerMsg.includes('lottery') || lowerMsg.includes('free') || lowerMsg.includes('cash') || lowerMsg.includes('job') || lowerMsg.includes('salary')) {
      score += 17;
      triggers.push('Greed & Reward Exploitation');
    }
    if (lowerMsg.includes('block') || lowerMsg.includes('freeze') || lowerMsg.includes('arrest') || lowerMsg.includes('penalty')) {
      score += 15;
      triggers.push('Fear & Consequence Ultimatum');
    }

    const isHarmless = triggers.length === 0;
    const finalScore = isHarmless ? 10 : Math.min(98, Math.max(35, score));

    return NextResponse.json({
      lethalityScore: finalScore,
      rating: isHarmless ? '🟢 Harmless Message (No Threat Detected)' : (finalScore >= 80 ? '🔴 Supreme Lethality Trap' : (finalScore >= 60 ? '🟡 Tactical Phishing Vector' : '🟢 Moderate Social Engineering')),
      triggersExploited: isHarmless ? ['None (Friendly Casual Message)'] : triggers,
      forensicAnalysis: isHarmless 
        ? `This looks like a friendly, completely harmless greeting or casual conversation! It does not contain any urgency, scare tactics, links, or financial demands typical of social engineering attackers.`
        : `This trap attempts to exploit ${triggers.length} psychological vulnerability vector(s) targeting the ${persona || 'Target'} persona.`,
      ethicalFlipChallenge: {
        prompt: "Now flip your mindset! As a cyber defender, evaluate how a vigilant citizen analyzes this text.",
        redFlagsToSpot: isHarmless ? [
          "No threatening or urgent language present",
          "No request for sensitive credentials or money",
          "No external phishing links or spoofed numbers"
        ] : [
          "Unverified external sender or contact vector",
          "Artificial emotional pressure or urgency",
          "Demands sensitive action or financial transfer"
        ]
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 });
  }
}
