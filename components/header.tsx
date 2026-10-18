"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ContactButton } from "@/components/contact-button";
export function Header() {
  const pathname = usePathname();
  return (
    <header className="site-header shell">
      <Link href="/" className="wordmark" aria-label="Shyam Rathore, home">
        Shyam Rathore
      </Link>
      <nav aria-label="Main navigation">
        {[
          ["/work", "Work"],
          ["/blog", "Writing"],
          ["/research", "Research"],
          ["/about", "About"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname.startsWith(href) ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      <ContactButton />
    </header>
  );
}
