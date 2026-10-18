import snapshot from "@/data/github.json";
export type Activity = typeof snapshot & { source: "snapshot" | "github" };
export const githubQuery = `query { user(login: "Iam-shyamrathore") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`;
export async function getActivity(): Promise<Activity> {
  if (process.env.GITHUB_TOKEN) {
    try {
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: githubQuery }),
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error("GitHub unavailable");
      const payload = await response.json();
      const calendar =
        payload.data?.user?.contributionsCollection?.contributionCalendar;
      if (
        payload.errors ||
        !calendar ||
        !Array.isArray(calendar.weeks) ||
        typeof calendar.totalContributions !== "number"
      )
        throw new Error("Invalid GitHub response");
      return {
        username: snapshot.username,
        fetchedAt: new Date().toISOString(),
        ...calendar,
        source: "github",
      };
    } catch {
      /* Retain the dated, real snapshot when GitHub cannot be reached. */
    }
  }
  return { ...snapshot, source: "snapshot" };
}
