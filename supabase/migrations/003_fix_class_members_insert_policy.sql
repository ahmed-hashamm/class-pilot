-- Fix class_members INSERT policy to allow users to join/create classes
-- Drop the existing restrictive policy that causes infinite recursion
DROP POLICY IF EXISTS "Teachers can add members" ON public.class_members;

-- Add policy that allows authenticated users to insert themselves as members
-- This is needed for initial class creation where the creator needs to add themselves
CREATE POLICY "Users can insert themselves as members" ON public.class_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add policy for class creators to add other members
-- This allows the class creator (from classes.created_by) to add other users
CREATE POLICY "Class creators can add other members" ON public.class_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = class_members.class_id
      AND classes.created_by = auth.uid()
      AND class_members.user_id != auth.uid() -- Only for adding other users
    )
  );

