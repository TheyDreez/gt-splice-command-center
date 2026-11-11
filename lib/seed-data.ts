import { ProjectState } from '@/types/project';

export const INITIAL_PROJECT_STATE: ProjectState = {
  lastUpdated: new Date().toISOString(),
  team: [
    {
      id: 'ana',
      name: 'Ana Paula Batista',
      github: 'https://github.com/abatistaa',
      email: 'anapcb1308@gmail.com',
      notes: 'Atuação e foco a definir pelo grupo'
    },
    {
      id: 'andre',
      name: 'André Rogério da Silva Filho',
      github: 'https://github.com/TheyDreez',
      notes: 'Atuação e foco a definir pelo grupo'
    },
    {
      id: 'cosmo',
      name: 'Cosmo',
      notes: 'Atuação e foco a definir pelo grupo'
    },
    {
      id: 'helton',
      name: 'Helton Rosa da Silva Abadia',
      github: 'https://github.com/heltonrsnet-cpu',
      notes: 'Atuação e foco a definir pelo grupo'
    },
    {
      id: 'vania',
      name: 'Vânia',
      notes: 'Atuação e foco a definir pelo grupo'
    }
  ],
  goals: [
    {
      id: 'goal-1',
      code: 'ESCOPO JANEIRO • MR BROWSER',
      title: 'Escopo da Primeira Entrega (Janeiro)',
      items: [
        'Ambiente do campus em Realidade Mista (MR), rodando em browser.',
        'Foco inicial: explorar o FRED e construir o artefato de realidade mista ou virtual (MR preferida por ser mais visual e impactante).',
        'Inserção dos pontos (postes e câmeras) clicáveis com destaque no modelo 3D.',
        'Câmeras fornecidas pela Splice, definição conjunta dos pontos de instalação.',
        'Montar plano de trabalho como primeira entrega (datas intermediárias flexíveis; data final não pode ser estourada).'
      ]
    },
    {
      id: 'goal-2',
      code: 'CAPACITAÇÃO & UNITY',
      title: 'Aproveitamento do Trabalho Anterior',
      items: [
        'Material da capacitação Splice (sensores, realidade virtual, acesso em tempo real) e acervo do LIGA podem ser reaproveitados.',
        'Próximo passo: fazer inventário do que foi desenvolvido e cruzar com o que será usado na Unity.',
        'Validar compatibilidade com a Unity (engine de games) junto ao Prof. Fred.',
        'Agendar reunião de validação antes de seguir o desenvolvimento.'
      ]
    },
    {
      id: 'goal-3',
      code: 'PERFORMANCE 3D & INFRA',
      title: 'Otimização do Modelo 3D e Organização',
      items: [
        'Principal risco de performance: quantidade de polígonos (reduzir árvores do entorno se ficar pesado nos óculos e recortar área mantendo foco no viário).',
        'Melhorias desejadas (não obrigatórias): sombras (balanceando processamento), animações de carros e pedestres em movimento, sons ambiente.',
        'Espaços disponíveis: Sala D29 (máquina mais potente), Sala 13 e bancada com monitores.',
        'Canal GT_Splice no Teams como ponto central de comunicação e trabalho remoto incentivado.'
      ]
    },
    {
      id: 'goal-4',
      code: 'ETAPA 2 • 5G & IA',
      title: 'Segunda Etapa (Posterior a Janeiro)',
      items: [
        'Conexão real-time com câmeras da Splice vem na etapa 2 (avaliando roteadores 5G na mesma rede para menor latência).',
        'Dados enriquecidos além da imagem: vestimenta, faixa etária e gênero estimado.',
        'Estatísticas e IA integradas numa etapa posterior, com apoio do professor de IA.'
      ]
    }
  ],
  materials: [
    {
      id: 'mat-1',
      title: 'Resumo e Transcrição da Reunião de Kickoff (09/11)',
      type: 'Ata / Transcrição Oficial',
      sharedBy: 'Ana Paula Batista',
      referenceOrUrl: 'Grupo WhatsApp GT_Splice Facens / Canal Teams GT_Splice',
      notes: 'Definições do desafio Splice, escopo da entrega de janeiro em MR no browser e validação com o Prof. Fred.'
    },
    {
      id: 'mat-2',
      title: 'SIGABEM_MalhaViva_VR.pptx & SIGABEM : Central de Controle de Mobilidade.pdf',
      type: 'Apresentação e PDF (1ª Capacitação)',
      sharedBy: 'Vânia',
      referenceOrUrl: 'Arquivos enviados em 10/11 (inclui referência ao GitHub do Tomita e Gabriel)',
      notes: 'Projeto da Malha Viva de Sorocaba montado para a Splice na primeira capacitação (app + VR e menção ao 5G).'
    },
    {
      id: 'mat-3',
      title: 'Dossiê Consolidado de Fontes, Referências e Imagens (TIC 51)',
      type: 'Caderno Técnico (PDF)',
      sharedBy: 'André / Ana Paula / Helton',
      referenceOrUrl: 'Dossie_Consolidado_Referencias_Imagens_TIC51.pdf',
      notes: '45 URLs verificadas: arquitetura Digital Shadow vs. Digital Twin, SIIS/SIS Splice, WebXR, Three.js e LGPD.'
    },
    {
      id: 'mat-4',
      title: 'Aplicativo Geo Capital Engine v3 & Omni-EcoRescue-Pitch.pdf',
      type: 'Repositório GitHub & PDF',
      sharedBy: 'Helton Rosa da Silva Abadia',
      referenceOrUrl: 'https://github.com/LeonardoGMendoza/aplicativo-geo-capital-engine-v3',
      notes: 'Projeto anterior compartilhado no grupo para referência técnica e visual.'
    },
    {
      id: 'mat-5',
      title: 'Referência de Equipamento Óptico / Câmera (TPCAM-H20S Gavião MPO3)',
      type: 'Especificação de Hardware',
      sharedBy: 'André Rogério da Silva Filho',
      referenceOrUrl: 'https://comlaser.net/tpcam-h20s-gavio-mpo3/',
      notes: 'Exemplo prático de equipamento óptico importado e ajustado internamente para atender licitações.'
    }
  ],
  tasks: []
};