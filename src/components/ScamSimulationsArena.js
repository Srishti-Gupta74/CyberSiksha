"use client";

import { useState } from 'react';
import { ShieldAlert, PhoneCall, Video, MessageSquare, Zap, CheckCircle2, XCircle, ArrowRight, RefreshCw, Sparkles, Award, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import DigitalArrestSim from './DigitalArrestSim';

const SIMULATIONS_DATA = [
  {
    id: "customs_call",
    title: "The FedEx / Customs Narcotics Parcel Call",
    category: "📞 Automated IVR Threat Call",
    difficulty: "🔴 HIGH LETHALITY",
    icon: "📦",
    color: "#f43f5e",
    storyIntro: "It is 11:30 AM on a normal weekday. Your mobile phone rings from an unfamiliar +91 number. You pick up, and an automated IVR robotic voice states:\n\n'This is Mumbai Customs. Your FedEx parcel tracking #DEL-8834 bound for Taiwan has been intercepted. Inside, 5 expired passports, 4 bank cards, and 200g of MDMA narcotics were found. An arrest warrant has been issued. Press 1 to connect to the cyber narcotics officer immediately.'",
    steps: [
      {
        question: "Your heart starts racing. You never sent any parcel to Taiwan. What is your immediate reaction?",
        options: [
          {
            text: "Press 1 to connect with the officer and explain that someone misused your identity.",
            isCorrect: false,
            feedback: "❌ WRONG DECISION! Pressing 1 connects you directly to scam call center operatives disguised as police. They will manipulate your fear, claim your Aadhaar is compromised, and initiate a fake interrogation."
          },
          {
            text: "Hang up immediately without pressing anything. Check official courier tracking independently if concerned.",
            isCorrect: true,
            feedback: "✅ SPOT ON! Official Customs or police never send automated IVR calls threatening arrest or demanding button presses. Hanging up neutralizes the scam instantly."
          }
        ]
      },
      {
        question: "Suppose you stayed on the line. A man claiming to be 'CBI Inspector Vikram' threatens non-bailable arrest unless you immediately join a Skype video interrogation and lock yourself in a room away from family.",
        options: [
          {
            text: "Refuse the Skype call and state clearly: 'Indian law enforcement never conducts official interrogations via Skype or WhatsApp.'",
            isCorrect: true,
            feedback: "✅ BRILLIANT DEFENSE! The Supreme Court and Ministry of Home Affairs have officially clarified that Indian law enforcement NEVER conducts interrogations or issues warrants via video calls."
          },
          {
            text: "Lock the door and join Skype out of fear so they don't dispatch police to your house.",
            isCorrect: false,
            feedback: "❌ FATAL MISTAKE! Isolating victims from family advice is the primary psychological weapon of digital arrest scammers."
          }
        ]
      },
      {
        question: "Finally, the fake inspector offers a 'secret compromise': transfer ₹50,000 to an 'RBI Supervision Account' for 2 hours to verify your bank balance is clean of drug money.",
        options: [
          {
            text: "Transfer the ₹50,000 to prove your bank accounts are clean.",
            isCorrect: false,
            feedback: "❌ TRAP SPRUNG! There is no such thing as an 'RBI Secret Verification Account'. Money transferred here goes straight into mule accounts and cryptocurrency."
          },
          {
            text: "Refuse any transfer, disconnect immediately, call 1930 Cyber Helpline, and report on cybercrime.gov.in.",
            isCorrect: true,
            feedback: "✅ MASTER GUARDIAN! You protected your life savings and maintained complete forensic composure under pressure!"
          }
        ]
      }
    ]
  },
  {
    id: "digital_arrest_legacy",
    title: "CBI / Supreme Court Digital Arrest Interrogation",
    category: "🚨 Live Video Interrogation Sim",
    difficulty: "🔴 EXTREME VECTOR",
    icon: "👮‍♂️",
    color: "#a855f7",
    isLegacySim: true
  },
  {
    id: "whatsapp_job",
    title: "WhatsApp Part-Time 'YouTube Trailer Like' Scam",
    category: "💬 Telegram Task Trap",
    difficulty: "🟠 MODERATE TRAP",
    icon: "💸",
    color: "#22d3ee",
    storyIntro: "A casual message pops up on your WhatsApp from 'Priya Sharma (HR Coordinator)':\n\n'Hello! Our digital marketing agency is hiring part-time remote promoters. You just need to watch and like 3 movie trailers on YouTube to earn ₹150 per video. Daily earning ₹1,500 to ₹3,000. Are you interested?'\n\nYou test it out, like 3 videos, send a screenshot, and within 10 minutes, they actually deposit ₹450 into your UPI bank account!",
    steps: [
      {
        question: "They just sent real money (₹450) into your account! Next, they add you to a 'VIP Telegram Task Group' where tasks pay even more. How do you evaluate this?",
        options: [
          {
            text: "They proved they are genuine by paying ₹450 upfront. Join the VIP group eagerly!",
            isCorrect: false,
            feedback: "❌ BAIT SWALLOWED! This ₹450 is 'Bait Money' paid out of scam syndicates' marketing budgets to build blind trust before springing the major trap."
          },
          {
            text: "Take the ₹450 bait money, block the WhatsApp contact and Telegram group immediately, and stop engaging.",
            isCorrect: true,
            feedback: "✅ PERFECT REACTION! Experienced citizens know that fraudsters pay initial bait rewards to hook victims into depositing thousands later."
          }
        ]
      },
      {
        question: "In the Telegram group, the admin announces a 'Prepaid Merchant Task': Deposit ₹5,000 into a given UPI ID to unlock a special ₹8,500 crypto return payout within 30 minutes.",
        options: [
          {
            text: "Recognize the 'Prepaid Task Scam' pattern, refuse any deposit, and report the group.",
            isCorrect: true,
            feedback: "✅ SHIELD ACTIVATED! No legitimate employer in the world asks employees to deposit personal money to receive salary or commissions."
          },
          {
            text: "Deposit ₹5,000 assuming you will get back ₹8,500 just like the earlier ₹450 payout.",
            isCorrect: false,
            feedback: "❌ FINANCIAL LOSS TRIGGERED! Once you deposit ₹5,000, they will claim your 'task score froze' and demand ₹20,000 more to unfreeze your money."
          }
        ]
      }
    ]
  },
  {
    id: "electricity_cut",
    title: "Electricity Board 'Tonight 9:30 PM Power Cut' SMS",
    category: "⚡ Urgent SMS Phishing",
    difficulty: "🟡 TARGETS ELDERS",
    icon: "💡",
    color: "#eab308",
    storyIntro: "It is 8:15 PM. Your elderly father receives an urgent SMS on his phone:\n\n'Dear Customer your Electricity power will be disconnected tonight at 9:30 PM from electricity officer because your previous month bill was not updated in server. Call Electricity helpline immediately at mobile # 9876543210.'",
    steps: [
      {
        question: "Your father is panicked about spending the night without electricity or air conditioning. What is your advice?",
        options: [
          {
            text: "Call the mobile number in the SMS immediately to verify if the bill payment failed.",
            isCorrect: false,
            feedback: "❌ TRAP ACTIVATED! Calling that mobile number connects to a fraudster who will convince your father to download 'AnyDesk' or 'TeamViewer' screen-sharing APKs."
          },
          {
            text: "Calm your father down. Explain that government electricity boards NEVER send disconnection notices from personal 10-digit mobile numbers.",
            isCorrect: true,
            feedback: "✅ EXCELLENT ADVICE! State electricity boards use verified sender IDs (like AD-BESCOM or JD-TATA) and never give personal mobile numbers for billing verification."
          }
        ]
      },
      {
        question: "To double check, how should you verify the true status of your electricity bill?",
        options: [
          {
            text: "Open the official State Electricity portal or trusted utility apps (Google Pay / Paytm / Cred) directly.",
            isCorrect: true,
            feedback: "✅ VERIFIED METHOD! Independent verification through official portals guarantees authentic account status."
          },
          {
            text: "Click the shortened bit.ly link provided in a follow-up WhatsApp message.",
            isCorrect: false,
            feedback: "❌ PHISHING ALERT! Unverified shortened links lead to fake cloned payment gateways designed to harvest debit card PINs."
          }
        ]
      }
    ]
  }
];

export default function ScamSimulationsArena() {
  const [selectedSim, setSelectedSim] = useState(SIMULATIONS_DATA[0]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completedSims, setCompletedSims] = useState([]);

  const handleSelectSim = (sim) => {
    setSelectedSim(sim);
    setCurrentStepIdx(0);
    setSelectedOptionIdx(null);
    setIsAnswered(false);
    setTimeout(() => {
      const el = document.getElementById('gameplay-arena');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleChooseOption = (optIdx, isCorrect) => {
    if (isAnswered) return;
    setSelectedOptionIdx(optIdx);
    setIsAnswered(true);

    if (isCorrect) {
      setScore(prev => prev + 250);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    }
  };

  const handleNextStep = () => {
    if (currentStepIdx < selectedSim.steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      setSelectedOptionIdx(null);
      setIsAnswered(false);
    } else {
      if (!completedSims.includes(selectedSim.id)) {
        setCompletedSims(prev => [...prev, selectedSim.id]);
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      }
      alert(`🎉 Scenario Mastered! Total Resilience XP Earned: ${score + 300}`);
    }
  };

  return (
    <div className="space-y-10 font-mono animate-fade-in select-none">
      
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-10 bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 border-2 border-purple-500/80 shadow-[0_0_80px_rgba(168,85,247,0.25)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 px-3.5 py-1.5 rounded-full text-xs font-black text-purple-300 uppercase tracking-widest mb-3 shadow-md">
              <Sparkles size={16} className="text-cyan-400 animate-spin" /> Interactive Threat Simulator Arena
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white">
              Real-Life <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">Scam Storylines</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-sans mt-2 max-w-2xl">
              Immerse yourself in interactive India-specific cyber scam scenarios. Make split-second choices to learn right from wrong and armor your psychological reflexes!
            </p>
          </div>

          <div className="bg-slate-900/90 border border-cyan-400/40 p-5 rounded-3xl text-center shrink-0 shadow-xl">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Combat XP Score</span>
            <div className="text-3xl font-black font-['Outfit'] text-cyan-300 flex items-center justify-center gap-2">
              <Award size={28} className="text-amber-400 animate-bounce" /> {score} XP
            </div>
            <span className="text-[10px] text-emerald-400 font-bold block mt-1">✔ {completedSims.length} Scenarios Completed</span>
          </div>
        </div>

        {/* Scenario Selection Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
          {SIMULATIONS_DATA.map((sim) => {
            const isSelected = selectedSim.id === sim.id;
            const isDone = completedSims.includes(sim.id);
            return (
              <div
                key={sim.id}
                onClick={() => handleSelectSim(sim)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative group ${
                  isSelected 
                    ? "bg-slate-900 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)] scale-102" 
                    : "bg-slate-950/60 border-white/10 hover:border-white/30 hover:bg-slate-900/40"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-md group-hover:scale-110 transition-transform">
                      {sim.icon}
                    </span>
                    {isDone && (
                      <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1">
                        <CheckCircle2 size={12} /> Mastered
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{sim.category}</span>
                  <h4 className="text-sm font-black font-['Outfit'] text-white leading-snug">{sim.title}</h4>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[10px] font-black">
                    <span style={{ color: sim.color }}>{sim.difficulty}</span>
                    <span className="text-slate-400 font-mono">Step {isSelected ? currentStepIdx + 1 : 1}/{sim.steps ? sim.steps.length : 'Live'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSim(sim);
                    }}
                    className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                      isSelected ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-102" : "bg-white/10 hover:bg-cyan-500 hover:text-slate-950 text-white"
                    }`}
                  >
                    <span>{isSelected ? "⚡ Active Playing Below" : "▶ Launch Scenario"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Simulation Showcase Area */}
      <div id="gameplay-arena" className="scroll-mt-28">
      {selectedSim.isLegacySim ? (
        <div className="animate-fade-in">
          <DigitalArrestSim />
        </div>
      ) : (
        <div className="glass-card p-6 sm:p-10 bg-slate-950 border-2 border-cyan-400/80 shadow-[0_0_80px_rgba(34,211,238,0.2)] animate-fade-in">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-8 border-b border-white/10">
            <div>
              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-400" /> Scenario Storyline Arcade
              </span>
              <h3 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-white mt-1">{selectedSim.title}</h3>
            </div>
            <div className="bg-slate-900 px-4 py-2 rounded-2xl border border-white/10 text-xs font-bold text-slate-300">
              Step <span className="text-cyan-400 font-black text-sm">{currentStepIdx + 1}</span> of {selectedSim.steps.length}
            </div>
          </div>

          {/* Story Intro Box */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 p-6 rounded-3xl border border-purple-500/40 mb-8 shadow-inner">
            <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest block mb-2">📜 Situation Background:</span>
            <p className="text-xs sm:text-sm text-slate-200 font-sans whitespace-pre-line leading-relaxed">
              {selectedSim.storyIntro}
            </p>
          </div>

          {/* Interactive Question Step */}
          {(() => {
            const step = selectedSim.steps[currentStepIdx];
            return (
              <div className="space-y-6">
                <div className="bg-slate-900/80 p-6 rounded-3xl border border-cyan-400/30">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-2">❓ Critical Decision Point:</span>
                  <h4 className="text-base sm:text-lg font-black font-['Outfit'] text-white leading-relaxed">
                    {step.question}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {step.options.map((opt, idx) => {
                    const isSelected = selectedOptionIdx === idx;
                    let cardStyle = "bg-white/5 border-white/10 hover:border-white/30 text-slate-200";
                    
                    if (isAnswered) {
                      if (opt.isCorrect) {
                        cardStyle = "bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.2)]";
                      } else if (isSelected && !opt.isCorrect) {
                        cardStyle = "bg-rose-500/20 border-2 border-rose-500 text-rose-200 shadow-[0_0_30px_rgba(244,63,94,0.2)]";
                      } else {
                        cardStyle = "bg-white/5 border-white/5 text-slate-500 opacity-50";
                      }
                    } else if (isSelected) {
                      cardStyle = "bg-cyan-500/20 border-cyan-400 text-white";
                    }

                    return (
                      <div
                        key={idx}
                        onClick={() => handleChooseOption(idx, opt.isCorrect)}
                        className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between font-sans leading-relaxed relative group ${cardStyle}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-mono font-black text-xs shrink-0 mt-0.5">
                            {idx === 0 ? 'A' : 'B'}
                          </span>
                          <span className="text-sm font-bold">{opt.text}</span>
                        </div>

                        {isAnswered && (isSelected || opt.isCorrect) && (
                          <div className="mt-4 pt-4 border-t border-white/10 font-mono text-xs font-bold flex items-start gap-2">
                            {opt.isCorrect ? <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" /> : <XCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />}
                            <span>{opt.feedback}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="flex justify-end pt-6 animate-fade-in">
                    <button
                      onClick={handleNextStep}
                      className="btn-primary py-4 px-8 text-sm font-black flex items-center gap-3 shadow-[0_0_30px_rgba(34,211,238,0.5)] cursor-pointer"
                    >
                      <span>{currentStepIdx < selectedSim.steps.length - 1 ? "Next Decision Step ➔" : "Complete Scenario 🏆"}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

        </div>
      )}
      </div>

    </div>
  );
}
