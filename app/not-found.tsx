import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="shell page-main empty-state">
      <span className="muted">404</span>
      <h1>A little off the map.</h1>
      <p>This page isn’t here. There’s plenty still being built elsewhere.</p>
      <Link href="/" className="text-link">
        Back to familiar ground ↗
      </Link>
    </main>
  );
}
