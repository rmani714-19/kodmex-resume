import axios from "axios";
import { appConfig } from "@shared/config.js";

export const api = axios.create({
  baseURL: "/api"
});

export async function requestAtsScore(payload) {
  const response = await api.post(appConfig.backend.routes.atsScore.replace("/api", ""), payload);
  return response.data;
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("resume", file);
  const response = await api.post(appConfig.backend.routes.uploadResume.replace("/api", ""), formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
}

export async function requestGeneratedResume(payload) {
  const response = await api.post(appConfig.backend.routes.generateResume.replace("/api", ""), payload);
  return response.data;
}

export async function requestGithubProjects(username) {
  const response = await api.get(appConfig.backend.routes.githubProjects.replace("/api", ""), {
    params: { username }
  });
  return response.data;
}
