import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star, Code2, Activity } from "lucide-react";
import { ProjectRow } from "@/components/project-row";
import { EscapeHatch } from "@/components/escape-hatch";
import { GitHubActivity } from "@/components/github-activity";
import { featuredProjects } from "@/lib/projects";
import { getPosts } from "@/lib/blog";
import { getActivity } from "@/lib/github";
import profile from "@/data/profile.json";
export const revalidate = 3600;
export default async function Home() {
  const posts = getPosts().slice(0, 2);
  const activity = await getActivity();
  return (
    <main id="main" className="shell portfolio-home">
      <section className="profile-overview" aria-label="About Shyam">
        <div className="profile-top-grid">
          <div className="profile-info">
            <div className="profile-heading">
              <Image
                src="/photos/headshot.webp"
                alt="Shyam Rathore"
                width={88}
                height={88}
                priority
              />
              <div>
                <h1>Shyam Rathore</h1>
                <p className="profile-role">
                  AI Engineer at{" "}
                  <a href="https://yolearn.ai" target="_blank" rel="noreferrer">
                    YoLearn.ai ↗
                  </a>
                  <span> · Noida, India</span>
                </p>
                <p className="profile-intro">
                  I build AI agents, backend systems, and the web & mobile
                  products around them.
                </p>
              </div>
            </div>
            <div className="profile-details">
              <p>
                My work spans tool orchestration, retrieval, real-time voice,
                resumable workflows, database design, and product interfaces.
              </p>
              <span>B.Tech, Computer Science · Galgotias University, 2026</span>
            </div>
            <div className="profile-links">
              <a
                href="https://github.com/Iam-shyamrathore"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
              <a
                href="https://www.linkedin.com/in/shyam-a458a7250/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗
              </a>
              <a href="mailto:shyamrathore013@gmail.com">Email ↗</a>
              <a
                href="/resume/Shyam_Rathore_AI_Engineer.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Resume ↗
              </a>
              <Link href="/about">More about me ↗</Link>
            </div>
          </div>
          <div id="github-activity" className="profile-activity">
            <GitHubActivity compact />
          </div>
        </div>
        <div className="profile-stats" aria-label="GitHub statistics">
          <a
            href="https://github.com/Iam-shyamrathore?tab=repositories"
            target="_blank"
            rel="noreferrer"
          >
            <Star size={14} aria-hidden="true" />
            <strong>{profile.stars}</strong>
            <span>GitHub stars</span>
          </a>
          <a
            href="https://github.com/Iam-shyamrathore?tab=repositories"
            target="_blank"
            rel="noreferrer"
          >
            <Code2 size={14} aria-hidden="true" />
            <strong>{profile.publicRepositories}</strong>
            <span>public repositories</span>
          </a>
          <a href="#github-activity">
            <Activity size={14} aria-hidden="true" />
            <strong>{activity.totalContributions}</strong>
            <span>contributions this year</span>
          </a>
          <span className="stats-date">
            Snapshot ·{" "}
            {new Date(profile.fetchedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              timeZone: "Asia/Kolkata",
            })}
          </span>
        </div>
      </section>
      <div className="home-columns">
        <section className="home-projects" aria-labelledby="selected-work">
          <div className="section-heading">
            <h2 id="selected-work">Selected work</h2>
            <Link href="/work" className="text-link">
              All 8 projects <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <ul className="project-list">
            {featuredProjects.map((project) => (
              <ProjectRow key={project.slug} project={project} compact />
            ))}
          </ul>
          <p className="work-note">
            Company work is described through my role and decisions. Source code
            stays private.
          </p>
        </section>
        <aside className="home-sidebar">
          <section>
            <h2>Currently</h2>
            <p>
              Building tutoring agents, curriculum-aware retrieval, resilient
              streaming, and voice experiences at YoLearn.
            </p>
            <Link className="text-link" href="/work/yolearn">
              My work there ↗
            </Link>
          </section>
          <section>
            <div className="sidebar-heading">
              <h2>Research</h2>
              <Link href="/research" aria-label="Read SIIN research">
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <Link className="sidebar-title" href="/research">
              SIIN: finding skills in GitHub evidence
            </Link>
            <p>
              Graphs, MCTS, and uncertainty.
              <br />
              Unpublished manuscript · paper + code
            </p>
          </section>
          <section>
            <div className="sidebar-heading">
              <h2>Recent writing</h2>
              <Link href="/blog" aria-label="All writing">
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
            {posts.map((post) => (
              <Link
                className="sidebar-note"
                key={post.slug}
                href={`/blog/${post.slug}`}
              >
                {post.title}
                <span>
                  {post.category} · {post.minutes} min
                </span>
              </Link>
            ))}
          </section>
        </aside>
      </div>
      <section className="home-elsewhere">
        <div>
          <h2>Outside the editor</h2>
          <p>
            I share what I’m learning about LLMs and agents as{" "}
            <a
              href="https://www.instagram.com/thebackendagent/"
              target="_blank"
              rel="noreferrer"
            >
              @thebackendagent ↗
            </a>
            .
          </p>
        </div>
        <EscapeHatch />
      </section>
    </main>
  );
}
