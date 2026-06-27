import "./globals.css";
import { Poppins, Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import GlobalAuthWrapper from "@/components/GlobalAuthWrapper";
import FloatingChatbot from "@/components/FloatingChatbot";
import DynamicBackground from "@/components/DynamicBackground";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["600", "700", "800", "900"],
});

export const metadata = {
  title: "CyberSiksha - Interactive Family Cyber Defense Hub",
  description: "Learn to spot online banking scams before they happen. Gamified AI cybersecurity education for families.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${outfit.variable}`}>
      <body className="antialiased bg-[#050811] text-[var(--foreground)] font-body pb-20 md:pb-0 selection:bg-cyan-500 selection:text-slate-950">
        <DynamicBackground />
        <AuthProvider>
          <GlobalAuthWrapper>
            <Navbar />
            <main className="w-full max-w-[1920px] mx-auto p-4 sm:pl-28 lg:pl-32 md:pr-12 md:py-8 font-body">
              {children}
            </main>
            <FloatingChatbot />
          </GlobalAuthWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
