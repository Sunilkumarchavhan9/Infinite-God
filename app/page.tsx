"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  PencilLine,
  Plus,
  Server,
  StickyNote,
  Trash2,
} from "lucide-react";
import Button from "@/components/Button";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const TABS = ["What's Hot"];

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitLabel = useMemo(
    () => (editingId ? "Update Note" : "Create Note"),
    [editingId],
  );
  const totalChars = title.length + content.length;

  async function loadNotes() {
    try {
      setError(null);
      const response = await fetch("/notes");
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = (await response.json()) as Note[];
      setNotes(data);
    } catch {
      setError("Could not load notes.");
    } finally {
      setIsLoadingList(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setError(null);
      setIsSaving(true);

      const payload = {
        title: title.trim(),
        content: content.trim(),
      };

      if (editingId) {
        const response = await fetch(`/notes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error("Failed to update note");
        }
      } else {
        const response = await fetch("/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error("Failed to create note");
        }
      }

      setTitle("");
      setContent("");
      setEditingId(null);
      await loadNotes();
    } catch {
      setError("Unable to save note. Check title/content and try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setError(null);
      setDeletingId(id);
      const response = await fetch(`/notes/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete note");
      }
      if (editingId === id) {
        setEditingId(null);
        setTitle("");
        setContent("");
      }
      await loadNotes();
    } catch {
      setError("Unable to delete note.");
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setContent("");
  }

  return (
    <main className="min-h-screen bg-[#f3f3f4] px-2 py-2 text-zinc-900 sm:px-3 sm:py-3">
      <section className="mx-auto min-h-[calc(100vh-24px)] w-full max-w-[1320px] border border-zinc-300 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-zinc-200 px-3 py-3 sm:px-5">
          <div className="inline-flex items-center gap-2 text-sm font-semibold">
            <span className="grid h-3 w-3 place-content-center rounded-sm bg-zinc-900 text-[8px] text-white">
              +
            </span>
            launch
          </div>
        </header>

        <section className="relative isolate min-h-[360px] overflow-hidden border-b border-zinc-200 px-3 sm:min-h-[430px] sm:px-5">
          <div className="hero-band absolute inset-0">
            <div className="hero-dots absolute inset-0" />
            <div className="hero-cloud absolute inset-0" />
          </div>

          <div className="relative z-10 grid min-h-[320px] gap-4 pt-[135px] pb-4 sm:min-h-[390px] sm:pt-[188px] lg:grid-cols-[1fr,360px] lg:items-end">
            <div>
              <p className="text-[clamp(2.2rem,11vw,3.45rem)] leading-[0.96] tracking-tight text-zinc-700">
                Create notes
              </p>
              <h1 className="text-[clamp(2.4rem,12vw,3.57rem)] leading-[0.95] tracking-tight text-zinc-950">
                Manage with CRUD
              </h1>
            </div>
            <p className="max-w-[320px] text-sm leading-relaxed text-zinc-500 lg:justify-self-end">
              Built for this assignment: Express + Node Notes API with full
              create/read/update/delete flow and loading-aware UI actions.
            </p>
          </div>
        </section>

        <nav className="flex gap-x-5 gap-y-2 overflow-x-auto whitespace-nowrap border-b border-zinc-200 px-3 py-3 text-xs text-zinc-500 sm:px-5">
          {TABS.map((tab, index) => (
            <span
              key={tab}
              className={
                index === 0
                  ? "font-semibold text-zinc-900 underline decoration-zinc-900 underline-offset-4"
                  : ""
              }
            >
              {tab}
            </span>
          ))}
        </nav>

        <section className="space-y-4 px-3 py-3 sm:px-4 sm:py-4">
          <article className="rounded-xl border border-zinc-300 bg-zinc-50 p-3 sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] font-semibold text-zinc-600">
                <Server className="h-3.5 w-3.5" />
                Endpoint: {editingId ? "PUT /notes/:id" : "POST /notes"}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] text-zinc-500">
                <StickyNote className="h-3.5 w-3.5" />
                {notes.length} total records
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Project title"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-950"
              />
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Describe your note..."
                rows={5}
                className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-950"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <p className="text-xs text-zinc-500">Payload: {totalChars} chars</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="submit"
                    loading={isSaving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-950 bg-zinc-950 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    {submitLabel}
                  </Button>
                  {editingId ? (
                    <Button
                      type="button"
                      onClick={cancelEdit}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 sm:w-auto"
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </div>
            </form>

            {error ? (
              <p className="mt-3 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700">
                {error}
              </p>
            ) : null}
          </article>

          {isLoadingList ? (
            <article className="rounded-xl border border-zinc-300 bg-white p-5 text-sm text-zinc-500">
              Loading notes...
            </article>
          ) : notes.length === 0 ? (
            <article className="rounded-xl border border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
              No notes yet. Add your first note above.
            </article>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {notes.map((note, index) => (
                <article
                  key={note.id}
                  className="overflow-hidden rounded-xl border border-zinc-300 bg-white"
                >
                  <div
                    className={`dither-surface border-b border-zinc-300 p-3 ${
                      index % 2 === 0 ? "dither-a" : "dither-b"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="rounded-full border border-zinc-300 bg-white px-2 py-0.5 font-semibold text-zinc-700">
                        Project of the day
                      </span>
                      <span className="rounded-full border border-zinc-300 bg-white px-2 py-0.5 text-zinc-600">
                        AI
                      </span>
                    </div>
                    <div className="h-32 sm:h-44" />
                  </div>

                  <div className="p-3 sm:p-4">
                    <h3 className="text-[clamp(1.45rem,6vw,1.95rem)] leading-[1.05] tracking-tight text-zinc-900">
                      {note.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                      {note.content}
                    </p>
                    <div className="mt-3 rounded-lg border border-zinc-300 bg-zinc-50 px-2.5 py-1.5 text-[11px] text-zinc-600">
                      <span className="font-semibold text-zinc-700">ID:</span>{" "}
                      <span className="break-all font-mono">{note.id}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] text-zinc-600">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {new Date(note.updatedAt).toLocaleString()}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        onClick={() => startEdit(note)}
                        className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-100"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <PencilLine className="h-3.5 w-3.5" />
                          Edit
                        </span>
                      </Button>
                      <Button
                        type="button"
                        loading={deletingId === note.id}
                        onClick={() => handleDelete(note.id)}
                        className="rounded-lg border border-zinc-950 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </span>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
