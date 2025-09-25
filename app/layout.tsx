import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Chat IA GPT Demo',
  description: 'Widget de chat integrado com OpenAI Assistants.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="bg-chat-background">
      <body className={`${poppins.variable} min-h-screen bg-transparent font-sans antialiased`}>{children}</body>
    </html>
  );
}
