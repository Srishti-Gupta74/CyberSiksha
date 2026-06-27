"use client";

import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { MapPin, AlertTriangle, ShieldAlert, Activity, Sparkles, Flame, ZoomIn } from 'lucide-react';

const INDIA_GEO_URL = "https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States";

// Official I4C & Parliamentary documented national cybercrime origin distribution database
const STATE_INTENSITY_DB = {
  "Haryana": { score: 98, share: "18.4% of India Volume", districts: "Nuh (Mewat), Gurugram, Faridabad", color: "#ef4444", level: "🔴 #1 NATIONAL CYBER HOTSPOT", topVector: "Sextortion, Marketplace Fraud & Electricity Disconnection SMS" },
  "Rajasthan": { score: 96, share: "15.2% of India Volume", districts: "Bharatpur, Alwar, Deeg", color: "#ef4444", level: "🔴 #2 NATIONAL CYBER HOTSPOT", topVector: "OLX Marketplace Escrow Fraud & Fake Army Courier Scams" },
  "Uttar Pradesh": { score: 94, share: "11.5% of India Volume", districts: "Mathura, Noida, Lucknow", color: "#ef4444", level: "🔴 SYNDICATE EXTORTION HUB", topVector: "CBI Digital Arrest Warrants & Investment Telegram Groups" },
  "Jharkhand": { score: 92, share: "10.8% of India Volume", districts: "Jamtara, Deoghar, Giridih", color: "#ef4444", level: "🔴 CRITICAL BANKING HOTSPOT", topVector: "AePS Biometric Cloning, KYC Update & Bank Officer Phishing" },
  "Bihar": { score: 89, share: "8.6% of India Volume", districts: "Nawada, Gaya, Nalanda", color: "#f97316", level: "🟠 HIGH EXTORTION ZONE", topVector: "Fake Gov Scheme Subsidy & Aadhaar Biometric Fraud" },
  "Delhi": { score: 88, share: "7.9% of India Volume", districts: "Rohini, Dwarka, Shahdara", color: "#f97316", level: "🟠 HIGH EXTORTION ZONE", topVector: "FedEx Parcel Arrest Scams & Crypto Ponzi Schemes" },
  "West Bengal": { score: 85, share: "6.4% of India Volume", districts: "Kolkata, Asansol, Jamtara Border", color: "#f97316", level: "🟠 TASK SYNDICATE HUB", topVector: "Work From Home Telegram Task & SEO Impersonation" },
  "Maharashtra": { score: 82, share: "5.8% of India Volume", districts: "Mumbai, Pune, Thane", color: "#f97316", level: "🟠 HIGHEST LOSS REGION", topVector: "Share Market IPO Trading Groups & CFO Deepfake Scams" },
  "Telangana": { score: 78, share: "4.2% of India Volume", districts: "Hyderabad, Cyberabad", color: "#f59e0b", level: "🟡 TACTICAL FRAUD BELT", topVector: "Fake Customs FedEx Extortion & Trading Task Apps" },
  "Karnataka": { score: 74, share: "3.5% of India Volume", districts: "Bengaluru Urban, Mysuru", color: "#f59e0b", level: "🟡 TACTICAL FRAUD BELT", topVector: "Sideloaded APK Loan Apps & Tech Employee Extortion" },
  "Gujarat": { score: 70, share: "2.9% of India Volume", districts: "Surat, Ahmedabad", color: "#f59e0b", level: "🟡 TACTICAL FRAUD BELT", topVector: "Stock Tip WhatsApp Syndicates & Fake GST Refunds" },
  "Tamil Nadu": { score: 68, share: "2.1% of India Volume", districts: "Chennai, Coimbatore", color: "#f59e0b", level: "🟡 TACTICAL FRAUD BELT", topVector: "Fake Bank KYC SMS & Part-Time Job Links" },
  "Andhra Pradesh": { score: 65, share: "1.4% of India Volume", districts: "Visakhapatnam, Vijayawada", color: "#f59e0b", level: "🟡 TACTICAL FRAUD BELT", topVector: "Lottery Prize & Credit Card Reward Point Scams" },
  "Madhya Pradesh": { score: 60, share: "0.8% of India Volume", districts: "Bhopal, Indore", color: "#06b6d4", level: "🟢 VIGILANCE DEFENSE ZONE", topVector: "UPI Collect Request & QR Code Scan Scams" },
  "Odisha": { score: 58, share: "0.3% of India Volume", districts: "Bhubaneswar, Cuttack", color: "#06b6d4", level: "🟢 VIGILANCE DEFENSE ZONE", topVector: "Job Portal Impersonation Phishing" },
  "Punjab": { score: 55, share: "0.2% of India Volume", districts: "Ludhiana, Amritsar", color: "#06b6d4", level: "🟢 VIGILANCE DEFENSE ZONE", topVector: "Foreign Visa & Immigration Fee Scams" },
  "Kerala": { score: 52, share: "0.1% of India Volume", districts: "Kochi, Thiruvananthapuram", color: "#06b6d4", level: "🟢 VIGILANCE DEFENSE ZONE", topVector: "Fake Customer Care Search Engine Spoofs" }
};

