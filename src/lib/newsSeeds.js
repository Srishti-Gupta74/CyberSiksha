// Hardcoded curated Indian cyber crime dispatches for 100% reliable fallbacks
export const CURATED_NEWS_SEEDS = [
  {
    id: "seed-1",
    title: "CBI Intercepts Massive 'Digital Arrest' Syndicates in NCR",
    date: "June 26, 2026",
    source: "CERT-In National Advisory",
    category: "Spoofed Video Interrogation",
    summary: "Fraudsters impersonating Supreme Court judges and CBI officers on Skype are placing retired citizens under fake 'digital arrest' demanding instant crypto bail bonds.",
    protection: [
      "No Indian law enforcement agency conducts interrogation or arrest via Skype/WhatsApp video call.",
      "Never transfer funds to personal or unverified accounts under threat of immediate arrest.",
      "Immediately disconnect the call and dial 1930 National Cyber Helpline."
    ],
    challengeQuestion: "If a caller claims to be a CBI officer demanding Skype screen share for a warrant, what should you do?",
    challengeOptions: [
      "Share your screen to prove innocence",
      "Transfer ₹50,000 refundable security deposit",
      "Hang up immediately and dial 1930"
    ],
    correctOptionIndex: 2
  },
  {
    id: "seed-2",
    title: "RBI issues Urgent Alert on Spoofed APK Banking Apps",
    date: "June 25, 2026",
    source: "RBI Financial Typology Report",
    category: "Malicious APK Trojan",
    summary: "Cyber criminals are circulating fake SBI and HDFC credit card reward redemption APK files via WhatsApp that secretly intercept OTP SMS messages.",
    protection: [
      "Never download banking or payment applications from third-party APK links or WhatsApp attachments.",
      "Disable 'Install Unknown Apps' in your Android mobile security settings.",
      "Verify app publisher certificates strictly on Google Play Store or Apple App Store."
    ],
    challengeQuestion: "You receive a WhatsApp message with an APK file claiming to unlock 5,000 HDFC reward points. Your immediate action?",
    challengeOptions: [
      "Download and install the APK to claim points",
      "Forward to family groups so everyone wins",
      "Delete the message and block the sender handle"
    ],
    correctOptionIndex: 2
  },
  {
    id: "seed-3",
    title: "TRAI Chakshu Portal records 200% surge in FedEx Impersonation Calls",
    date: "June 24, 2026",
    source: "I4C Annual Dispatch",
    category: "Courier Narcotic Extortion",
    summary: "Victims receive automated IVR calls claiming a FedEx parcel containing illegal narcotics addressed to their Aadhaar card was intercepted at Mumbai Customs.",
    protection: [
      "Courier companies never connect calls directly to police officers or narcotics bureaus.",
      "Do not confirm your Aadhaar number or passport digits to automated voice recordings.",
      "Report spoofed international numbers directly on sancharsathi.gov.in Chakshu portal."
    ],
    challengeQuestion: "An automated call claims your FedEx parcel has contraband narcotics and press 1 to speak to Customs. What is the safe protocol?",
    challengeOptions: [
      "Press 1 and give your bank digits for verification",
      "Disconnect immediately and report on Chakshu portal",
      "Stay on the line and argue with the automated bot"
    ],
    correctOptionIndex: 1
  }
];
