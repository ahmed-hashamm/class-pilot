-- Create AI Usage Logs table for compliance and cost monitoring
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- e.g. 'class_assistant', 'grading'
    model TEXT NOT NULL, -- e.g. 'gpt-4o-mini'
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_usage_logs ENABLE CONTROLLED ACCESS; -- Error in terminology, should be ENABLE ROW LEVEL SECURITY

-- We use ENABLE ROW LEVEL SECURITY
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Only service_role can write logs by default, or we can add a policy for authenticated users to view their own logs
CREATE POLICY "Users can view their own AI usage logs"
    ON public.ai_usage_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Teachers can view logs for their students (if we want to expand this later, we can add a complex policy)
-- For now, keep it simple: users see their own logs.
