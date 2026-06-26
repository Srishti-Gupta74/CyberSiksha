import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import GlobalAuthWrapper from "@/components/GlobalAuthWrapper";
import FloatingChatbot from "@/components/FloatingChatbot";
import DynamicBackground from "@/components/DynamicBackground";

export const metadata = {
  title: "CyberSiksha - Interactive Family Cyber Defense Hub",
  description: "Learn to spot online banking scams before they happen. Gamified AI cybersecurity education for families.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#050811] text-[var(--foreground)] pb-20 md:pb-0 selection:bg-cyan-500 selection:text-slate-950">
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
