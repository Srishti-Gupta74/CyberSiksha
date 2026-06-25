// ============================================================
// CyberSiksha — Content Data
// All lessons, quizzes, and news articles as static data
// ============================================================

const LESSONS = [
  {
    id: 1,
    title: "What is Phishing?",
    category: "SMS Scams",
    icon: "📩",
    difficulty: "Beginner",
    duration: "3 min",
    content: [
      {
        type: "text",
        value: "Phishing is when a scammer pretends to be someone you trust — like your bank, the government, or a delivery company — to trick you into giving away your personal information."
      },
      {
        type: "example",
        value: "\"Dear customer, your SBI account will be blocked in 24 hours. Click here to verify your KYC: bit.ly/sbi-kyc-update\""
      },
      {
        type: "text",
        value: "This looks real, right? But notice the signs:\n• Banks NEVER send links via SMS to update KYC\n• The link uses 'bit.ly' — a URL shortener, not the official SBI website\n• It creates urgency (\"24 hours\") to make you panic and act fast"
      },
      {
        type: "tip",
        value: "If you get a message about your bank account, NEVER click the link. Instead, call your bank directly using the number on the back of your debit card."
      },
      {
        type: "text",
        value: "Think of phishing like a fake watchman wearing a real uniform. He looks official, but he's there to steal from you. The uniform is the fake message. Always verify the person behind it."
      }
    ],
    redFlags: [
      "Urgent language — \"Act now or lose access\"",
      "Shortened or suspicious links",
      "Asking for OTP, password, or PIN",
      "Generic greeting — \"Dear Customer\" instead of your name"
    ]
  },
  {
    id: 2,
    title: "UPI Fraud — Collect Request Scam",
    category: "UPI Scams",
    icon: "💸",
    difficulty: "Beginner",
    duration: "4 min",
    content: [
      {
        type: "text",
        value: "UPI (Unified Payments Interface) has made payments easy. But scammers use a trick most people don't know about: the COLLECT REQUEST."
      },
      {
        type: "text",
        value: "Here's how it works:\n1. You sell something on OLX or Quikr\n2. A 'buyer' calls and says \"I'll pay you right now via UPI\"\n3. Instead of SENDING money, they send a COLLECT REQUEST\n4. The notification looks like you're receiving money\n5. You enter your PIN thinking you're getting paid\n6. But you actually SENT them your money!"
      },
      {
        type: "example",
        value: "Scammer: \"Sir, I've sent ₹5,000 to your PhonePe. Please accept the request and enter your PIN.\"\n\nWhat actually happened: They sent a COLLECT request FOR ₹5,000 FROM your account."
      },
      {
        type: "tip",
        value: "Golden Rule: You NEVER need to enter your UPI PIN to RECEIVE money. If someone asks you to enter your PIN to receive payment — it's a scam. Always."
      },
      {
        type: "text",
        value: "Remember: Entering PIN = Money LEAVING your account. No exceptions."
      }
    ],
    redFlags: [
      "Someone asking you to enter PIN to 'receive' money",
      "Collect requests from unknown people",
      "Buyers who insist on paying immediately via UPI",
      "Anyone asking you to scan a QR code to receive money"
    ]
  },
  {
    id: 3,
    title: "The \"Digital Arrest\" Scam",
    category: "Call Scams",
    icon: "📞",
    difficulty: "Intermediate",
    duration: "5 min",
    content: [
      {
        type: "text",
        value: "This is one of India's fastest-growing scams. You receive a call from someone claiming to be from CBI, Police, or Narcotics department. They say a parcel with illegal drugs was found with your name on it, or your Aadhaar was used in a crime."
      },
      {
        type: "text",
        value: "How the scam unfolds:\n1. You get a call: \"This is from Mumbai Cyber Crime / CBI / Customs\"\n2. They say you're involved in a serious crime\n3. They may do a video call showing fake police uniforms\n4. They tell you you're under 'digital arrest' — you must stay on the call\n5. They say the only way to prove innocence is to transfer money to a 'verification account'\n6. They threaten jail time if you disconnect or tell anyone"
      },
      {
        type: "example",
        value: "\"This is Inspector Sharma from CBI. A parcel from China with 5kg drugs has your Aadhaar number. You are under digital arrest. Do not disconnect this call or we will send local police to arrest you.\""
      },
      {
        type: "tip",
        value: "There is NO legal concept called 'digital arrest' in India. Police CANNOT arrest you over a phone call. No government agency will ever ask you to transfer money to prove your innocence. HANG UP immediately."
      },
      {
        type: "text",
        value: "If you're scared, call 1930 (Cyber Crime Helpline) or visit your nearest police station. Real police come to your door — they don't call and ask for money."
      }
    ],
    redFlags: [
      "Claims of 'digital arrest' — no such thing exists",
      "Threats of immediate arrest over phone",
      "Asking to stay on call and not tell anyone",
      "Demanding money transfer to prove innocence",
      "Fake video calls with police uniforms"
    ]
  },
  {
    id: 4,
    title: "Fake Job Offer Scams",
    category: "Job Scams",
    icon: "💼",
    difficulty: "Beginner",
    duration: "3 min",
    content: [
      {
        type: "text",
        value: "With unemployment being a major concern, scammers prey on job seekers — especially young graduates and people looking for work-from-home opportunities."
      },
      {
        type: "text",
        value: "Common patterns:\n1. WhatsApp message: \"Earn ₹5,000-₹10,000 daily from home! Just like and review products.\"\n2. They ask you to 'invest' a small amount first (₹500-₹1,000) to 'activate your account'\n3. Initially you see fake profits in their app\n4. They ask you to invest more to 'unlock higher earnings'\n5. When you try to withdraw, your money is gone"
      },
      {
        type: "example",
        value: "\"Congratulations! You've been selected for a work-from-home position at Amazon/Flipkart. Salary: ₹25,000/month for 2 hours/day. Send ₹999 registration fee to start.\""
      },
      {
        type: "tip",
        value: "No legitimate company asks you to PAY to get a job. If a job sounds too good to be true — easy work, huge pay, no interview — it IS too good to be true."
      }
    ],
    redFlags: [
      "Jobs that require you to pay money first",
      "Unrealistic salary for simple tasks",
      "No formal interview process",
      "Communication only through WhatsApp/Telegram",
      "Pressure to 'invest' to earn more"
    ]
  },
  {
    id: 5,
    title: "Password Safety Basics",
    category: "Account Safety",
    icon: "🔐",
    difficulty: "Beginner",
    duration: "3 min",
    content: [
      {
        type: "text",
        value: "Your password is the lock on your digital life. But most people use locks that a thief can open in seconds."
      },
      {
        type: "text",
        value: "Most common passwords in India:\n• 123456\n• password\n• your name + birth year (rahul1990)\n• your phone number\n• india123\n\nAll of these can be cracked in less than 1 second."
      },
      {
        type: "text",
        value: "How to create a strong password:\n1. Make it at least 12 characters long\n2. Mix uppercase, lowercase, numbers, and symbols\n3. Use a passphrase: \"MyDogRaju@Ate3Rotis!\" — long, strong, and easy to remember\n4. Never use the same password for multiple accounts\n5. Never share your password with anyone — not even bank employees"
      },
      {
        type: "tip",
        value: "Think of passwords like toothbrushes: Don't share them, and change them regularly."
      },
      {
        type: "text",
        value: "What is 2FA (Two-Factor Authentication)?\nIt's like having two locks on your door. Even if someone guesses your password (first lock), they still need the OTP sent to your phone (second lock) to get in. Enable 2FA on all important accounts — email, banking, social media."
      }
    ],
    redFlags: [
      "Using the same password everywhere",
      "Passwords shorter than 8 characters",
      "Passwords containing your name, birthday, or phone number",
      "Sharing passwords over WhatsApp or SMS",
      "Not having 2FA enabled on important accounts"
    ]
  },
  {
    id: 6,
    title: "Fake Shopping & Lottery Scams",
    category: "Shopping Scams",
    icon: "🛒",
    difficulty: "Beginner",
    duration: "4 min",
    content: [
      {
        type: "text",
        value: "\"Congratulations! You've won an iPhone 15 Pro!\" or \"90% off on branded shoes — today only!\" — these are traps designed to steal your money or personal information."
      },
      {
        type: "text",
        value: "Types of shopping/lottery scams:\n\n1. Fake e-commerce sites that look like Amazon/Flipkart\n2. Instagram/Facebook ads for unbelievable deals\n3. WhatsApp forwards about free gifts from brands\n4. Fake lottery/lucky draw wins asking for 'processing fee'\n5. Fake traffic challan SMS with payment links"
      },
      {
        type: "example",
        value: "\"You have a pending traffic challan of ₹500. Pay immediately to avoid ₹2,000 fine: paytm.link/challan-pay\"\n\nReal traffic challans come from official government portals, not random SMS links."
      },
      {
        type: "tip",
        value: "If you didn't enter a contest, you can't win it. No company gives away iPhones to random people. Always check the website URL carefully — 'amaz0n.deals.com' is NOT Amazon."
      }
    ],
    redFlags: [
      "Deals that are too good to be true (90% off)",
      "Winning a contest you never entered",
      "Paying a 'processing fee' to claim a prize",
      "Websites with slightly misspelled brand names",
      "Payment only through UPI or direct transfer (no COD option)"
    ]
  },
  // ===================== NEW LESSONS (IDs 7–15) =====================
  {
    id: 7,
    title: "QR Code Scams",
    category: "QR Scams",
    icon: "📱",
    difficulty: "Beginner",
    duration: "3 min",
    content: [
      {
        type: "text",
        value: "QR codes are everywhere in India — chai stalls, auto-rickshaws, parking lots, restaurants. They make paying easy. But scammers have learned to exploit them. A fake QR code can empty your bank account in seconds."
      },
      {
        type: "text",
        value: "How QR scams work:\n1. Scammer pastes a fake QR code OVER the real one at a shop or parking meter\n2. You scan the QR code thinking you're paying the shopkeeper\n3. The QR actually sends money to the scammer's account\n4. Some QR codes redirect you to a phishing website that steals your banking details\n5. Others auto-fill a LARGE payment amount — you might approve ₹5,000 instead of ₹50"
      },
      {
        type: "example",
        value: "At a busy parking lot in Bangalore, scammers replaced the official parking QR stickers with their own. Over 200 people unknowingly paid ₹100-₹500 each to the scammer instead of the parking authority. In another case, a restaurant in Delhi found that someone had pasted a fake QR code on top of the real one on their table standees."
      },
      {
        type: "tip",
        value: "Before confirming any QR code payment, ALWAYS check the merchant name displayed on your payment screen. If you're paying a restaurant called 'Sharma Dhaba', the screen should show that name — not some random person's name. If the name looks wrong, STOP and pay by cash or ask for a fresh QR."
      },
      {
        type: "text",
        value: "Think of a QR code like a door. You can't see what's behind it until you scan it. Just like you wouldn't walk through a random door in an unfamiliar building, don't scan random QR codes — especially ones pasted on walls, poles, or sent via WhatsApp."
      },
      {
        type: "tip",
        value: "Never scan a QR code to RECEIVE money. QR codes are for PAYING, not receiving. If a buyer on OLX says 'Scan this QR to get your payment', it's a scam — the QR will TAKE money from you."
      }
    ],
    redFlags: [
      "QR code sticker looks pasted over another one",
      "Merchant name on payment screen doesn't match the shop",
      "Someone asks you to scan a QR code to RECEIVE money",
      "QR code sent via WhatsApp or SMS from an unknown number",
      "The payment amount auto-filled is different from what you expected"
    ]
  },
  {
    id: 8,
    title: "WhatsApp Scams & Forwarded Misinformation",
    category: "WhatsApp Scams",
    icon: "💬",
    difficulty: "Beginner",
    duration: "4 min",
    content: [
      {
        type: "text",
        value: "WhatsApp is India's most-used messaging app — over 50 crore Indians use it daily. Unfortunately, this also makes it the biggest platform for spreading scams. From fake government schemes to family impersonation, scammers have turned WhatsApp into their favourite hunting ground."
      },
      {
        type: "text",
        value: "The most common WhatsApp scams in India:\n\n1. Fake government scheme links — 'PM Kisan Yojana: Get ₹6,000 directly in your account. Register here.'\n2. 'Hi Mom/Dad' scam — Someone texts you from a new number pretending to be your child: 'Mummy, mera phone kharab ho gaya. Ye mera naya number hai. Mujhe ₹10,000 bhejo urgently.'\n3. Investment groups — You're added to a group with 'expert stock tips' that are actually pump-and-dump schemes\n4. Fake news forwards — 'RBI is withdrawing ₹500 notes from 1st July! Withdraw all your money NOW!'\n5. Prize/lottery messages — 'You've been selected for WhatsApp's annual lucky draw! Claim your ₹25 lakh.'"
      },
      {
        type: "example",
        value: "A forwarded message reads: \"URGENT: Government is giving ₹6,000 to all citizens under PM Digital India Scheme. Last date to register is tomorrow! Click here to apply: pmdigital-scheme.com\"\n\nThis is FAKE. There is no such scheme. The website will steal your Aadhaar, PAN, and bank details."
      },
      {
        type: "tip",
        value: "Before forwarding any message, ask yourself: 'Would the government/bank really announce something important via a WhatsApp forward?' The answer is always NO. Verify claims on PIB Fact Check (pibfactcheck.in) or call the organisation directly."
      },
      {
        type: "text",
        value: "The 'Hi Mom' scam is particularly dangerous because it exploits your love for your child. If you get a message from an unknown number claiming to be your son or daughter, DON'T send money. Instead, call their known number. Even if they say 'My phone is broken', try calling — if it rings, it's a scam."
      },
      {
        type: "tip",
        value: "Set up a secret family code word that only your family knows. If someone claims to be your family member from a new number, ask them the code word. A scammer won't know it."
      }
    ],
    redFlags: [
      "Messages that say 'Forward to 10 people to activate'",
      "Government scheme links that don't end in .gov.in or .nic.in",
      "Unknown numbers claiming to be family members asking for money",
      "WhatsApp groups promising stock tips or guaranteed investment returns",
      "Forwarded messages creating urgency — 'Last date tomorrow!'"
    ]
  },
  {
    id: 9,
    title: "SIM Swap Fraud",
    category: "Phone Scams",
    icon: "📶",
    difficulty: "Intermediate",
    duration: "5 min",
    content: [
      {
        type: "text",
        value: "Imagine waking up one morning to find your phone has no network. You think it's a tower issue. But a few hours later, you discover that ₹5 lakh has been transferred from your bank account. This is SIM Swap Fraud — one of the most devastating scams in India."
      },
      {
        type: "text",
        value: "How SIM Swap Fraud works:\n1. The scammer collects your personal information — name, phone number, Aadhaar, date of birth (often from social media or data leaks)\n2. They visit a telecom store or call customer care pretending to be YOU\n3. They say: 'I've lost my phone, please issue a new SIM for my number'\n4. The telecom company deactivates YOUR SIM and activates a new one for the scammer\n5. Now ALL your calls, SMS, and — most importantly — OTPs go to the scammer\n6. They log into your bank account, use the OTP to transfer money, and you have no idea until it's too late"
      },
      {
        type: "example",
        value: "A retired government officer in Hyderabad noticed his phone suddenly showed 'No Network' for 4 hours. By the time he visited his Airtel store, someone had already swapped his SIM and transferred ₹12 lakh from his SBI and HDFC accounts using the OTPs sent to the new SIM."
      },
      {
        type: "tip",
        value: "If your phone suddenly shows 'No Network' or 'SOS Only' for more than 30 minutes — and it's not a known network outage — treat it as an EMERGENCY. Immediately call your bank from another phone and freeze your accounts. Then visit your telecom store."
      },
      {
        type: "text",
        value: "How to protect yourself:\n• Set a SIM lock PIN on your phone (different from your screen lock)\n• Register for your bank's email alerts IN ADDITION to SMS alerts — if your SIM is swapped, you'll still get email notifications\n• Use app-based authentication (like Google Authenticator) instead of SMS OTP where possible\n• Never share your personal details like Aadhaar number on social media"
      },
      {
        type: "tip",
        value: "Call your telecom provider (Airtel: 121, Jio: 199, Vi: 199) and ask them to add extra verification for SIM replacement requests. Some providers allow you to set a special passphrase."
      }
    ],
    redFlags: [
      "Phone suddenly shows 'No Network' or 'SOS Only' unexpectedly",
      "You stop receiving calls and SMS without explanation",
      "You get a call or SMS about a SIM replacement you didn't request",
      "Unknown people asking for your telecom customer ID or Aadhaar details",
      "Bank transaction alerts arriving on email but not SMS"
    ]
  },
  {
    id: 10,
    title: "Investment & Crypto Trading Scams",
    category: "Investment Scams",
    icon: "📈",
    difficulty: "Intermediate",
    duration: "5 min",
    content: [
      {
        type: "text",
        value: "India has seen an explosion of investment scams — from fake stock trading apps to Telegram groups promising '50% monthly returns'. These scams target everyone from retired uncles looking to grow their savings to young professionals tempted by crypto riches."
      },
      {
        type: "text",
        value: "How investment scams typically work:\n1. You see an ad or get added to a WhatsApp/Telegram group with 'expert analysts'\n2. The group shows screenshots of huge profits — ₹10,000 turned into ₹1 lakh in a week\n3. They ask you to download a trading app (which is FAKE — not on Google Play or App Store)\n4. You invest a small amount — say ₹5,000 — and the app shows you've 'earned' ₹15,000\n5. You get excited and invest more — ₹50,000, ₹1 lakh, even borrowing from family\n6. When you try to withdraw, they say you need to 'pay taxes' or 'unlock your account' with more money\n7. Eventually, the app stops working, the group disappears, and your money is gone"
      },
      {
        type: "example",
        value: "A Telegram group called 'Bull Market India Pro 🚀' with 50,000 members promised guaranteed 40% monthly returns through 'AI-powered crypto trading'. Members had to invest minimum ₹25,000 through a custom app. The app showed fake profits for 3 months. When investors tried to withdraw, the app demanded a '20% tax payment' first. Those who paid the 'tax' got nothing. Total fraud: ₹47 crore."
      },
      {
        type: "tip",
        value: "If anyone promises returns greater than 15% per YEAR (not month!) without risk, it's almost certainly a scam. Even top mutual funds in India give 12-15% annual returns. No legitimate investment gives 50% per MONTH. That would make ₹1 lakh into ₹130 crore in 3 years — if that were real, everyone would be a billionaire."
      },
      {
        type: "text",
        value: "How to invest safely:\n• Only use SEBI-registered brokers (check: sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes)\n• Download trading apps only from Google Play Store or Apple App Store\n• Never invest through WhatsApp or Telegram groups\n• If a friend recommends an 'amazing' scheme, verify it independently — they might be a victim too\n• Remember: High return always means high risk. If there's no risk, there's no real return."
      },
      {
        type: "tip",
        value: "The golden rule of investing: 'If it sounds too good to be true, it IS too good to be true.' This is as old as the hills, and as true as ever."
      }
    ],
    redFlags: [
      "Guaranteed returns of more than 15% per month",
      "Trading apps not available on official app stores",
      "Pressure to invest more to 'unlock' withdrawals",
      "Screenshots of profits shared in WhatsApp/Telegram groups",
      "No SEBI registration number provided",
      "'Expert analysts' who won't share their real identity or SEBI credentials"
    ]
  },
  {
    id: 11,
    title: "Social Media Account Hacking",
    category: "Social Media Scams",
    icon: "📸",
    difficulty: "Intermediate",
    duration: "4 min",
    content: [
      {
        type: "text",
        value: "Your Instagram, Facebook, or Twitter account might seem like just a place for photos and memes. But for a scammer, a hacked social media account is a goldmine. They can use YOUR identity to scam YOUR friends and family — and everyone trusts the message because it comes from YOU."
      },
      {
        type: "text",
        value: "How scammers hack your social media accounts:\n1. Phishing DMs — A message from a 'friend' saying 'Is this you in this video? 😂' with a link. The link leads to a fake Instagram login page.\n2. Fake 'verification' — An email or DM saying 'Your account will be deleted unless you verify. Click here.' The 'verify' button leads to a phishing page.\n3. Third-party app permissions — You log into a random quiz app or 'See who viewed your profile' tool with your Instagram credentials. Now they have your password.\n4. Password reuse — If you use the same password on a hacked website and your Instagram, scammers try it automatically."
      },
      {
        type: "example",
        value: "Riya in Mumbai received a DM from her best friend's Instagram: 'Hey, can you vote for me in this contest? Just log in here: instagram-vote-contest.com.' Riya entered her credentials on what looked like Instagram's login page. Within minutes, scammers took over HER account and sent the same message to all 800 of her followers. They also messaged her close friends asking for emergency money transfers via UPI."
      },
      {
        type: "tip",
        value: "Enable Two-Factor Authentication (2FA) on ALL your social media accounts. Go to Settings → Security → Two-Factor Authentication. This means even if someone steals your password, they can't log in without the code sent to your phone."
      },
      {
        type: "text",
        value: "What to do if your account is hacked:\n1. Try to log in immediately and change your password\n2. If you can't log in, use the 'I've been hacked' option on the app's login page\n3. Tell your friends and family IMMEDIATELY (via phone call, not social media) so they don't fall for messages sent from your hacked account\n4. Check your email for 'password changed' notifications and use the 'revert this change' link\n5. Report the hacked account to the platform"
      },
      {
        type: "tip",
        value: "Use a unique, strong password for every social media account. If you can't remember them all, use a password manager app. Never reuse your email password on any other site."
      }
    ],
    redFlags: [
      "DMs with suspicious links — even from friends",
      "'Verify your account' messages with links outside the official app",
      "Login pages that don't have the correct URL (e.g., instagram-verify.com instead of instagram.com)",
      "Third-party apps asking for your social media password",
      "A friend's account suddenly sending unusual messages or money requests"
    ]
  },
  {
    id: 12,
    title: "Aadhaar & Identity Theft",
    category: "Identity Theft",
    icon: "🪪",
    difficulty: "Advanced",
    duration: "5 min",
    content: [
      {
        type: "text",
        value: "Your Aadhaar number is like your digital identity — it's linked to your bank account, your phone number, your PAN card, and many government services. If someone misuses your Aadhaar, they can open bank accounts, take loans, and even get SIM cards in YOUR name. You won't know until the damage is done."
      },
      {
        type: "text",
        value: "How Aadhaar fraud happens:\n1. Data leaks — Your Aadhaar number, name, and address leak from government databases or photocopied documents you submitted\n2. Biometric theft — At unauthorized 'Aadhaar centres', scammers secretly capture your fingerprints using hidden devices\n3. Fake e-KYC — Scammers use your leaked Aadhaar details to complete KYC for SIM cards, bank accounts, or loan apps\n4. Document fraud — Your Aadhaar photo shared on WhatsApp or email gets used to create fake documents"
      },
      {
        type: "example",
        value: "A vegetable vendor in Lucknow discovered that someone had taken a ₹2 lakh personal loan in his name using his Aadhaar details. He had given his Aadhaar photocopy at a mobile shop for a new SIM card 6 months earlier. The shop owner sold his details to a fraud ring that opened a bank account and took a loan — all in his name."
      },
      {
        type: "tip",
        value: "NEVER share your full Aadhaar card photo on WhatsApp, email, or social media. If you must share, use the 'Masked Aadhaar' option from the UIDAI website (uidai.gov.in) — it shows only the last 4 digits of your Aadhaar number."
      },
      {
        type: "text",
        value: "How to check if your Aadhaar has been misused:\n1. Visit myaadhaar.uidai.gov.in\n2. Log in with your Aadhaar number and OTP\n3. Go to 'Aadhaar Authentication History'\n4. Check if there are any authentications you don't recognize\n5. If you see unknown entries, file a complaint at UIDAI immediately"
      },
      {
        type: "tip",
        value: "Lock your Aadhaar biometrics RIGHT NOW. Go to myaadhaar.uidai.gov.in → 'Lock/Unlock Biometrics'. When biometrics are locked, nobody can use your fingerprint for any Aadhaar authentication. You can temporarily unlock it whenever YOU need to use it."
      }
    ],
    redFlags: [
      "Any phone call asking for your Aadhaar number or OTP for 'verification'",
      "Unauthorized Aadhaar authentication entries in your history",
      "Letters or calls about loans or accounts you never opened",
      "Requests to share Aadhaar photos via WhatsApp or email",
      "Unknown 'Aadhaar update centres' in markets or mobile shops"
    ]
  },
  {
    id: 13,
    title: "Predatory Loan Apps",
    category: "Loan Scams",
    icon: "🏦",
    difficulty: "Intermediate",
    duration: "5 min",
    content: [
      {
        type: "text",
        value: "Need ₹5,000 urgently? There are hundreds of apps promising 'instant loans' with 'no documents'. They sound helpful, but many of these loan apps are run by criminal gangs — and once they have your data, they can destroy your life."
      },
      {
        type: "text",
        value: "How predatory loan apps trap you:\n1. You download a loan app and get approved for ₹5,000 instantly\n2. But the app takes 'processing fees' — you receive only ₹3,500\n3. The repayment is ₹7,000 in 7 days — that's 300%+ annual interest!\n4. If you can't pay, they access your contacts (you gave permission during install)\n5. They call your family, friends, colleagues and say: 'Your son/daughter owes us money and is a defaulter'\n6. They morph your photos (taken from your gallery) into explicit images and threaten to send them to all your contacts\n7. Many victims have taken extreme steps due to the harassment"
      },
      {
        type: "example",
        value: "A college student in Chennai downloaded 'QuickCash' loan app and borrowed ₹3,000. Within a week, she owed ₹8,000. When she couldn't pay, the app operators called her parents, classmates, and professors claiming she was a 'fraud'. They created a morphed explicit photo and threatened to share it. Over 30 such apps were later banned by RBI, but not before thousands were harassed."
      },
      {
        type: "tip",
        value: "Before taking ANY loan, check if the company is registered with RBI. Visit rbi.org.in and search their list of registered NBFCs (Non-Banking Financial Companies). If the loan app isn't on this list, DON'T use it."
      },
      {
        type: "text",
        value: "What to do if you're already trapped:\n1. Don't panic — the harassment is illegal, not your fault\n2. File a complaint at cybercrime.gov.in and your nearest police station\n3. RBI has banned hundreds of these apps — you may not legally owe anything\n4. Call the RBI helpline at 14440\n5. Don't take another loan app's loan to pay off the first one — that's the debt trap"
      },
      {
        type: "tip",
        value: "When installing ANY app, be very careful about permissions. A loan app has NO reason to access your contacts, gallery, camera, or call logs. If it insists, it's a red flag. Legitimate banks (SBI, HDFC, ICICI) never ask for contact access for loans."
      }
    ],
    redFlags: [
      "Loan app not available on Google Play Store (sideloaded APK)",
      "App demands access to contacts, gallery, and camera",
      "Loan approved 'instantly' without any income verification",
      "Repayment amount is 2-3x the loan amount within days",
      "No RBI registration or NBFC license displayed in the app",
      "Threats and harassment when you can't repay on time"
    ]
  },
  {
    id: 14,
    title: "Romance & Matrimony Scams",
    category: "Romance Scams",
    icon: "💔",
    difficulty: "Advanced",
    duration: "5 min",
    content: [
      {
        type: "text",
        value: "Finding love or a life partner online is normal now — lakhs of Indians use Shaadi.com, Bharat Matrimony, Jeevansathi, and dating apps like Bumble and Hinge. But scammers are also on these platforms, playing the long game. They spend weeks or months building emotional trust before asking for money."
      },
      {
        type: "text",
        value: "How romance scams work:\n1. A scammer creates a fake profile — often claiming to be an NRI, military officer, or successful professional\n2. They match with you and start chatting regularly. They're charming, attentive, and say all the right things\n3. Over weeks, they build a deep emotional connection. They may even talk about marriage and meeting your family\n4. Then comes the 'crisis' — a medical emergency, a business problem, or visa fees\n5. They ask for money: 'I'll pay you back when I come to India'\n6. You send money because you trust them. They ask for more. Eventually, they disappear"
      },
      {
        type: "example",
        value: "A 45-year-old divorced woman in Pune met a man on Bharat Matrimony who claimed to be an Indian doctor in the UK. They chatted daily for 3 months. He talked about marriage and settling in India. Then he said his medical license renewal required ₹3 lakh and his bank account was 'frozen'. She sent the money via NEFT. He then asked for ₹5 lakh for 'flight tickets and visa fees'. After she sent a total of ₹11 lakh, he vanished. His photos were stolen from a real doctor's LinkedIn profile."
      },
      {
        type: "tip",
        value: "NEVER send money to someone you've only met online — no matter how much you trust them. If they truly love you, they'll understand. Anyone who stops talking to you because you won't send money was never interested in you — only in your money."
      },
      {
        type: "text",
        value: "How to verify an online match:\n• Reverse image search their profile photos on Google Images — scammers steal photos from other people's profiles\n• Insist on a video call — if they always have an excuse, it's suspicious\n• Ask specific questions about the city/country they claim to live in\n• NEVER share financial details, bank account info, or send OTPs\n• If they claim to be NRI military/doctor — verify through official channels, not through links they provide"
      },
      {
        type: "tip",
        value: "Tell a trusted friend or family member about your online relationship. Scammers isolate victims by saying 'Don't tell anyone about us yet.' A fresh pair of eyes from someone who cares about you can spot red flags you might miss when emotions are involved."
      }
    ],
    redFlags: [
      "They fall in love very quickly — 'love bombing'",
      "They always have an excuse to avoid video calls or meeting in person",
      "They claim to be NRI, military, or doctor but can't provide verifiable proof",
      "A 'crisis' requiring money appears after weeks of building trust",
      "They ask you not to tell family or friends about the relationship",
      "Their photos look too professional or like stock images"
    ]
  },
  {
    id: 15,
    title: "Public WiFi & Bluetooth Safety",
    category: "Network Safety",
    icon: "📡",
    difficulty: "Beginner",
    duration: "3 min",
    content: [
      {
        type: "text",
        value: "Free WiFi at a coffee shop, airport lounge, or railway station feels like a bonus. But connecting to public WiFi is like having a conversation in a crowded room — anyone can listen in. Hackers sitting nearby can intercept everything you do online."
      },
      {
        type: "text",
        value: "How hackers exploit public WiFi:\n1. Man-in-the-Middle Attack — The hacker sits between you and the WiFi router, reading everything you send: passwords, bank details, messages\n2. Fake Hotspots — They create a WiFi network named 'Starbucks_Free' or 'Airport_WiFi' that looks legitimate. When you connect, all your data goes through their device\n3. Session Hijacking — They steal your login session cookies and take over your accounts\n4. Malware Injection — On unsecured networks, hackers can push malicious software to your phone"
      },
      {
        type: "example",
        value: "At a popular café in Gurgaon, a cybersecurity researcher demonstrated how easy it was to steal data. He set up a WiFi hotspot called 'CafeWiFi-Free'. Within 30 minutes, 45 people connected. He could see their browsing activity, email subjects, and even some passwords entered on non-HTTPS websites. He didn't steal anything — but a real hacker would have."
      },
      {
        type: "tip",
        value: "NEVER do online banking, UPI payments, or enter passwords while connected to public WiFi. Use your mobile data (4G/5G) instead — it's encrypted and much safer. Think of it this way: free WiFi is for reading news and watching videos, NOT for anything involving money or passwords."
      },
      {
        type: "text",
        value: "Bluetooth safety:\n• Turn off Bluetooth when you're not actively using it — especially in crowded places like metro stations and malls\n• Set your device to 'non-discoverable' mode\n• Don't accept file transfer requests from unknown devices\n• Hackers can use Bluetooth to send malware or access your files if your device is discoverable"
      },
      {
        type: "tip",
        value: "If you travel frequently and MUST use public WiFi, install a trusted VPN app (like ProtonVPN — free tier available). A VPN creates an encrypted tunnel for your data, so even if a hacker intercepts it, they can't read it. It's like speaking in a secret code in that crowded room."
      }
    ],
    redFlags: [
      "WiFi networks with generic names like 'Free_WiFi' or 'Airport_Internet'",
      "Public WiFi that doesn't require any password to connect",
      "Being asked to enter personal details or bank info to 'register' for free WiFi",
      "Your phone auto-connecting to unknown WiFi networks",
      "Bluetooth pairing requests from unknown devices in public places"
    ]
  }
];

