import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface AnalyticsItem {
    id?: string;
    project_id: string;
    title: string;
    value: string;
    subtitle: string;
    icon: string;
    type: string;
    max_value?: number | null;
    sort_order: number;
}

export function useAnalytics() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const getAnalytics = useCallback(async (projectId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from("loveos_analytics")
            .select("*")
            .eq("project_id", projectId)
            .order("sort_order", { ascending: true });

        setLoading(false);
        if (error) {
            toast({
                title: "Error fetching analytics",
                description: error.message,
                variant: "destructive",
            });
            return [];
        }
        return data as AnalyticsItem[];
    }, [toast]);

    const upsertAnalytics = useCallback(async (items: AnalyticsItem[]) => {
        setLoading(true);
        const { error } = await supabase
            .from("loveos_analytics")
            .upsert(items);

        setLoading(false);
        if (error) {
            toast({
                title: "Error saving analytics",
                description: error.message,
                variant: "destructive",
            });
        }
        return { error };
    }, [toast]);

    const deleteAnalytics = useCallback(async (id: string) => {
        setLoading(true);
        const { error } = await supabase
            .from("loveos_analytics")
            .delete()
            .eq("id", id);

        setLoading(false);
        if (error) {
            toast({
                title: "Error deleting analytics",
                description: error.message,
                variant: "destructive",
            });
        }
        return { error };
    }, [toast]);

    return { loading, getAnalytics, upsertAnalytics, deleteAnalytics };
}
