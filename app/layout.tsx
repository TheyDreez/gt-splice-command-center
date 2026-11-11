import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GT_Splice Command Center | Residência TIC 51 (Facens & Splice)',
  description:
    'Plano de Trabalho Vivo, Gestão Kanban, Inventário SIGABEM/Unity e Otimização 3D em Realidade Mista do grupo GT_Splice Facens.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
