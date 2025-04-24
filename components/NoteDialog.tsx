import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Loader2 } from "lucide-react";
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
        className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 flex flex-col">
          <Input
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg"
          />
          <Textarea
            placeholder="Write your note content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] text-base"
          />
          {summary && (
            <div className="p-4 rounded-lg bg-violet-50 border border-violet-200">
              <h4 className="font-semibold mb-2 text-violet-900">
                AI Summarization
              </h4>
              <p className="text-sm text-violet-700">{summary}</p>
            </div>
          )}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(note.id);
                onClose();
              }}
            >
              Delete
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={() => onSummarize(note)}
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
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isSaving ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
