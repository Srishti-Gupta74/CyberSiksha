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

    if (!message || message.trim().length < 5) {
      return NextResponse.json({ error: 'Message payload too short' }, { status: 400 });
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

    score = Math.min(98, Math.max(25, score));

    return NextResponse.json({
      lethalityScore: score,
      rating: score >= 80 ? '🔴 Supreme Lethality Trap' : (score >= 60 ? '🟡 Tactical Phishing Vector' : '🟢 Amateur Social Engineering'),
      triggersExploited: triggers.length > 0 ? triggers : ['Curiosity Vector'],
      forensicAnalysis: `Your trap exploited ${triggers.length || 1} core psychological vulnerability vectors targeting the ${persona || 'Target'} persona.`,
      ethicalFlipChallenge: {
        prompt: "Now flip your helmet! As a CyberCIA Forge Defender, spot the critical flaws in your own attack.",
        redFlagsToSpot: [
          "Unverified external contact vector",
          "Artificial urgency demanding immediate action",
          "Requests sensitive credential or financial transfer"
        ]
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 });
  }
}
