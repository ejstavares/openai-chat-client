'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import clsx from 'clsx';
import { Bot } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import WelcomePopup from './WelcomePopup';
import type { ChatMessageShape, ChatWidgetProps, ChatResponsePayload } from './types';

const DEFAULT_STORAGE_KEY = 'openai-chat-widget';
const DEFAULT_HEIGHT_RATIO = 0.8;
const DEFAULT_POPUP_DELAY = 5000;
const DEFAULT_POPUP_MESSAGE = 'Olá 👋, precisa de ajuda?';

const normalizeColor = (value?: string | null) => {
  if (!value) return undefined;
  const cleaned = value.trim();
  return cleaned.length > 0 ? cleaned : undefined;
};

const normalizeLabel = (value?: string | null) => {
  if (!value) return undefined;
  const cleaned = value.trim();
  return cleaned.length > 0 ? cleaned : undefined;
};

const envTitle = normalizeLabel(typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CHAT_TITLE : undefined);
const envSubtitle = normalizeLabel(typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CHAT_SUBTITLE : undefined);
const envButtonLabel = normalizeLabel(typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CHAT_BUTTON_LABEL : undefined);
const envPrimaryColor = normalizeColor(typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CHAT_PRIMARY_COLOR : undefined);
const envSecondaryColor = normalizeColor(typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CHAT_SECONDARY_COLOR : undefined);
const envAccentColor = normalizeColor(typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CHAT_ACCENT_COLOR : undefined);
const envBackgroundColor = normalizeColor(typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CHAT_BACKGROUND_COLOR : undefined);
const envUserBubbleColor = normalizeColor(typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CHAT_USER_BUBBLE_COLOR : undefined);
const envWelcomeMessage = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CHAT_WELCOME_MESSAGE : undefined;

const envHeight = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CHAT_WIDGET_HEIGHT : undefined;
const parsedHeight = envHeight ? Number.parseFloat(envHeight) : NaN;
const CHAT_HEIGHT_RATIO = Number.isFinite(parsedHeight) && parsedHeight > 0 && parsedHeight <= 1 ? parsedHeight : DEFAULT_HEIGHT_RATIO;
const CHAT_HEIGHT = `${parseFloat((CHAT_HEIGHT_RATIO * 100).toFixed(2))}vh`;

const isBrowser = typeof window !== 'undefined';

