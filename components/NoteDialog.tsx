import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Loader2, Save, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface NoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  note: { id: string; title: string; content: string } | null;
  onSave: (note: { id: string; title: string; content: string }) => void;
  onDelete: (id: string) => void;
  onSummarize: (note: { id: string; content: string }) => void;
  isLoading: boolean;
  summary: string | null;
}

export function NoteDialog({
  isOpen,
  onClose,
  note,
  onSave,
  onDelete,
  onSummarize,
  isLoading,
  summary,
}: NoteDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  if (!note) return null;

  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);

    onSave({
      id: note?.id || "",
      title: title.trim(),
      content: content.trim(),
    });

    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto overflow-x-hidden bg-gradient-to-b from-white to-indigo-50 border border-indigo-100 shadow-xl rounded-xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-800 flex items-center gap-2">
            <div className="bg-indigo-100 p-1 rounded-full">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            Edit Note
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 flex flex-col">
          <Input
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg max-w-[560px] border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-sm"
          />
          <Textarea
            placeholder="Write your note content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[180px] max-w-[560px] text-base border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-sm resize-none"
          />
          {summary && (
            <div className="p-5 max-w-[560px] rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-200 shadow-inner animate-fadeIn">
              <h4 className="font-semibold mb-2 text-indigo-900 flex items-center gap-2">
                <div className="bg-indigo-100 p-1 rounded-full">
                  <FileText className="h-4 w-4 text-indigo-600" />
                </div>
                AI Summarization
              </h4>
              <p className="text-sm text-indigo-700 leading-relaxed">
                {summary}
              </p>
            </div>
          )}
          <div className="flex justify-between items-center pt-4 border-t border-indigo-100">
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(note.id);
                onClose();
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white transition-all duration-300 hover:translate-y-px flex items-center gap-2 shadow-sm"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={() => onSummarize(note)}
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border border-indigo-200 transition-all duration-300 hover:translate-y-px shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Summarize with AI
                  </>
                )}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 hover:translate-y-px flex items-center gap-2 shadow-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Note
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
