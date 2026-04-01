import express from "express";
import next from "next";
import { randomUUID } from "node:crypto";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = Number(process.env.PORT) || 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const notes: Note[] = [];

app.prepare().then(() => {
  const server = express();
  server.use(express.json());

  server.post("/notes", (req, res) => {
    const title = String(req.body?.title ?? "").trim();
    const content = String(req.body?.content ?? "").trim();

    if (!title || !content) {
      return res.status(400).json({ message: "title and content are required" });
    }

    const now = new Date().toISOString();
    const note: Note = {
      id: randomUUID(),
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };
    notes.unshift(note);
    return res.status(201).json(note);
  });

  server.get("/notes", (_req, res) => {
    return res.status(200).json(notes);
  });

  server.get("/notes/:id", (req, res) => {
    const note = notes.find((item) => item.id === req.params.id);
    if (!note) {
      return res.status(404).json({ message: "note not found" });
    }
    return res.status(200).json(note);
  });

  server.put("/notes/:id", (req, res) => {
    const noteIndex = notes.findIndex((item) => item.id === req.params.id);
    if (noteIndex === -1) {
      return res.status(404).json({ message: "note not found" });
    }

    const nextTitle = req.body?.title;
    const nextContent = req.body?.content;

    if (typeof nextTitle === "string" && !nextTitle.trim()) {
      return res.status(400).json({ message: "title cannot be empty" });
    }

    if (typeof nextContent === "string" && !nextContent.trim()) {
      return res.status(400).json({ message: "content cannot be empty" });
    }

    const current = notes[noteIndex];
    const updated: Note = {
      ...current,
      title:
        typeof nextTitle === "string" ? nextTitle.trim() : current.title,
      content:
        typeof nextContent === "string"
          ? nextContent.trim()
          : current.content,
      updatedAt: new Date().toISOString(),
    };
    notes[noteIndex] = updated;
    return res.status(200).json(updated);
  });

  server.delete("/notes/:id", (req, res) => {
    const noteIndex = notes.findIndex((item) => item.id === req.params.id);
    if (noteIndex === -1) {
      return res.status(404).json({ message: "note not found" });
    }

    notes.splice(noteIndex, 1);
    return res.status(200).json({ message: "note deleted" });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Server listening on http://${hostname}:${port}`);
  });
});
