'use client';

import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import ChatWidget from '@/components/chat/ChatWidget';

const features = [
  {
    title: 'Integração instantânea',
    description:
      'Widget pronto para Next.js com posicionamento flutuante ou embutido, estilos responsivos e armazenamento do histórico no navegador.',
  },
  {
    title: 'Totalmente personalizável',
    description:
      'Controle textos, cores, rótulos e mensagens de boas-vindas via props ou variáveis cliente-side, mantendo a identidade da KrêUI.',
  },
  {
    title: 'Assistants API no centro',
    description:
      'Servidor integrado com Threads & Runs, com _rate limiting_ embutido e pronta para se adaptar a qualquer agente da OpenAI.',
  },
  {
    title: 'Aberto a contribuições',
    description:
      'Código MIT, projetado para extensões como streaming, analytics e deploy serverless sem fricção.',
  },
];

const installSteps = [
  {
    title: '1. Clonar ou instalar',
    detail:
      'Clone o repositório `git clone https://github.com/ejstavares/openai-chat-client.git` ou adicione-o como dependência npm quando publicado.',
  },
  {
    title: '2. Configurar variáveis',
    detail:
      'Duplique `.env.example` para `.env.local` e defina `OPENAI_API_KEY`, `OPENAI_ASSISTANT_ID` e as variáveis `NEXT_PUBLIC_CHAT_*` conforme sua marca.',
  },
  {
    title: '3. Instalar dependências',
    detail: 'Execute `npm install` (Node 18.18+) e confirme se o build roda com `npm run lint` e `npm run build`.',
  },
  {
    title: '4. Incluir o widget',
    detail:
      'No arquivo da página, importe `ChatWidget` de `components/chat/ChatWidget` e renderize-o onde quiser, ajustando `position`, `placeholder` e textos.',
  },
  {
    title: '5. Conectar o endpoint',
    detail:
      'Garanta que a rota `/api/chat` esteja ativa. Para frameworks diferentes de Next.js, utilize a função do route handler como referência e adapte para Express/Fastify.',
  },
  {
    title: '6. Personalizar e publicar',
    detail:
      'Altere _component tokens_, fonts e gradients para casar com o seu design system. Faça deploy no Vercel, Netlify ou infraestrutura própria.',
  },
];

const highlights = [
  {
    title: 'Componentes modulares',
    copy: 'Header, mensagens, input e popup isolados para que você estenda comportamentos de forma granular.',
  },
  {
    title: 'Persistência leve',
    copy: 'Histórico sincronizado via `sessionStorage`, permitindo retomada do chat sem backend adicional.',
  },
  {
    title: 'Tema KrêUI pronto',
    copy: 'Tailwind ajustado para a paleta Kre+, com suporte a CSS custom properties para troca dinâmica.',
  },
];

const techStack = [
  { label: 'Next.js', value: '15.5.4 (App Router)' },
  { label: 'React', value: '18.2.0' },
  { label: 'TypeScript', value: '5.4.x' },
  { label: 'Tailwind CSS', value: '3.4 + @tailwindcss/typography' },
  { label: 'OpenAI SDK', value: '4.52.0 (Assistants API beta)' },
  { label: 'Zod', value: '3.23' },
  { label: 'react-markdown', value: '9.1 + remark-gfm + rehype-sanitize' },
  { label: 'lucide-react', value: '0.408' },
];

const screenshots = [
  {
    title: 'Experiência principal',
    description:
      'Janela flutuante completa, base para visualizar o widget em desktop e derivar variações responsivas e popups.',
    src: '/images/kreui-desktop.png',
    width: 2719,
    height: 1455,
    aspectRatio: 2719 / 1455,
    tag: 'Desktop',
    meta: 'Tela ampla',
    gradient: 'from-[#0454a0]/16 via-white to-[#2bb071]/12',
    notes: [
      'Integra o widget flutuante, cabeçalho com métricas e timeline completa de mensagens.',
      'Para mobile, utilize altura total (`NEXT_PUBLIC_CHAT_WIDGET_HEIGHT=1`) e tokens responsivos para bordas e tipografia.',
      'Ative o popup de convite com `NEXT_PUBLIC_CHAT_SHOW_WELCOME_POPUP` e personalize `NEXT_PUBLIC_CHAT_POPUP_MESSAGE` para replicar a abordagem compacta.',
    ],
  },
];

