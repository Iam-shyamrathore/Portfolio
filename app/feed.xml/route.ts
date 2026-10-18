import { getPosts } from "@/lib/blog";
export const dynamic = "force-static";
const escape = (text: string) =>
  text.replace(
    /[<>&"']/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[char]!,
  );
export function GET() {
  const base = process.env.SITE_URL || "https://shyam.codes";
  const items = getPosts()
    .map(
      (post) =>
        `<item><title>${escape(post.title)}</title><link>${base}/blog/${post.slug}</link><guid>${base}/blog/${post.slug}</guid><description>${escape(post.description)}</description><pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate></item>`,
    )
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Shyam Rathore · Field notes</title><link>${base}/blog</link><description>Systems, data, agents, and product thinking.</description><language>en</language>${items}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
}