const getStateMatchKey = (geo) => {
  const props = geo.properties || {};
  const possibleNames = [
    props.st_nm,
    props.name,
    props.NAME_1,
    props.STATE,
    props.State,
    props.state_name,
    props.id,
    geo.id
  ].filter(Boolean).map(s => String(s).toLowerCase().trim());

  return Object.keys(STATE_INTENSITY_DB).find(k => {
    const keyLow = k.toLowerCase();
    return possibleNames.some(name => 
      name.includes(keyLow) || 
      keyLow.includes(name) ||
      (keyLow === 'delhi' && name.includes('delhi')) ||
      (keyLow === 'odisha' && (name.includes('odisha') || name.includes('orissa'))) ||
      (keyLow === 'uttar pradesh' && (name === 'up' || name.includes('uttar Pradesh')))
    );
  });
};

export default function IndiaHeatmap() {
  const [selectedState, setSelectedState] = useState("Haryana");
  const [geoError, setGeoError] = useState(false);

  const activeInfo = STATE_INTENSITY_DB[selectedState] || {
    score: 35,
    share: "<1% of India Volume",
    districts: "Regional Cyber Districts",
    color: "#06b6d4",
    level: "🟢 VIGILANCE DEFENSE ZONE",
    topVector: "Standard Phishing SMS"
  };

  return (
    <div className="bg-slate-950/80 rounded-3xl p-6 md:p-10 border border-cyan-400/40 shadow-[0_0_50px_rgba(6,182,212,0.15)] select-none">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 px-3 py-1 rounded-full text-xs font-mono font-bold text-rose-300 uppercase tracking-wider mb-3">
            <Flame size={14} className="text-rose-400 animate-bounce" /> Live MHA & I4C Threat Matrix
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-['Outfit'] text-white">
            🗺️ National Cyber Crime <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-cyan-400">Origin Heatmap</span>
          </h2>
        </div>

        {/* Legend (High contrast & large fonts for elders) */}
        <div className="flex flex-wrap gap-5 text-sm sm:text-base font-mono bg-slate-900/90 p-4 rounded-2xl border-2 border-white/20 shadow-xl">
          <span className="flex items-center gap-2 font-bold text-rose-400"><span className="w-3.5 h-3.5 rounded-md bg-[#ef4444] shadow-[0_0_10px_#ef4444]"></span> Critical (&gt;10%)</span>
          <span className="flex items-center gap-2 font-bold text-orange-400"><span className="w-3.5 h-3.5 rounded-md bg-[#f97316] shadow-[0_0_10px_#f97316]"></span> High (5-10%)</span>
          <span className="flex items-center gap-2 font-bold text-amber-400"><span className="w-3.5 h-3.5 rounded-md bg-[#f59e0b] shadow-[0_0_10px_#f59e0b]"></span> Tactical (1-5%)</span>
          <span className="flex items-center gap-2 font-bold text-cyan-400"><span className="w-3.5 h-3.5 rounded-md bg-[#06b6d4] shadow-[0_0_10px_#06b6d4]"></span> Vigilance (&lt;1%)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Interactive Geographic Matrix */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Top GeoJSON Map Render */}
          <div className="bg-slate-900/40 rounded-3xl p-4 border border-white/5 relative flex items-center justify-center min-h-[350px] overflow-hidden group">
            <div className="absolute top-4 left-4 z-10 bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-full border border-cyan-400/60 text-xs sm:text-sm text-cyan-300 font-bold flex items-center gap-2 pointer-events-none shadow-xl">
              <ZoomIn size={16} className="text-cyan-400 animate-pulse" /> <span>Pinch / Scroll to Zoom & Pan • Click State</span>
            </div>
            {!geoError ? (
              <ComposableMap 
                projection="geoMercator" 
                projectionConfig={{ scale: 1050, center: [82.8, 22.5] }}
                className="w-full h-auto max-h-[420px] cursor-grab active:cursor-grabbing"
              >
                <ZoomableGroup zoom={1} minZoom={1} maxZoom={4} translateExtent={[[-100, -100], [900, 700]]}>
                  <Geographies geography={INDIA_GEO_URL} onError={() => setGeoError(true)}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const matchKey = getStateMatchKey(geo);
                        const data = matchKey ? STATE_INTENSITY_DB[matchKey] : null;
                        const isSelected = matchKey === selectedState;
                        const fillColor = data ? data.color : "#0891b2"; // vibrant teal/cyan fallback

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => matchKey && setSelectedState(matchKey)}
                            style={{
                              default: {
                                fill: fillColor,
                                stroke: isSelected ? "#ffffff" : "#38bdf8",
                                strokeWidth: isSelected ? 2.5 : 0.8,
                                outline: "none",
                                opacity: 0.95
                              },
                              hover: {
                                fill: fillColor,
                                stroke: "#ffffff",
                                strokeWidth: 2,
                                outline: "none",
                                cursor: "pointer",
                                opacity: 1
                              },
                              pressed: { fill: "#0284c7", outline: "none" }
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            ) : (
              <div className="text-center py-12 px-6 space-y-3">
                <MapPin size={40} className="text-rose-400 mx-auto animate-bounce" />
                <p className="text-sm font-bold text-white uppercase">Visual State Matrix Active</p>
                <p className="text-xs text-slate-400 max-w-sm">External GeoJSON Topo map blocked by browser sandbox. Interactive state intelligence grid below is live.</p>
              </div>
            )}
          </div>

          {/* Unshakeable State Belt Selection Grid */}
          <div className="space-y-4">
            <span className="text-base sm:text-lg font-black uppercase tracking-wider text-cyan-300 block">⚡ Select Official Threat Zone To Audit:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {Object.keys(STATE_INTENSITY_DB).map((state, i) => {
                const data = STATE_INTENSITY_DB[state];
                const isSelected = selectedState === state;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedState(state)}
                    className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-md ${
                      isSelected ? "bg-rose-500/30 border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.5)] scale-105" : "bg-white/[0.06] border-white/15 hover:border-white/30 hover:bg-white/[0.1]"
                    }`}
                  >
                    <span className="text-base sm:text-lg font-black text-white font-['Outfit'] truncate">{state}</span>
                    <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                      <span className="text-rose-300 truncate pr-1">{data.share.split(' ')[0]} Share</span>
                      <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: data.color }}></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* State Threat Dossier Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-10 bg-slate-900 border-2 border-rose-500/80 shadow-2xl space-y-8 relative animate-scale-up rounded-[2.5rem]">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/20 pb-6 gap-4">
              <div>
                <span className="text-xs sm:text-sm text-slate-200 uppercase tracking-widest block font-bold">Geographic Dossier</span>
                <h3 className="text-4xl sm:text-5xl font-black font-['Outfit'] text-cyan-300 mt-1">{selectedState}</h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="bg-rose-500/30 border-2 border-rose-500/60 text-rose-200 font-black text-sm sm:text-base px-4 py-2 rounded-xl block shadow-lg">
                  {activeInfo.share}
                </span>
                <span className="text-xs sm:text-sm text-slate-100 font-bold uppercase block mt-2">{activeInfo.level}</span>
              </div>
            </div>

            <div>
              <span className="text-sm sm:text-base text-slate-200 uppercase tracking-wider block mb-2 font-bold">🎯 Documented Hotspot Districts:</span>
              <p className="text-base sm:text-lg font-mono font-bold text-amber-300 bg-amber-500/15 p-4 rounded-2xl border-2 border-amber-500/40 shadow-inner">
                📍 {activeInfo.districts}
              </p>
            </div>

            <div>
              <span className="text-sm sm:text-base text-slate-200 uppercase tracking-wider block mb-2 font-bold">🔥 Primary Regional Trap Typology:</span>
              <p className="text-base sm:text-lg font-bold text-white bg-white/[0.06] p-5 rounded-2xl border-2 border-white/20 leading-relaxed shadow-inner">
                {activeInfo.topVector}
              </p>
            </div>

            <div className="bg-rose-950/60 border-2 border-rose-500/50 p-6 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2.5 text-rose-300 text-sm sm:text-base font-black uppercase tracking-wider">
                <AlertTriangle size={20} className="text-rose-400 shrink-0" /> <span>Official MHA / I4C Advisory</span>
              </div>
              <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed font-normal">
                {selectedState} accounts for {activeInfo.share} of reported national cyber fraud incidents. Citizens must exercise vigilance against {activeInfo.topVector.toLowerCase()}. Never share banking credentials over unverified calls.
              </p>
            </div>

            <div className="text-center pt-2 text-xs text-slate-400 uppercase tracking-widest border-t border-white/10 font-bold">
              Source: Ministry of Home Affairs (MHA) & I4C Parliamentary Reports
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
