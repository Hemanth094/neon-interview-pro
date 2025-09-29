import { supabase } from '@/integrations/supabase/client';
import type { UserResource } from '@clerk/types';

export interface CreateProfileData {
  user_id: string;
  email: string;
  full_name?: string;
  role: 'candidate' | 'interviewer' | 'admin';
}

export const createOrUpdateProfile = async (user: UserResource, role: 'candidate' | 'interviewer'): Promise<void> => {
  if (!user.id || !user.primaryEmailAddress?.emailAddress) {
    throw new Error('User ID and email are required');
  }

  const profileData: CreateProfileData = {
    user_id: user.id,
    email: user.primaryEmailAddress.emailAddress,
    full_name: user.fullName || user.firstName || null,
    role: role,
  };

  // First, check if profile already exists
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching existing profile:', fetchError);
    throw new Error('Failed to check existing profile');
  }

  if (existingProfile) {
    // Update existing profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        email: profileData.email,
        full_name: profileData.full_name,
        role: profileData.role,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      throw new Error('Failed to update profile');
    }
  } else {
    // Create new profile
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([profileData]);

    if (insertError) {
      console.error('Error creating profile:', insertError);
      throw new Error('Failed to create profile');
    }
  }
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Failed to fetch profile');
  }

  return data;
};