import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { getPosts } from "@/lib/blog";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || "https://shyam.codes";
  return [
    "",
    "/work",
    "/blog",
    "/about",
    "/research",
    ...projects.map((project) => `/work/${project.slug}`),
    ...getPosts().map((post) => `/blog/${post.slug}`),
  ].map((route) => ({ url: `${base}${route}` }));
}
