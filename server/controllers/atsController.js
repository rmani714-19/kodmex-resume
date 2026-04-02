import { calculateAtsScore } from "../services/atsService.js";

export function scoreAts(request, response) {
  const { resume = null, resumeText = "", jobDescription = "", jobDesc = "" } = request.body || {};

  if (!resume && !resumeText.trim()) {
    response.status(400).json({
      message: "resume or resumeText is required"
    });
    return;
  }

  response.json(calculateAtsScore({ resume, resumeText, jobDescription: jobDescription || jobDesc }));
}
