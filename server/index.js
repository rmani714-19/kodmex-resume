import cors from "cors";
import express from "express";
import { appConfig } from "../shared/config.js";
import atsRoutes from "./routes/atsRoutes.js";
import generateRoutes from "./routes/generateRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();
const serverPort = Number(process.env.PORT || appConfig.backend.port || 5001);

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_request, response) => {
  response.json({
    status: "ok",
    service: appConfig.project.name,
    port: serverPort
  });
});

app.use(appConfig.backend.routes.atsScore, atsRoutes);
app.use(appConfig.backend.routes.uploadResume, uploadRoutes);
app.use(appConfig.backend.routes.generateResume, generateRoutes);
app.use(appConfig.backend.routes.githubProjects, githubRoutes);

app.listen(serverPort, () => {
  console.log(`KodMex server listening on http://localhost:${serverPort}`);
});
