import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { Providers } from "@/components/providers";
import { ScrollSmootherHost } from "@/components/scroll-smoother/scroll-smoother-host";
import { ScrollSmootherWrapper } from "@/components/scroll-smoother/scroll-smoother-wrapper";
import { SkipLink } from "@/components/skip-link";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <Providers>
          <SkipLink />
          <AppHeader />
          <ScrollSmootherWrapper>
            <main id="main-content" className="min-h-[calc(100dvh-3.5rem)] pt-14">
              {children}
            </main>
            <AppFooter />
          </ScrollSmootherWrapper>
          <ScrollSmootherHost />
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
