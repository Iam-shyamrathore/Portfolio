import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import { WorkExplorer } from "@/components/work-explorer";
export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected AI systems, cloud infrastructure, apps, and research, with the decisions behind them.",
};
export default function Work() {
  return (
    <main id="main" className="shell page-main">
      <header className="page-intro">
        <h1>Projects & company work</h1>
        <p>
          The systems I build, and the problems I work through inside them.
          <br />
          Open a project for specific contributions, decisions, and tradeoffs.
        </p>
      </header>
      <WorkExplorer projects={projects} />
      <aside className="private-note">
        <h2>A note on company work</h2>
        <p>
          I share the kinds of problems I solve and my engineering
          responsibilities. Company source code, internal endpoints, customer
          data, and operational details stay private.
        </p>
      </aside>
    </main>
  );
}
