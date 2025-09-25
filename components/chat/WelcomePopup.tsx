'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { MessageCircle, X } from 'lucide-react';

interface WelcomePopupProps {
  message: string;
  delay: number;
  variant?: 'floating' | 'inline';
  onDismiss?: () => void;
}

export default function WelcomePopup({ message, delay, variant = 'inline', onDismiss }: WelcomePopupProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, Math.max(0, delay));

    return () => clearTimeout(timer);
  }, [delay, dismissed]);

  const handleClose = () => {
    setVisible(false);
    setDismissed(true);
    onDismiss?.();
  };

  if (!visible || dismissed) return null;

  const isFloating = variant === 'floating';

  return (
    <aside
      className={clsx(
        'pointer-events-auto relative max-w-[240px] rounded-3xl border border-white/50 bg-white px-5 py-4 text-sm text-[#0d1421] shadow-[0_24px_48px_rgba(4,84,160,0.18)] backdrop-blur transition',
        isFloating ? 'mb-3' : 'mt-6'
      )}
      role="status"
      aria-live="polite"
    >
      {isFloating ? (
        <span
          aria-hidden="true"
          className="absolute -bottom-3 right-8 h-4 w-4 rotate-45 rounded-sm border border-white/50 bg-white shadow-[0_12px_18px_rgba(4,84,160,0.18)]"
        />
      ) : null}

      <button
        type="button"
        onClick={handleClose}
        className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#e4eefc] text-[#0454a0] transition hover:bg-[#d6e4fb]"
        aria-label="Fechar boas-vindas"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-accent">
          <MessageCircle className="h-4 w-4" aria-hidden />
        </span>
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
    </aside>
  );
}
