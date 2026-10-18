import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Download } from "lucide-react";
export const metadata: Metadata = {
  title: "Research",
  description:
    "SIIN: developer skill inference through heterogeneous graphs, MCTS, and Dempster–Shafer theory. Manuscript and code.",
};
export default function Research() {
  return (
    <main id="main" className="shell page-main research-page">
      <header className="page-intro">
        <h1>
          Follow the evidence.
          <br />
          <em>Keep asking questions.</em>
        </h1>
        <p>
          Research at the intersection of graphs, reasoning, and the uncertainty
          in what we think we know.
        </p>
      </header>
      <section className="research-paper">
        <a
          className="paper-preview"
          href="/research/siin-manuscript.pdf"
          target="_blank"
          rel="noreferrer"
          aria-label="Open the eight-page SIIN manuscript PDF"
        >
          <Image
            src="/research/siin-first-page.webp"
            alt="First page of the SIIN manuscript"
            width={620}
            height={877}
          />
          <span>
            Read the manuscript <ArrowUpRight size={15} aria-hidden="true" />
          </span>
        </a>
        <div className="paper-summary">
          <p className="paper-status">Unpublished manuscript · 8 pages</p>
          <h2>
            SIIN: Skill Inference Information Network for Developer Profiling
            Using MCTS and Dempster-Shafer Theory
          </h2>
          <p className="paper-authors">
            Garima Verma, Shyam, and Atul Kirti
            <br />
            <span>Department of CSE, Galgotias University</span>
          </p>
          <p>
            What can a developer’s repository history tell us beyond the
            keywords on their profile?
          </p>
          <p>
            SIIN models activity as a heterogeneous information network, uses
            LLM-guided Monte Carlo Tree Search to explore skill evidence, and
            combines that evidence through Dempster–Shafer belief and
            plausibility with Yager conflict handling.
          </p>
          <p className="study-limit">
            The paper reports an exploratory study of five developers. Its
            findings belong to that small evaluation; broader generalization
            needs further validation.
          </p>
          <div className="paper-links">
            <a
              className="text-link"
              href="/research/siin-manuscript.pdf"
              download
            >
              <Download size={15} aria-hidden="true" /> Download paper{" "}
              <span className="muted">(19.4 MB)</span>
            </a>
            <a
              className="text-link"
              href="https://github.com/Iam-shyamrathore/graph-skill-infrence"
              target="_blank"
              rel="noreferrer"
            >
              Explore the code <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
      <section className="research-questions">
        <h2>Questions I’m interested in.</h2>
        <div>
          <p>How do we make agent decisions inspectable?</p>
          <p>How should systems express conflicting evidence?</p>
          <p>What should persist when a conversation ends?</p>
        </div>
      </section>
      <Link className="text-link" href="/work/siin">
        How SIIN is built <ArrowUpRight size={15} aria-hidden="true" />
      </Link>
    </main>
  );
}
