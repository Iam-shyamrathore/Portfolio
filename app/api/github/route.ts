import { getActivity } from "@/lib/github";
export const revalidate = 3600;
export async function GET() {
  return Response.json(await getActivity(), {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
