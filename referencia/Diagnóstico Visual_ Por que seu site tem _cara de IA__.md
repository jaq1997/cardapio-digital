# Diagnóstico Visual: Por que seu site tem "cara de IA"?

Analisei seu `style.css` e identifiquei os motivos técnicos que estão deixando o design com esse aspecto genérico e como podemos aproximá-lo do visual "Franquia Premium" da Pizza Hut.

## 1. O Problema do "Perfeito Demais" (IA-Style)
*   **Sombras Lavadas:** Você está usando `rgba(0,0,0,0.05)` e `0.12`. Isso cria uma névoa suave que é a marca registrada de componentes de IA/SaaS modernos. A Pizza Hut usa sombras mais densas ou até bordas sólidas para dar peso.
*   **Bordas Arredondadas Inconsistentes:** Você tem variáveis para `radius-card: 4px` e `radius-btn: 2px`. Embora pequenas, elas ainda tentam suavizar o design. O visual "Hut" é mais brutalista: ou é **100% quadrado** ou é **completamente arredondado (Pill)**.
*   **Montserrat em Peso Leve:** A Montserrat é uma fonte linda, mas se usada nos pesos 400/500, ela grita "template de agência".

## 2. O que falta para ser "Pizza Hut"
*   **Contraste Agressivo:** A Pizza Hut não usa cinza médio. É Branco Puro, Preto Sólido e Vermelho Sangue.
*   **Tipografia "Heavy":** A força da marca está no peso 900 (Black). Seus títulos precisam ser maiores e mais compactos.
*   **Texturas e Profundidade:** Falta o uso de padrões (como o xadrez vermelho da Pizza Hut) ou gradientes sutis que simulam a "sujeira" e o calor do forno.

## 3. Plano de Ação para o Novo CSS
Vou criar uma nova versão do seu CSS focando em:
1.  **Tipografia Brutalista:** Forçar o peso 900 em todos os títulos e usar `text-transform: uppercase` agressivo.
2.  **Sombras de Impacto:** Trocar as sombras suaves por sombras com mais opacidade e menos "blur", dando um aspecto de recorte.
3.  **Cores de Alta Saturação:** Ajustar o vermelho para o tom exato da marca e eliminar cinzas intermediários.
4.  **Botões de Ação:** Criar botões que pareçam "clicáveis" e pesados, não apenas retângulos coloridos.
