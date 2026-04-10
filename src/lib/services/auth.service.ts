import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export class AuthService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async requestPasswordReset(email: string, redirectTo: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
    return { success: true };
  }

  async updatePassword(password: string) {
    const { error } = await this.supabase.auth.updateUser({
      password,
    });
    if (error) throw error;
    return { success: true };
  }
}
