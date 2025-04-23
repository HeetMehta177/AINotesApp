"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote, deleteNote, updateNote } from "@/lib/notes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

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
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(note.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
