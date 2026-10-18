import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AmbientBackground } from "@/components/ambient-background";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://shyam.codes"),
  title: {
    default: "Shyam Rathore · Engineer & builder",
    template: "%s · Shyam Rathore",
  },
  description:
    "AI systems, thoughtful products, and the engineering in between. Selected work and field notes by Shyam Rathore.",
  openGraph: {
    title: "Shyam Rathore · Engineer & builder",
    description:
      "AI systems, thoughtful products, and the engineering in between.",
    images: [{ url: "/art/blue-sky.webp", width: 2172, height: 724 }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="site-world">
          <AmbientBackground />
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
