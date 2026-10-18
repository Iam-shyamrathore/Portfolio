import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
const query =
  'query { user(login:"Iam-shyamrathore") { login followers { totalCount } allPublic: repositories(first:1,privacy:PUBLIC,ownerAffiliations:OWNER) { totalCount } originals: repositories(first:100,privacy:PUBLIC,ownerAffiliations:OWNER,isFork:false) { totalCount nodes { stargazerCount } pageInfo { hasNextPage } } contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }';
try {
  const payload = JSON.parse(
    execFileSync("gh", ["api", "graphql", "-f", `query=${query}`], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }),
  );
  const calendar =
    payload.data?.user?.contributionsCollection?.contributionCalendar;
  if (
    payload.errors ||
    !calendar?.weeks ||
    typeof calendar.totalContributions !== "number"
  )
    throw new Error("Missing contribution calendar");
  const user = payload.data.user;
  if (
    !user.originals?.nodes ||
    user.originals.pageInfo.hasNextPage ||
    typeof user.allPublic?.totalCount !== "number"
  )
    throw new Error("Incomplete public repository totals");
  const fetchedAt = new Date().toISOString();
  writeFileSync(
    new URL("../data/github.json", import.meta.url),
    JSON.stringify(
      {
        username: "Iam-shyamrathore",
        fetchedAt,
        ...calendar,
      },
      null,
      2,
    ) + "\n",
  );
  writeFileSync(
    new URL("../data/profile.json", import.meta.url),
    JSON.stringify(
      {
        username: user.login,
        fetchedAt,
        stars: user.originals.nodes.reduce(
          (sum, repo) => sum + repo.stargazerCount,
          0,
        ),
        publicRepositories: user.allPublic.totalCount,
        originalPublicRepositories: user.originals.totalCount,
        followers: user.followers.totalCount,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `Saved ${calendar.totalContributions} contributions. Only dates, counts, and activity levels are stored.`,
  );
} catch {
  console.error(
    "Could not refresh GitHub. Check that the GitHub CLI is installed and signed in with `gh auth status`. The existing snapshot was preserved.",
  );
  process.exitCode = 1;
}
