-- Attendances table
CREATE TABLE IF NOT EXISTS public.attendances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  title TEXT,
  date DATE NOT NULL,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance records table
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attendance_id UUID NOT NULL REFERENCES public.attendances(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(attendance_id, user_id)
);

-- Polls table
CREATE TABLE IF NOT EXISTS public.polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Poll responses table
CREATE TABLE IF NOT EXISTS public.poll_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  selected_option_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_attendances_class_id ON public.attendances(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_attendance_id ON public.attendance_records(attendance_id);
CREATE INDEX IF NOT EXISTS idx_polls_class_id ON public.polls(class_id);
CREATE INDEX IF NOT EXISTS idx_poll_responses_poll_id ON public.poll_responses(poll_id);

-- Enable RLS
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_responses ENABLE ROW LEVEL SECURITY;

-- Triggers for updated_at
CREATE TRIGGER update_attendances_updated_at BEFORE UPDATE ON public.attendances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_polls_updated_at BEFORE UPDATE ON public.polls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for attendances
CREATE POLICY "Class members can view attendances" ON public.attendances
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.class_members
      WHERE class_id = attendances.class_id
      AND user_id = auth.uid()
    )
  );
CREATE POLICY "Teachers can create attendances" ON public.attendances
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.class_members
      WHERE class_id = attendances.class_id
      AND user_id = auth.uid()
      AND role = 'teacher'
    )
    AND auth.uid() = created_by
  );
CREATE POLICY "Teachers can update attendances" ON public.attendances
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.class_members
      WHERE class_id = attendances.class_id
      AND user_id = auth.uid()
      AND role = 'teacher'
    )
  );
CREATE POLICY "Teachers can delete attendances" ON public.attendances
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.class_members
      WHERE class_id = attendances.class_id
      AND user_id = auth.uid()
      AND role = 'teacher'
    )
  );

-- RLS Policies for attendance_records
CREATE POLICY "Users can view own attendance records" ON public.attendance_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view all attendance records in their classes" ON public.attendance_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.attendances a
      JOIN public.class_members cm ON cm.class_id = a.class_id
      WHERE a.id = attendance_records.attendance_id
      AND cm.user_id = auth.uid()
      AND cm.role = 'teacher'
    )
  );
CREATE POLICY "Users can create own attendance records" ON public.attendance_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachers can update any attendance record" ON public.attendance_records
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.attendances a
      JOIN public.class_members cm ON cm.class_id = a.class_id
      WHERE a.id = attendance_records.attendance_id
      AND cm.user_id = auth.uid()
      AND cm.role = 'teacher'
    )
  );
CREATE POLICY "Teachers can delete any attendance record" ON public.attendance_records
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.attendances a
      JOIN public.class_members cm ON cm.class_id = a.class_id
      WHERE a.id = attendance_records.attendance_id
      AND cm.user_id = auth.uid()
      AND cm.role = 'teacher'
    )
  );

-- RLS Policies for polls
CREATE POLICY "Class members can view polls" ON public.polls
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.class_members
      WHERE class_id = polls.class_id
      AND user_id = auth.uid()
    )
  );
CREATE POLICY "Teachers can create polls" ON public.polls
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.class_members
      WHERE class_id = polls.class_id
      AND user_id = auth.uid()
      AND role = 'teacher'
    )
    AND auth.uid() = created_by
  );
CREATE POLICY "Teachers can update polls" ON public.polls
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.class_members
      WHERE class_id = polls.class_id
      AND user_id = auth.uid()
      AND role = 'teacher'
    )
  );
CREATE POLICY "Teachers can delete polls" ON public.polls
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.class_members
      WHERE class_id = polls.class_id
      AND user_id = auth.uid()
      AND role = 'teacher'
    )
  );

-- RLS Policies for poll_responses
CREATE POLICY "Class members can view poll responses" ON public.poll_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.polls p
      JOIN public.class_members cm ON cm.class_id = p.class_id
      WHERE p.id = poll_responses.poll_id
      AND cm.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create own poll responses" ON public.poll_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own poll responses" ON public.poll_responses
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Teachers can delete poll responses" ON public.poll_responses
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.polls p
      JOIN public.class_members cm ON cm.class_id = p.class_id
      WHERE p.id = poll_responses.poll_id
      AND cm.user_id = auth.uid()
      AND cm.role = 'teacher'
    )
  );
