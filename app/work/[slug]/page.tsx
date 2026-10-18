import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/projects";
import Image from "next/image";
import { ProjectSitePreview } from "@/components/project-site-preview";
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return {
    title: project?.name ?? "Project",
    description: project?.description,
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <main id="main" className="shell page-main">
      <Link className="back-link" href="/work">
        <ArrowLeft size={14} aria-hidden="true" /> All work
      </Link>
      <header className="case-intro">
        <p className="case-status">{project.status}</p>
        <h1>{project.name}</h1>
        <p className="case-line">{project.line}</p>
        <p className="case-description">{project.description}</p>
        <div className="case-links">
          {project.links?.map((link) => (
            <a
              className="text-link"
              key={link.href}
              href={link.href}
              target={link.href.startsWith("https") ? "_blank" : undefined}
              rel={link.href.startsWith("https") ? "noreferrer" : undefined}
            >
              {link.label} <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ))}
        </div>
      </header>
      {project.liveSite?<ProjectSitePreview project={project}/>:<figure className="project-cover">
        <Image
          src={`/projects/${project.slug}.webp`}
          alt={`Concept illustration for ${project.name}`}
          width={1200}
          height={800}
          priority
        />
        <figcaption>Concept illustration · {project.name}</figcaption>
      </figure>}
      <div className="case-body">
        <aside>
          <h2>Tools & systems</h2>
          <ul>
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="case-evidence">{project.verification}</p>
        </aside>
        <article>
          <h2>The problem</h2>
          <p className="case-question">{project.question}</p>
          <h2 className="decisions-heading">What I worked on</h2>
          {project.decisions.map((decision) => (
            <section className="decision" key={decision.title}>
              <h3>{decision.title}</h3>
              {decision.before && <p className="decision-before">{decision.before}</p>}
              <p>{decision.text}</p>
              {decision.tradeoff && <p className="decision-tradeoff"><span>The tradeoff</span> {decision.tradeoff}</p>}
            </section>
          ))}
          <section className="case-takeaway">
            <h2>What I take forward</h2>
            <p>{project.takeaway}</p>
          </section>
          {project.relatedPost && <Link href={`/blog/${project.relatedPost}`} className="case-related text-link">Read the engineering note <ArrowUpRight size={14} aria-hidden="true" /></Link>}
        </article>
      </div>
      <Link className="next-project" href={`/work/${next.slug}`}>
        <span>Next project</span>
        <strong>{next.name}</strong>
        <ArrowUpRight aria-hidden="true" />
      </Link>
    </main>
  );
}