const generateId = () => {
  if (isBrowser && 'crypto' in window && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export default function ChatWidget({
  title,
  subtitle,
  placeholder = 'Escreva a sua mensagem…',
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundColor,
  position = 'embedded',
  storageKey = DEFAULT_STORAGE_KEY,
  assistantId,
  className,
  welcomeMessage,
  showWelcomePopup,
  popupMessage,
  popupDelay,
  widgetTitle,
  widgetSubtitle,
  floatingButtonLabel,
  userBubbleColor,
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessageShape[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(position === 'embedded');
  const [resolvedAssistantId, setResolvedAssistantId] = useState<string | null>(assistantId ?? null);
  const [popupConfig, setPopupConfig] = useState<{ message: string; delay: number } | null>(null);
  const [popupSuppressed, setPopupSuppressed] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const storageMessageKey = `${storageKey}:messages`;
  const storageThreadKey = `${storageKey}:thread`;
  const storageAssistantKey = `${storageKey}:assistant`;
  const storageWelcomeKey = `${storageKey}:welcome`;
  const isFloating = position !== 'embedded';

  const resolvedTitle = normalizeLabel(widgetTitle) ?? normalizeLabel(title) ?? envTitle ?? 'Assistente Virtual';
  const resolvedSubtitle = normalizeLabel(widgetSubtitle) ?? normalizeLabel(subtitle) ?? envSubtitle ?? 'Plataforma Kre+';
  const resolvedWelcomeMessage = (welcomeMessage ?? envWelcomeMessage ?? 'Olá! Sou o assistente da Kre+. Em que posso ajudar?')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n\n');
  const resolvedPrimaryColor = normalizeColor(primaryColor) ?? envPrimaryColor ?? '#0454A0';
  const resolvedSecondaryColor = normalizeColor(secondaryColor) ?? envSecondaryColor ?? '#2370BB';
  const resolvedAccentColor = normalizeColor(accentColor) ?? envAccentColor ?? '#2BB071';
  const resolvedBackgroundColor = normalizeColor(backgroundColor) ?? envBackgroundColor ?? '#F8FAFD';
  const resolvedButtonLabel = normalizeLabel(floatingButtonLabel) ?? envButtonLabel;
  const resolvedUserBubbleColor = normalizeColor(userBubbleColor) ?? envUserBubbleColor ?? resolvedPrimaryColor;
  const themeStyles = useMemo(() => {
    const styles: CSSProperties & {
      ['--chat-primary-color']?: string;
      ['--chat-secondary-color']?: string;
      ['--chat-accent-color']?: string;
      ['--chat-background-color']?: string;
      ['--chat-user-bubble']?: string;
    } = {};
    if (resolvedPrimaryColor) styles['--chat-primary-color'] = resolvedPrimaryColor;
    if (resolvedSecondaryColor) styles['--chat-secondary-color'] = resolvedSecondaryColor;
    if (resolvedAccentColor) styles['--chat-accent-color'] = resolvedAccentColor;
    if (resolvedBackgroundColor) styles['--chat-background-color'] = resolvedBackgroundColor;
    if (resolvedUserBubbleColor) styles['--chat-user-bubble'] = resolvedUserBubbleColor;
    return styles;
  }, [resolvedPrimaryColor, resolvedSecondaryColor, resolvedAccentColor, resolvedBackgroundColor, resolvedUserBubbleColor]);

  useEffect(() => {
    if (!isBrowser) return;

    const persistedAssistantId = sessionStorage.getItem(storageAssistantKey);
    if (assistantId) {
      sessionStorage.setItem(storageAssistantKey, assistantId);
      setResolvedAssistantId(assistantId);
    } else if (persistedAssistantId) {
      setResolvedAssistantId(persistedAssistantId);
    }

    const persistedThread = sessionStorage.getItem(storageThreadKey);
    const persistedMessages = sessionStorage.getItem(storageMessageKey);
    const persistedWelcome = sessionStorage.getItem(storageWelcomeKey);
    const welcomeChanged = persistedWelcome !== resolvedWelcomeMessage;

    if (welcomeChanged) {
      sessionStorage.removeItem(storageThreadKey);
      sessionStorage.removeItem(storageMessageKey);
      sessionStorage.setItem(storageWelcomeKey, resolvedWelcomeMessage);
      setThreadId(null);

      const welcome: ChatMessageShape = {
        id: generateId(),
        role: 'assistant',
        content: resolvedWelcomeMessage,
        createdAt: new Date().toISOString(),
        status: 'sent',
      };
      setMessages([welcome]);
      return;
    }

    if (persistedThread) {
      setThreadId(persistedThread);
    }

    if (persistedMessages) {
      try {
        const parsed = JSON.parse(persistedMessages) as ChatMessageShape[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (parseError) {
        console.warn('Erro ao recuperar histórico de mensagens', parseError);
      }
    }

    const welcome: ChatMessageShape = {
      id: generateId(),
      role: 'assistant',
      content: resolvedWelcomeMessage,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };

    setMessages([welcome]);
    sessionStorage.setItem(storageWelcomeKey, resolvedWelcomeMessage);
  }, [assistantId, resolvedWelcomeMessage, storageAssistantKey, storageMessageKey, storageThreadKey, storageWelcomeKey]);

  useEffect(() => {
    const enabled = (() => {
      if (typeof showWelcomePopup === 'boolean') return showWelcomePopup;
      if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CHAT_SHOW_WELCOME_POPUP !== undefined) {
        return process.env.NEXT_PUBLIC_CHAT_SHOW_WELCOME_POPUP === 'true';
      }
      return true;
    })();

    if (!enabled) {
      setPopupConfig(null);
      return;
    }

    if (popupSuppressed) {
      setPopupConfig(null);
      return;
    }

    const message =
      popupMessage ??
      (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CHAT_POPUP_MESSAGE
        ? process.env.NEXT_PUBLIC_CHAT_POPUP_MESSAGE
        : DEFAULT_POPUP_MESSAGE);

    const delayValueRaw =
      popupDelay ??
      (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CHAT_POPUP_DELAY
        ? Number.parseInt(process.env.NEXT_PUBLIC_CHAT_POPUP_DELAY, 10)
        : DEFAULT_POPUP_DELAY);

    const delay = Number.isFinite(delayValueRaw) && delayValueRaw >= 0 ? delayValueRaw : DEFAULT_POPUP_DELAY;

    setPopupConfig({ message, delay });
  }, [popupDelay, popupMessage, popupSuppressed, showWelcomePopup]);

  useEffect(() => {
    if (!isBrowser) return;
    sessionStorage.setItem(storageMessageKey, JSON.stringify(messages));
    sessionStorage.setItem(storageWelcomeKey, resolvedWelcomeMessage);
  }, [messages, resolvedWelcomeMessage, storageMessageKey, storageWelcomeKey]);

  useEffect(() => {
    if (!isBrowser) return;
    if (threadId) {
      sessionStorage.setItem(storageThreadKey, threadId);
    } else {
      sessionStorage.removeItem(storageThreadKey);
    }
  }, [threadId, storageThreadKey]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages.length, isLoading]);

  const handleSendMessage = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    if (trimmed.length > 2000) {
      setError('A mensagem ultrapassa o limite de 2000 caracteres.');
      return;
    }

    const userMessage: ChatMessageShape = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          threadId,
          assistantId: resolvedAssistantId ?? undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Não foi possível obter resposta do assistente.');
      }

      const data = (await response.json()) as ChatResponsePayload;

      const assistantMessages = data.messages
        .filter((item) => item.role === 'assistant')
        .map<ChatMessageShape>((item) => ({
          id: item.id,
          role: 'assistant',
          content: item.content,
          createdAt: item.created_at,
          status: 'sent',
        }));

      setThreadId(data.threadId);

      setMessages((prev) => {
        const updated = prev.map((message) =>
          message.id === userMessage.id ? { ...message, status: 'sent' as const } : message
        );
        return [...updated, ...assistantMessages];
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado ao enviar a mensagem.');
      setMessages((prev) =>
        prev.map((message) =>
          message.id === userMessage.id ? { ...message, status: 'error' } : message
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, resolvedAssistantId, threadId]);

  const handlePopupDismiss = useCallback(() => {
    setPopupSuppressed(true);
    setPopupConfig(null);
  }, []);

  const handleClearConversation = useCallback(() => {
    setMessages((prev) => {
      if (welcomeMessage) {
        const welcome: ChatMessageShape = {
          id: generateId(),
          role: 'assistant',
          content: welcomeMessage,
          createdAt: new Date().toISOString(),
          status: 'sent',
        };
        return [welcome];
      }
      return [];
    });
    setThreadId(null);
    setError(null);
    if (isBrowser) {
      sessionStorage.removeItem(storageMessageKey);
      sessionStorage.removeItem(storageThreadKey);
    }
  }, [storageMessageKey, storageThreadKey, welcomeMessage]);

  const toggleWidget = useCallback(() => {
    if (!isFloating) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setPopupSuppressed(true);
        setPopupConfig(null);
      }
      return next;
    });
  }, [isFloating]);

  const containerClasses = clsx(
    'flex w-full flex-col overflow-hidden rounded-[32px] border border-[#e0e8f5] bg-chat-surface text-chat-text shadow-widget transition-all',
    isFloating ? 'backdrop-blur-sm' : 'bg-white/90',
    className
  );

  const floatingWrapperClasses = clsx('fixed z-50 flex flex-col items-end gap-3', {
    'bottom-8 right-8': position === 'bottom-right',
    'bottom-8 left-8': position === 'bottom-left',
  });

  const floatingSectionStyle = isFloating
    ? ({
        height: CHAT_HEIGHT,
        maxHeight: CHAT_HEIGHT,
      } as CSSProperties)
    : undefined;

  const floatingButtonClasses = clsx(
    'rounded-full bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-[0_18px_36px_rgba(4,84,160,0.25)] transition hover:brightness-110 flex items-center',
    resolvedButtonLabel ? 'gap-3 px-5 py-3 text-sm font-semibold' : 'p-4'
  );

  const popupShouldRenderInWidget = popupConfig && !isFloating;
  const popupShouldRenderFloatingButton = popupConfig && isFloating && !isOpen && !popupSuppressed;

  return (
    <div style={themeStyles} className={isFloating ? floatingWrapperClasses : undefined}>
      {popupShouldRenderFloatingButton ? (
        <div className="self-end">
          <WelcomePopup
            message={popupConfig.message}
            delay={popupConfig.delay}
            variant="floating"
            onDismiss={handlePopupDismiss}
          />
        </div>
      ) : null}

      {isFloating && !isOpen ? (
        <button
          type="button"
          onClick={toggleWidget}
          className={floatingButtonClasses}
          aria-label={resolvedButtonLabel ?? "Abrir chat"}
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20">
            <Bot className="h-4 w-4" aria-hidden />
          </span>
          {resolvedButtonLabel ? <span>{resolvedButtonLabel}</span> : null}
        </button>
      ) : null}

      {(!isFloating || isOpen) && (
        <section
          className={clsx(containerClasses, {
            'w-full max-w-sm': isFloating,
          })}
          style={floatingSectionStyle}
          role="complementary"
          aria-label="Widget de chat com assistente"
        >
          <ChatHeader
            title={resolvedTitle}
            subtitle={resolvedSubtitle}
            onClear={handleClearConversation}
            onToggle={isFloating ? toggleWidget : undefined}
            isFloating={isFloating}
            isOpen={isOpen}
          />

          {popupShouldRenderInWidget ? (
            <div className="px-6 pt-5">
              <WelcomePopup
                message={popupConfig.message}
                delay={popupConfig.delay}
                variant="inline"
                onDismiss={handlePopupDismiss}
              />
            </div>
          ) : null}

          {error ? (
            <div className="bg-[#fdecec] px-6 py-3 text-xs font-medium text-[#b42318]" role="alert">
              {error}
            </div>
          ) : null}

          <div
            ref={messagesContainerRef}
            className="flex-1 space-y-5 overflow-y-auto bg-[#f5f7fb] px-6 py-6"
            role="list"
          >
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading ? (
              <div className="flex items-center gap-3 text-xs font-medium text-[#616E85]">
                <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-accent" />
                Assistente a escrever…
              </div>
            ) : null}
          </div>

          <div className="border-t border-[#e0e8f5] bg-[#f8fafd] px-6 py-4">
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSendMessage}
              placeholder={placeholder}
              isLoading={isLoading}
            />
          </div>
        </section>
      )}
    </div>
  );
}