type ScreenshotItem = (typeof screenshots)[number];

function ScreenshotCard({
  item,
  priority,
  onExpand,
}: {
  item: ScreenshotItem;
  priority?: boolean;
  onExpand?: (item: ScreenshotItem) => void;
}) {
  const imageSizes = '(min-width: 1280px) 70vw, (min-width: 768px) 80vw, 100vw';
  const aspectRatio = item.aspectRatio ?? item.width / item.height;

  return (
    <article
      className={clsx(
        'h-full rounded-[28px] border border-[#e1efff] bg-gradient-to-br p-6 shadow-[0_24px_48px_rgba(4,84,160,0.12)] md:p-10',
        item.gradient,
      )}
    >
      <div className="flex flex-col gap-5 md:grid md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:items-start md:gap-8">
        <div className="flex items-center justify-between md:col-span-2">
          <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0454a0]">
            {item.tag}
          </span>
          {item.meta ? (
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-[#0454a0]/75 md:inline">
              {item.meta}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onExpand?.(item)}
          className="group relative block w-full md:col-start-2 md:row-start-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0454a0]/40 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
          aria-label={`Expandir ${item.title}`}
        >
          <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-inner transition-transform group-hover:scale-[1.01] md:rounded-3xl">
            <div
              className="relative flex items-center justify-center bg-gradient-to-br from-white via-[#f4f8ff] to-[#e6f3ff]"
              style={{ aspectRatio }}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes={imageSizes}
                className="object-contain"
                priority={priority}
              />
              <span className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-[#0b1e3c]/40 text-xs font-medium uppercase tracking-[0.18em] text-white transition group-hover:flex group-focus-visible:flex">
                Ampliar
              </span>
            </div>
          </div>
        </button>
        <div className="mt-4 md:col-start-1 md:row-start-2 md:mt-0">
          <h3 className="text-lg font-semibold text-chat-text">{item.title}</h3>
          <p className="mt-2 text-sm text-[#4d5b78]">{item.description}</p>
          {item.notes ? (
            <ul className="mt-4 space-y-2">
              {item.notes.map((note) => (
                <li key={note} className="flex items-start gap-2 text-xs leading-relaxed text-[#4d5b78]">
                  <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-[#2bb071]" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  );
}

const codeSample = `import ChatWidget from '@/components/chat/ChatWidget';

export default function Page() {
  return (
    <ChatWidget
      position="bottom-right"
      placeholder="Pergunte sobre vagas e formação"
      widgetTitle="OpenAI Assistants - KrêUI"
      widgetSubtitle="Portal formação & emprego"
    />
  );
}`;

export default function HomePage() {
  const primaryScreenshot = screenshots[0];
  const [activeScreenshot, setActiveScreenshot] = useState<ScreenshotItem | null>(null);
  const expandedAspectRatio = activeScreenshot
    ? activeScreenshot.aspectRatio ?? activeScreenshot.width / activeScreenshot.height
    : 1;

  useEffect(() => {
    if (!activeScreenshot) {
      document.body.style.removeProperty('overflow');
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveScreenshot(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.removeProperty('overflow');
    };
  }, [activeScreenshot]);

  return (
    <main className="relative mx-auto flex min-h-screen w-full flex-col gap-16 bg-gradient-to-br from-[#f5faff] via-white to-[#f0f8ff] px-6 py-16 md:max-w-6xl">
      <section className="rounded-[32px] border border-white/60 bg-white/80 p-10 shadow-[0_40px_80px_rgba(4,84,160,0.15)] backdrop-blur">
        <span className="inline-flex rounded-full bg-[#e1efff] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0454a0]">
          Open source
        </span>
        <h1 className="mt-6 text-4xl font-semibold leading-tight text-chat-text md:text-5xl">
          OpenAI Assistants - KrêUI
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#4d5b78]">
          Uma interface de chat moderna e pronta para produção construída sobre a Assistants API. Inspire-se na estética Kre+, reutilizando os
          componentes em múltiplos produtos e oferecendo uma experiência conversacional consistente.
        </p>
        <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-[#0454a0]">
          Construído com o Codex · modelo gpt-5-codex-high
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="https://github.com/ejstavares/openai-chat-client"
            className="inline-flex items-center rounded-full bg-[#0454a0] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(4,84,160,0.2)] transition hover:bg-[#034988]"
          >
            Ver repositório
          </Link>
          <a
            href="#instalacao"
            className="inline-flex items-center rounded-full border border-[#0454a0]/30 bg-white px-6 py-3 text-sm font-semibold text-[#0454a0] transition hover:border-[#0454a0]/60"
          >
            Guia de instalação
          </a>
        </div>
      </section>

      <section className="rounded-[32px] border border-[#e1efff] bg-white/80 p-10 shadow-[0_28px_60px_rgba(4,84,160,0.1)] backdrop-blur" aria-label="Stack técnica e requisitos">
        <h2 className="text-2xl font-semibold text-chat-text">Feito com Next.js 15 e stack moderna</h2>
        <p className="mt-3 max-w-3xl text-base text-[#4d5b78]">
          O KrêUI nasce sobre uma base atualizada para garantir desempenho, tipagem e integração direta com a Assistants API. Requer Node.js 18.18 ou superior e
          depende apenas de bibliotecas populares da comunidade.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {techStack.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-2xl border border-[#e1efff] bg-[#f8fbff] px-5 py-4 text-sm text-[#0454a0]">
              <span className="font-semibold">{item.label}</span>
              <span className="text-[#4d5b78]">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2" aria-label="Principais funcionalidades">
        <div className="rounded-[28px] border border-[#e1efff] bg-white/70 p-8 shadow-[0_24px_48px_rgba(4,84,160,0.08)] backdrop-blur">
          <h2 className="text-2xl font-semibold text-chat-text">Por que KrêUI?</h2>
          <p className="mt-3 text-base text-[#4d5b78]">
            O pacote consolida e é utilizado em diversos produtos para entregar um canal conversacional confiável. A estrutura modular facilita adicionar
            novas features sem reescrever fluxos de atendimento.
          </p>
          <ul className="mt-6 space-y-4">
            {highlights.map((item) => (
              <li key={item.title} className="rounded-2xl border border-[#e1efff] bg-[#f8fbff] p-4">
                <strong className="block text-sm font-semibold uppercase tracking-[0.12em] text-[#0454a0]">{item.title}</strong>
                <span className="mt-2 block text-sm text-[#4d5b78]">{item.copy}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[24px] border border-[#e1efff] bg-white/80 p-6 shadow-[0_20px_40px_rgba(4,84,160,0.08)] backdrop-blur"
            >
              <h3 className="text-lg font-semibold text-chat-text">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4d5b78]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="screenshots" className="space-y-8" aria-label="Demonstrações visuais">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-chat-text">Como o chat se apresenta</h2>
            <p className="mt-2 max-w-2xl text-base text-[#4d5b78]">
              Layout consistente no desktop e mobile, com popup de convite e tema adaptável. A captura abaixo serve como referência principal e inclui notas de como replicar as variações móveis e de convite.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-[#e1efff] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0454a0]">
            Screenshots
          </span>
        </div>
        {primaryScreenshot ? (
          <div className="mx-auto max-w-5xl">
            <ScreenshotCard item={primaryScreenshot} priority onExpand={(next) => setActiveScreenshot(next)} />
          </div>
        ) : null}
      </section>

      <section id="instalacao" className="rounded-[32px] border border-[#e1efff] bg-white/80 p-10 shadow-[0_30px_60px_rgba(4,84,160,0.12)] backdrop-blur">
        <h2 className="text-2xl font-semibold text-chat-text">Instalação e incorporação</h2>
        <p className="mt-3 text-base text-[#4d5b78]">
          O passo a passo abaixo replica e expande o guia do README, cobrindo configuração local, personalização e deploy.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {installSteps.map((step) => (
            <div key={step.title} className="rounded-2xl border border-[#e1efff] bg-[#f8fbff] p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0454a0]">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4d5b78]">{step.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-dashed border-[#0454a0]/30 bg-[#f5faff] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0454a0]">Exemplo de uso</p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-[#0b1e3c] p-6 text-xs text-[#e1efff]">
            <code>{codeSample}</code>
          </pre>
        </div>
      </section>

      <section className="rounded-[32px] border border-[#e1efff] bg-white/80 p-10 text-center shadow-[0_28px_60px_rgba(4,84,160,0.12)] backdrop-blur">
        <h2 className="text-2xl font-semibold text-chat-text">Ajude o KrêUI a crescer</h2>
        <p className="mt-3 text-base text-[#4d5b78]">
          Se o widget acelerou o seu projeto ou inspirou novas integrações, deixe uma estrela no repositório. O feedback impulsiona novas funcionalidades e mantém o
          projeto ativo.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="https://github.com/ejstavares/openai-chat-client"
            className="inline-flex items-center gap-2 rounded-full bg-[#ffb347] px-6 py-3 text-sm font-semibold text-[#0b1e3c] shadow-[0_12px_30px_rgba(255,179,71,0.35)] transition hover:bg-[#ffa031]"
          >
            ⭐️ Dar uma estrela
          </Link>
        </div>
      </section>

      <section className="space-y-6 rounded-[32px] border border-[#e1efff] bg-gradient-to-br from-[#0454a0]/90 via-[#0454a0]/80 to-[#2bb071]/70 p-10 text-white shadow-[0_30px_80px_rgba(4,84,160,0.4)]">
        <h2 className="text-3xl font-semibold">Projeto aberto à comunidade</h2>
        <p className="max-w-3xl text-base text-white/80">
          Aceitamos _issues_, _pull requests_ e sugestões de roadmap. Considere adicionar suporte a respostas em streaming, integrações com observabilidade ou adaptações para
          ambientes sem Next.js. Toda contribuição é bem-vinda.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="https://github.com/ejstavares/openai-chat-client/issues"
            className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0454a0] transition hover:bg-[#f0f5ff]"
          >
            Abrir issue
          </Link>
          <Link
            href="https://github.com/ejstavares/openai-chat-client#contributing"
            className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Guia de contribuição
          </Link>
        </div>
      </section>

      {activeScreenshot ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeScreenshot.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1e3c]/80 px-4 py-10 backdrop-blur"
          onClick={() => setActiveScreenshot(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded-[32px] border border-white/20 bg-[#051329]/95 p-6 shadow-[0_30px_90px_rgba(4,84,160,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveScreenshot(null)}
              className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-white/20"
              autoFocus
            >
              Fechar
            </button>
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5">
              <div
                className="relative flex items-center justify-center"
                style={{ aspectRatio: expandedAspectRatio }}
              >
                <Image
                  src={activeScreenshot.src}
                  alt={activeScreenshot.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#96c5ff]">{activeScreenshot.tag}</p>
              <h3 className="text-xl font-semibold text-white">{activeScreenshot.title}</h3>
              <p className="text-sm text-white/80">{activeScreenshot.description}</p>
            </div>
          </div>
        </div>
      ) : null}

      <ChatWidget
        placeholder="Escreva a sua questão sobre a plataforma..."
        position="bottom-right"
      />
    </main>
  );
}
