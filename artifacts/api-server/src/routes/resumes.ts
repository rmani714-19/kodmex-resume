import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { resumesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  CreateResumeBody,
  UpdateResumeBody,
  GetAtsScoreBody,
  EnhanceResumeBody,
} from "@workspace/api-zod";
import { calculateAtsScore, enhanceContent } from "../lib/ats-scorer.js";

const router: IRouter = Router();

router.get("/resumes", async (req, res) => {
  try {
    const resumes = await db.select().from(resumesTable).orderBy(resumesTable.updatedAt);
    res.json(resumes.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list resumes");
    res.status(500).json({ error: "Failed to list resumes" });
  }
});

router.post("/resumes", async (req, res) => {
  try {
    const body = CreateResumeBody.parse(req.body);
    const [resume] = await db
      .insert(resumesTable)
      .values({
        title: body.title,
        content: body.content as Record<string, unknown>,
        template: body.template || "modern",
      })
      .returning();
    res.status(201).json({
      ...resume,
      createdAt: resume.createdAt.toISOString(),
      updatedAt: resume.updatedAt.toISOString(),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid request body", details: err.issues });
      return;
    }
    req.log.error({ err }, "Failed to create resume");
    res.status(500).json({ error: "Failed to create resume" });
  }
});

router.get("/resumes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [resume] = await db.select().from(resumesTable).where(eq(resumesTable.id, id));
    if (!resume) {
      res.status(404).json({ error: "Resume not found" });
      return;
    }
    res.json({
      ...resume,
      createdAt: resume.createdAt.toISOString(),
      updatedAt: resume.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get resume");
    res.status(500).json({ error: "Failed to get resume" });
  }
});

router.put("/resumes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const body = UpdateResumeBody.parse(req.body);
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.template !== undefined) updateData.template = body.template;
    if (body.lastAtsScore !== undefined) updateData.lastAtsScore = body.lastAtsScore;

    const [updated] = await db
      .update(resumesTable)
      .set(updateData as Parameters<typeof resumesTable.$inferInsert>[0] & { updatedAt: Date })
      .where(eq(resumesTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Resume not found" });
      return;
    }
    res.json({
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    req.log.error({ err }, "Failed to update resume");
    res.status(500).json({ error: "Failed to update resume" });
  }
});

router.delete("/resumes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [deleted] = await db
      .delete(resumesTable)
      .where(eq(resumesTable.id, id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Resume not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete resume");
    res.status(500).json({ error: "Failed to delete resume" });
  }
});

router.post("/resumes/:id/ats-score", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [resume] = await db.select().from(resumesTable).where(eq(resumesTable.id, id));
    if (!resume) {
      res.status(404).json({ error: "Resume not found" });
      return;
    }

    const body = GetAtsScoreBody.parse(req.body);
    const result = calculateAtsScore(resume.content as Parameters<typeof calculateAtsScore>[0], body.jobDescription);

    await db
      .update(resumesTable)
      .set({ lastAtsScore: result.overallScore, updatedAt: new Date() })
      .where(eq(resumesTable.id, id));

    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    req.log.error({ err }, "Failed to calculate ATS score");
    res.status(500).json({ error: "Failed to calculate ATS score" });
  }
});

router.post("/resumes/:id/enhance", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [resume] = await db.select().from(resumesTable).where(eq(resumesTable.id, id));
    if (!resume) {
      res.status(404).json({ error: "Resume not found" });
      return;
    }
    const body = EnhanceResumeBody.parse(req.body);
    const result = enhanceContent(
      body.section,
      body.currentContent,
      body.context,
      body.jobDescription
    );
    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    req.log.error({ err }, "Failed to enhance resume");
    res.status(500).json({ error: "Failed to enhance resume" });
  }
});

export default router;
