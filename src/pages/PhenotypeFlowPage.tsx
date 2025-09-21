import { Header } from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";

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
                          <div className="space-y-4">
                            <p className="text-muted-foreground">
                              Reference photos for {subregion} phenotypes
                            </p>
                            
                            {/* Photo upload/display area */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {/* Placeholder for existing photos */}
                              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-phindex-teal transition-colors">
                                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-sm text-muted-foreground mb-4">
                                  No reference photos yet
                                </p>
                                <Button variant="outline" size="sm">
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Photo
                                </Button>
                              </div>
                              
                              {/* Additional placeholder slots */}
                              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-phindex-teal transition-colors opacity-50">
                                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <Button variant="outline" size="sm" disabled>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Photo
                                </Button>
                              </div>
                              
                              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-phindex-teal transition-colors opacity-50">
                                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <Button variant="outline" size="sm" disabled>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Photo
                                </Button>
                              </div>
                            </div>
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