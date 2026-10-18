import { getActivity } from "@/lib/github";
import { ArrowUpRight } from "lucide-react";
export async function GitHubActivity({
  compact = false,
}: {
  compact?: boolean;
}) {
  const activity = await getActivity();
  const weeks = compact ? activity.weeks.slice(-26) : activity.weeks;
  const levels: Record<string, number> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };
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
        <div
          className="contribution-scroll"
          tabIndex={0}
          role="region"
          aria-label={`${compact ? "Last six months" : "Past year"} of GitHub contributions, scroll horizontally`}
        >
          <div
            className="contribution-grid"
            role="img"
            aria-label={`${activity.totalContributions} contributions in the past year; darker blue indicates more activity.`}
          >
            {weeks.map((week, i) => (
              <div className="contribution-week" key={i}>
                {week.contributionDays.map((day) => (
                  <span
                    key={day.date}
                    data-level={levels[day.contributionLevel] ?? 0}
                    title={`${day.date}: ${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <figcaption>
          <span>
            {activity.source === "snapshot"
              ? "GitHub snapshot"
              : "Synced from GitHub"}{" "}
            · {updated}
            {compact ? " · last 6 months shown" : ""}
          </span>
          <span className="activity-legend">
            Less{" "}
            {[0, 1, 2, 3, 4].map((level) => (
              <i key={level} data-level={level} />
            ))}{" "}
            More
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
