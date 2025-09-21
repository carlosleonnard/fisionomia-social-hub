import { useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CountrySelector } from "@/components/CountrySelector";
import { useUserProfiles } from "@/hooks/use-user-profiles";
import { useAuth } from "@/hooks/use-auth";
import { useImageUpload } from "@/hooks/use-image-upload";
import { supabase } from "@/integrations/supabase/client";

interface AddProfileModalProps {
  // Remove onAddProfile prop as we'll handle it internally
}

export const AddProfileModal = ({}: AddProfileModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createProfile } = useUserProfiles();
  const { uploadImage, isUploading } = useImageUpload();
  const [open, setOpen] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    gender: "",
    category: "",
    height: "",
    ancestry: [] as string[], // Changed to array of countries
    frontImageUrl: "",
    profileImageUrl: "",
    isAnonymous: null as boolean | null
  });

  const [dragActive, setDragActive] = useState(false);

  const handleGuidelinesAccept = () => {
    setShowGuidelines(false);
    setOpen(true);
  };

  const handleTriggerClick = () => {
    setShowGuidelines(true);
  };

  const handleAnonymousChange = (value: string) => {
    const isAnonymous = value === "yes";
    setFormData(prev => ({ 
      ...prev, 
      isAnonymous: isAnonymous,
      category: isAnonymous ? "User Profiles" : ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('You need to be logged in to create a profile.');
      return;
    }
    
    if (formData.name && formData.country && formData.gender && formData.category && formData.height && formData.ancestry.length > 0 && formData.frontImageUrl && formData.isAnonymous !== null) {
      try {
        const newProfile = await createProfile.mutateAsync({
          name: formData.name,
          country: formData.country,
          gender: formData.gender,
          category: formData.category,
          height: parseFloat(formData.height),
          ancestry: formData.ancestry.join(', '), // Convert array to string
          frontImageUrl: formData.frontImageUrl,
          profileImageUrl: formData.profileImageUrl,
          isAnonymous: formData.isAnonymous
        });

        // Create complete profile record with all form data
        const { data: completeProfileData, error: completeProfileError } = await supabase
          .from('complete_profiles')
          .insert({
            user_id: user.id,
            profile_id: newProfile.id,
            name: formData.name,
            country: formData.country,
            gender: formData.gender,
            category: formData.category,
            height: parseFloat(formData.height),
            ancestry: formData.ancestry.join(', '), // Convert array to string
            is_anonymous: formData.isAnonymous,
            front_image_url: formData.frontImageUrl,
            profile_image_url: formData.profileImageUrl || null,
            description: formData.ancestry.join(', ') // Convert array to string
          });

        if (completeProfileError) {
          console.error('Error creating complete profile record:', completeProfileError);
        }

        // Reset form and close modal
        setFormData({ name: "", country: "", gender: "", category: "", height: "", ancestry: [], frontImageUrl: "", profileImageUrl: "", isAnonymous: null });
        setOpen(false);
        
        // Navigate to the new profile page
        navigate(`/user-profile/${newProfile.slug}`);
        } catch (error) {
        console.error('Error creating profile:', error);
      }
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

  const handleDrop = async (e: React.DragEvent, imageType: 'front' | 'profile') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const uploadedUrl = await uploadImage(file, imageType);
      
      if (uploadedUrl) {
        setFormData(prev => ({ 
          ...prev, 
          [imageType === 'front' ? 'frontImageUrl' : 'profileImageUrl']: uploadedUrl 
        }));
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, imageType: 'front' | 'profile') => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadedUrl = await uploadImage(file, imageType);
      
      if (uploadedUrl) {
        setFormData(prev => ({ 
          ...prev, 
          [imageType === 'front' ? 'frontImageUrl' : 'profileImageUrl']: uploadedUrl 
        }));
      }
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
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
              <p className="font-medium text-foreground">Before adding a profile, please read and agree to the following terms:</p>
              
              <ul className="space-y-2 list-disc list-inside">
                <li>Respect the privacy and rights of people represented in images</li>
                <li>Only use images you have permission to share</li>
                <li>Provide accurate and respectful information about ancestry</li>
                <li>Do not use images of minors without appropriate consent</li>
                <li>Maintain a respectful and inclusive environment</li>
                <li>Classifications should be based on visible characteristics, not stereotypes</li>
              </ul>
              
              <div className="space-y-2 pt-3 border-t border-border">
                <p className="text-xs font-medium text-foreground">
                  Please do your best to check for duplicates, periodically, we will clean out inactive or duplicated profiles
                </p>
                <p className="text-xs">
                  If you would like to remove a profile, please report to contact@phindex.com
                </p>
              </div>
              
              <p className="text-xs pt-2 border-t border-border">
                By continuing, you agree to follow these guidelines and use the platform responsibly.
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
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 bg-gradient-primary hover:shadow-button transition-all duration-300"
              onClick={handleGuidelinesAccept}
            >
              I Agree and Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Creation Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gradient-card border-border/50 max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              New Profile
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Upload de imagens */}
            <div className="space-y-3">
              <Label>Profile Photos</Label>
              <p className="text-xs text-muted-foreground">Front photo is required, profile photo is optional</p>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Foto de Frente */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Front Photo *</Label>
                <Card
                  className={`border-2 border-dashed transition-colors p-4 text-center cursor-pointer ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop(e, 'front')}
                  onClick={() => document.getElementById('front-image-input')?.click()}
                >
                  <input
                    id="front-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, 'front')}
                  />
                  {formData.frontImageUrl ? (
                    <div className="relative inline-block">
                        <img 
                          src={formData.frontImageUrl} 
                          alt="Front Preview" 
                          className="w-20 h-19 rounded-lg mx-auto object-cover"
                          style={{ aspectRatio: '640/607' }}
                        />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive hover:bg-destructive/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, frontImageUrl: "" }));
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {isUploading ? 'Uploading...' : 'Click or drag front photo *'}
                      </p>
                    </div>
                  )}
                </Card>
                </div>

                {/* Foto de Perfil */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Profile Photo</Label>
                <Card
                  className={`border-2 border-dashed transition-colors p-4 text-center cursor-pointer ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop(e, 'profile')}
                  onClick={() => document.getElementById('profile-image-input')?.click()}
                >
                  <input
                    id="profile-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, 'profile')}
                  />
                  {formData.profileImageUrl ? (
                    <div className="relative inline-block">
                        <img 
                          src={formData.profileImageUrl} 
                          alt="Profile Preview" 
                          className="w-20 h-19 rounded-lg mx-auto object-cover"
                          style={{ aspectRatio: '640/607' }}
                        />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive hover:bg-destructive/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, profileImageUrl: "" }));
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {isUploading ? 'Uploading...' : 'Click or drag profile photo'}
                      </p>
                    </div>
                  )}
                </Card>
                </div>
              </div>
            </div>

            {/* Campo sim/não para perfil anônimo */}
            <div className="space-y-2">
              <Label htmlFor="anonymousSelect">Is this an anonymous person? *</Label>
              <select
                id="anonymousSelect"
                value={formData.isAnonymous === true ? "yes" : formData.isAnonymous === false ? "no" : ""}
                onChange={(e) => handleAnonymousChange(e.target.value)}
                className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="" disabled>Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Informações básicas */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (meters) *</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  min="0.5"
                  max="3"
                  placeholder="e.g: 1.75"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select country</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Albania">Albania</option>
                  <option value="Algeria">Algeria</option>
                  <option value="Andorra">Andorra</option>
                  <option value="Angola">Angola</option>
                  <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Armenia">Armenia</option>
                  <option value="Australia">Australia</option>
                  <option value="Austria">Austria</option>
                  <option value="Azerbaijan">Azerbaijan</option>
                  <option value="Bahamas">Bahamas</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Barbados">Barbados</option>
                  <option value="Belarus">Belarus</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Belize">Belize</option>
                  <option value="Benin">Benin</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Brunei">Brunei</option>
                  <option value="Bulgaria">Bulgaria</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Burundi">Burundi</option>
                  <option value="Cabo Verde">Cabo Verde</option>
                  <option value="Cambodia">Cambodia</option>
                  <option value="Cameroon">Cameroon</option>
                  <option value="Canada">Canada</option>
                  <option value="Central African Republic">Central African Republic</option>
                  <option value="Chad">Chad</option>
                  <option value="Chile">Chile</option>
                  <option value="China">China</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Comoros">Comoros</option>
                  <option value="Congo">Congo</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Croatia">Croatia</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Cyprus">Cyprus</option>
                  <option value="Czech Republic">Czech Republic</option>
                  <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Djibouti">Djibouti</option>
                  <option value="Dominica">Dominica</option>
                  <option value="Dominican Republic">Dominican Republic</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Egypt">Egypt</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Equatorial Guinea">Equatorial Guinea</option>
                  <option value="Eritrea">Eritrea</option>
                  <option value="Estonia">Estonia</option>
                  <option value="Eswatini">Eswatini</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="Fiji">Fiji</option>
                  <option value="Finland">Finland</option>
                  <option value="France">France</option>
                  <option value="Gabon">Gabon</option>
                  <option value="Gambia">Gambia</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Germany">Germany</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Greece">Greece</option>
                  <option value="Grenada">Grenada</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Guinea">Guinea</option>
                  <option value="Guinea-Bissau">Guinea-Bissau</option>
                  <option value="Guyana">Guyana</option>
                  <option value="Haiti">Haiti</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Hungary">Hungary</option>
                  <option value="Iceland">Iceland</option>
                  <option value="India">India</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Iran">Iran</option>
                  <option value="Iraq">Iraq</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Israel">Israel</option>
                  <option value="Italy">Italy</option>
                  <option value="Jamaica">Jamaica</option>
                  <option value="Japan">Japan</option>
                  <option value="Jordan">Jordan</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Kiribati">Kiribati</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                  <option value="Laos">Laos</option>
                  <option value="Latvia">Latvia</option>
                  <option value="Lebanon">Lebanon</option>
                  <option value="Lesotho">Lesotho</option>
                  <option value="Liberia">Liberia</option>
                  <option value="Libya">Libya</option>
                  <option value="Liechtenstein">Liechtenstein</option>
                  <option value="Lithuania">Lithuania</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Madagascar">Madagascar</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Maldives">Maldives</option>
                  <option value="Mali">Mali</option>
                  <option value="Malta">Malta</option>
                  <option value="Marshall Islands">Marshall Islands</option>
                  <option value="Mauritania">Mauritania</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Micronesia">Micronesia</option>
                  <option value="Moldova">Moldova</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Mongolia">Mongolia</option>
                  <option value="Montenegro">Montenegro</option>
                  <option value="Morocco">Morocco</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Myanmar">Myanmar</option>
                  <option value="Namibia">Namibia</option>
                  <option value="Nauru">Nauru</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Niger">Niger</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="North Korea">North Korea</option>
                  <option value="North Macedonia">North Macedonia</option>
                  <option value="Norway">Norway</option>
                  <option value="Oman">Oman</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Palau">Palau</option>
                  <option value="Palestine">Palestine</option>
                  <option value="Panama">Panama</option>
                  <option value="Papua New Guinea">Papua New Guinea</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Peru">Peru</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Poland">Poland</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Romania">Romania</option>
                  <option value="Russia">Russia</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                  <option value="Saint Lucia">Saint Lucia</option>
                  <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                  <option value="Samoa">Samoa</option>
                  <option value="San Marino">San Marino</option>
                  <option value="São Tomé and Príncipe">São Tomé and Príncipe</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Senegal">Senegal</option>
                  <option value="Serbia">Serbia</option>
                  <option value="Seychelles">Seychelles</option>
                  <option value="Sierra Leone">Sierra Leone</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Slovakia">Slovakia</option>
                  <option value="Slovenia">Slovenia</option>
                  <option value="Solomon Islands">Solomon Islands</option>
                  <option value="Somalia">Somalia</option>
                  <option value="South Africa">South Africa</option>
                  <option value="South Korea">South Korea</option>
                  <option value="South Sudan">South Sudan</option>
                  <option value="Spain">Spain</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Sudan">Sudan</option>
                  <option value="Suriname">Suriname</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Syria">Syria</option>
                  <option value="Taiwan">Taiwan</option>
                  <option value="Tajikistan">Tajikistan</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Timor-Leste">Timor-Leste</option>
                  <option value="Togo">Togo</option>
                  <option value="Tonga">Tonga</option>
                  <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                  <option value="Tunisia">Tunisia</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Turkmenistan">Turkmenistan</option>
                  <option value="Tuvalu">Tuvalu</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Uzbekistan">Uzbekistan</option>
                  <option value="Vanuatu">Vanuatu</option>
                  <option value="Vatican City">Vatican City</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Yemen">Yemen</option>
                  <option value="Zambia">Zambia</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={formData.isAnonymous === true}
                  required
                >
                  <option value="">Select category</option>
                  {formData.isAnonymous !== true && (
                    <>
                      <option value="Pop Culture">Pop Culture</option>
                      <option value="Music and Entertainment">Music and Entertainment</option>
                      <option value="Arts">Arts</option>
                      <option value="Philosophy">Philosophy</option>
                      <option value="Sciences">Sciences</option>
                      <option value="Sports">Sports</option>
                      <option value="Business">Business</option>
                      <option value="Politics">Politics</option>
                    </>
                  )}
                  {formData.isAnonymous === true && (
                    <option value="User Profiles">User Profiles</option>
                  )}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ancestry">Known Ancestry *</Label>
              <CountrySelector
                selectedCountries={formData.ancestry}
                onCountriesChange={(countries) => setFormData(prev => ({ ...prev, ancestry: countries }))}
                placeholder="Type to search ancestry countries..."
                maxCountries={5}
              />
              <p className="text-xs text-muted-foreground">Select up to 5 countries that represent known ancestry</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-primary hover:shadow-button transition-all duration-300"
                disabled={createProfile.isPending || isUploading}
              >
                {createProfile.isPending || isUploading ? 'Creating...' : 'Add Profile'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};