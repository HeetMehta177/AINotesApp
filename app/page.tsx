"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote, deleteNote, updateNote } from "@/lib/notes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { summarizeNote } from "@/lib/summarize";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { NoteDialog } from "@/components/NoteDialog";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState<{
    id: string;
    title: string;
    content: string;
  } | null>(null);
  const [summaries, setSummaries] = useState<{ [id: string]: string }>({});
  const [loadingSummary, setLoadingSummary] = useState(false);

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  const handleSummarize = async (note: { id: string; content: string }) => {
    setLoadingSummary(true);
    try {
      const summary = await summarizeNote(note.content);
      setSummaries((prev) => ({ ...prev, [note.id]: summary }));
    } catch (err) {
      console.error("Failed to summarize:", err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setSelectedNote(newNote);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, title, content }: any) =>
      updateNote(id, { title, content }),
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setSelectedNote(null);
    },
  });

  const filteredNotes = notes?.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleNewNote = () => {
    setSelectedNote({
      id: "",
      title: "",
      content: "",
    });
  };

  const handleSaveNote = (note: {
    id: string;
    title: string;
    content: string;
  }) => {
    if (!note.id) {
      createMutation.mutate(
        {
          title: note.title || "Untitled Note",
          content: note.content || "",
        },
        {
          onSuccess: () => {
            setSelectedNote(null);
            queryClient.invalidateQueries({ queryKey: ["notes"] });
          },
        }
      );
    } else {
      updateMutation.mutate(
        {
          id: note.id,
          title: note.title || "Untitled Note",
          content: note.content || "",
        },
        {
          onSuccess: () => {
            setSelectedNote(null);
            queryClient.invalidateQueries({ queryKey: ["notes"] });
          },
        }
      );
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    // window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Notes</h1>
          {user ? (
            <div>
              <Button
                onClick={handleNewNote}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Button>
              <Button
                onClick={logout}
                variant="destructive"
                className="bg-violet-600 hover:bg-violet-700"
              >
                Log Out
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => router.push("/login")}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Sign in
            </Button>
          )}
        </div>
        {user ? (
          <>
            <Input
              type="search"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Loading notes...
                </div>
              ) : filteredNotes?.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No notes found
                </div>
              ) : (
                filteredNotes?.map((note) => (
                  <Card
                    key={note.id}
                    className="p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => user && setSelectedNote(note)}
                  >
                    <h2 className="font-semibold text-xl mb-2 line-clamp-1">
                      {note.title || "Untitled Note"}
                    </h2>
                    <p className="text-gray-600 line-clamp-3">
                      {note.content || "No content"}
                    </p>
                    <p className="text-sm text-gray-400 mt-4">
                      {formatDistanceToNow(new Date(note.updated_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </Card>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Please sign in to view your notes.
          </div>
        )}
        {user && (
          <NoteDialog
            isOpen={!!selectedNote}
            onClose={() => setSelectedNote(null)}
            note={selectedNote}
            onSave={handleSaveNote}
            onDelete={(id) => {
              deleteMutation.mutate(id);
              setSelectedNote(null);
            }}
            onSummarize={handleSummarize}
            isLoading={loadingSummary}
            summary={selectedNote ? summaries[selectedNote.id] : null}
          />
        )}
      </div>
    </div>
  );
}
