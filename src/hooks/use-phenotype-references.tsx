import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export interface PhenotypeReferenceImage {
  id: string;
  phenotype: string;
  subregion: string;
  region: string;
  gender: 'male' | 'female';
  image_url: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export function usePhenotypeReferences() {
  const { user } = useAuth();
  const [references, setReferences] = useState<PhenotypeReferenceImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Load existing references
  useEffect(() => {
    loadReferences();
  }, []);

  const loadReferences = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('phenotype_reference_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferences((data || []) as PhenotypeReferenceImage[]);
    } catch (error) {
      console.error('Error loading phenotype references:', error);
      toast.error('Failed to load phenotype references');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (
    file: File,
    phenotype: string,
    subregion: string,
    region: string,
    gender: 'male' | 'female'
  ): Promise<string | null> => {
    if (!user) {
      toast.error('You must be logged in to upload images');
      return null;
    }

    try {
      setIsUploading(true);

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return null;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return null;
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${phenotype}-${gender}-${Date.now()}.${fileExt}`;
      const filePath = `${region}/${subregion}/${fileName}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('phenotype-references')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('phenotype-references')
        .getPublicUrl(filePath);

      // Check if entry already exists for this phenotype/gender combination
      const existingEntry = references.find(
        ref => ref.phenotype === phenotype && 
               ref.gender === gender && 
               ref.subregion === subregion &&
               ref.region === region
      );

      if (existingEntry) {
        // Update existing entry
        const { error: updateError } = await supabase
          .from('phenotype_reference_images')
          .update({ 
            image_url: publicUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingEntry.id);

        if (updateError) throw updateError;

        // Delete old image from storage if it exists
        if (existingEntry.image_url) {
          const oldPath = existingEntry.image_url.split('/').pop();
          if (oldPath && oldPath !== fileName) {
            await supabase.storage
              .from('phenotype-references')
              .remove([`${region}/${subregion}/${oldPath}`]);
          }
        }
      } else {
        // Create new entry
        const { error: insertError } = await supabase
          .from('phenotype_reference_images')
          .insert({
            phenotype,
            subregion,
            region,
            gender,
            image_url: publicUrl,
            uploaded_by: user.id
          });

        if (insertError) throw insertError;
      }

      // Reload references to get updated data
      await loadReferences();

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (
    phenotype: string,
    subregion: string,
    region: string,
    gender: 'male' | 'female'
  ): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to delete images');
      return false;
    }

    try {
      const existingEntry = references.find(
        ref => ref.phenotype === phenotype && 
               ref.gender === gender && 
               ref.subregion === subregion &&
               ref.region === region
      );

      if (!existingEntry) {
        toast.error('Image not found');
        return false;
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('phenotype_reference_images')
        .delete()
        .eq('id', existingEntry.id);

      if (deleteError) throw deleteError;

      // Delete from storage
      if (existingEntry.image_url) {
        const fileName = existingEntry.image_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('phenotype-references')
            .remove([`${region}/${subregion}/${fileName}`]);
        }
      }

      // Reload references
      await loadReferences();

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
      return false;
    }
  };

  const getImageUrl = (
    phenotype: string,
    subregion: string,
    region: string,
    gender: 'male' | 'female'
  ): string | null => {
    const reference = references.find(
      ref => ref.phenotype === phenotype && 
             ref.gender === gender && 
             ref.subregion === subregion &&
             ref.region === region
    );
    return reference?.image_url || null;
  };

  return {
    references,
    isLoading,
    isUploading,
    uploadImage,
    deleteImage,
    getImageUrl,
    loadReferences
  };
}