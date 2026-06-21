import { questions } from "@/data/questions";

export function GET() {
  return Response.json(questions, {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
