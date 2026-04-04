-- Discussion Messages table for per-tab discussion channels
-- Each class has 3 discussion topics: 'assignments', 'materials', 'groups'

CREATE TABLE IF NOT EXISTS discussion_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  topic TEXT NOT NULL CHECK (topic IN ('assignments', 'materials', 'groups')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX idx_discussion_messages_class_topic ON discussion_messages(class_id, topic, created_at DESC);
CREATE INDEX idx_discussion_messages_user ON discussion_messages(user_id);

-- Enable RLS
ALTER TABLE discussion_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Members of the class can read messages
CREATE POLICY "Class members can read discussion messages"
  ON discussion_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM class_members
      WHERE class_members.class_id = discussion_messages.class_id
        AND class_members.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = discussion_messages.class_id
        AND classes.teacher_id = auth.uid()
    )
  );

-- Policy: Members of the class can insert messages
CREATE POLICY "Class members can send discussion messages"
  ON discussion_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (
      EXISTS (
        SELECT 1 FROM class_members
        WHERE class_members.class_id = discussion_messages.class_id
          AND class_members.user_id = auth.uid()
      )
      OR
      EXISTS (
        SELECT 1 FROM classes
        WHERE classes.id = discussion_messages.class_id
          AND classes.teacher_id = auth.uid()
      )
    )
  );

-- Policy: Users can delete their own messages
CREATE POLICY "Users can delete own discussion messages"
  ON discussion_messages FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Teachers can delete any message in their class
CREATE POLICY "Teachers can delete any discussion message"
  ON discussion_messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = discussion_messages.class_id
        AND classes.teacher_id = auth.uid()
    )
  );

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE discussion_messages;
