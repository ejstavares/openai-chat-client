# OpenAI Assistants - KreUI
Construído integralmente com o GPT-5 Codex através de prompting iterativo.


Widget de chat pronto para Next.js 13+ (App Router) com integração à OpenAI Assistants API. Design responsivo com Tailwind CSS, suporte a Markdown, histórico persistido no navegador e indicadores de estado para experiência próxima a ferramentas como Typebot.

## Requisitos
- Node.js 18+
- Next.js 13 ou superior (App Router)
- Tailwind CSS
- Conta e credenciais da OpenAI Assistants API

## Instalação
```bash
npm install
# ou
pnpm install
```

## Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com as chaves:
```
OPENAI_API_KEY=your_openai_api_key
OPENAI_ASSISTANT_ID=your_assistant_id
NEXT_PUBLIC_CHAT_WIDGET_HEIGHT=0.8
NEXT_PUBLIC_CHAT_SHOW_WELCOME_POPUP=true
NEXT_PUBLIC_CHAT_POPUP_MESSAGE=Olá 👋, precisa de ajuda?
NEXT_PUBLIC_CHAT_POPUP_DELAY=5000
NEXT_PUBLIC_CHAT_TITLE="Assistente Kre+"
NEXT_PUBLIC_CHAT_SUBTITLE="Portal Formação & Emprego"
NEXT_PUBLIC_CHAT_BUTTON_LABEL="Conversar"
NEXT_PUBLIC_CHAT_PRIMARY_COLOR="#0454A0"
NEXT_PUBLIC_CHAT_SECONDARY_COLOR="#2370BB"
NEXT_PUBLIC_CHAT_ACCENT_COLOR="#2BB071"
NEXT_PUBLIC_CHAT_BACKGROUND_COLOR="#F8FAFD"
NEXT_PUBLIC_CHAT_USER_BUBBLE_COLOR="#FFFFFF"
NEXT_PUBLIC_CHAT_WELCOME_MESSAGE="Olá 👋\nSou o assistente virtual do Portal Krê+. Estou aqui para o ajudar com informações sobre o setor do Emprego e da Formação Profissional\nEm que posso ajudar?"
```
Consulte `.env.example` para referência.

Por padrão o widget ocupa 80% da altura da viewport; ajuste `NEXT_PUBLIC_CHAT_WIDGET_HEIGHT` (0.1–1) conforme necessário.
Ative um pop-up de boas-vindas com `NEXT_PUBLIC_CHAT_SHOW_WELCOME_POPUP`, personalizando mensagem e atraso (ms) via `NEXT_PUBLIC_CHAT_POPUP_MESSAGE` e `NEXT_PUBLIC_CHAT_POPUP_DELAY`.
Personalize título, subtítulo, rótulo do botão flutuante e paleta padrão via variáveis `NEXT_PUBLIC_CHAT_TITLE`, `NEXT_PUBLIC_CHAT_SUBTITLE`, `NEXT_PUBLIC_CHAT_BUTTON_LABEL`, `NEXT_PUBLIC_CHAT_*_COLOR` e `NEXT_PUBLIC_CHAT_USER_BUBBLE_COLOR`. Prefira envolver valores hexadecimais e textos com espaços em aspas ("#ABCDEF").

## Executando em Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3000` para visualizar o widget.

## Estrutura
```
app/
  api/chat/route.ts      # Rota serverless que orquestra threads e runs do Assistants
  page.tsx               # Exemplo de integração do widget
components/
  chat/                  # Componentes do widget (header, mensagens, input, etc.)
lib/
  openai.ts              # Cliente OpenAI reutilizável
  rateLimiter.ts         # Implementação simples de rate limiting in-memory
```

## Como Integrar em outro projeto
1. Copie o diretório `components/chat` para `src/components/chat` (ou caminho equivalente).
2. Copie `lib/openai.ts` e `lib/rateLimiter.ts`.
3. Adicione a rota `app/api/chat/route.ts` (ou adapte para `pages/api/chat.ts` caso utilize Pages Router).
4. Garanta que o Tailwind esteja configurado para fazer scan em `components/**/*.{ts,tsx}` e adicione as variáveis CSS opcionais em `globals.css`.
5. Importe o componente onde desejar:

