import { useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface AddProfileModalProps {
  onAddProfile: (profile: {
    name: string;
    country: string;
    gender: string;
    category: string;
    height: number;
    ancestry: string;
    frontImageUrl: string;
    profileImageUrl?: string;
  }) => void;
}

export const AddProfileModal = ({ onAddProfile }: AddProfileModalProps) => {
  const [open, setOpen] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    gender: "",
    category: "",
    height: "",
    ancestry: "",
    frontImageUrl: "",
    profileImageUrl: "",
    isAnonymous: false
  });

  const [dragActive, setDragActive] = useState(false);

  const handleGuidelinesAccept = () => {
    setShowGuidelines(false);
    setOpen(true);
  };

  const handleTriggerClick = () => {
    setShowGuidelines(true);
  };

  const handleAnonymousChange = (checked: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      isAnonymous: checked,
      category: checked ? "User Profiles" : ""
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.country && formData.gender && formData.category && formData.height && formData.ancestry && formData.frontImageUrl) {
      onAddProfile({
        ...formData,
        height: parseFloat(formData.height),
        frontImageUrl: formData.frontImageUrl,
        profileImageUrl: formData.profileImageUrl
      });
      setFormData({ name: "", country: "", gender: "", category: "", height: "", ancestry: "", frontImageUrl: "", profileImageUrl: "", isAnonymous: false });
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
    <>
      {/* Guidelines Modal */}
      <Dialog open={showGuidelines} onOpenChange={setShowGuidelines}>
        <DialogTrigger asChild>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-phindex-teal hover:bg-phindex-teal/90 px-4 py-2 h-9"
            onClick={handleTriggerClick}
          >
            <Plus className="mr-1 h-4 w-4" />
            Classify Now!
          </Button>
        </DialogTrigger>
        
        <DialogContent className="bg-gradient-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Adding Guidelines
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Antes de adicionar um perfil, leia e concorde com os seguintes termos:</p>
              
              <ul className="space-y-2 list-disc list-inside">
                <li>Respeite a privacidade e direitos das pessoas representadas nas imagens</li>
                <li>Use apenas imagens que você tem permissão para compartilhar</li>
                <li>Forneça informações precisas e respeitosas sobre ancestralidade</li>
                <li>Não use imagens de menores de idade sem consentimento apropriado</li>
                <li>Mantenha um ambiente respeitoso e inclusivo</li>
                <li>As classificações devem ser baseadas em características visíveis, não em estereótipos</li>
              </ul>
              
              <p className="text-xs pt-2 border-t border-border">
                Ao continuar, você concorda em seguir estas diretrizes e usar a plataforma de forma responsável.
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowGuidelines(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="flex-1 bg-gradient-primary hover:shadow-button transition-all duration-300"
              onClick={handleGuidelinesAccept}
            >
              Concordo e Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Creation Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gradient-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Novo Perfil
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Upload de imagens */}
            <div className="space-y-3">
              <Label>Fotos do Perfil</Label>
              <p className="text-xs text-muted-foreground">Foto de frente é obrigatória, foto de perfil é opcional</p>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Foto de Frente */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Foto de Frente *</Label>
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
                        <p className="text-xs text-muted-foreground">Foto de frente *</p>
                      </div>
                    )}
                  </Card>
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
                </div>
              </div>
            </div>

            {/* Checkbox para perfil anônimo */}
            <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
              <Checkbox 
                id="anonymous"
                checked={formData.isAnonymous}
                onCheckedChange={handleAnonymousChange}
              />
              <Label htmlFor="anonymous" className="text-sm cursor-pointer">
                Esta é uma pessoa anônima (não famosa)
              </Label>
            </div>

            {/* Informações básicas */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Altura (metros) *</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  min="0.5"
                  max="3"
                  placeholder="ex: 1.75"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">País *</Label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Selecionar país</option>
                  <option value="Afeganistão">Afeganistão</option>
                  <option value="África do Sul">África do Sul</option>
                  <option value="Alemanha">Alemanha</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Austrália">Austrália</option>
                  <option value="Áustria">Áustria</option>
                  <option value="Bélgica">Bélgica</option>
                  <option value="Bolívia">Bolívia</option>
                  <option value="Brasil">Brasil</option>
                  <option value="Canadá">Canadá</option>
                  <option value="Chile">Chile</option>
                  <option value="China">China</option>
                  <option value="Colômbia">Colômbia</option>
                  <option value="Coreia do Sul">Coreia do Sul</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Dinamarca">Dinamarca</option>
                  <option value="Equador">Equador</option>
                  <option value="Espanha">Espanha</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Finlândia">Finlândia</option>
                  <option value="França">França</option>
                  <option value="Grécia">Grécia</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Índia">Índia</option>
                  <option value="Indonésia">Indonésia</option>
                  <option value="Irlanda">Irlanda</option>
                  <option value="Islândia">Islândia</option>
                  <option value="Israel">Israel</option>
                  <option value="Itália">Itália</option>
                  <option value="Japão">Japão</option>
                  <option value="México">México</option>
                  <option value="Nicarágua">Nicarágua</option>
                  <option value="Noruega">Noruega</option>
                  <option value="Nova Zelândia">Nova Zelândia</option>
                  <option value="Panamá">Panamá</option>
                  <option value="Paraguai">Paraguai</option>
                  <option value="Peru">Peru</option>
                  <option value="Polônia">Polônia</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Reino Unido">Reino Unido</option>
                  <option value="República Dominicana">República Dominicana</option>
                  <option value="Rússia">Rússia</option>
                  <option value="Suécia">Suécia</option>
                  <option value="Suíça">Suíça</option>
                  <option value="Turquia">Turquia</option>
                  <option value="Ucrânia">Ucrânia</option>
                  <option value="Uruguai">Uruguai</option>
                  <option value="Venezuela">Venezuela</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gênero *</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Selecionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={formData.isAnonymous}
                  required
                >
                  <option value="">Selecionar categoria</option>
                  <option value="User Profiles">User Profiles</option>
                  <option value="Pop Culture">Pop Culture</option>
                  <option value="Music and Entertainment">Music and Entertainment</option>
                  <option value="Arts">Arts</option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="Sciences">Sciences</option>
                  <option value="Sports">Sports</option>
                  <option value="Business">Business</option>
                  <option value="Politics">Politics</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ancestry">Ancestralidade Conhecida *</Label>
              <Textarea
                id="ancestry"
                placeholder="Descreva a ancestralidade conhecida..."
                value={formData.ancestry}
                onChange={(e) => setFormData(prev => ({ ...prev, ancestry: e.target.value }))}
                rows={3}
                required
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
    </>
  );
};