import ChatWidget from '@/components/chat/ChatWidget';

export default function HomePage() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12">
      <section className="rounded-[32px] border border-[#d9e4f5] bg-white/80 p-10 shadow-[0_30px_60px_rgba(4,84,160,0.12)] backdrop-blur">
        <span className="inline-flex rounded-full bg-[#e1efff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0454a0]">
          Kre+
        </span>
        <h1 className="mt-6 text-4xl font-semibold text-chat-text">
          Assistente virtual integrado com a plataforma Kre+
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#616E85]">
          Este projeto demonstra como incorporar um widget de chat com o Assistants API da OpenAI mantendo a estética visual da Kre+.
          Adapte o componente para qualquer página do seu site em minutos, com personalização de cores, textos e posição.
        </p>
      </section>

      <div className="grid grow place-items-center rounded-[32px] border border-transparent bg-gradient-to-br from-[#0454a0]/10 via-[#2bb071]/5 to-[#f8fafd] p-12">
        <p className="max-w-lg text-center text-base text-[#4d5b78]">
          Interaja com o widget no canto da tela para conversar com o agente configurado e receber orientação sobre oportunidades da Kre+.
        </p>
      </div>

      <ChatWidget
        placeholder="Escreva a sua questão sobre a plataforma..."
        position="bottom-right"
      />
    </main>
  );
}
