import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export class AuthService {
  constructor(private supabase: SupabaseClient<any, any, any>) {}

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { data };
  }

  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await this.supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName,
        avatar_url: null,
      });
      if (profileError) {
        console.error('Profile creation error during signup:', profileError);
      }
    }

    return { data };
  }

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
