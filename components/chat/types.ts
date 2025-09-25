export type ChatRole = 'user' | 'assistant';

export interface ChatMessageShape {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatWidgetProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  position?: 'embedded' | 'bottom-right' | 'bottom-left';
  storageKey?: string;
  assistantId?: string;
  className?: string;
  welcomeMessage?: string;
  showWelcomePopup?: boolean;
  popupMessage?: string;
  popupDelay?: number;
  widgetTitle?: string;
  widgetSubtitle?: string;
  floatingButtonLabel?: string;
  userBubbleColor?: string;
}

export interface ChatResponsePayload {
  threadId: string;
  messages: Array<{
    id: string;
    role: ChatRole;
    content: string;
    created_at: string;
  }>;
}
