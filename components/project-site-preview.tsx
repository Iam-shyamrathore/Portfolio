import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";

export function ProjectSitePreview({project}:{project:Project}) {
  const site=project.liveSite;
  if(!site)return null;
  const domain=new URL(site.url).hostname.replace(/^www\./,"");
  return <section className="project-site-preview" aria-label={`${project.name} website`}>
    <div className="project-site-bar">
      <span>{site.embeddable?"Live preview":"Live website"}<span className="project-site-domain">{domain}</span></span>
      <a href={site.url} target="_blank" rel="noreferrer">Open site <ArrowUpRight size={14} aria-hidden="true"/></a>
    </div>
    {site.embeddable?<>
      <iframe src={site.url} title={`${project.name} live website`} loading="lazy" referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        className="project-site-frame"/>
      <p className="project-site-caption">Explore the live site above, or open it in a new tab.</p>
    </>:<>
      <a href={site.url} target="_blank" rel="noreferrer" className="project-site-external" aria-label={`Open ${project.name} website in a new tab`}>
        <Image src={site.previewImage??`/projects/${project.slug}.webp`} alt={site.previewImage?`${project.name} website preview image`:`Concept illustration for ${project.name}`} width={1200} height={630} sizes="(max-width:760px) 100vw, 1040px"/>
        <span className="project-site-open">Visit {domain} <ArrowUpRight size={16} aria-hidden="true"/></span>
      </a>
      <p className="project-site-caption">This website opens in a new tab.{!site.previewImage?" Concept illustration shown above.":""}</p>
    </>}
  </section>;
}
