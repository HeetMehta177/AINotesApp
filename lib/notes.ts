import { supabase } from "./supabase";

export const fetchNotes = async () => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const createNote = async (note: { title: string; content: string }) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("notes")
    .insert([{ ...note, user_id: user?.id }])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};

export const updateNote = async (
  id: string,
  updatedFields: Partial<{ title: string; content: string }>
) => {
  const { data, error } = await supabase
    .from("notes")
    .update(updatedFields)
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};

export const deleteNote = async (id: string) => {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw new Error(error.message);
};
