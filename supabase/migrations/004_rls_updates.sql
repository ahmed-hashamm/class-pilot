-- Allow teachers to UPDATE their assignments
CREATE POLICY "Teachers can update assignments" 
ON public.assignments
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.class_members
    WHERE class_members.class_id = assignments.class_id
      AND class_members.user_id = auth.uid()
      AND class_members.role = 'teacher'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.class_members
    WHERE class_members.class_id = assignments.class_id
      AND class_members.user_id = auth.uid()
      AND class_members.role = 'teacher'
  )
);

-- Allow teachers to DELETE their assignments
CREATE POLICY "Teachers can delete assignments" 
ON public.assignments
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.class_members
    WHERE class_members.class_id = assignments.class_id
      AND class_members.user_id = auth.uid()
      AND class_members.role = 'teacher'
  )
);

-- Allow teachers to UPDATE their materials
CREATE POLICY "Teachers can update materials" 
ON public.materials
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.class_members
    WHERE class_members.class_id = materials.class_id
      AND class_members.user_id = auth.uid()
      AND class_members.role = 'teacher'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.class_members
    WHERE class_members.class_id = materials.class_id
      AND class_members.user_id = auth.uid()
      AND class_members.role = 'teacher'
  )
);

-- Allow teachers to DELETE their materials
CREATE POLICY "Teachers can delete materials" 
ON public.materials
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.class_members
    WHERE class_members.class_id = materials.class_id
      AND class_members.user_id = auth.uid()
      AND class_members.role = 'teacher'
  )
);


-- Allow teachers to UPDATE their announcements
CREATE POLICY "Teachers can update announcements" 
ON public.announcements
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.class_members
    WHERE class_members.class_id = announcements.class_id
      AND class_members.user_id = auth.uid()
      AND class_members.role = 'teacher'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.class_members
    WHERE class_members.class_id = announcements.class_id
      AND class_members.user_id = auth.uid()
      AND class_members.role = 'teacher'
  )
);

-- Allow teachers to DELETE their announcements
CREATE POLICY "Teachers can delete announcements" 
ON public.announcements
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.class_members
    WHERE class_members.class_id = announcements.class_id
      AND class_members.user_id = auth.uid()
      AND class_members.role = 'teacher'
  )
);
