-- Users sharing a class can view each other's basic profile info
-- This is necessary for the discussion board to show names and avatars for all senders

CREATE POLICY "Users can view class members profile" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.class_members cm1
      JOIN public.class_members cm2 ON cm1.class_id = cm2.class_id
      WHERE cm1.user_id = auth.uid()
        AND cm2.user_id = public.users.id
    )
    OR
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE created_by = auth.uid()
        AND public.users.id IN (
          SELECT user_id FROM public.class_members WHERE class_id = classes.id
        )
    )
    OR
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE created_by = public.users.id
        AND auth.uid() IN (
          SELECT user_id FROM public.class_members WHERE class_id = classes.id
        )
    )
    OR
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE created_by = auth.uid()
        AND public.users.id = auth.uid() -- redundant but safe
    )
  );

-- Simplified alternative: Allow any authenticated user to see full_name and avatar_url
-- In Class Pilot, profile discovery is generally safe within the tenant context.
-- Drop the old policy if we want to replace it, or just add this one.
-- Let's stick to the class-based one for better privacy.
