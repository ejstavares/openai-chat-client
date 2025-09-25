import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import type OpenAI from 'openai';
import { getOpenAIClient } from '@/lib/openai';
import { checkRateLimit } from '@/lib/rateLimiter';

const requestSchema = z.object({
  message: z.string().trim().min(1, 'Mensagem obrigatória').max(2000, 'Mensagem muito longa'),
  threadId: z.string().optional().nullable(),
  assistantId: z.string().optional().nullable(),
});

async function waitForRunCompletion(openai: OpenAI, threadId: string, runId: string) {
  const MAX_WAIT_MS = 120_000;
  const POLL_INTERVAL_MS = 1_000;
  const start = Date.now();

  let run = await openai.beta.threads.runs.retrieve(threadId, runId);

  while (run.status === 'queued' || run.status === 'in_progress') {
    if (Date.now() - start > MAX_WAIT_MS) {
      throw new Error('Tempo de espera excedido ao aguardar a resposta do assistente.');
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    run = await openai.beta.threads.runs.retrieve(threadId, runId);
  }

  if (run.status !== 'completed') {
    throw new Error(`Execução do assistente finalizada com status: ${run.status}`);
  }
}

const extractTextFromMessage = (message: any) => {
  if (!message || !Array.isArray(message.content)) return '';
  return message.content
    .filter((item: any) => item.type === 'text' && item.text?.value)
    .map((item: any) => item.text.value as string)
    .join('\n')
    .trim();
};

const getClientIdentifier = (request: NextRequest) => {
  const headerNamePreference = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'true-client-ip',
    'x-vercel-forwarded-for',
  ] as const;

  for (const headerName of headerNamePreference) {
    const value = request.headers.get(headerName);
    if (value) {
      return value.split(',')[0]!.trim();
    }
  }

  const forwarded = request.headers.get('forwarded');
  if (forwarded) {
    const match = forwarded.split(';').find((part) => part.trim().toLowerCase().startsWith('for='));
    if (match) {
      return match.split('=')[1]!.replace(/"/g, '').split(',')[0]!.trim();
    }
  }

  return 'anonymous';
};

export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const rate = checkRateLimit(identifier);

  if (!rate.success) {
    const retryAfter = Math.max(0, Math.ceil((rate.reset - Date.now()) / 1000));
    return NextResponse.json(
      { error: 'Limite de requisições atingido. Tente novamente em instantes.' },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Remaining': rate.remaining.toString(),
          'X-RateLimit-Reset': rate.reset.toString(),
        },
      }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'JSON inválido na requisição.' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? 'Requisição inválida.';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const body = parsed.data;
  const apiAssistantId = body.assistantId ?? process.env.OPENAI_ASSISTANT_ID;

  if (!apiAssistantId) {
    return NextResponse.json(
      { error: 'Assistant ID não configurado. Ajuste a variável OPENAI_ASSISTANT_ID.' },
      { status: 500 }
    );
  }

  try {
    const openai = getOpenAIClient();

    const activeThreadId = body.threadId
      ? body.threadId
      : (await openai.beta.threads.create()).id;

    await openai.beta.threads.messages.create(activeThreadId, {
      role: 'user',
      content: body.message,
    });

    const run = await openai.beta.threads.runs.create(activeThreadId, {
      assistant_id: apiAssistantId,
    });

    await waitForRunCompletion(openai, activeThreadId, run.id);

    const messages = await openai.beta.threads.messages.list(activeThreadId, {
      order: 'asc',
    });

    const assistantMessages = messages.data
      .filter((message) => message.role === 'assistant' && message.run_id === run.id)
      .map((message) => ({
        id: message.id,
        role: 'assistant' as const,
        content: extractTextFromMessage(message),
        created_at: message.created_at ? new Date(message.created_at * 1000).toISOString() : new Date().toISOString(),
      }))
      .filter((message) => message.content.length > 0);

    return NextResponse.json(
      {
        threadId: activeThreadId,
        messages: assistantMessages,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': rate.remaining.toString(),
          'X-RateLimit-Reset': rate.reset.toString(),
        },
      }
    );
  } catch (error) {
    console.error('Erro na rota /api/chat', error);
    const message =
      error instanceof Error ? error.message : 'Ocorreu um erro inesperado ao obter a resposta do assistente.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
