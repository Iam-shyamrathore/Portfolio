"use client";
import { useState } from "react";
import type { Project } from "@/lib/projects";
import { ProjectRow } from "./project-row";
const filters = [
  "Everything",
  "AI systems",
  "Product & apps",
  "Infrastructure",
  "Research",
];
export function WorkExplorer({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("Everything");
  const visible = projects.filter(
    (project) => filter === "Everything" || project.discipline === filter,
  );
  return (
    <>
      <div
        className="filter-row"
        role="group"
        aria-label="Filter projects by discipline"
      >
        {filters.map((item) => (
          <button
            key={item}
            aria-pressed={filter === item}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length} projects shown
      </p>
      <ul className="project-list work-list">
        {visible.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </ul>
    </>
  );
}
