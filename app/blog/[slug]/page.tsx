import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Markdown from "react-markdown";
import { ContactButton } from "@/components/contact-button";
import remarkGfm from "remark-gfm";
import { getPost, getPosts, displayDate } from "@/lib/blog";
export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return {
    title: post?.title ?? "Note",
    description: post?.description,
    openGraph: { type: "article", publishedTime: post?.date },
  };
}
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <main id="main" className="shell page-main">
      <div className="article-shell">
        <Link href="/blog" className="back-link">
          <ArrowLeft size={14} aria-hidden="true" /> All engineering notes
        </Link>
        <header className="article-header">
          <div className="article-meta">
            <span>{post.category}</span>
            <time dateTime={post.date}>{displayDate(post.date)}</time>
            <span>{post.minutes} min read</span>
          </div>
          <h1>{post.title}</h1>
          <p>{post.description}</p>
          <span className="article-author">By Shyam Rathore</span>
        </header>
        <article className="prose">
          <Markdown remarkPlugins={[remarkGfm]}>{post.body}</Markdown>
        </article>
        <div className="article-end">
          <span>Thanks for reading.</span>
          <ContactButton
            className="text-link"
            label="Let’s talk about it"
            subject={`A thought on: ${post.title}`}
          />
          <Link href="/blog" className="text-link">
            More field notes ↗
          </Link>
        </div>
      </div>
    </main>
  );
}
