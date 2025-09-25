'use client';

import { useEffect, useRef } from 'react';
import { SendHorizonal } from 'lucide-react';
import clsx from 'clsx';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Escreva uma mensagem…',
  disabled = false,
  isLoading = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [value]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  const isSubmitDisabled = disabled || isLoading || value.trim().length === 0;

  return (
    <div className="rounded-[24px] border border-[#d6e2f5] bg-chat-surface px-4 py-3 shadow-[0_12px_32px_rgba(4,84,160,0.08)] transition focus-within:border-primary/60 focus-within:shadow-[0_16px_42px_rgba(4,84,160,0.16)]">
      <div className="flex items-end gap-4">
        <textarea
          ref={textareaRef}
          value={value}
          rows={1}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={clsx(
            'w-full resize-none bg-transparent text-sm text-chat-text placeholder:text-[#A5B4CF] focus:outline-none',
            disabled && 'cursor-not-allowed opacity-60'
          )}
          aria-label="Campo de mensagem"
          maxLength={2000}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className={clsx(
            'inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-secondary text-white shadow-[0_10px_20px_rgba(43,176,113,0.35)] transition hover:brightness-110',
            isSubmitDisabled && 'cursor-not-allowed opacity-60 shadow-none'
          )}
          aria-label="Enviar mensagem"
        >
          <SendHorizonal className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
