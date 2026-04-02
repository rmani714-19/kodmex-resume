import { mapGithubReposToProjects } from "../../shared/resumeEngine.js";

export async function fetchGithubProjects(username) {
  const apiResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "kodmex-resume-builder"
    }
  });

  if (!apiResponse.ok) {
    throw new Error(`GitHub API returned ${apiResponse.status}`);
  }

  const repositories = await apiResponse.json();

  return {
    repositories,
    projects: mapGithubReposToProjects(repositories)
  };
}