const QUIZZES = [
  {
    id: 1,
    scenario: "You receive this SMS:\n\n\"Dear Customer, your PAN card has been linked to suspicious activities. Your bank account will be frozen in 2 hours. Click here to verify: http://pan-verify.co.in/update\"",
    type: "sms",
    isScam: true,
    explanation: "This is a PHISHING scam. Red flags:\n• Government agencies don't send SMS threats about freezing accounts\n• The URL 'pan-verify.co.in' is not an official government website (real one is incometax.gov.in)\n• Creates artificial urgency (\"2 hours\")\n• No government process works this fast",
    difficulty: "Easy"
  },
  {
    id: 2,
    scenario: "You're selling a sofa on OLX for ₹8,000. A buyer says:\n\n\"I'll pay you right now. I've sent ₹8,000 to your GPay. Please enter your UPI PIN to accept the payment.\"",
    type: "upi",
    isScam: true,
    explanation: "This is a UPI COLLECT REQUEST scam. Red flags:\n• You NEVER need to enter your UPI PIN to RECEIVE money\n• The buyer sent a COLLECT request (taking money FROM you), not a payment\n• Legitimate buyers don't pressure you to enter PIN immediately\n• If someone sent you money, it would appear in your account automatically",
    difficulty: "Easy"
  },
  {
    id: 3,
    scenario: "Your bank SBI sends you this message from their official number (SBIBNK):\n\n\"Your SBI account statement for June 2025 is ready. View it on https://onlinesbi.sbi.co.in or visit your nearest branch.\"",
    type: "sms",
    isScam: false,
    explanation: "This is LEGITIMATE. Why:\n• The sender ID (SBIBNK) is SBI's official SMS header\n• The URL 'onlinesbi.sbi.co.in' is SBI's real official website\n• It's not asking for any personal information, OTP, or PIN\n• No urgency or threats\n• Simply informing about a statement — a routine bank communication",
    difficulty: "Medium"
  },
  {
    id: 4,
    scenario: "You receive a WhatsApp message:\n\n\"Hi! I'm from Flipkart HR team. We have a work-from-home data entry job. Salary ₹25,000/month for just 2 hours daily. No experience needed. Send ₹499 registration fee to start immediately.\"",
    type: "job",
    isScam: true,
    explanation: "This is a FAKE JOB scam. Red flags:\n• Flipkart doesn't hire through WhatsApp messages\n• No legitimate company asks for registration fees\n• ₹25,000/month for 2 hours of data entry is unrealistic\n• \"No experience needed\" for high-paying work is suspicious\n• Pressure to act immediately is a classic scam tactic",
    difficulty: "Easy"
  },
  {
    id: 5,
    scenario: "You receive a call:\n\n\"Hello, this is Officer Verma from CBI Delhi. A courier package with illegal drugs has been intercepted with your Aadhaar number. You are under digital arrest. Do not disconnect this call. Transfer ₹50,000 to our verification account to prove your innocence.\"",
    type: "call",
    isScam: true,
    explanation: "This is a DIGITAL ARREST scam. Red flags:\n• 'Digital arrest' is NOT a real legal concept in India\n• CBI/Police NEVER conduct arrests or investigations over phone calls\n• No law enforcement agency asks for money to 'prove innocence'\n• They threaten you to stay on the call so you can't think clearly or ask anyone\n• Real police come to your door with proper documentation",
    difficulty: "Easy"
  },
  {
    id: 6,
    scenario: "You get this email from noreply@google.com:\n\n\"Someone just signed in to your Google account from a new device in Karachi, Pakistan. If this wasn't you, review your security settings at https://myaccount.google.com/security\"",
    type: "email",
    isScam: false,
    explanation: "This is LEGITIMATE. Why:\n• Google does send security alerts from noreply@google.com\n• The link points to the real Google security page (myaccount.google.com)\n• It's not asking for your password or OTP\n• It's asking you to review — not threatening to block your account\n• This is a standard security notification. You should check it.",
    difficulty: "Hard"
  },
  {
    id: 7,
    scenario: "You see this Instagram ad:\n\n\"MEGA SALE! Original Nike Air Jordan shoes — ₹899 only (MRP ₹12,999). Limited stock! Order now: www.nike-india-sale.com. Only UPI payment accepted.\"",
    type: "shopping",
    isScam: true,
    explanation: "This is a FAKE SHOPPING scam. Red flags:\n• 93% discount on premium shoes is unrealistic\n• The website 'nike-india-sale.com' is NOT Nike's official site (real: nike.com/in)\n• 'Only UPI payment accepted' — legitimate stores offer multiple payment options including COD\n• Creating urgency with 'limited stock'\n• Instagram ads are not verified for legitimacy",
    difficulty: "Medium"
  },
  {
    id: 8,
    scenario: "Your PhonePe app shows:\n\n\"₹250.00 received from AJAY KUMAR (ajay.kumar@ybl)\"\n\nYou see the money in your account balance.",
    type: "upi",
    isScam: false,
    explanation: "This is LEGITIMATE. Why:\n• Money actually appeared in your account balance\n• You did NOT have to enter any PIN\n• The notification is from within the PhonePe app itself (not an SMS or WhatsApp message)\n• UPI transactions that credit your account are genuine\n• Note: Scammers sometimes send ₹1 to gain trust before a bigger scam — be cautious of follow-up requests",
    difficulty: "Medium"
  },
  {
    id: 9,
    scenario: "You receive a call from someone who sounds exactly like your son:\n\n\"Papa, mera accident ho gaya! Please urgently transfer ₹30,000 to this number for hospital admission. Don't call back, my phone is damaged, I'm calling from the nurse's phone.\"",
    type: "call",
    isScam: true,
    explanation: "This is likely an AI VOICE CLONING scam. Red flags:\n• Extreme urgency to prevent you from thinking\n• Asking to NOT call back (so you can't verify)\n• Requesting money transfer to an unknown number\n• AI can now clone anyone's voice from social media clips\n• Always verify: Call your son's actual number, call another family member, ask a question only your son would know",
    difficulty: "Hard"
  },
  {
    id: 10,
    scenario: "You receive this SMS:\n\n\"IRCTC: Your train 12302 Rajdhani Exp departing tomorrow at 16:55 from NDLS. PNR: 4521367890. Check status: https://www.irctc.co.in\"",
    type: "sms",
    isScam: false,
    explanation: "This is LEGITIMATE. Why:\n• IRCTC sends booking confirmations via SMS\n• The URL irctc.co.in is the official IRCTC website\n• Contains specific details (train number, PNR) matching a booking you would have made\n• Not asking for any personal info, payment, or OTP\n• Standard travel confirmation message",
    difficulty: "Medium"
  },
  {
    id: 11,
    scenario: "You get a WhatsApp forward:\n\n\"🎉 Jio is giving FREE 1 year unlimited data to celebrate 10th anniversary! Just fill this form: jio-free-recharge.com and share with 10 friends to activate.\"",
    type: "shopping",
    isScam: true,
    explanation: "This is a FAKE OFFER scam. Red flags:\n• 'jio-free-recharge.com' is NOT Jio's official website (real: jio.com)\n• 'Share with 10 friends' is a classic viral scam trick to spread itself\n• No telecom company gives free 1-year plans via WhatsApp forwards\n• The form will steal your personal information\n• Jio announces offers through their app and official channels only",
    difficulty: "Easy"
  },
  {
    id: 12,
    scenario: "You get an SMS:\n\n\"Your electricity bill of ₹8,340 is overdue. Your power supply will be disconnected tonight. Pay immediately: https://pay-electricity-bill.in/urgent\"",
    type: "sms",
    isScam: true,
    explanation: "This is a FAKE BILL scam. Red flags:\n• Electricity boards send notices through proper channels, not threatening SMS\n• 'pay-electricity-bill.in' is not any official electricity board website\n• Power disconnection requires proper notice period — never happens 'tonight'\n• Creates panic to make you act without thinking\n• Always pay bills through official apps or your electricity provider's website",
    difficulty: "Easy"
  },
  // ===================== NEW QUIZZES (IDs 13–24) =====================
  {
    id: 13,
    scenario: "You park your car at a busy market. There's a QR code pasted on the parking sign that says:\n\n\"Pay Parking Fee ₹30 — Scan QR Code\"\n\nYou scan it and it opens a UPI payment page, but the receiver name shows 'RAVI KUMAR' instead of the municipal corporation.",
    type: "qr",
    isScam: true,
    explanation: "This is a QR CODE SCAM. Red flags:\n• The receiver name 'RAVI KUMAR' is a personal account, not a municipal or parking authority account — legitimate parking QR codes show the corporation or official parking company name.\n• Scammers paste fake QR stickers over real ones in busy parking areas.\n• The QR could also redirect you to a phishing site instead of a genuine UPI payment page.\n• Always check if the QR sticker looks freshly pasted or tampered with before scanning.\n• Pay the parking attendant directly in cash or use only the official parking app if available.",
    difficulty: "Medium"
  },
  {
    id: 14,
    scenario: "You get a push notification from the official SBI YONO app on your phone:\n\n\"Alert: A login attempt was made on your SBI account from a new device. If this was not you, please visit your nearest branch or call 1800-1234 immediately.\"",
    type: "sms",
    isScam: false,
    explanation: "This is LEGITIMATE. Why:\n• The notification came from the official SBI YONO app installed on your phone — not from an SMS or WhatsApp message.\n• It's asking you to visit a branch or call a toll-free number, NOT asking you to click a link or share OTP.\n• It provides SBI's official helpline number.\n• Legitimate security alerts inform you and tell you to verify through official channels.\n• You should act on it by checking your recent transactions in the YONO app or calling the number to verify.",
    difficulty: "Medium"
  },
  {
    id: 15,
    scenario: "You receive a WhatsApp message from an unknown number:\n\n\"Hello, this is Dr. Mehta from City Hospital. Your son Rahul has been in a serious accident and needs emergency surgery. Please transfer ₹50,000 immediately to this UPI ID: emergencyfund@ybl. He is unconscious and cannot speak. Don't waste time calling, every second matters!\"",
    type: "call",
    isScam: true,
    explanation: "This is an EMERGENCY IMPERSONATION scam. Red flags:\n• Hospitals don't ask for payments via WhatsApp UPI transfers — they have proper billing counters and accept insurance.\n• The message creates extreme panic to stop you from thinking clearly or verifying.\n• 'Don't waste time calling' is a classic scammer tactic to prevent verification — a real doctor would WANT you to call the hospital.\n• The UPI ID 'emergencyfund@ybl' is a personal account, not a hospital account.\n• Always verify by calling your family member's phone directly, or calling the hospital's official number before sending any money.",
    difficulty: "Medium"
  },
  {
    id: 16,
    scenario: "You're added to a Telegram group called 'Crypto Bulls India 🚀🔥' with 12,000 members. The admin posts:\n\n\"Today's signal: Buy MOONX coin NOW. Guaranteed 50% return in 48 hours! Our members made ₹3 lakh last week. Minimum investment ₹10,000. Send to our trading wallet address below. Screenshot your profits by tomorrow evening! 📈💰\"",
    type: "investment",
    isScam: true,
    explanation: "This is a CRYPTO INVESTMENT scam (pump-and-dump scheme). Red flags:\n• No legitimate investment guarantees 50% returns in 48 hours — that's financially impossible without fraud.\n• Unknown 'MOONX coin' is not listed on any legitimate exchange — they're likely pumping a worthless token.\n• The group artificially shows only 'profit screenshots' (which are fake) and hides the losses.\n• Sending money to a 'trading wallet address' means you have zero protection — crypto transactions are irreversible.\n• SEBI does not regulate crypto in India, meaning there's no authority to help you recover losses from such schemes.",
    difficulty: "Medium"
  },
  {
    id: 17,
    scenario: "You receive an SMS from UIDAI:\n\n\"Your Aadhaar update request has been received. Please visit your nearest Aadhaar Seva Kendra or uidai.gov.in to track status. Request ID: 2834-7291-5532. Do not share this ID with anyone.\"",
    type: "sms",
    isScam: false,
    explanation: "This is LEGITIMATE. Why:\n• The SMS is from the official UIDAI sender ID, not a random mobile number.\n• The URL uidai.gov.in is the official UIDAI government website (.gov.in domain).\n• It's providing a tracking request ID for an update you would have initiated — it's not asking you to click any link or pay anything.\n• The message says 'Do not share this ID with anyone' — this is a genuine security advisory that scam messages never include.\n• UIDAI does send such confirmation messages after you submit an Aadhaar update at a seva kendra.",
    difficulty: "Medium"
  },
  {
    id: 18,
    scenario: "You need ₹15,000 urgently. You find an app called 'EasyRupee Instant Loan' (not on Google Play Store — downloaded via a link on WhatsApp). During installation, it asks for permissions to access your:\n\n• Contacts\n• Photo Gallery\n• Camera\n• Call Logs\n• SMS\n\nThe app promises loan approval in 5 minutes with zero documents.",
    type: "loan",
    isScam: true,
    explanation: "This is a PREDATORY LOAN APP scam. Red flags:\n• The app is NOT on Google Play Store — it was sideloaded via a WhatsApp link, which means it bypassed Google's security checks.\n• A loan app has absolutely NO legitimate reason to access your contacts, photo gallery, camera, and call logs.\n• 'Zero documents' and '5-minute approval' is a trap — they don't verify because they plan to recover money through harassment, not legal means.\n• These apps charge 100-300% annual interest and harass you by calling your contacts and morphing your photos if you can't repay.\n• Only use apps from RBI-registered NBFCs and always download from official app stores.",
    difficulty: "Easy"
  },
  {
    id: 19,
    scenario: "You read this notification on the official RBI website (rbi.org.in):\n\n\"RBI Press Release: With effect from 1st July 2025, the per-transaction limit for UPI payments has been increased to ₹5 lakh for certain categories including tax payments and education fees. For details, visit rbi.org.in/press-releases.\"",
    type: "email",
    isScam: false,
    explanation: "This is LEGITIMATE. Why:\n• The information is displayed on rbi.org.in — the Reserve Bank of India's official website, which is a .org.in government-affiliated domain.\n• RBI regularly issues press releases about UPI policy changes.\n• The notification provides factual information and does not ask for any personal details, OTP, PIN, or payment.\n• It directs you to the official press releases section for more details.\n• Always verify such policy changes on rbi.org.in directly rather than through WhatsApp forwards or random websites.",
    difficulty: "Hard"
  },
  {
    id: 20,
    scenario: "You get an Instagram DM from your close friend Priya's account:\n\n\"OMG! Is this you in this video? 😂😂 I can't believe it! Check it out 👉 instagram-viral-vid.com/watch?id=29374\"\n\nThe link takes you to a page that looks exactly like Instagram's login page, asking you to enter your username and password to view the video.",
    type: "social",
    isScam: true,
    explanation: "This is a SOCIAL MEDIA PHISHING scam. Red flags:\n• The link 'instagram-viral-vid.com' is NOT Instagram's real website (which is instagram.com). It's a phishing page designed to steal your login credentials.\n• If you were already logged into Instagram, you wouldn't need to log in again to view a video — needing to 're-login' is a dead giveaway.\n• Your friend Priya's account has likely been hacked, and the scammer is sending this same message to all her followers to hack more accounts.\n• The message creates curiosity ('Is this you?') to make you click without thinking.\n• If you receive such a message, tell your friend (via phone call, not Instagram) that their account may be hacked.",
    difficulty: "Medium"
  },
  {
    id: 21,
    scenario: "You've been chatting with a man named 'Dr. Arun Kapoor' on Bharat Matrimony for 2 months. He says he's an NRI cardiologist in Canada. He's been very sweet and talks about marriage. One day he messages:\n\n\"Darling, I'm coming to India next month to meet your family! But my visa processing requires ₹2 lakh as security deposit. My Canadian accounts are frozen due to a tax audit. Can you help? I'll repay double when I arrive. I love you so much. 💕\"",
    type: "social",
    isScam: true,
    explanation: "This is a ROMANCE/MATRIMONY scam. Red flags:\n• Asking for a large sum of money (₹2 lakh) after building emotional trust over months is the classic romance scam pattern.\n• 'Canadian accounts frozen due to tax audit' is a fabricated excuse — tax audits don't freeze personal accounts entirely, and a doctor earning well wouldn't need ₹2 lakh from someone they haven't met.\n• Promising to 'repay double' is designed to make it feel like an investment rather than a gift.\n• Real people meeting from matrimony sites don't ask for money before the first meeting.\n• Always do a reverse image search of their photos and insist on live video calls before building deep trust. Never send money to someone you haven't met in person.",
    difficulty: "Hard"
  },
  {
    id: 22,
    scenario: "You're at a coffee shop and connect to a WiFi network called 'Starbucks_Free_WiFi'. After connecting, a webpage pops up saying:\n\n\"Welcome to Starbucks WiFi! To access free internet, please register with your full name, mobile number, email, and debit card number for age verification. Your card will NOT be charged.\"",
    type: "shopping",
    isScam: true,
    explanation: "This is a FAKE WIFI HOTSPOT scam. Red flags:\n• NO legitimate WiFi service — Starbucks or otherwise — asks for your debit card number to provide internet access.\n• The 'age verification' excuse is a trick to make you feel comfortable sharing your card details.\n• This is likely a fake hotspot set up by a hacker to steal personal information.\n• Even legitimate public WiFi only asks for a phone number and OTP at most — never banking details.\n• If a WiFi login page asks for any financial information, disconnect immediately and use your mobile data instead.",
    difficulty: "Easy"
  },
  {
    id: 23,
    scenario: "After making a purchase at a store using PhonePe, you see this notification in your PhonePe app:\n\n\"🎉 Congratulations! You earned ₹15 cashback on your last transaction. Cashback has been credited to your PhonePe wallet balance.\"",
    type: "upi",
    isScam: false,
    explanation: "This is LEGITIMATE. Why:\n• The notification appeared within the official PhonePe app — not via SMS, email, or WhatsApp.\n• PhonePe regularly offers cashback promotions on transactions, and the credited amount appears directly in your wallet.\n• The notification is not asking you to click any external link, enter OTP, or share any information.\n• The cashback amount (₹15) is reasonable and matches typical PhonePe cashback offers.\n• Always trust notifications within the official app rather than SMS or messages claiming cashback with links.",
    difficulty: "Easy"
  },
  {
    id: 24,
    scenario: "You receive a WhatsApp forward from your uncle:\n\n\"🇮🇳 GREAT NEWS! Government of India is giving ₹6,000 to every citizen under PM Digital Yojana Scheme. This is for promoting digital India. Last date to register: TOMORROW! Click now to get your money: www.pmdigital-scheme.com 🇮🇳\n\n✅ Forward this to 10 people so they also benefit!\"",
    type: "sms",
    isScam: true,
    explanation: "This is a FAKE GOVERNMENT SCHEME scam. Red flags:\n• The website 'pmdigital-scheme.com' is NOT a government website — real government websites end in .gov.in or .nic.in (e.g., pmkisan.gov.in).\n• 'Forward to 10 people' is a classic viral scam tactic to spread the fraud message to more victims.\n• There is no real scheme called 'PM Digital Yojana' that gives ₹6,000 to all citizens — verify any scheme on pib.gov.in or myscheme.gov.in.\n• Creating urgency with 'Last date: TOMORROW' pressures you to act before checking facts.\n• Even if your trusted uncle forwarded it, he was also tricked — always verify before forwarding. Check PIB Fact Check (@PIBFactCheck on Twitter) for debunked claims.",
    difficulty: "Easy"
  }
];

