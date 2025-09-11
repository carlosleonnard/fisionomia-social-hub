import { Header } from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { Footer } from "@/components/Footer";
import { Construction } from "lucide-react";

export default function PhenotypeFlowPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AppSidebar />
      
      <main className="lg:ml-80 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Construction className="h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Phenotype Flow
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Esta página está em construção
            </p>
            <p className="text-muted-foreground max-w-md">
              Estamos trabalhando para trazer uma experiência incrível de fluxo de fenótipos. 
              Volte em breve para conferir as novidades!
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}