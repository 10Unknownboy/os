import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface QuizQuestion {
    id?: string;
    project_id: string;
    question_number: number;
    question: string;
    option_1: string;
    option_2: string;
    option_3: string;
    option_4: string;
    correct_option: number;
}

export function useQuiz() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const getQuiz = useCallback(async (projectId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from("loveos_quiz")
            .select("*")
            .eq("project_id", projectId)
            .order("question_number", { ascending: true });

        setLoading(false);
        if (error) {
            toast({
                title: "Error fetching quiz",
                description: error.message,
                variant: "destructive",
            });
            return [];
        }
        return data as QuizQuestion[];
    }, [toast]);

    const upsertQuiz = useCallback(async (questions: QuizQuestion[]) => {
        setLoading(true);
        const { error } = await supabase
            .from("loveos_quiz")
            .upsert(questions, { onConflict: "project_id,question_number" });

        setLoading(false);
        if (error) {
            toast({
                title: "Error saving quiz",
                description: error.message,
                variant: "destructive",
            });
        }
        return { error };
    }, [toast]);

    return { loading, getQuiz, upsertQuiz };
}
