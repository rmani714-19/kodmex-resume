import { extractResumePayload } from "../services/uploadService.js";

export async function parseUpload(request, response) {
  if (!request.file) {
    response.status(400).json({
      message: "resume file is required"
    });
    return;
  }

  try {
    const payload = await extractResumePayload(request.file);
    response.json(payload);
  } catch (error) {
    response.status(500).json({
      message: "Unable to parse uploaded resume",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
