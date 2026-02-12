import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { generateShareCode, hashString } from "@/lib/crypto";

export function useShare() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const generateShare = useCallback(async (projectId: string) => {
        setLoading(true);
        const rawCode = generateShareCode(8);
        const hashedCode = await hashString(rawCode);

        const { error } = await supabase
            .from("loveos_shares")
            .insert({
                project_id: projectId,
                access_code_hash: hashedCode,
            });

        setLoading(false);
        if (error) {
            toast({
                title: "Error generating share code",
                description: error.message,
                variant: "destructive",
            });
            return null;
        }

        return rawCode;
    }, [toast]);

    const validateShare = useCallback(async (code: string) => {
        setLoading(true);
        const hashedCode = await hashString(code.toUpperCase());

        const { data, error } = await supabase
            .from("loveos_shares")
            .select("project_id")
            .eq("access_code_hash", hashedCode)
            .maybeSingle();

        setLoading(false);
        if (error) {
            toast({
                title: "Error validating code",
                description: error.message,
                variant: "destructive",
            });
            return null;
        }

        return data?.project_id || null;
    }, [toast]);

    return { loading, generateShare, validateShare };
}
