import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "CyberSiksha - Duolingo for Cyber Security",
  description: "Learn to outsmart digital scams. A gamified, AI-powered cybersecurity education platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[var(--color-navy)] text-[var(--foreground)] pb-20 md:pb-0">
        <Navbar />
        <main className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
