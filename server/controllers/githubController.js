import { fetchGithubProjects } from "../services/githubService.js";

export async function githubProjects(request, response) {
  const username = String(request.query.username || "").trim();

  if (!username) {
    response.status(400).json({
      message: "username query parameter is required"
    });
    return;
  }

  try {
    const payload = await fetchGithubProjects(username);
    response.json(payload);
  } catch (error) {
    response.status(500).json({
      message: "Unable to fetch GitHub repositories",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
