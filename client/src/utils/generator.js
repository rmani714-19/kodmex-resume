import { appConfig } from "@shared/config.js";
import { autoGenerateResume, normalizeResumeData } from "@shared/resumeEngine.js";

export const sampleProfiles = appConfig.sampleResumes.map((sample) => ({
  id: sample.id,
  label: sample.label,
  data: normalizeResumeData(sample.data)
}));

export function generateResume(resumeData) {
  return autoGenerateResume(resumeData);
}
