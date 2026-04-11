import { sendEmail, EMAIL_FROM } from '@/lib/resend'
import { EmailTemplates } from '@/lib/emails/templates'
import { createAdminClient } from '@/lib/supabase/admin'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://theclasspilot.com';

/**
 * Service to handle automated email notifications for classroom events.
 * Uses the admin client to bypass RLS when looking up user emails in the background.
 */
export const NotificationService = {
  
  /**
   * Helper to fetch all student emails for a specific class.
   */
  async getClassStudentEmails(classId: string): Promise<string[]> {
    const supabase = await createAdminClient()
    
    // 1. Get all student IDs for this class
    const { data: members, error: membersError } = await supabase
      .from('class_members')
      .select('user_id')
      .eq('class_id', classId)
      .eq('role', 'student')
      
    if (membersError || !members || members.length === 0) {
      return []
    }
    
    const userIds = members.map(m => m.user_id)
    
    // 2. Fetch emails from public users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('email')
      .in('id', userIds)
      
    if (usersError || !users) {
      return []
    }
    
    return users.map(u => u.email).filter(Boolean) as string[]
  },

  /**
   * Notifies all students in a class about a new assignment.
   */
  async notifyNewAssignment(data: {
    classId: string;
    className: string;
    assignmentId: string;
    title: string;
    dueDate: string | null;
    points: number;
  }) {
    try {
      const studentEmails = await this.getClassStudentEmails(data.classId);
      if (!studentEmails.length) return { success: true };

      const html = EmailTemplates.NewAssignment({
        className: data.className,
        assignmentTitle: data.title,
        dueDate: data.dueDate,
        points: data.points,
        url: `${APP_URL}/dashboard/${data.classId}/assignments`,
      });

      const chunks = this.chunkArray(studentEmails, 50);
      
      for (const chunk of chunks) {
        // Send individually to ensure privacy (BCC behavior)
        await Promise.all(chunk.map(email => 
          sendEmail({
            to: email,
            subject: `New Assignment in ${data.className}: ${data.title}`,
            html,
            from: `Class Pilot (${data.className}) <${EMAIL_FROM}>`,
          })
        ));
      }
      
      return { success: true };
    } catch (error) {
      console.error('[NotificationService] notifyNewAssignment failed:', error);
      return { success: false, error };
    }
  },

  /**
   * Notifies all students in a class about a new announcement.
   */
  async notifyNewAnnouncement(data: {
    classId: string;
    className: string;
    title: string;
    content: string;
  }) {
    try {
      const studentEmails = await this.getClassStudentEmails(data.classId);
      if (!studentEmails.length) return { success: true };

      const html = EmailTemplates.NewAnnouncement({
        className: data.className,
        title: data.title,
        content: data.content,
        url: `${APP_URL}/dashboard/${data.classId}`,
      });

      const chunks = this.chunkArray(studentEmails, 50);
      
      for (const chunk of chunks) {
        await Promise.all(chunk.map(email => 
          sendEmail({
            to: email,
            subject: `Announcement from ${data.className}: ${data.title}`,
            html,
            from: `Class Pilot (${data.className}) <${EMAIL_FROM}>`,
          })
        ));
      }
      
      return { success: true };
    } catch (error) {
      console.error('[NotificationService] notifyNewAnnouncement failed:', error);
      return { success: false, error };
    }
  },

  /**
   * Notifies a specific student that their assignment grading is complete.
   */
  async notifyGradeUpdate(data: {
    studentId: string;
    classId: string;
    className: string;
    assignmentTitle: string;
    grade: number;
    totalPoints: number;
    feedback: string | null;
  }) {
    try {
      const supabase = await createAdminClient();
      const { data: user } = await supabase.from('users').select('email').eq('id', data.studentId).maybeSingle();
      
      if (!user || !user.email) return { success: false, error: 'User email not found' };

      const html = EmailTemplates.GradingFeedback({
        className: data.className,
        assignmentTitle: data.assignmentTitle,
        grade: data.grade,
        totalPoints: data.totalPoints,
        feedback: data.feedback,
        url: `${APP_URL}/dashboard/${data.classId}/grades`,
      });

      await sendEmail({
        to: user.email,
        subject: `Grade Updated: ${data.assignmentTitle}`,
        html,
        from: `Class Pilot (${data.className}) <${EMAIL_FROM}>`,
      });
      
      return { success: true };
    } catch (error) {
      console.error('[NotificationService] notifyGradeUpdate failed:', error);
      return { success: false, error };
    }
  },

  /**
   * Notifies all students in a class about a new poll.
   */
  async notifyNewPoll(data: {
    classId: string;
    className: string;
    question: string;
  }) {
    try {
      const studentEmails = await this.getClassStudentEmails(data.classId);
      if (!studentEmails.length) return { success: true };

      const html = EmailTemplates.NewPoll({
        className: data.className,
        question: data.question,
        url: `${APP_URL}/dashboard/${data.classId}`,
      });

      const chunks = this.chunkArray(studentEmails, 50);
      
      for (const chunk of chunks) {
        await Promise.all(chunk.map(email => 
          sendEmail({
            to: email,
            subject: `New Poll in ${data.className}`,
            html,
            from: `Class Pilot (${data.className}) <${EMAIL_FROM}>`,
          })
        ));
      }
      
      return { success: true };
    } catch (error) {
      console.error('[NotificationService] notifyNewPoll failed:', error);
      return { success: false, error };
    }
  },

  /**
   * Notifies all students in a class about a new attendance session.
   */
  async notifyNewAttendance(data: {
    classId: string;
    className: string;
  }) {
    try {
      const studentEmails = await this.getClassStudentEmails(data.classId);
      if (!studentEmails.length) return { success: true };

      const html = EmailTemplates.NewAttendance({
        className: data.className,
        url: `${APP_URL}/dashboard/${data.classId}`,
      });

      const chunks = this.chunkArray(studentEmails, 50);
      
      for (const chunk of chunks) {
        await Promise.all(chunk.map(email => 
          sendEmail({
            to: email,
            subject: `Attendance Started for ${data.className}`,
            html,
            from: `Class Pilot (${data.className}) <${EMAIL_FROM}>`,
          })
        ));
      }
      
      return { success: true };
    } catch (error) {
      console.error('[NotificationService] notifyNewAttendance failed:', error);
      return { success: false, error };
    }
  },

  /**
   * Notifies all students in a class about a new material.
   */
  async notifyNewMaterial(data: {
    classId: string;
    className: string;
    title: string;
  }) {
    try {
      const studentEmails = await this.getClassStudentEmails(data.classId);
      if (!studentEmails.length) return { success: true };

      const html = EmailTemplates.NewMaterial({
        className: data.className,
        title: data.title,
        url: `${APP_URL}/dashboard/${data.classId}`,
      });

      const chunks = this.chunkArray(studentEmails, 50);
      
      for (const chunk of chunks) {
        await Promise.all(chunk.map(email => 
          sendEmail({
            to: email,
            subject: `New Material in ${data.className}: ${data.title}`,
            html,
            from: `Class Pilot (${data.className}) <${EMAIL_FROM}>`,
          })
        ));
      }
      
      return { success: true };
    } catch (error) {
      console.error('[NotificationService] notifyNewMaterial failed:', error);
      return { success: false, error };
    }
  },

  // Helper to chunk arrays for rate-limiting protection
  chunkArray<T>(array: T[], size: number): T[][] {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
}
