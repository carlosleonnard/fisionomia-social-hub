/**
 * UTILITÁRIOS GLOBAIS (utils.ts)
 * 
 * Este arquivo contém funções utilitárias que são usadas em toda a aplicação.
 * Principalmente para manipulação e combinação de classes CSS do Tailwind.
 */

// Importa clsx para concatenação condicional de classes CSS
import { clsx, type ClassValue } from "clsx"
// Importa twMerge para resolver conflitos entre classes do Tailwind
import { twMerge } from "tailwind-merge"

/**
 * FUNÇÃO DE COMBINAÇÃO DE CLASSES CSS (cn)
 * 
 * Esta é uma função utilitária essencial usada em toda a aplicação para:
 * 1. Combinar múltiplas classes CSS de forma condicional
 * 2. Resolver conflitos entre classes do Tailwind CSS
 * 3. Manter a precedência correta das classes
 * 
 * @param inputs - Array de valores que podem ser strings, objetos ou arrays de classes
 * @returns String final com todas as classes combinadas e otimizadas
 * 
 * Exemplo de uso:
 * cn("bg-red-500", "text-white", { "font-bold": isActive }, className)
 * 
 * twMerge resolve conflitos como: "bg-red-500 bg-blue-500" -> "bg-blue-500"
 * clsx permite condicionais como: { "active": isActive }
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
