import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  country: string;
  gender: string;
  category: string;
  height: number;
  ancestry: string;
  front_image_url: string;
  profile_image_url?: string;
  is_anonymous: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserProfileData {
  name: string;
  country: string;
  gender: string;
  category: string;
  height: number;
  ancestry: string;
  frontImageUrl: string;
  profileImageUrl?: string;
  isAnonymous: boolean;
}

export const useUserProfiles = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get all user profiles
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['user-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserProfile[];
    },
  });

  // Get user's own profiles
  const { data: myProfiles, isLoading: myProfilesLoading } = useQuery({
    queryKey: ['my-profiles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: !!user?.id,
  });

  // Get single profile by slug
  const getProfileBySlug = async (slug: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  };

  // Create profile mutation
  const createProfile = useMutation({
    mutationFn: async (profileData: CreateUserProfileData) => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      // Generate slug from name
      const { data: slugData, error: slugError } = await supabase
        .rpc('generate_unique_slug', { profile_name: profileData.name });

      if (slugError) throw slugError;

      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          name: profileData.name,
          country: profileData.country,
          gender: profileData.gender,
          category: profileData.category,
          height: profileData.height,
          ancestry: profileData.ancestry,
          front_image_url: profileData.frontImageUrl,
          profile_image_url: profileData.profileImageUrl,
          is_anonymous: profileData.isAnonymous,
          slug: slugData,
        })
        .select()
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['my-profiles'] });
      toast.success('Perfil criado com sucesso!');
      return data;
    },
    onError: (error) => {
      console.error('Erro ao criar perfil:', error);
      toast.error('Erro ao criar perfil. Tente novamente.');
    },
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async ({ id, profileData }: { id: string; profileData: Partial<CreateUserProfileData> }) => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      let updateData: any = {
        ...profileData,
        front_image_url: profileData.frontImageUrl,
        profile_image_url: profileData.profileImageUrl,
        is_anonymous: profileData.isAnonymous,
      };

      // Generate new slug if name changed
      if (profileData.name) {
        const { data: slugData, error: slugError } = await supabase
          .rpc('generate_unique_slug', { 
            profile_name: profileData.name,
            profile_id: id 
          });

        if (slugError) throw slugError;
        updateData.slug = slugData;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only update their own profiles
        .select()
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['my-profiles'] });
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    },
  });

  // Delete profile mutation
  const deleteProfile = useMutation({
    mutationFn: async (profileId: string) => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', profileId)
        .eq('user_id', user.id); // Ensure user can only delete their own profiles

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['my-profiles'] });
      toast.success('Perfil excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir perfil:', error);
      toast.error('Erro ao excluir perfil. Tente novamente.');
    },
  });

  return {
    profiles,
    profilesLoading,
    myProfiles,
    myProfilesLoading,
    createProfile,
    updateProfile,
    deleteProfile,
    getProfileBySlug,
    isCreating: createProfile.isPending,
    isUpdating: updateProfile.isPending,
    isDeleting: deleteProfile.isPending,
  };
};