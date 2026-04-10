-- Allow creators to delete their own classes
-- Since RLS is enabled on public.classes, we must explicitly grant the DELETE permission
CREATE POLICY "Creators can delete their own classes"
ON public.classes
FOR DELETE
USING (auth.uid() = created_by);
