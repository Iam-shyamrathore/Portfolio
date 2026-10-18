import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";
export function ProjectRow({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  return (
    <li
      className={`project-list-item ${compact ? "project-list-compact" : ""}`}
    >
      <Link href={`/work/${project.slug}`} className="project-row">
        <Image
          src={`/projects/${project.slug}.webp`}
          alt=""
          width={112}
          height={84}
          className="project-thumbnail"
        />
        <div className="project-row-copy">
          <div className="project-row-title">
            <h3>{project.name}</h3>
            <span>{project.category}</span>
          </div>
          <p>{project.description}</p>
          {!compact && (
            <span className="project-row-stack">
              {project.stack.slice(0, 4).join(" · ")}
            </span>
          )}
        </div>
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
      {project.liveSite&&<a className="project-row-live" href={project.liveSite.url} target="_blank" rel="noreferrer" aria-label={`Visit ${project.name} live website`}>Live site <ArrowUpRight size={12} aria-hidden="true"/></a>}
    </li>
  );
}