const NEWS_ARTICLES = [
  {
    id: 1,
    title: "Digital Arrest Scams Surge: Indians Lost ₹120 Crore in 3 Months",
    date: "June 2025",
    source: "Indian Cyber Crime Coordination Centre",
    summary: "The 'digital arrest' scam has become India's fastest-growing cybercrime. Scammers pose as CBI, police, or customs officers, claiming victims are involved in crimes. They keep victims on video calls for hours — sometimes days — while extracting money.",
    details: "In Q1 2025, over 7,000 cases of digital arrest scams were reported, with victims losing an average of ₹1.7 lakh each. The youngest victim was 22, the oldest was 78. PM Modi addressed this scam specifically in Mann Ki Baat, warning citizens that no government agency conducts arrests via video call.",
    protection: [
      "There is no legal concept called 'digital arrest' in India",
      "No police or government agency asks for money over phone",
      "Hang up immediately and call 1930 (Cyber Crime Helpline)",
      "Real police come to your door with proper documentation"
    ],
    relatedQuizIds: [5]
  },
  {
    id: 2,
    title: "AI Voice Cloning: Scammers Now Sound Like Your Family Members",
    date: "May 2025",
    source: "CERT-In Advisory",
    summary: "Scammers are using AI to clone voices from social media videos and WhatsApp voice notes. They call parents pretending to be their children, claiming emergencies and requesting urgent money transfers.",
    details: "AI voice cloning technology can now replicate a person's voice from just 3 seconds of audio. Scammers scrape voice samples from Instagram reels, YouTube videos, and even WhatsApp voice messages. A retired teacher in Pune lost ₹3.5 lakh after receiving a call that sounded exactly like her son claiming to be in a hospital.",
    protection: [
      "Always call back on the person's known number to verify",
      "Ask a personal question only your family member would know",
      "Be suspicious of calls asking for urgent money transfers",
      "Don't post long voice/video clips publicly on social media"
    ],
    relatedQuizIds: [9]
  },
  {
    id: 3,
    title: "UPI Fraud Hits ₹1,087 Crore in 2024-25 — RBI Report",
    date: "April 2025",
    source: "Reserve Bank of India",
    summary: "UPI-related frauds crossed the ₹1,000 crore mark for the first time, driven primarily by collect request scams, fake QR codes, and 'wrong transfer' schemes targeting OLX/Quikr sellers.",
    details: "With UPI processing over 14 billion transactions monthly, fraud rates have increased proportionally. The most common scam remains the collect request trick, where victims enter their PIN thinking they're receiving money. Rural and semi-urban areas saw a 340% increase in UPI fraud. RBI has issued new guidelines effective April 2026 requiring real-time fraud alerts.",
    protection: [
      "You NEVER enter UPI PIN to RECEIVE money",
      "Never scan unknown QR codes",
      "Verify collect requests carefully before approving",
      "Enable transaction limits on your UPI apps"
    ],
    relatedQuizIds: [2, 8]
  },
  {
    id: 4,
    title: "Fake Job Scams on WhatsApp & Telegram Target 5 Lakh Youth",
    date: "March 2025",
    source: "National Cyber Crime Reporting Portal",
    summary: "Organized scam networks are running fake job offers on WhatsApp and Telegram, promising ₹15,000-₹50,000/month for simple tasks like 'liking videos' or 'reviewing products'. Victims invest money expecting returns that never come.",
    details: "These scams operate like Ponzi schemes. Initial small tasks pay real money (₹100-500) to build trust. Then victims are asked to 'invest' larger amounts for 'premium tasks'. The largest case involved a Telegram group with 2 lakh members, collectively defrauded of ₹47 crore. Most victims were 18-25 year old graduates seeking their first income.",
    protection: [
      "No legitimate job requires you to pay money first",
      "Be skeptical of 'earn from home' opportunities with high pay",
      "Research the company on official websites before engaging",
      "Report suspicious job offers to cybercrime.gov.in"
    ],
    relatedQuizIds: [4]
  },
  {
    id: 5,
    title: "Fake Traffic Challan SMS Scam Spreads Across 12 States",
    date: "June 2025",
    source: "Ministry of Road Transport",
    summary: "A new wave of fake traffic challan SMS messages is tricking citizens into paying fines through fraudulent payment links. The messages mimic real traffic violation notices with fake challan numbers.",
    details: "Over 15 lakh fake challan SMS messages were sent in May 2025 alone, targeting vehicle owners whose data was leaked from regional transport databases. The SMS contains a fake challan number and a payment link that leads to a phishing site designed to steal banking credentials. Several state transport departments have issued advisories reminding citizens that official challans can only be paid through the official e-challan portal.",
    protection: [
      "Pay challans only through the official e-challan website or app",
      "Don't click payment links in SMS messages",
      "Verify challan status on parivahan.gov.in",
      "Report fake challans to 1930"
    ],
    relatedQuizIds: [12]
  },
  // ===================== NEW NEWS ARTICLES (IDs 6–12) =====================
  {
    id: 6,
    title: "Predatory Loan App Crisis — RBI Bans 300+ Illegal Lending Apps",
    date: "May 2025",
    source: "Reserve Bank of India",
    summary: "The RBI has taken sweeping action against over 300 illegal digital lending apps operating without any NBFC license. These apps were charging interest rates as high as 300% annually, accessing users' contacts and photos, and using extreme harassment tactics including morphed images to force repayment.",
    details: "Following a surge in complaints and at least 42 reported suicides linked to loan app harassment across India, the RBI directed Google and Apple to remove over 300 unregistered lending apps from their stores. Investigations revealed that most of these apps were operated by foreign entities routing money through shell companies. Victims reported receiving loans of ₹5,000 but being asked to repay ₹15,000 within 7 days, with harassment calls made to their entire contact list if they defaulted. The RBI has also issued a master circular mandating that all digital lending must be done through RBI-registered entities only.",
    protection: [
      "Only borrow from RBI-registered NBFCs — check the list at rbi.org.in",
      "Never grant contacts, gallery, or camera permissions to loan apps",
      "If harassed by a loan app, file a complaint at cybercrime.gov.in and call RBI helpline 14440",
      "Download loan apps only from Google Play Store or Apple App Store — never via WhatsApp links"
    ],
    relatedQuizIds: [18]
  },
  {
    id: 7,
    title: "WhatsApp Crypto Investment Groups Defraud 2 Lakh Indians",
    date: "April 2025",
    source: "Central Bureau of Investigation",
    summary: "The CBI has busted a massive network of WhatsApp and Telegram groups that lured over 2 lakh Indians into fake cryptocurrency investment schemes. Victims collectively lost over ₹500 crore, with individual losses ranging from ₹10,000 to ₹40 lakh.",
    details: "The operation, codenamed 'Operation CryptoTrap', revealed that the fraud ring operated 1,200 WhatsApp and Telegram groups with names like 'Bitcoin Profit India', 'Crypto Bulls VIP', and 'Digital Gold Traders'. The groups used fake trading apps that showed artificial profits, luring members to invest increasingly larger amounts. When victims tried to withdraw, they were told to pay 'taxes' or 'unlock fees'. The CBI arrested 47 people across 8 states and traced the money trail to bank accounts in Dubai and Hong Kong. Many victims were IT professionals and small business owners who invested their savings believing the fake profit screenshots shared in these groups.",
    protection: [
      "Never invest through WhatsApp or Telegram groups — use only SEBI-registered platforms",
      "If returns seem too good to be true (>15% per month), it's definitely a scam",
      "Verify any trading app on Google Play Store and check SEBI registration before investing",
      "Report crypto fraud to cybercrime.gov.in and the Economic Offences Wing of your local police"
    ],
    relatedQuizIds: [16]
  },
  {
    id: 8,
    title: "SIM Swap Attacks — Retired Army Officer Loses ₹1.2 Crore",
    date: "June 2025",
    source: "Times of India",
    summary: "A retired Indian Army officer in Chandigarh lost ₹1.2 crore in a sophisticated SIM swap fraud. His mobile network was disabled for just 3 hours, during which scammers transferred funds from his three bank accounts using OTPs received on the cloned SIM.",
    details: "Colonel (Retd.) Mahendra Singh noticed his Airtel phone showing 'No Network' at 11 PM. Assuming it was a technical issue, he went to sleep. By 2 AM, scammers had completed 14 NEFT transactions totalling ₹1.2 crore from his SBI, HDFC, and PNB accounts — all verified with OTPs sent to the swapped SIM. The scammer had visited an Airtel store in another city with a fake Aadhaar card in Singh's name, requesting a 'lost SIM replacement'. The Chandigarh Police Cyber Cell traced the transactions to 8 different accounts used as money mules. Only ₹15 lakh has been recovered so far. Telecom companies are now under TRAI pressure to implement mandatory biometric verification for all SIM replacement requests.",
    protection: [
      "If your phone suddenly loses network, immediately contact your bank from another phone to freeze accounts",
      "Enable SIM lock PIN on your device — it prevents the SIM from working in another phone",
      "Register for email alerts from your bank in addition to SMS alerts for double protection",
      "Contact your telecom provider to add a special verification passphrase for any SIM-related requests"
    ],
    relatedQuizIds: [14, 15]
  },
  {
    id: 9,
    title: "Instagram Influencer Impersonation — Fake Accounts Scam Thousands of Followers",
    date: "March 2025",
    source: "Meta Security",
    summary: "Meta has removed over 15,000 fake Instagram accounts impersonating popular Indian influencers and content creators. These fake accounts were used to scam followers with fake brand deals, phishing links, and fraudulent investment schemes.",
    details: "The fake accounts copied profile photos, bios, and recent posts of popular Indian creators with 1 lakh+ followers. They then sent DMs to the real creator's followers with messages like 'Exclusive brand deal just for my followers — 80% off!' or 'Is this you in this video?' with phishing links. In one case, a fake account of a Mumbai food blogger with 5 lakh followers scammed over 3,000 people by promoting a fake restaurant voucher site that stole credit card details. Meta has introduced new verification prompts and is working with Indian cybersecurity agencies. CERT-In has advised users to enable 2FA on all social media accounts and report impersonation accounts immediately.",
    protection: [
      "Enable Two-Factor Authentication (2FA) on all social media accounts immediately",
      "Never click login links sent via DMs — always log in directly through the app",
      "Report impersonation accounts using the platform's 'Report' feature",
      "Verify influencer promotions by checking their official verified account, not DMs from similar-looking handles"
    ],
    relatedQuizIds: [20]
  },
  {
    id: 10,
    title: "Aadhaar Biometric Fraud — UIDAI Issues Emergency Advisory",
    date: "May 2025",
    source: "UIDAI",
    summary: "UIDAI has issued an emergency advisory after uncovering a fraud ring that used stolen biometric data to open bank accounts and SIM cards in people's names. Over 8,000 cases of unauthorized Aadhaar authentication were detected across Uttar Pradesh, Bihar, and Rajasthan.",
    details: "An investigation by UIDAI and state police revealed that unauthorized 'Aadhaar centres' in small towns were secretly storing fingerprint and iris data of people who came for legitimate Aadhaar updates. This stolen biometric data was then sold to criminal networks who used it to complete e-KYC processes — opening bank accounts, obtaining SIM cards, and even taking loans in victims' names. One victim in Patna discovered 3 bank accounts and 7 SIM cards registered to his Aadhaar without his knowledge. UIDAI has now made biometric locking the default recommendation for all Aadhaar holders and has launched a new feature that sends real-time alerts whenever your Aadhaar is used for any authentication.",
    protection: [
      "Lock your Aadhaar biometrics immediately at myaadhaar.uidai.gov.in — unlock only when YOU need to use them",
      "Use Masked Aadhaar (showing only last 4 digits) when sharing your Aadhaar for non-government purposes",
      "Regularly check your Aadhaar authentication history at myaadhaar.uidai.gov.in for unauthorized usage",
      "Only visit official Aadhaar Seva Kendras for updates — avoid unauthorized centres in mobile shops or markets"
    ],
    relatedQuizIds: [17]
  },
  {
    id: 11,
    title: "Fake E-Commerce Websites Surge During Festival Sales",
    date: "October 2024",
    source: "CERT-In",
    summary: "CERT-In has issued a warning about a sharp increase in fake e-commerce websites designed to mimic Amazon, Flipkart, and Myntra during the Diwali and Navratri festival sale season. Over 5,000 fraudulent websites were detected in October 2024 alone.",
    details: "The fake websites used domain names like 'amazon-diwali-sale.com', 'flipkart-festive-deals.in', and 'myntra-offer-zone.com' — designed to look identical to the real platforms. They offered branded electronics and clothing at 70-90% discounts, accepted UPI and direct bank transfers (no COD), and either delivered counterfeit products or nothing at all. Social media ads on Facebook and Instagram were the primary traffic drivers. CERT-In estimates that over ₹50 crore was lost by Indian consumers to these fake sites during the October-November festival season. They recommend verifying website authenticity by checking for HTTPS, the exact domain spelling, and legitimate customer reviews before making purchases.",
    protection: [
      "Always verify the exact URL — type it yourself instead of clicking links in social media ads",
      "If a deal offers 70-90% discount on branded items, it's almost certainly fake",
      "Choose Cash on Delivery (COD) when possible — scam sites never offer COD",
      "Check for HTTPS padlock in the browser and read reviews on independent sites before purchasing"
    ],
    relatedQuizIds: [7, 11]
  },
  {
    id: 12,
    title: "AI-Generated Deepfake Videos Used in Investment Scams",
    date: "June 2025",
    source: "SEBI Advisory",
    summary: "SEBI has issued an urgent advisory after discovering that AI-generated deepfake videos of prominent Indian business leaders — including industrialists and tech CEOs — are being used to promote fraudulent investment platforms and crypto schemes.",
    details: "Deepfake videos showing India's top business personalities 'endorsing' fake trading apps and crypto platforms have gone viral on YouTube, Instagram, and Facebook. In one widely circulated deepfake, a convincing replica of a famous Indian industrialist was shown saying 'I personally use this trading platform — it gave me 200% returns in one month.' The video looked completely real to most viewers. SEBI's investigation found that these videos directed viewers to download unregistered trading apps, which showed fake profits before disappearing with investors' money. Over ₹200 crore was lost to deepfake-promoted investment scams in Q1 2025. SEBI has coordinated with social media platforms to flag and remove such content and has reminded investors that no regulated entity uses celebrity endorsements for specific investment returns.",
    protection: [
      "No legitimate investment platform guarantees specific returns — any video making such claims is suspicious",
      "Verify investment platforms on SEBI's official website (sebi.gov.in) before investing any money",
      "Be skeptical of celebrity endorsement videos for financial products — check the official accounts of those personalities",
      "Report deepfake investment ads to SEBI at scores.gov.in and to the social media platform where you saw them"
    ],
    relatedQuizIds: [16, 19]
  }
];

// Export for use
if (typeof module !== 'undefined') {
  module.exports = { LESSONS, QUIZZES, NEWS_ARTICLES };
}

export { LESSONS, QUIZZES, NEWS_ARTICLES };
