import "./globals.css";
import { Space_Grotesk, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import GlobalAuthWrapper from "@/components/GlobalAuthWrapper";
import FloatingChatbot from "@/components/FloatingChatbot";
import DynamicBackground from "@/components/DynamicBackground";

const heading = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-heading",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "CyberSiksha - Interactive Family Cyber Defense Hub",
  description: "Learn to spot online banking scams before they happen. Gamified AI cybersecurity education for families.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="antialiased bg-[#050505] text-white/90 pb-20 md:pb-0 selection:bg-neutral-800 selection:text-white font-body">
        <DynamicBackground />
        <AuthProvider>
          <GlobalAuthWrapper>
            <Navbar />
            <main className="max-w-6xl mx-auto p-4 md:p-8">
              {children}
            </main>
            <FloatingChatbot />
          </GlobalAuthWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}

