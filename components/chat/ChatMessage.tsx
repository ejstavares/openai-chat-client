'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import clsx from 'clsx';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import type { ChatMessageShape } from './types';

interface ChatMessageProps {
  message: ChatMessageShape;
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
});

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';
  const timestamp = dateFormatter.format(new Date(message.createdAt));

  return (
    <article
      className={clsx('flex w-full gap-4', {
        'flex-row': isAssistant,
        'flex-row-reverse': !isAssistant,
      })}
      role="listitem"
      aria-live="polite"
    >
      <div
        className={clsx(
          'grid h-11 w-11 place-items-center rounded-2xl border text-sm font-medium shadow-sm',
          {
            'border-[#d6e2f5] bg-white text-primary shadow-[0_8px_18px_rgba(4,84,160,0.12)]': isAssistant,
            'border-transparent bg-[var(--chat-user-bubble, #ffffff)] text-[var(--chat-primary-color,#0454A0)] shadow-[0_10px_22px_rgba(4,84,160,0.2)]': !isAssistant,
          }
        )}
      >
        {isAssistant ? <Bot className="h-5 w-5" aria-hidden /> : <User className="h-5 w-5" aria-hidden />}
      </div>

      <div
        className={clsx(
          'relative max-w-[80%] rounded-[28px] border px-5 py-4 text-sm leading-relaxed shadow-sm transition',
          {
            'border-transparent bg-[#EFF2F5] text-chat-text shadow-[0_12px_30px_rgba(4,84,160,0.08)]': isAssistant,
            'border border-[#c8def5] bg-[var(--chat-user-bubble, #ffffff)] text-[#0d1421] shadow-[0_16px_34px_rgba(4,84,160,0.14)]': !isAssistant,
            'border-red-100 bg-red-50 text-red-700 shadow-none': message.status === 'error',
          }
        )}
      >
        <div className="prose prose-slate max-w-none text-sm prose-p:my-2 prose-p:leading-relaxed prose-pre:overflow-x-auto prose-pre:text-xs prose-strong:text-current">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
            {message.content}
          </ReactMarkdown>
        </div>
        <footer className="mt-3 flex items-center gap-2 text-xs text-[#616E85]">
          <span>{timestamp}</span>
          {message.status === 'sending' && (
            <span className="inline-flex items-center gap-1 text-accent">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />Enviando…
            </span>
          )}
          {message.status === 'error' && <span>Falha ao enviar</span>}
        </footer>
      </div>
    </article>
  );
}
