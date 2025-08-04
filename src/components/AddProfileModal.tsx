import { useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface AddProfileModalProps {
  onAddProfile: (profile: {
    name: string;
    age: number;
    location: string;
    frontImageUrl: string;
    profileImageUrl: string;
    description: string;
  }) => void;
}

export const AddProfileModal = ({ onAddProfile }: AddProfileModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    frontImageUrl: "",
    profileImageUrl: "",
    description: ""
  });

  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.age && formData.location) {
      onAddProfile({
        ...formData,
        age: parseInt(formData.age),
        frontImageUrl: formData.frontImageUrl || "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face",
        profileImageUrl: formData.profileImageUrl || "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=400&fit=crop&crop=face"
      });
      setFormData({ name: "", age: "", location: "", frontImageUrl: "", profileImageUrl: "", description: "" });
      setOpen(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, imageType: 'front' | 'profile') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ 
        ...prev, 
        [imageType === 'front' ? 'frontImageUrl' : 'profileImageUrl']: imageUrl 
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="bg-phindex-teal hover:bg-phindex-teal/90 px-4 py-2 h-9">
          <Plus className="mr-1 h-4 w-4" />
          Classify Now!
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gradient-card border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Novo Perfil
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload de imagens */}
          <div className="space-y-4">
            <Label>Fotos do Perfil</Label>
            
            {/* Foto de Frente */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Foto de Frente</Label>
              <Card
                className={`border-2 border-dashed transition-colors p-4 text-center cursor-pointer ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => handleDrop(e, 'front')}
              >
                {formData.frontImageUrl ? (
                  <div className="relative inline-block">
                    <img 
                      src={formData.frontImageUrl} 
                      alt="Preview Frente" 
                      className="w-16 h-16 rounded-lg mx-auto object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive hover:bg-destructive/80"
                      onClick={() => setFormData(prev => ({ ...prev, frontImageUrl: "" }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Foto de frente</p>
                  </div>
                )}
              </Card>
              
              <Input
                placeholder="URL da foto de frente..."
                value={formData.frontImageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, frontImageUrl: e.target.value }))}
                className="text-xs"
              />
            </div>

            {/* Foto de Perfil */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Foto de Perfil</Label>
              <Card
                className={`border-2 border-dashed transition-colors p-4 text-center cursor-pointer ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => handleDrop(e, 'profile')}
              >
                {formData.profileImageUrl ? (
                  <div className="relative inline-block">
                    <img 
                      src={formData.profileImageUrl} 
                      alt="Preview Perfil" 
                      className="w-16 h-16 rounded-lg mx-auto object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive hover:bg-destructive/80"
                      onClick={() => setFormData(prev => ({ ...prev, profileImageUrl: "" }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Foto de perfil</p>
                  </div>
                )}
              </Card>
              
              <Input
                placeholder="URL da foto de perfil..."
                value={formData.profileImageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, profileImageUrl: e.target.value }))}
                className="text-xs"
              />
            </div>
          </div>

          {/* Informações básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Idade *</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização *</Label>
            <Input
              id="location"
              placeholder="Cidade, Estado/País"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Conte um pouco sobre a pessoa..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:shadow-button transition-all duration-300"
            >
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};