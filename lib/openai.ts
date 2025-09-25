import OpenAI from 'openai';

let client: OpenAI | null = null;

export function getOpenAIClient() {
  if (client) return client;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não está definida. Configure a variável de ambiente.');
  }

  client = new OpenAI({ apiKey });
  return client;
}