```tsx
import ChatWidget from '@/components/chat/ChatWidget';

<ChatWidget
  placeholder="Pergunte sobre desenvolvimento..."
  position="bottom-right"
/>
```

## Props Disponíveis
| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `title` | `string` | `Assistente Virtual` | Título exibido no cabeçalho |
| `subtitle` | `string?` | `Plataforma Kre+` | Subtítulo opcional |
| `placeholder` | `string` | `Escreva a sua mensagem…` | Placeholder do campo de input |
| `primaryColor` | `string?` | `#0454A0` | Cor principal (gradient azul, cabeçalho) |
| `secondaryColor` | `string?` | `#2370BB` | Cor secundária do gradiente |
| `accentColor` | `string?` | `#2BB071` | Cor de destaque (botão enviar/flutuante) |
| `backgroundColor` | `string?` | `#F8FAFD` | Cor de fundo do widget |
| `position` | `'embedded' \| 'bottom-right' \| 'bottom-left'` | `'embedded'` | Define se o widget será flutuante ou inline |
| `storageKey` | `string` | `openai-chat-widget` | Prefixo usado no `sessionStorage` |
| `assistantId` | `string?` | `OPENAI_ASSISTANT_ID` | Permite sobrescrever o assistant via prop |
| `welcomeMessage` | `string` | `NEXT_PUBLIC_CHAT_WELCOME_MESSAGE` | Mensagem inicial exibida pelo agente |
| `showWelcomePopup` | `boolean?` | `true` | Controla exibição do pop-up de boas-vindas |
| `popupMessage` | `string?` | `Olá 👋, precisa de ajuda?` | Mensagem exibida no pop-up configurável |
| `popupDelay` | `number?` | `5000` | Atraso em ms para mostrar o pop-up |
| `widgetTitle` | `string?` | `NEXT_PUBLIC_CHAT_TITLE` | Sobrepõe título vindo do env |
| `widgetSubtitle` | `string?` | `NEXT_PUBLIC_CHAT_SUBTITLE` | Sobrepõe subtítulo do env |
| `floatingButtonLabel` | `string?` | `NEXT_PUBLIC_CHAT_BUTTON_LABEL` | Texto opcional ao lado do ícone flutuante |
| `userBubbleColor` | `string?` | `NEXT_PUBLIC_CHAT_USER_BUBBLE_COLOR` | Cor do balão/ícone do usuário |
| `className` | `string?` | `undefined` | Classe extra para estilização |

## Recursos Inclusos
- Visual alinhado ao kremais.gov.cv (Poppins, gradiente azul/verde Kre+)
- Pop-up de boas-vindas configurável (mensagem/atraso via env)
- Histórico persistido em `sessionStorage` com thread ID reutilizado
- Indicador de “digitando” e estados de envio/erro para mensagens
- Suporte a Markdown com sanitização (remark-gfm + rehype-sanitize)
- Input com auto-resize, limite de caracteres, envio via Enter
- Botões de limpar conversa e toggle para widget flutuante
- Rate limiting básico (20 requisições/minuto por IP) com cabeçalhos `X-RateLimit-*`
- Tratamento de erros com mensagens amigáveis e logs server-side

## Segurança
- A API key nunca é exposta no frontend; todas as chamadas ao Assistants passam por `/api/chat`
- Mensagens sanitizadas antes da renderização para evitar XSS
- Limite de caracteres e validação server-side via `zod`
- Rate limiting para evitar abuso

## Produção
- Ajuste variáveis `primaryColor`, `secondaryColor` e `backgroundColor` ao integrar no site final
- Configure logs/observabilidade (ex.: Vercel Observability) para monitorar a API route
- Caso utilize deploy serverless, considere armazenar histórico/threads em store persistente conforme necessidade do produto

## Testes & Próximos Passos
- Adicione testes end-to-end (ex.: Playwright) para garantir fluxo completo
- Configure monitoramento de uso da API e alertas para rate limits
- Extenda o widget com upload de arquivos, dark mode ou exportação de conversa conforme mencionado nos requisitos avançados
