import type { Metadata } from "next";
import { getPosts } from "@/lib/blog";
import { BlogExplorer } from "@/components/blog-explorer";
export const metadata: Metadata = {
  title: "Writing",
  description:
    "Field notes on system design, databases, AI agents, and product thinking.",
};
export default function Blog() {
  const posts = getPosts().map(
    ({ slug, title, description, date, category, minutes }) => ({
      slug,
      title,
      description,
      date,
      category,
      minutes,
    }),
  );
  return (
    <main id="main" className="shell page-main notebook">
      <header className="page-intro">
        <h1>Engineering notes</h1>
        <p>
          Bugs I traced, choices I made, and what I learned from the fix.
          <br />Short reads from my work on agents, databases, and interfaces.
        </p>
      </header>
      <BlogExplorer posts={posts} />
      <div className="notebook-footer">
        <p>More thoughts, in smaller pieces.</p>
        <a
          className="text-link"
          href="https://www.instagram.com/thebackendagent/"
          target="_blank"
          rel="noreferrer"
        >
          @thebackendagent ↗
        </a>
        <a className="text-link" href="/feed.xml">
          Subscribe with RSS ↗
        </a>
      </div>
    </main>
  );
}
