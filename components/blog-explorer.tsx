"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/blog";
const categories = [
  "All notes",
  "System design",
  "Databases",
  "Agents",
  "Product thinking",
];
export function BlogExplorer({ posts }: { posts: Omit<Post, "body">[] }) {
  const [category, setCategory] = useState("All notes");
  const [query, setQuery] = useState("");
  const visible = posts.filter(
    (post) =>
      (category === "All notes" || post.category === category) &&
      `${post.title} ${post.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <label className="blog-search">
        <Search size={17} aria-hidden="true" />
        <span className="sr-only">Search writing</span>
        <input
          type="search"
          placeholder="Find a thought…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <div
        className="filter-row"
        role="group"
        aria-label="Filter writing by subject"
      >
        {categories.map((item) => (
          <button
            key={item}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="results-label" aria-live="polite">
        {visible.length} {visible.length === 1 ? "note" : "notes"}
      </p>
      <div className="blog-list">
        {visible.map((post) => (
          <Link
            key={post.slug}
            className="blog-entry"
            href={`/blog/${post.slug}`}
          >
            <div className="blog-entry-meta">
              <span>{post.category}</span>
              <span>{post.minutes} min read</span>
            </div>
            <div>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
            </div>
            <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        ))}
      </div>
      {!visible.length && (
        <div className="empty-state">
          <h2>No notes found.</h2>
          <p>Try a different search or subject.</p>
          <button
            className="text-link"
            onClick={() => {
              setQuery("");
              setCategory("All notes");
            }}
          >
            Show all notes ↗
          </button>
        </div>
      )}
    </>
  );
}
