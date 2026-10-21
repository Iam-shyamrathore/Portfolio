import { getActivity } from "@/lib/github";
import { ArrowUpRight } from "lucide-react";
import ContributionSkyline from "@/components/ui/contribution-skyline";
export async function GitHubActivity({
  compact = false,
}: {
  compact?: boolean;
}) {
  const activity = await getActivity();
  const days = activity.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 }[day.contributionLevel],
    })),
  );
  const updated = new Date(activity.fetchedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
  return (
    <section
      className={`github-activity ${compact ? "github-compact" : ""}`}
      aria-label="GitHub contributions"
    >
      <div className="activity-heading">
        <div>
          <h2>GitHub activity</h2>
          <p>
            <strong>
              {activity.totalContributions.toLocaleString("en-IN")}
            </strong>{" "}
            contributions in the past year
          </p>
        </div>
        <a
          className="text-link"
          href="https://github.com/Iam-shyamrathore?tab=overview"
          target="_blank"
          rel="noreferrer"
        >
          On GitHub <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
      <figure>
        <ContributionSkyline
          data={days}
          weeksToShow={compact ? 26 : 53}
          palette={["#c7d9ef", "#88acd8", "#4e79b2", "#2d5195"]}
          title="Daily contributions"
          defaultView="2d"
          showStats={!compact}
          showLegend={!compact}
          locale="en-GB"
          className={compact ? "skyline-compact" : undefined}
        />
        <figcaption>
          <span>
            {activity.source === "snapshot"
              ? "GitHub snapshot"
              : "Synced from GitHub"}{" "}
            · {updated}
            {compact ? " · last 26 weeks shown" : ""}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
