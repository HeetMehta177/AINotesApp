"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote, deleteNote, updateNote } from "@/lib/notes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { summarizeNote } from "@/lib/summarize";

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summaries, setSummaries] = useState<{ [id: string]: string }>({});
  const [loadingSummaries, setLoadingSummaries] = useState<{
    [id: string]: boolean;
  }>({});

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  const handleSummarize = async (note: any) => {
    setLoadingSummaries((prev) => ({ ...prev, [note.id]: true }));
    try {
      const summary = await summarizeNote(note.content);
      setSummaries((prev) => ({ ...prev, [note.id]: summary }));
    } catch (err) {
      console.error("Failed to summarize:", err);
    } finally {
      setLoadingSummaries((prev) => ({ ...prev, [note.id]: false }));
    }
  };

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setTitle("");
      setContent("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, title, content }: any) =>
      updateNote(id, { title, content }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <div className="space-y-2">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={() => createMutation.mutate({ title, content })}>
          Create Note
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading && <p>Loading notes...</p>}
        {notes?.map((note) => (
          <div key={note.id} className="p-4 border rounded-lg space-y-2">
            <Input
              value={note.title}
              onChange={(e) =>
                updateMutation.mutate({
                  id: note.id,
                  title: e.target.value,
                  content: note.content,
                })
              }
            />
            <Textarea
              value={note.content}
              onChange={(e) =>
                updateMutation.mutate({
                  id: note.id,
                  content: e.target.value,
                  title: note.title,
                })
              }
            />
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate(note.id)}
              >
                Delete
              </Button>
              <Button onClick={() => handleSummarize(note)}>
                {loadingSummaries[note.id] ? "Summarizing..." : "Summarize"}
              </Button>
            </div>
            {summaries[note.id] && (
              <div className="mt-2 p-2 rounded-md bg-gray-100 text-sm">
                <strong>Summary:</strong> {summaries[note.id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
