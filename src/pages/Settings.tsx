import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useImageUpload } from "@/hooks/use-image-upload";
import { Header } from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user } = useAuth();
  const { uploadImage, isUploading } = useImageUpload();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nicknameError, setNicknameError] = useState("");

  // Load profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('name, nickname, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setName(profile.name || "");
          setNickname(profile.nickname || "");
          setProfileImage(profile.avatar_url || "");
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to user metadata
        setName(user.user_metadata?.name || "");
        setProfileImage(user.user_metadata?.avatar_url || "");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  // Check if nickname is available
  const checkNicknameAvailability = async (nicknameToCheck: string) => {
    if (!nicknameToCheck || nicknameToCheck.length < 3) {
      setNicknameError("Nickname deve ter pelo menos 3 caracteres");
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('nickname', nicknameToCheck)
        .neq('id', user?.id || '');

      if (error && error.code !== 'PGRST116') throw error;

      if (data && data.length > 0) {
        setNicknameError("Este nickname já está em uso");
        return false;
      }

      setNicknameError("");
      return true;
    } catch (error) {
      console.error('Error checking nickname:', error);
      setNicknameError("Erro ao verificar nickname");
      return false;
    }
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setNicknameError("");
    
    // Debounce nickname check
    if (value.length >= 3) {
      const timeoutId = setTimeout(() => {
        checkNicknameAvailability(value);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file, 'profile');
    if (imageUrl) {
      setProfileImage(imageUrl);
      toast({
        title: "Imagem carregada",
        description: "A imagem foi carregada com sucesso. Clique em salvar para aplicar as alterações.",
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;

    // Validate nickname before saving
    if (nickname && !(await checkNicknameAvailability(nickname))) {
      return;
    }

    setIsUpdating(true);
    try {
      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name: name,
          avatar_url: profileImage
        }
      });

      if (authError) throw authError;

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          name: name,
          nickname: nickname,
          avatar_url: profileImage
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      let errorMessage = "Não foi possível atualizar o perfil. Tente novamente.";
      if (error.code === '23505' && error.constraint === 'profiles_nickname_unique') {
        errorMessage = "Este nickname já está em uso. Escolha outro.";
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <AppSidebar />
        <main className="lg:ml-80 pt-16">
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="p-8 text-center">
                <p>Você precisa estar logado para acessar as configurações.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AppSidebar />
      <main className="lg:ml-80 pt-16">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Configurações do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Carregando informações do perfil...</p>
                </div>
              ) : (
                <>
                  {/* Profile Image Section */}
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profileImage} alt={name} />
                      <AvatarFallback className="text-2xl">
                        {nickname ? nickname.charAt(0).toUpperCase() : name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="profile-image-upload"
                        disabled={isUploading}
                      />
                      <Label htmlFor="profile-image-upload">
                        <Button variant="outline" className="cursor-pointer" disabled={isUploading}>
                          <Camera className="h-4 w-4 mr-2" />
                          {isUploading ? "Enviando..." : "Alterar Foto"}
                        </Button>
                      </Label>
                    </div>
                  </div>

                  {/* Name Section */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Digite seu nome"
                    />
                  </div>

                  {/* Nickname Section */}
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      value={nickname}
                      onChange={(e) => handleNicknameChange(e.target.value)}
                      placeholder="Digite seu nickname"
                      className={nicknameError ? "border-destructive" : ""}
                    />
                    {nicknameError && (
                      <div className="flex items-center space-x-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <span>{nicknameError}</span>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Seu nickname deve ser único e ter pelo menos 3 caracteres.
                    </p>
                  </div>

                  {/* Email Section (Read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      value={user.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      O e-mail não pode ser alterado através desta página.
                    </p>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <Button 
                      onClick={handleSave} 
                      disabled={isUpdating || isUploading || !!nicknameError || !nickname.trim()}
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isUpdating ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;