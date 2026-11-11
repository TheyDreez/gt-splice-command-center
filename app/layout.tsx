import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GT_Splice Facens | Workspace & Plano de Trabalho (TIC 51)',
  description:
    'Plataforma de gestão de entregas, metas oficiais e acervo técnico do grupo GT_Splice Facens na Residência TIC 51.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
