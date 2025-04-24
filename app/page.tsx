"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote, deleteNote, updateNote } from "@/lib/notes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { summarizeNote } from "@/lib/summarize";
import { Card } from "@/components/ui/card";
import { LogOut, Plus, Search } from "lucide-react";
import { NoteDialog } from "@/components/NoteDialog";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
interface UpdateNoteParams {
  id: string;
  title: string;
  content: string;
}
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
    mutationFn: ({ id, title, content }: UpdateNoteParams) =>
      updateNote(id, { title, content }),
    onSuccess: () => {
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
    <div className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-purple-100 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-2">
            Smart Notes
          </h1>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
            {user ? (
              <>
                <Button
                  onClick={handleNewNote}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25 text-xs sm:text-sm"
                >
                  <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  New Note
                </Button>
                <Button
                  variant="destructive"
                  onClick={logout}
                  className="shadow-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 transition-all duration-300 hover:shadow-rose-500/25 text-xs sm:text-sm"
                >
                  <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Log Out
                </Button>
              </>
            ) : null}
          </div>
        </div>

        {user ? (
          <>
            <div className="relative max-w-2xl mx-auto w-full px-2 sm:px-0">
              <Search
                className="absolute left-5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-1 bg-white/70 backdrop-blur-sm shadow-xl focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 rounded-xl w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-8 sm:py-12">
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-indigo-300/50 backdrop-blur-sm"></div>
                    <div className="space-y-2">
                      <div className="h-3 sm:h-4 w-24 sm:w-32 rounded bg-indigo-300/50 backdrop-blur-sm"></div>
                      <div className="h-3 sm:h-4 w-32 sm:w-48 rounded bg-indigo-200/50 backdrop-blur-sm"></div>
                    </div>
                  </div>
                </div>
              ) : filteredNotes?.length === 0 ? (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <p className="text-gray-600 text-base sm:text-lg font-medium">
                    No notes found.
                  </p>
                  <p className="text-gray-500 mt-2 text-sm sm:text-base">
                    Create a new note to get started!
                  </p>
                </div>
              ) : (
                filteredNotes?.map((note) => (
                  <Card
                    key={note.id}
                    onClick={() => user && setSelectedNote(note)}
                    className="cursor-pointer bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white/90 p-4 sm:p-5 border-1 rounded-xl overflow-hidden group"
                  >
                    <h2 className="text-base sm:text-lg font-semibold text-indigo-900 truncate group-hover:text-indigo-700 transition-colors">
                      {note.title || "Untitled Note"}
                    </h2>
                    <p className="text-xs sm:text-sm text-indigo-950 line-clamp-3 mt-1 sm:mt-2 group-hover:text-gray-800">
                      {note.content || "No content"}
                    </p>
                    <div className="flex justify-between items-center mt-3 sm:mt-4">
                      <p className="text-xs text-gray-500 italic">
                        {formatDistanceToNow(new Date(note.updated_at), {
                          addSuffix: true,
                        })}
                      </p>
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="animate-fade-in-up px-2 sm:px-0">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-pulse" />
              <div className="text-center bg-white/70 backdrop-blur-md py-10 sm:py-20 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/40 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent opacity-50" />
                <div className="relative z-20 px-4 sm:px-6 space-y-4 sm:space-y-8">
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 sm:mb-4 pb-2 sm:pb-4 animate-fade-in">
                      ✨ Welcome to Smart Notes
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-2">
                      Your personal space for capturing thoughts, ideas, and
                      memories. Sign in to start your journey.
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-4 sm:gap-6 pt-2 sm:pt-4">
                    <Button
                      onClick={() => router.push("/login")}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-6 rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 group"
                    >
                      <span className="relative">
                        Get Started
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform group-hover:scale-x-100" />
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {user && selectedNote && (
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
