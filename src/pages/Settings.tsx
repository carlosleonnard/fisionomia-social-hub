import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useImageUpload } from "@/hooks/use-image-upload";
import { Header } from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user } = useAuth();
  const { uploadImage, isUploading } = useImageUpload();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.user_metadata?.name || "");
  const [profileImage, setProfileImage] = useState(user?.user_metadata?.avatar_url || "");
  const [isUpdating, setIsUpdating] = useState(false);

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

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: name,
          avatar_url: profileImage
        }
      });

      if (error) throw error;

      // Update profiles table as well if it exists
      await supabase
        .from('profiles')
        .update({ name: name })
        .eq('id', user.id);

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil. Tente novamente.",
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
              {/* Profile Image Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileImage} alt={name} />
                  <AvatarFallback className="text-2xl">
                    {name.charAt(0).toUpperCase()}
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
                  disabled={isUpdating || isUploading}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isUpdating ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;