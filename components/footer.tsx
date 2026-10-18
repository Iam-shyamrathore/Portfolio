import Image from "next/image";
import { SubscribeButton } from "@/components/subscribe-button";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-content">
        <div className="footer-bottom">
          <span>
            Shyam Rathore{" "}
            <span className="muted">· India, working everywhere</span>
          </span>
          <div>
            <a
              href="https://github.com/Iam-shyamrathore"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/shyam-a458a7250/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://www.instagram.com/thebackendagent/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram ↗
            </a>
            <SubscribeButton feedUrl={new URL("/feed.xml", process.env.SITE_URL || "https://shyam.codes").href} />
          </div>
        </div>
      </div>
      <div className="footer-sky">
        <Image
          src="/art/blue-sky.webp"
          alt="A panoramic blue and white halftone sky with soft clouds"
          fill
          sizes="100vw"
        />
      </div>
    </footer>
  );
}
