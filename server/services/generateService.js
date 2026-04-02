import { autoGenerateResume, createResumeText, scoreResume, validateResumeData } from "../../shared/resumeEngine.js";

export function generateResumePayload({ resumeData, jobDescription = "" }) {
  const validation = validateResumeData(resumeData);
  const resume = autoGenerateResume(validation.resume);
  const ats = scoreResume({
    resume,
    resumeText: createResumeText(resume),
    jobDescription
  });

  return {
    resume,
    ats,
    validation
  };
}
