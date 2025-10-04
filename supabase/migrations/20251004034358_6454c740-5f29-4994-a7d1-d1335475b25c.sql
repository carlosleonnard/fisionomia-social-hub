-- Atualizar as URLs das imagens do perfil Maxwell
UPDATE user_profiles 
SET 
  front_image_url = '/phindex-uploads/maxwell-front.jpg',
  profile_image_url = '/phindex-uploads/maxwell-profile.jpg',
  updated_at = now()
WHERE slug = 'maxwell';