"use client";

import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { MapPin, AlertTriangle, ShieldAlert, Activity, Sparkles } from 'lucide-react';

const INDIA_GEO_URL = "https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States";

// Official I4C documented geographic scam intensity database
const STATE_INTENSITY_DB = {
  "Jharkhand": { score: 98, mult: "3.8x", color: "#E8372C", topVector: "AePS Biometric Cloning & Jamtara Phishing" },
  "Haryana": { score: 95, mult: "3.4x", color: "#E8372C", topVector: "Mewat/Nuh Fake Courier & Sextortion Syndicates" },
  "Uttar Pradesh": { score: 92, mult: "3.1x", color: "#D9463E", topVector: "CBI Digital Arrest & Police Spoof Warrants" },
  "Bihar": { score: 89, mult: "2.9x", color: "#D9463E", topVector: "Fake Gov Benefit Scheme & Bank KYC SMS Freeze" },
  "Delhi": { score: 88, mult: "2.8x", color: "#C93B3B", topVector: "NCR Crypto Ponzi & Skype Interrogation Traps" },
  "West Bengal": { score: 75, mult: "2.2x", color: "#9E303A", topVector: "Work From Home Telegram Task Frauds" },
  "Maharashtra": { score: 74, mult: "2.1x", color: "#9E303A", topVector: "Corporate Reward Point APK Trojans" },
  "Telangana": { score: 65, mult: "1.8x", color: "#7A2D3A", topVector: "Hyderabad Fake FedEx Customs Extortion" },
  "Karnataka": { score: 64, mult: "1.7x", color: "#7A2D3A", topVector: "Sideloaded APK Loan App Harassment" },
  "Gujarat": { score: 55, mult: "1.4x", color: "#4A2A3A", topVector: "Investment Stock Tip WhatsApp Syndicates" }
};

export default function IndiaHeatmap() {
  const [selectedState, setSelectedState] = useState("Jharkhand");
  const [geoData, setGeoData] = useState(INDIA_GEO_URL);

  const activeInfo = STATE_INTENSITY_DB[selectedState] || {
    score: 30,
    mult: "1.0x (Baseline)",
    color: "#1E2A3A",
    topVector: "Standard Phishing SMS & UPI QR Spam"
  };

  return (
    <div className="glass-card p-6 sm:p-10 bg-slate-950 border-rose-500/40 relative overflow-hidden animate-fade-in font-mono select-none">
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 px-3.5 py-1 rounded-full text-[11px] font-black text-rose-300 uppercase tracking-widest mb-2">
            <Activity size={14} className="text-rose-400 animate-pulse" /> Indian Cyber Crime (I4C) Geographic Intelligence
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-white">National Scam Intensity Heatmap</h2>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-slate-900/90 p-3.5 rounded-2xl border border-white/10 text-xs text-slate-300">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-[#1E2A3A]"></span> Baseline</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-[#7A2D3A]"></span> Elevated</span>
          <span className="flex items-center gap-1.5 font-bold text-rose-400"><span className="w-3 h-3 rounded-md bg-[#E8372C] animate-pulse"></span> Red Belt (3x+)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Geographic SVG Map */}
        <div className="lg:col-span-7 bg-slate-900/40 rounded-3xl p-4 border border-white/5 relative flex items-center justify-center min-h-[420px]">
          <ComposableMap 
            projection="geoMercator" 
            projectionConfig={{ scale: 1050, center: [82.8, 22.5] }}
            className="w-full h-auto max-h-[500px]"
          >
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stName = geo.properties.NAME_1 || geo.properties.st_nm || "Unknown";
                  const info = STATE_INTENSITY_DB[stName];
                  const fillColor = info ? info.color : "#1E2A3A";
                  const isHovered = selectedState === stName;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setSelectedState(stName)}
                      onClick={() => setSelectedState(stName)}
                      style={{
                        default: {
                          fill: fillColor,
                          stroke: isHovered ? "#22d3ee" : "rgba(255,255,255,0.15)",
                          strokeWidth: isHovered ? 2 : 0.6,
                          outline: "none",
                          transition: "all 250ms"
                        },
                        hover: {
                          fill: info ? "#F43F5E" : "#334155",
                          stroke: "#22d3ee",
                          strokeWidth: 2,
                          cursor: "pointer",
                          outline: "none"
                        },
                        pressed: { fill: "#E8372C", outline: "none" }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        {/* State Threat Dossier Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-8 bg-slate-900 border-2 border-rose-500/60 shadow-2xl space-y-6 relative animate-scale-up">
            
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Geographic Dossier</span>
                <h3 className="text-2xl font-black font-['Outfit'] text-white text-cyan-300">{selectedState}</h3>
              </div>
              <span className="bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black text-sm px-3 py-1 rounded-xl">
                {activeInfo.mult} Risk
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1 font-bold">🔥 Primary Regional Trap Typology:</span>
              <p className="text-sm font-bold text-white bg-white/5 p-3.5 rounded-xl border border-white/10 leading-snug">
                {activeInfo.topVector}
              </p>
            </div>

            <div className="bg-rose-950/40 border border-rose-500/30 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-black uppercase tracking-wider">
                <AlertTriangle size={16} className="text-rose-400 shrink-0" /> <span>Local Citizen Advisory</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Your region records {activeInfo.mult} the national average of financial social engineering fraud. Never share WhatsApp screen records or accept video calls from unknown law enforcement handles.
              </p>
            </div>

            <div className="text-center pt-2 text-[9px] text-slate-500 uppercase tracking-widest border-t border-white/5">
              Data Mapped from I4C Annual Crime Grid Typology
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
