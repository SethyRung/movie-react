import { parseListPage } from "@/lib/discovery-list";
import { isServiceError } from "@/services/error";
import { searchMovies } from "@/services/movie/queries";

const EMPTY_PAGE = {
  results: [],
  page: 1,
  total_pages: 0,
  total_results: 0,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const page = parseListPage(searchParams.get("page") ?? undefined);

  if (!query) {
    return Response.json(EMPTY_PAGE);
  }

  try {
    const data = await searchMovies(query, { page });
    return Response.json(data);
  } catch (error) {
    const serviceError = isServiceError(error)
      ? error
      : { code: "UNKNOWN_ERROR", message: "An unexpected error occurred." };

    return Response.json(
      { code: serviceError.code, message: serviceError.message },
      { status: serviceError.statusCode ?? 500 },
    );
  }
}
