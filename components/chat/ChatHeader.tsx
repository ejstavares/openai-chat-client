'use client';

import { X, Trash2, MessageCircle } from 'lucide-react';
import clsx from 'clsx';

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  onClear: () => void;
  onToggle?: () => void;
  isFloating?: boolean;
  isOpen?: boolean;
}

export default function ChatHeader({
  title,
  subtitle,
  onClear,
  onToggle,
  isFloating = false,
  isOpen = true,
}: ChatHeaderProps) {
  return (
    <header
      className={clsx(
        'relative overflow-hidden rounded-t-[32px] border-b border-white/10 px-6 py-5 text-white',
        'max-[640px]:rounded-none max-[640px]:pt-[calc(env(safe-area-inset-top)+1.25rem)] max-[640px]:pb-5',
        'bg-gradient-to-r from-primary via-secondary to-accent shadow-[inset_0_-1px_0_rgba(255,255,255,0.2)]'
      )}
    >
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold leading-tight tracking-tight">{title}</h2>
            {subtitle ? (
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/80">{subtitle}</p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Limpar conversa"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
          {isFloating && onToggle ? (
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label={isOpen ? 'Minimizar chat' : 'Expandir chat'}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40" aria-hidden="true">
        <div className="absolute -right-10 -top-16 h-36 w-36 rounded-full bg-white/40 blur-3xl" />
        <div className="absolute -bottom-12 left-4 h-32 w-32 rounded-full bg-white/30 blur-3xl" />
      </div>
    </header>
  );
}
