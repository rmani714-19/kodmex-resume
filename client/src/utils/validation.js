import { validateResumeData } from "@shared/resumeEngine.js";

export function validateQuickStart(values) {
  return validateResumeData(values);
}
