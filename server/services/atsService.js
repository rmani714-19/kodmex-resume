import { scoreResume } from "../../shared/resumeEngine.js";

export function calculateAtsScore({ resume, resumeText, jobDescription }) {
  return scoreResume({
    resume,
    resumeText,
    jobDescription
  });
}
