import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
export const blogCategories = [
  "All notes",
  "System design",
  "Databases",
  "Agents",
  "Product thinking",
] as const;
export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  minutes: number;
  body: string;
};
const directory = path.join(process.cwd(), "content/blog");
export function getPosts(): Post[] {
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .flatMap((file) => {
      const source = fs.readFileSync(path.join(directory, file), "utf8");
      const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      if (!match) throw new Error(`Missing frontmatter in ${file}`);
      const meta = parse(match[1]);
      if (meta?.draft === true) return [];
      for (const key of ["title", "description", "date", "category"])
        if (typeof meta?.[key] !== "string" || !meta[key].trim())
          throw new Error(`Invalid ${key} in ${file}`);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(meta.date) ||
        Number.isNaN(Date.parse(meta.date))
      )
        throw new Error(`Invalid date in ${file}`);
      if (
        !(blogCategories as readonly string[]).slice(1).includes(meta.category)
      )
        throw new Error(`Invalid category in ${file}`);
      const slug = file.slice(0, -3);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
        throw new Error(`Invalid slug: ${file}`);
      return [
        {
          slug,
          title: meta.title,
          description: meta.description,
          date: meta.date,
          category: meta.category,
          minutes: Math.max(1, Math.ceil(match[2].split(/\s+/).length / 200)),
          body: match[2],
        },
      ];
    })
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
    );
}
export function getPost(slug: string) {
  return getPosts().find((post) => post.slug === slug);
}
export function displayDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
