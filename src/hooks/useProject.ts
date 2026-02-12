import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Project {
  id: string;
  user_id: string;
  initial_1: string;
  initial_2: string;
  voice_word: string;
  voice_file_path?: string | null;
  collage_url?: string | null;
  partner_name: string;
  songs_meta: any[];
}

export function useProject() {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("loveos_projects")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setProject({
        ...data,
        songs_meta: Array.isArray(data.songs_meta) ? data.songs_meta : JSON.parse(data.songs_meta as string || "[]"),
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

  const updateProject = useCallback(async (updates: Partial<Omit<Project, "id" | "user_id">>) => {
    if (!project) return { error: new Error("No project") };
    const { error } = await supabase
      .from("loveos_projects")
      .update(updates as any)
      .eq("id", project.id);
    if (!error) await fetchProject();
    return { error };
  }, [project, fetchProject]);

  return { project, loading, updateProject, refetch: fetchProject };
}
