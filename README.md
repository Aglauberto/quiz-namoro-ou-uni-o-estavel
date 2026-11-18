# Funil de Quiz: Namoro ou União Estável?

Aplicação web interativa, responsiva e de alta conversão, desenhada sob as diretrizes do **Apple Design** (interfaces fluidas, feedback táctil imediato, tipografia refinada e materiais translúcidos) e com a identidade visual nas cores **vinho, bege/creme, cinza e dourado**.

---

## 🚀 Como Acessar e Testar Localmente

O servidor local já está ativo no seu computador:
👉 **[http://localhost:3000](http://localhost:3000)**

Para reiniciar ou rodar em outra máquina:
```bash
node server.js
```
Ou com qualquer servidor estático:
```bash
npx serve .
```

---

## 📱 Estrutura das 9 Telas

1. **Tela 1: Boas-vindas**
   - Headline: *"Seu relacionamento pode ter consequências jurídicas que você desconhece."*
   - Subtexto explicativo, badge de avaliação jurídica e botão **COMEÇAR**.
2. **Tela 2: Pergunta 1**
   - *"Qual é sua situação atual?"* (4 opções de toque amplo e auto-avanço).
3. **Tela 3: Pergunta 2**
   - *"O que vocês já compartilham?"* (Contas, bens, filhos ou nada disso).
4. **Tela 4: Evidência Visual 1**
   - *"Morar junto não significa automaticamente união estável!"*
   - Ilustração vetorial minimalista (casal entre duas casas).
   - Apoio: *"Morar separado também não impede seu reconhecimento."*
5. **Tela 5: Pergunta 3**
   - *"Se vocês terminassem hoje, você saberia como ficariam os bens?"*
6. **Tela 6: Pergunta 4**
   - *"Você sabe para que serve um contrato de namoro?"*
7. **Tela 7: Evidência Visual 2**
   - *"Ter um filho e estar noivo comprova união estável?"*
   - Ícones de alianças + bebê com destaque **NÃO NECESSARIAMENTE!**.
   - Jurisprudência citada: STJ, 21/10/2026.
8. **Tela 8: Pergunta 5**
   - *"O que mais preocupa você?"* (Patrimônio, direitos, separação, comprovação).
9. **Tela 9: Conversão / Oferta Final**
   - Headline: *"Você conhece seu relacionamento. Mas conhece seus direitos?"*
   - **Mockup 3D realista em CSS/SVG** do **Guia Prático: Namoro ou União Estável?** (PDF de 21 páginas).
   - 30 perguntas e respostas sobre direitos, patrimônio e contratos.
   - Autoria: **Bertolina Sueli**, advogada e mediadora judicial.
   - Preço: **R$ 29,90** (pagamento único).
   - Botão de Checkout: **QUERO ACESSAR MEU GUIA**.
   - Selos de segurança e disclaimer obrigatório.

---

## 🎨 Princípios Apple Design Aplicados

- **Kill Latency (Princípio #1):** Efeito `:active` com scale `0.97` no instante do toque (`pointerdown`).
- **Micro-Haptic:** Feedback auditivo suave sintetizado via Web Audio API ao tocar nas opções e avançar.
- **Transições Fluidas:** Curvas de aceleração inspiradas em molas de desaceleração da Apple.
- **Navegação Não-Bloqueante:** Botão de **Voltar** permitindo alterar respostas a qualquer instante.
- **Barra de Progresso Realista:** Indicação exata de 1/9 a 9/9 sem contadores falsos.

---

## 🔗 Como Configurar o Link de Checkout

Abra o arquivo `index.html` e edite a linha do botão na Tela 9:
```html
<a href="SEU_LINK_DO_CHECKOUT_AQUI" class="btn-primary btn-checkout" id="btnCheckout">
  QUERO ACESSAR MEU GUIA
</a>
```
Substitua pela sua URL da Hotmart, Kiwify, Eduzz, Stripe, etc.
