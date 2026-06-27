"use client";

import { useState } from 'react';
import { ShieldAlert, PhoneCall, Video, MessageSquare, Zap, CheckCircle2, XCircle, ArrowRight, RefreshCw, Sparkles, Award, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import DigitalArrestSim from './DigitalArrestSim';
import TextReveal from './TextReveal';

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
    <div className="space-y-12 font-mono animate-fade-in select-none">
      
      {/* Noir Hero Header (Exact Screenshot 1 Match) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pb-8 border-b border-white/10">
        <div>
          <span className="bg-rose-600 text-white font-black font-mono text-[10px] px-3 py-1 uppercase tracking-widest inline-block mb-4 rounded-sm shadow">
            INTERACTIVE THREAT SIMULATOR ARENA
          </span>
          <h2 className="text-5xl sm:text-8xl font-black font-['Outfit'] uppercase leading-[0.85] tracking-tight text-white">
            SCAM <br /><span className="text-cyan-400">STORYLINES</span>
          </h2>
          <TextReveal 
            text="Immerse yourself in India-specific cyber threat vectors. Make split-second decisions to survive high-lethality social engineering attacks." 
            className="text-slate-300 text-base sm:text-lg font-sans mt-6 max-w-xl leading-relaxed font-semibold"
          />
        </div>

        <div className="lg:border-l lg:border-white/10 lg:pl-12 flex flex-col justify-center shrink-0">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">COMBAT XP SCORE</span>
          <div className="text-6xl sm:text-8xl font-black font-['Outfit'] text-cyan-400 leading-none">
            {score.toString().padStart(2, '0')}
          </div>
          <span className="text-xs font-mono text-cyan-400 flex items-center gap-2 mt-3 font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            {completedSims.length} SCENARIOS COMPLETED
          </span>
        </div>
      </div>

      {/* 4 Cards Grid on Top (Exact Screenshot 1 Match) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SIMULATIONS_DATA.map((sim) => {
          const isSelected = selectedSim.id === sim.id;
          const isDone = completedSims.includes(sim.id);
          const stepCount = sim.steps ? sim.steps.length : 1;
          const currentStepStr = isSelected ? `0${currentStepIdx + 1}/0${stepCount}` : `01/0${stepCount}`;

          return (
            <div
              key={sim.id}
              onClick={() => handleSelectSim(sim)}
              className={`p-5 rounded-xl transition-all cursor-pointer flex flex-col justify-between min-h-[150px] relative overflow-hidden ${
                isSelected
                  ? "bg-[#18181b] border-2 border-cyan-400 shadow-[0_4px_30px_rgba(34,211,238,0.2)] scale-102"
                  : "bg-[#121214] border border-white/10 hover:border-white/25 hover:bg-[#161618]"
              }`}
            >
              <div className="flex justify-between items-center text-xs font-mono font-bold">
                <span className={isSelected ? "text-cyan-400" : "text-slate-500"}>
                  {isSelected ? "[ IN-PROGRESS ]" : isDone ? "[ MASTERED ]" : "[ STANDBY ]"}
                </span>
                <span className="text-slate-400">{currentStepStr}</span>
              </div>

              <h4 className="text-sm sm:text-base font-black font-['Outfit'] text-white uppercase leading-snug my-4">
                {sim.title}
              </h4>

              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <span className="text-rose-500 text-[10px] font-mono font-bold uppercase tracking-wider">
                  {sim.difficulty.replace(/[^\w\s]/gi, '').trim() || 'HIGH LETHALITY'}
                </span>
                {isDone && <CheckCircle2 size={16} className="text-emerald-400" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cinematic Noir Split Console (Exact Screenshot 1 & 2 Match) */}
      <div id="gameplay-arena" className="scroll-mt-28 pt-2">
        {selectedSim.isLegacySim ? (
          <div className="bg-[#121214] border border-white/15 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-fade-in">
            {/* Far Left Vertical Strip (1 Col) */}
            <div className="hidden lg:flex lg:col-span-1 border-r border-white/10 flex-col justify-between items-center py-8 px-2 bg-black/40 text-slate-500 font-mono select-none">
              <div 
                className="text-[10px] font-bold tracking-widest uppercase py-4"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                THREAT_ID: DIGITAL_ARREST_CBI
              </div>
              <div className="text-rose-500 font-black text-lg tracking-widest animate-pulse">
                !!!
              </div>
            </div>

            {/* Main Noir Content Area (11 Cols) */}
            <div className="lg:col-span-11 bg-[#141416]">
              <DigitalArrestSim />
            </div>
          </div>
        ) : (
          <div className="bg-[#121214] border border-white/15 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-fade-in min-h-[720px]">
            
            {/* Far Left Vertical Strip (1 Col) */}
            <div className="hidden lg:flex lg:col-span-1 border-r border-white/10 flex-col justify-between items-center py-8 px-2 bg-black/40 text-slate-500 font-mono select-none">
              <div 
                className="text-[10px] font-bold tracking-widest uppercase py-4"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                THREAT_ID: {selectedSim.id.toUpperCase()}_TAIWAN
              </div>
              <div className="text-rose-500 font-black text-lg tracking-widest animate-pulse">
                !!!
              </div>
            </div>

            {/* Left Main Panel (6 Cols) */}
            <div className="lg:col-span-6 p-6 sm:p-12 flex flex-col space-y-8 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#141416]">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="border border-rose-500/60 text-rose-500 text-xs font-mono font-bold px-2.5 py-1 uppercase rounded-sm">
                    {selectedSim.difficulty.replace(/[^\w\s]/gi, '').trim() || 'HIGH LETHALITY'}
                  </span>
                  <span className="text-slate-400 font-mono text-xs font-bold">
                    STEP 0{currentStepIdx + 1} OF 0{selectedSim.steps.length}
                  </span>
                </div>

                <h3 className="text-4xl sm:text-6xl font-black font-['Outfit'] text-white uppercase leading-[0.9] tracking-tight mb-8">
                  {selectedSim.title}
                </h3>
              </div>

              <div>
                <span className="text-slate-400 font-mono text-xs font-bold tracking-widest block mb-4">
                  [ INCOMING TRANSMISSION ]
                </span>

                {/* Stack Intro and Quote Box vertically with full comfortable width */}
                {(() => {
                  const introParts = selectedSim.storyIntro ? selectedSim.storyIntro.split('\n\n') : [];
                  if (introParts.length > 1) {
                    return (
                      <div className="space-y-6">
                        <TextReveal 
                          text={introParts[0]} 
                          className="text-slate-100 text-base sm:text-lg leading-relaxed font-sans font-semibold"
                        />
                        <div className="bg-[#082f33] border-l-4 border-cyan-400 p-6 rounded-2xl shadow-lg">
                          <TextReveal 
                            text={introParts[1]} 
                            className="text-cyan-200 font-sans font-bold text-base sm:text-lg leading-relaxed"
                          />
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="bg-[#082f33] border-l-4 border-cyan-400 p-6 rounded-2xl shadow-lg">
                      <TextReveal 
                        text={selectedSim.storyIntro} 
                        className="text-cyan-200 font-sans font-bold text-base sm:text-lg leading-relaxed"
                      />
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Right Panel (5 Cols) */}
            <div className="lg:col-span-5 p-6 sm:p-12 bg-[#0e0e10] flex flex-col space-y-6 min-h-[600px]">
              {(() => {
                const step = selectedSim.steps[currentStepIdx];
                return (
                  <div className="flex flex-col flex-1">
                    <div>
                      <h4 className="text-cyan-300 font-black font-['Outfit'] text-2xl sm:text-3xl uppercase leading-snug tracking-wide mb-8">
                        {step.question}
                      </h4>

                      {/* Options stacked vertically with consistent border thickness (border-2) */}
                      <div className="space-y-4">
                        {step.options.map((opt, idx) => {
                          const isSelected = selectedOptionIdx === idx;
                          let cardStyle = "bg-[#18181b] border-2 border-white/10 hover:border-white/30 text-slate-100";
                          let badgeStyle = "text-slate-400";
                          
                          if (isAnswered) {
                            if (opt.isCorrect) {
                              cardStyle = "bg-emerald-950/90 border-2 border-emerald-400 text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.25)]";
                              badgeStyle = "text-emerald-400 font-black";
                            } else if (isSelected && !opt.isCorrect) {
                              cardStyle = "bg-rose-950/90 border-2 border-rose-500 text-rose-100 shadow-[0_0_25px_rgba(244,63,94,0.25)]";
                              badgeStyle = "text-rose-400 font-black";
                            } else {
                              cardStyle = "bg-[#18181b]/30 border-2 border-white/5 text-slate-500 opacity-40";
                            }
                          } else if (isSelected) {
                            cardStyle = "bg-cyan-950/80 border-2 border-cyan-400 text-white shadow-lg";
                            badgeStyle = "text-cyan-400 font-black";
                          }

                          return (
                            <div
                              key={idx}
                              onClick={() => handleChooseOption(idx, opt.isCorrect)}
                              className={`p-6 sm:p-7 rounded-2xl transition-all cursor-pointer flex items-start gap-5 relative group shadow-md ${cardStyle}`}
                            >
                              <span className={`font-mono text-2xl sm:text-3xl font-black pt-0.5 shrink-0 ${badgeStyle}`}>
                                {idx === 0 ? 'A' : 'B'}
                              </span>
                              <div className="flex-1">
                                <p className="text-base sm:text-xl font-bold leading-relaxed font-sans text-white">
                                  {opt.text}
                                </p>
                              </div>

                              {isAnswered && (isSelected || opt.isCorrect) && (
                                <div className="shrink-0 pt-0.5 animate-fade-in">
                                  {opt.isCorrect ? <CheckCircle2 size={24} className="text-emerald-400" /> : <XCircle size={24} className="text-rose-400" />}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Reserved Feedback & Action Area to prevent abrupt layout jumping */}
                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col justify-between gap-6 min-h-[160px]">
                      {isAnswered ? (
                        <div className="font-mono text-xs sm:text-sm font-bold text-slate-200 animate-fade-in">
                          {step.options[selectedOptionIdx] && (
                            <p className="leading-relaxed bg-white/[0.04] p-4 rounded-xl border border-white/10 text-cyan-200">
                              💡 {step.options[selectedOptionIdx].feedback}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="font-mono text-xs text-slate-500 italic flex items-center gap-2">
                          <span>⚡ Select an option above to trigger forensic AI evaluation...</span>
                        </div>
                      )}

                      {isAnswered && (
                        <div className="flex justify-end animate-fade-in">
                          <button
                            onClick={handleNextStep}
                            className="btn-primary py-4 px-8 text-sm sm:text-base font-black flex items-center gap-3 shadow-[0_0_25px_rgba(34,211,238,0.5)] cursor-pointer rounded-xl font-mono uppercase tracking-wider hover:scale-105 transition-transform"
                          >
                            <span>{currentStepIdx < selectedSim.steps.length - 1 ? "Next Decision Step ➔" : "Complete Scenario 🏆"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
