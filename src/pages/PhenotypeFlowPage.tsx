import { Header } from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useState, useRef } from "react";
import { toast } from "sonner";

const phenotypeData = {
  "Northern America": [
    "Eskimid",
    "Margid", 
    "Pacificid",
    "Silvid"
  ],
  "Central America": [
    "Centralid"
  ],
  "Southern America": [
    "Amazonid",
    "Andid",
    "Lagid",
    "Patagonid"
  ],
  "North Africa": [
    "Mediterranid",
    "Orientalid"
  ],
  "East Africa": [
    "Ethiopid",
    "Nilotid",
    "Sudanid"
  ],
  "Sub-Saharan Africa": [
    "Bambutid",
    "Bantuid",
    "Congoid",
    "Khoid",
    "Sanid"
  ],
  "Central Asia": [
    "Tungid",
    "Turanid"
  ],
  "Southern Asia": [
    "Indid",
    "Indo Melanin",
    "Veddid"
  ],
  "Eastern Asia": [
    "Ainuid",
    "Sibirid",
    "Sinid"
  ],
  "Southeastern Asia": [
    "Negritid",
    "South Mongoloid"
  ],
  "Eastern Europe": [
    "Dinarid",
    "East Europid",
    "Turanid"
  ],
  "Southern Europe": [
    "Mediterranid"
  ],
  "Central Europe": [
    "Alpinid"
  ],
  "Northern Europe": [
    "Lappid",
    "Nordid"
  ],
  "Anatolia": [
    "Alpinid",
    "Armenoid",
    "Mediterranid",
    "Turanid"
  ],
  "Levant": [
    "Armenoid",
    "Mediterranid"
  ],
  "Arabian Peninsula": [
    "Orientalid",
    "Veddid"
  ],
  "Persian Plateau": [
    "Orientalid"
  ],
  "Australia and New Zealand": [
    "Australid"
  ],
  "Melanesia": [
    "Melanesid"
  ],
  "Polynesia": [
    "Polynesid"
  ]
};

const phenotypeRegions = [
  {
    name: "Europe",
    subregions: [
      "Eastern Europe",
      "Central Europe", 
      "Southern Europe",
      "Northern Europe"
    ]
  },
  {
    name: "Africa",
    subregions: [
      "North Africa",
      "East Africa",
      "Sub-Saharan Africa"
    ]
  },
  {
    name: "Middle East",
    subregions: [
      "Levant",
      "Anatolia",
      "Arabian Peninsula",
      "Persian Plateau"
    ]
  },
  {
    name: "Asia",
    subregions: [
      "Central Asia",
      "Eastern Asia",
      "Southern Asia", 
      "Southeastern Asia"
    ]
  },
  {
    name: "Americas",
    subregions: [
      "Northern America",
      "Central America",
      "Southern America"
    ]
  },
  {
    name: "Oceania",
    subregions: [
      "Australia and New Zealand",
      "Melanesia",
      "Polynesia"
    ]
  }
];

export default function PhenotypeFlowPage() {
  const { uploadImage, isUploading } = useImageUpload();
  const [uploadedImages, setUploadedImages] = useState<Record<string, { male?: string; female?: string }>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const getImageKey = (phenotype: string, gender: 'male' | 'female') => `${phenotype}-${gender}`;

  const handleFileSelect = async (phenotype: string, gender: 'male' | 'female', file: File) => {
    try {
      const imageUrl = await uploadImage(file, 'profile');
      if (imageUrl) {
        setUploadedImages(prev => ({
          ...prev,
          [phenotype]: {
            ...prev[phenotype],
            [gender]: imageUrl
          }
        }));
        toast.success(`${gender} photo uploaded successfully for ${phenotype}`);
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleUploadClick = (phenotype: string, gender: 'male' | 'female') => {
    const key = getImageKey(phenotype, gender);
    const input = fileInputRefs.current[key];
    if (input) {
      input.click();
    }
  };

  const handleFileChange = (phenotype: string, gender: 'male' | 'female') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(phenotype, gender, file);
    }
  };

  const removeImage = (phenotype: string, gender: 'male' | 'female') => {
    setUploadedImages(prev => ({
      ...prev,
      [phenotype]: {
        ...prev[phenotype],
        [gender]: undefined
      }
    }));
    toast.success(`${gender} photo removed for ${phenotype}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AppSidebar />
      
      <main className="lg:ml-80 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Phenotype Flow
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore phenotypic diversity across different geographic regions
            </p>
          </div>

          <div className="space-y-6">
            {phenotypeRegions.map((region, regionIndex) => (
              <Card key={regionIndex} className="w-full">
                <CardHeader>
                  <CardTitle className="text-2xl text-phindex-teal">
                    {region.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {region.subregions.map((subregion, subregionIndex) => (
                      <AccordionItem key={subregionIndex} value={`${regionIndex}-${subregionIndex}`}>
                        <AccordionTrigger className="text-lg font-medium">
                          {subregion}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-6">
                            {phenotypeData[subregion as keyof typeof phenotypeData]?.map((phenotype, phenotypeIndex) => (
                              <div key={phenotypeIndex} className="border rounded-lg p-4 bg-card">
                                <h4 className="text-lg font-semibold text-foreground mb-4">{phenotype}</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Male section */}
                                  <div className="space-y-3">
                                    <h5 className="text-md font-medium text-muted-foreground">Male</h5>
                                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-phindex-teal transition-colors">
                                      {uploadedImages[phenotype]?.male ? (
                                        <div className="relative">
                                          <img 
                                            src={uploadedImages[phenotype].male} 
                                            alt={`${phenotype} male reference`}
                                            className="max-h-48 mx-auto rounded object-cover"
                                          />
                                          <Button
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={() => removeImage(phenotype, 'male')}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <>
                                          <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                                          <p className="text-sm text-muted-foreground mb-3">
                                            No male reference photo
                                          </p>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleUploadClick(phenotype, 'male')}
                                            disabled={isUploading}
                                          >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {isUploading ? 'Uploading...' : 'Upload Male Photo'}
                                          </Button>
                                        </>
                                      )}
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={(el) => fileInputRefs.current[getImageKey(phenotype, 'male')] = el}
                                        onChange={handleFileChange(phenotype, 'male')}
                                      />
                                    </div>
                                  </div>
                                  
                                  {/* Female section */}
                                  <div className="space-y-3">
                                    <h5 className="text-md font-medium text-muted-foreground">Female</h5>
                                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-phindex-teal transition-colors">
                                      {uploadedImages[phenotype]?.female ? (
                                        <div className="relative">
                                          <img 
                                            src={uploadedImages[phenotype].female} 
                                            alt={`${phenotype} female reference`}
                                            className="max-h-48 mx-auto rounded object-cover"
                                          />
                                          <Button
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={() => removeImage(phenotype, 'female')}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <>
                                          <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                                          <p className="text-sm text-muted-foreground mb-3">
                                            No female reference photo
                                          </p>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleUploadClick(phenotype, 'female')}
                                            disabled={isUploading}
                                          >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {isUploading ? 'Uploading...' : 'Upload Female Photo'}
                                          </Button>
                                        </>
                                      )}
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={(el) => fileInputRefs.current[getImageKey(phenotype, 'female')] = el}
                                        onChange={handleFileChange(phenotype, 'female')}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )) || (
                              <p className="text-muted-foreground text-center py-8">
                                No phenotypes defined for this subregion
                              </p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}