import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import GlobalAuthWrapper from "@/components/GlobalAuthWrapper";

export const metadata = {
  title: "CyberSiksha - Duolingo for Cyber Security",
  description: "Learn to outsmart digital scams. A gamified, AI-powered cybersecurity education platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)] pb-20 md:pb-0">
        <AuthProvider>
          <GlobalAuthWrapper>
            <Navbar />
            <main className="max-w-6xl mx-auto p-4 md:p-8 relative z-10">
              {children}
            </main>
          </GlobalAuthWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
