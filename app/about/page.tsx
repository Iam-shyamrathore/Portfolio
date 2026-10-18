import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GitHubActivity } from "@/components/github-activity";
export const revalidate = 3600;
export const metadata: Metadata = {
  title: "About",
  description:
    "Shyam Rathore, AI Engineer and builder working across backend systems, interfaces, voice, and machine learning.",
};
const experience = [
  [
    "Oct 2025–present",
    "AI Engineer",
    "YoLearn.ai",
    "Agent workflows, retrieval, resilient streaming, voice systems, and the interfaces around them.",
  ],
  [
    "Aug–Oct 2025",
    "Associate System Engineer Intern",
    "MAQ Software",
    "Azure DevOps pipelines, SQL-backed reporting, and Power BI dashboards.",
  ],
  [
    "Jul–Aug 2025",
    "Associate Software Engineer Intern",
    "Better Software",
    "React features, REST integrations, code reviews, and production debugging.",
  ],
  [
    "Jul–Oct 2024",
    "Java Developer Intern",
    "TPF Technologies",
    "Java REST endpoints, SQL queries, and relational persistence.",
  ],
];
export default function About() {
  return (
    <main id="main" className="shell page-main">
      <section className="about-intro">
        <div>
          <span className="about-greeting">Hello, I’m Shyam.</span>
          <h1>
            Curious about
            <br />
            <em>the whole thing.</em>
          </h1>
          <p>
            I’m an AI Engineer at YoLearn.ai, based in India. I work across
            agents, backend systems, databases, and the interfaces people use to
            make sense of them.
          </p>
          <p>
            I enjoy joining the dots: a product idea, a data model, a reliable
            API, a useful screen. Some days that means reasoning about a failing
            stream. Other days, it means making a mobile interaction feel
            obvious.
          </p>
          <div className="about-links">
            <a
              className="text-link"
              href="/resume/Shyam_Rathore_AI_Engineer.pdf"
              target="_blank"
              rel="noreferrer"
            >
              My resume <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a className="text-link" href="mailto:shyamrathore013@gmail.com">
              Get in touch <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
        <figure className="about-portrait">
          <Image
            src="/photos/portrait.webp"
            alt="Shyam sitting outside a café in the afternoon sun"
            width={1100}
            height={1956}
            priority
          />
          <figcaption>Occasionally, away from a keyboard.</figcaption>
        </figure>
      </section>
      <section className="capabilities">
        <h2>What you can bring me into.</h2>
        <div className="capability-grid">
          <div>
            <h3>AI & agents</h3>
            <p>
              Tool orchestration, retrieval, model integrations, real-time
              voice, and uncertainty-aware experiments.
            </p>
          </div>
          <div>
            <h3>Systems & data</h3>
            <p>
              API boundaries, PostgreSQL modeling, Redis, resumable workflows,
              background jobs, and failure recovery.
            </p>
          </div>
          <div>
            <h3>Product & interfaces</h3>
            <p>
              React, Next.js, React Native, app flows, and the UI details that
              make a system usable.
            </p>
          </div>
        </div>
        <p className="capability-boundary">
          My strongest work is at the intersection of AI, backend, and product
          engineering. I also build interfaces and mobile apps, and explore ML
          through research and from-scratch projects. I’m happy to be specific
          about what I’ve shipped and what I’m still learning.
        </p>
      </section>
      <section className="experience-section">
        <h2>Along the way.</h2>
        {experience.map(([period, role, company, summary]) => (
          <div className="experience-row" key={company}>
            <span>{period}</span>
            <div>
              <h3>{company}</h3>
              <p className="experience-role">{role}</p>
              <p>{summary}</p>
            </div>
          </div>
        ))}
        <div className="education">
          <h3>Galgotias University</h3>
          <p>
            B.Tech, Computer Science & Engineering · 2022–2026 · CGPA 8.4/10
          </p>
          <Link className="text-link" href="/research">
            My SIIN research ↗
          </Link>
        </div>
      </section>
      <section className="photo-notes">
        <div className="section-heading">
          <h2>A few frames from life.</h2>
          <a
            href="https://www.instagram.com/thebackendagent/"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            @thebackendagent ↗
          </a>
        </div>
        <div className="photo-grid">
          <figure className="event-photo">
            <Image
              src="/photos/cloud-event.webp"
              alt="Shyam presenting YoLearn's cloud migration at a Redington and CloudTry event held in collaboration with AWS"
              width={1500}
              height={2666}
              sizes="(max-width:760px) calc(100vw - 40px), 460px"
            />
            <figcaption>
              Representing YoLearn at a cloud partner event, in collaboration
              with AWS.
            </figcaption>
          </figure>
          <figure>
            <Image
              src="/photos/at-work.webp"
              alt="Shyam working on a laptop in the office"
              width={900}
              height={1600}
            />
            <figcaption>Most days look a little like this.</figcaption>
          </figure>
          <figure>
            <Image
              src="/photos/off-duty.webp"
              alt="Shyam at the gym"
              width={800}
              height={1422}
            />
            <figcaption>Different kind of progressive overload.</figcaption>
          </figure>
        </div>
      </section>
      <GitHubActivity />
      <section className="small-transmissions">
        <div>
          <h2>Small transmissions.</h2>
          <p>
            I share what I’m learning about LLMs, agents, and the work of
            building software as{" "}
            <a
              href="https://www.instagram.com/thebackendagent/"
              target="_blank"
              rel="noreferrer"
            >
              @thebackendagent ↗
            </a>
            .
          </p>
          <p>
            The longer thoughts live in <Link href="/blog">the notebook</Link>.
          </p>
        </div>
        <figure><Image src="/photos/interview.webp" alt="Shyam in a technical conversation with colleagues at the office" width={1100} height={1956} /><figcaption>Technical conversations, away from the editor.</figcaption></figure>
      </section>
    </main>
  );
}
