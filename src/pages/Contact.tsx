import { Header } from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ExternalLink } from "lucide-react";

const Contact = () => {
  const email = "contato@phindex.com";

  const handleEmailClick = () => {
    window.open(`mailto:${email}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AppSidebar />
      <main className="lg:ml-80 pt-16">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Entre em Contato</CardTitle>
              <CardDescription className="text-lg">
                Estamos aqui para ajudar você. Entre em contato conosco!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Main Contact Card */}
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-2">E-mail Principal</h3>
                      <p className="text-muted-foreground mb-4">
                        Para dúvidas, sugestões ou suporte técnico
                      </p>
                      <div className="bg-muted/50 p-3 rounded-lg mb-4">
                        <p className="font-mono text-lg">{email}</p>
                      </div>
                      <Button onClick={handleEmailClick} className="w-full">
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar E-mail
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Information Cards */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Suporte Técnico</h4>
                    <p className="text-sm text-muted-foreground">
                      Problemas com o site, bugs ou dificuldades técnicas.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Sugestões</h4>
                    <p className="text-sm text-muted-foreground">
                      Ideias para melhorar a plataforma e novas funcionalidades.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Parcerias</h4>
                    <p className="text-sm text-muted-foreground">
                      Propostas de colaboração e parcerias comerciais.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Geral</h4>
                    <p className="text-sm text-muted-foreground">
                      Dúvidas gerais sobre a plataforma e como utilizá-la.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Response Time Info */}
              <Card className="bg-muted/50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tempo de resposta:</strong> Normalmente respondemos em até 24 horas durante dias úteis.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Contact;