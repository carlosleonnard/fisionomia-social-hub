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
import { GoogleAdsense } from "@/components/GoogleAdsense";
import { Helmet } from "react-helmet-async";

const Settings = () => {
  const { user } = useAuth();
  const { uploadImage, isUploading } = useImageUpload();
  const { toast } = useToast();
  
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
          .select('nickname, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setNickname(profile.nickname || "");
          setProfileImage(profile.avatar_url || "");
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsUpdating(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          nickname: nickname,
          avatar_url: profileImage
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast({
        title: "Profile updated",
        description: "Your information has been saved successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Could not update profile. Please try again.",
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
                <p>You need to be logged in to access settings.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Settings - Profile Configuration | Phindex</title>
        <meta name="description" content="Update your Phindex profile settings. Change your nickname, profile picture and personal information." />
        <meta name="keywords" content="settings, profile, configuration, user preferences, account" />
      </Helmet>
      <Header />
      <AppSidebar />
      <main className="lg:ml-80 pt-16">
        <div className="container mx-auto px-4 py-8">
          <GoogleAdsense className="w-full mb-8" />
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Loading profile information...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Enter your nickname"
                    />
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={handleSave} 
                      disabled={isUpdating || isUploading || !nickname.trim()}
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <GoogleAdsense className="w-full mt-8" />
        </div>
      </main>
    </div>
  );
};

export default Settings;