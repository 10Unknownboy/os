
-- =============================================
-- LOVE OS: Tables + Triggers + Storage
-- =============================================

-- 1. Core tables
CREATE TABLE public.users_meta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.loveos_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  initial_1 text NOT NULL DEFAULT '',
  initial_2 text NOT NULL DEFAULT '',
  voice_word text NOT NULL DEFAULT 'open',
  partner_name text NOT NULL DEFAULT '',
  songs_meta jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Content tables
CREATE TABLE public.loveos_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.loveos_projects(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  value text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'heart',
  type text NOT NULL DEFAULT 'counter',
  max_value integer,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.loveos_quiz (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.loveos_projects(id) ON DELETE CASCADE,
  question_number integer NOT NULL,
  question text NOT NULL DEFAULT '',
  option_1 text NOT NULL DEFAULT '',
  option_2 text NOT NULL DEFAULT '',
  option_3 text NOT NULL DEFAULT '',
  option_4 text NOT NULL DEFAULT '',
  correct_option integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, question_number)
);

CREATE TABLE public.loveos_terminal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.loveos_projects(id) ON DELETE CASCADE,
  command text NOT NULL DEFAULT '',
  output text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.loveos_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.loveos_projects(id) ON DELETE CASCADE,
  access_code_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.users_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loveos_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loveos_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loveos_quiz ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loveos_terminal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loveos_shares ENABLE ROW LEVEL SECURITY;

-- 4. Helper function (tables exist now)
CREATE OR REPLACE FUNCTION public.is_project_owner(p_project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.loveos_projects
    WHERE id = p_project_id AND user_id = auth.uid()
  )
$$;

-- 5. RLS Policies
-- users_meta
CREATE POLICY "users_meta_select_own" ON public.users_meta FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users_meta_insert_own" ON public.users_meta FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_meta_update_own" ON public.users_meta FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- loveos_projects
CREATE POLICY "projects_select_own" ON public.loveos_projects FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "projects_insert_own" ON public.loveos_projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_update_own" ON public.loveos_projects FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "projects_delete_own" ON public.loveos_projects FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "projects_select_anon" ON public.loveos_projects FOR SELECT TO anon USING (
  EXISTS (SELECT 1 FROM public.loveos_shares WHERE loveos_shares.project_id = loveos_projects.id)
);

-- loveos_analytics
CREATE POLICY "analytics_select" ON public.loveos_analytics FOR SELECT TO authenticated USING (public.is_project_owner(project_id));
CREATE POLICY "analytics_insert" ON public.loveos_analytics FOR INSERT TO authenticated WITH CHECK (public.is_project_owner(project_id));
CREATE POLICY "analytics_update" ON public.loveos_analytics FOR UPDATE TO authenticated USING (public.is_project_owner(project_id));
CREATE POLICY "analytics_delete" ON public.loveos_analytics FOR DELETE TO authenticated USING (public.is_project_owner(project_id));
CREATE POLICY "analytics_select_anon" ON public.loveos_analytics FOR SELECT TO anon USING (
  EXISTS (SELECT 1 FROM public.loveos_shares WHERE loveos_shares.project_id = loveos_analytics.project_id)
);

-- loveos_quiz
CREATE POLICY "quiz_select" ON public.loveos_quiz FOR SELECT TO authenticated USING (public.is_project_owner(project_id));
CREATE POLICY "quiz_insert" ON public.loveos_quiz FOR INSERT TO authenticated WITH CHECK (public.is_project_owner(project_id));
CREATE POLICY "quiz_update" ON public.loveos_quiz FOR UPDATE TO authenticated USING (public.is_project_owner(project_id));
CREATE POLICY "quiz_delete" ON public.loveos_quiz FOR DELETE TO authenticated USING (public.is_project_owner(project_id));
CREATE POLICY "quiz_select_anon" ON public.loveos_quiz FOR SELECT TO anon USING (
  EXISTS (SELECT 1 FROM public.loveos_shares WHERE loveos_shares.project_id = loveos_quiz.project_id)
);

-- loveos_terminal
CREATE POLICY "terminal_select" ON public.loveos_terminal FOR SELECT TO authenticated USING (public.is_project_owner(project_id));
CREATE POLICY "terminal_insert" ON public.loveos_terminal FOR INSERT TO authenticated WITH CHECK (public.is_project_owner(project_id));
CREATE POLICY "terminal_update" ON public.loveos_terminal FOR UPDATE TO authenticated USING (public.is_project_owner(project_id));
CREATE POLICY "terminal_delete" ON public.loveos_terminal FOR DELETE TO authenticated USING (public.is_project_owner(project_id));
CREATE POLICY "terminal_select_anon" ON public.loveos_terminal FOR SELECT TO anon USING (
  EXISTS (SELECT 1 FROM public.loveos_shares WHERE loveos_shares.project_id = loveos_terminal.project_id)
);

-- loveos_shares
CREATE POLICY "shares_select_public" ON public.loveos_shares FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "shares_insert_own" ON public.loveos_shares FOR INSERT TO authenticated WITH CHECK (public.is_project_owner(project_id));
CREATE POLICY "shares_update_own" ON public.loveos_shares FOR UPDATE TO authenticated USING (public.is_project_owner(project_id));
CREATE POLICY "shares_delete_own" ON public.loveos_shares FOR DELETE TO authenticated USING (public.is_project_owner(project_id));

-- 6. Triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_loveos_projects_updated_at
  BEFORE UPDATE ON public.loveos_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_meta (user_id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)));
  INSERT INTO public.loveos_projects (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Storage
INSERT INTO storage.buckets (id, name, public) VALUES ('loveos-uploads', 'loveos-uploads', false);

CREATE POLICY "storage_select_own" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'loveos-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "storage_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'loveos-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "storage_update_own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'loveos-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "storage_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'loveos-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "storage_select_anon" ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'loveos-uploads');

-- 8. Indexes
CREATE INDEX idx_loveos_analytics_project ON public.loveos_analytics(project_id);
CREATE INDEX idx_loveos_quiz_project ON public.loveos_quiz(project_id);
CREATE INDEX idx_loveos_terminal_project ON public.loveos_terminal(project_id);
CREATE INDEX idx_loveos_shares_hash ON public.loveos_shares(access_code_hash);
CREATE INDEX idx_loveos_shares_project ON public.loveos_shares(project_id);
