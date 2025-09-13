/**
 * ARQUIVO DE ENTRADA DA APLICAÇÃO (main.tsx)
 * 
 * Este é o ponto de entrada principal da aplicação React. Ele é responsável por:
 * - Inicializar o React 18 com o novo sistema de renderização
 * - Conectar a aplicação ao DOM do HTML
 * - Carregar os estilos globais
 */

// Importa a função createRoot do React 18 para renderização moderna
import { createRoot } from 'react-dom/client'
// Importa o componente principal da aplicação
import App from './App.tsx'
// Importa todos os estilos CSS globais (Tailwind + customizações)
import './index.css'

/**
 * INICIALIZAÇÃO DA APLICAÇÃO
 * 
 * 1. document.getElementById("root")! - Busca o elemento HTML com id="root"
 *    O "!" indica que sabemos que este elemento existe (assertion)
 * 
 * 2. createRoot() - Cria uma raiz React 18 para renderização concurrent
 *    Isso habilita features como Suspense, useTransition, etc.
 * 
 * 3. render(<App />) - Renderiza o componente App dentro da raiz
 *    Inicia toda a hierarquia de componentes da aplicação
 */
createRoot(document.getElementById("root")!).render(<App />);
