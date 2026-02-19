import { createClient } from '@/lib/supabase/client';
import type { Profile, UpdateProfilePayload } from '@/types';

export async function fetchProfile(): Promise<Profile | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    // Profile may not exist yet if trigger hasn't run — return null gracefully
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return data as Profile;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<Profile> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Profile;
}
