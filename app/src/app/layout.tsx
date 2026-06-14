import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickPoll — Create polls. Share instantly. See results live.",
  description:
    "Create polls. Share instantly. See results live. No account required.",
  metadataBase: new URL("https://quick-poll-ba18.vercel.app"),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "QuickPoll",
    description: "Create polls. Share instantly. See results live.",
    url: "https://quick-poll-ba18.vercel.app",
    siteName: "QuickPoll",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body
        className="qp-shell flex min-h-full flex-col text-[var(--text-primary)]"
        suppressHydrationWarning
      >
        <div className="qp-bg-mesh" aria-hidden />
        <ToastProvider>
          <SiteHeader />
          <main className="qp-main flex-1 qp-animate-in">{children}</main>
          <SiteFooter />
        </ToastProvider>
      </body>
    </html>
  );
}
