// Pre-curated defanged fake-but-realistic phishing URL patterns
// Note: Uses [.] instead of . so they are NEVER accidentally clickable
export const PHISH_SEEDS = [
  { url: "sbi-kyc-verify-now[.]in", vector: "Bank KYC SMS", target: "Elderly Grandfather", redFlags: ["Urgent Account Freeze Threat", "Unofficial Shortened URL", "Generic Customer Greeting"] },
  { url: "uidai-aadhar-link-urgently[.]com", vector: "Aadhaar Biometric Update", target: "General Citizen", redFlags: ["Fear of SIM Disconnection", "Non-gov Domain (.com)", "24-Hour Expiry Ultimatum"] },
  { url: "pm-kisan-samman-claim[.]net", vector: "Government Direct Benefit Scheme", target: "Rural Farmer", redFlags: ["Unsolicited Grant Notification", "Fake Payment Processing Fee Request", "Poor Grammar & Syntax"] },
  { url: "iphone15-pro-winner-tatacliq[.]co", vector: "Fake Luxury Lottery", target: "Teen / Student", redFlags: ["Unrealistic Giveaway Claim", "Demands UPI PIN to Receive Prize", "WhatsApp Only Contact Vector"] },
  { url: "cbi-digital-arrest-warrant[.]org", vector: "Spoofed Law Enforcement Video Call", target: "Retired Pensioner", redFlags: ["Threat of Immediate Police Raid", "Demands Secret Skype Interrogation", "Requests Bail Money Transfer via Crypto"] },
  { url: "hdfc-reward-points-expire[.]xyz", vector: "Credit Card Reward Redemption", target: "Corporate Employee", redFlags: ["Suspicious Domain (.xyz)", "Demands OTP Verification on Web Form", "High Pressure Countdown Timer"] },
  { url: "amazon-wfh-parttime-job[.]top", vector: "Work From Home Task Recruitment", target: "Job Seeking Graduate", redFlags: ["No Interview Required", "Demands Initial ₹999 Activation Deposit", "Promised ₹5000 Daily Returns"] },
  { url: "irctc-tatkal-refund-portal[.]info", vector: "Railway Ticket Refund Fraud", target: "Traveler", redFlags: ["Fake Customer Care App Download Request", "Demands Screen Share via Anydesk", "Unofficial Portal URL"] },
  { url: "paytm-cashback-scratchcard[.]me", vector: "Digital Wallet Reward Trap", target: "Young Adult", redFlags: ["Scan QR to Receive Money Lie", "Requests UPI PIN Input", "Unverified Merchant Handle"] },
  { url: "income-tax-refund-approved[.]in", vector: "IT Department Tax Rebate", target: "Taxpayer", redFlags: ["Demands Bank Account Verification Link Click", "Impersonates Gov Emblem", "Urgent Refund Expiration Notice"] }
];
