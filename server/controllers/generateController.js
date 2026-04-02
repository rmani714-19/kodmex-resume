import { generateResumePayload } from "../services/generateService.js";

export function generateResume(request, response) {
  const { resumeData = {}, jobDescription = "" } = request.body || {};

  response.json(generateResumePayload({ resumeData, jobDescription }));
}
