import { Header } from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqData = [
    {
      question: "O que é o Phindex?",
      answer: "O Phindex é uma plataforma para classificação e discussão de fenótipos físicos. Os usuários podem criar perfis, votar em classificações e participar de discussões sobre diversidade fenotípica."
    },
    {
      question: "Como criar um perfil?",
      answer: "Para criar um perfil, você precisa estar logado. Clique no botão 'Adicionar Perfil' no cabeçalho, preencha as informações solicitadas e faça upload das fotos necessárias."
    },
    {
      question: "Como funciona o sistema de votação?",
      answer: "Cada perfil pode receber votos em diferentes categorias fenotípicas. Os usuários podem votar uma vez por perfil em cada categoria, e os resultados são agregados para mostrar as classificações mais populares."
    },
    {
      question: "O que são regiões fenotípicas?",
      answer: "As regiões fenotípicas organizam os perfis por origem geográfica e características físicas predominantes, como Europa, África, Ásia, Américas, Oriente Médio e Oceania."
    },
    {
      question: "Posso criar perfis anônimos?",
      answer: "Sim, ao criar um perfil você pode escolher a opção 'Perfil Anônimo' para manter a privacidade da pessoa fotografada."
    },
    {
      question: "Como editar ou excluir meu perfil?",
      answer: "Você pode editar ou excluir apenas os perfis que você criou. Na página do perfil, haverá opções para editar ou excluir se você for o criador."
    },
    {
      question: "Como funciona o sistema de comentários?",
      answer: "Cada perfil possui uma seção de comentários onde usuários podem discutir as classificações. Os comentários podem ser curtidos e organizados por relevância."
    },
    {
      question: "O que fazer se encontrar conteúdo inadequado?",
      answer: "Entre em contato conosco através da página de contato informando o perfil ou comentário problemático. Revisaremos e tomaremos as medidas necessárias."
    },
    {
      question: "Como alterar minha foto e nome de usuário?",
      answer: "Acesse a página de Configurações através do menu lateral. Lá você pode alterar seu nome e foto de perfil."
    },
    {
      question: "A plataforma é gratuita?",
      answer: "Sim, o Phindex é completamente gratuito para uso. Você pode criar perfis, votar e comentar sem nenhum custo."
    },
    {
      question: "Como funciona a busca de perfis?",
      answer: "Você pode buscar perfis pelo nome na barra de pesquisa no cabeçalho. A busca mostra resultados em tempo real conforme você digita."
    },
    {
      question: "Posso baixar as fotos dos perfis?",
      answer: "As fotos são propriedade dos usuários que as enviaram. Recomendamos respeitar os direitos autorais e não fazer download sem permissão."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AppSidebar />
      <main className="lg:ml-80 pt-16">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <HelpCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">Perguntas Frequentes</CardTitle>
              <CardDescription className="text-lg">
                Encontre respostas para as dúvidas mais comuns sobre o Phindex
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Contact Section */}
              <Card className="mt-8 bg-muted/50">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Não encontrou sua resposta?</h3>
                  <p className="text-muted-foreground mb-4">
                    Entre em contato conosco e teremos prazer em ajudar!
                  </p>
                  <a 
                    href="/contact" 
                    className="text-primary hover:underline font-medium"
                  >
                    Ir para a página de contato →
                  </a>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FAQ;