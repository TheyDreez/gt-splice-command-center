import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GT_Splice Facens: Workspace',
  description:
    'Repositório de estudo, metas oficiais e plano de trabalho do grupo GT_Splice Facens (Residência TIC 51).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased selection:bg-neutral-800 selection:text-neutral-100">
        {children}
      </body>
    </html>
  );
}
