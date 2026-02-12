import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface TerminalCommand {
    id?: string;
    project_id: string;
    command: string;
    output: string;
    sort_order: number;
}

export function useTerminal() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const getCommands = useCallback(async (projectId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from("loveos_terminal")
            .select("*")
            .eq("project_id", projectId)
            .order("sort_order", { ascending: true });

        setLoading(false);
        if (error) {
            toast({
                title: "Error fetching terminal commands",
                description: error.message,
                variant: "destructive",
            });
            return [];
        }
        return data as TerminalCommand[];
    }, [toast]);

    const upsertCommands = useCallback(async (commands: TerminalCommand[]) => {
        setLoading(true);
        const { error } = await supabase
            .from("loveos_terminal")
            .upsert(commands);

        setLoading(false);
        if (error) {
            toast({
                title: "Error saving terminal commands",
                description: error.message,
                variant: "destructive",
            });
        }
        return { error };
    }, [toast]);

    const deleteCommand = useCallback(async (id: string) => {
        setLoading(true);
        const { error } = await supabase
            .from("loveos_terminal")
            .delete()
            .eq("id", id);

        setLoading(false);
        if (error) {
            toast({
                title: "Error deleting command",
                description: error.message,
                variant: "destructive",
            });
        }
        return { error };
    }, [toast]);

    return { loading, getCommands, upsertCommands, deleteCommand };
}
