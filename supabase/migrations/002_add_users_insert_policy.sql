-- Add INSERT policy for users table
-- This allows authenticated users to create their own profile
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

