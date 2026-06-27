// Fact-checked real historical Indian data breaches (all publicly documented)
export const BREACH_DB = {
  domains: ["gmail", "yahoo", "hotmail", "outlook", "rediffmail"],
  breaches: [
    { 
      name: "Zomato", 
      year: 2017, 
      records: "17M", 
      type: "Email, Password hashes",
      details: "Major Indian food delivery platform suffered an unauthorized database access vector exposing user authentication credentials."
    },
    { 
      name: "BigBasket", 
      year: 2020, 
      records: "20M", 
      type: "Email, Phone, Full Address",
      details: "E-commerce grocery giant database intercepted, leaking full physical delivery coordinates and hashed passwords."
    },
    { 
      name: "MobiKwik", 
      year: 2021, 
      records: "3.5M confirmed", 
      type: "Email, Phone, KYC documents",
      details: "Fintech payment gateway repository breach containing sensitive government identification uploads."
    },
    { 
      name: "JusPay", 
      year: 2021, 
      records: "35M", 
      type: "Email, Card fingerprints",
      details: "Payment processing layer breach exposing anonymized card transaction metadata across online merchants."
    },
    { 
      name: "Air India", 
      year: 2021, 
      records: "4.5M", 
      type: "Passport, Credit card data",
      details: "SITA passenger service system cyber attack compromising frequent flyer and identity records worldwide."
    },
    { 
      name: "HDFC Life", 
      year: 2023, 
      records: "Unknown", 
      type: "Policy details, Personal data",
      details: "Insurance provider system anomaly leading to potential exposure of policyholder personal dossiers."
    }
  ]
};
