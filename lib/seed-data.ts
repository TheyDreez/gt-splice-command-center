import { ProjectState } from '@/types/project';

export const INITIAL_PROJECT_STATE: ProjectState = {
  lastUpdated: new Date().toISOString(),
  goals: [
    {
      id: 'g-1',
      title: 'Escopo da Primeira Entrega (Janeiro)',
      items: [
        'Ambiente do campus em Realidade Mista (MR), rodando em browser.',
        'Foco inicial: explorar o FRED (Unity) e construir o artefato de realidade mista ou virtual (MR preferida por ser mais visual e impactante).',
        'Inserção dos pontos clicáveis (postes e câmeras) com destaque no modelo 3D.',
        'Câmeras fornecidas pela Splice, com definição conjunta dos pontos de instalação.',
        'Montar o Plano de Trabalho como primeira entrega (datas intermediárias flexíveis; data final inegociável).'
      ]
    },
    {
      id: 'g-2',
      title: 'Aproveitamento do Trabalho Anterior e Validação',
      items: [
        'Material da capacitação Splice (sensores, realidade virtual, acesso em tempo real) e acervo do LIGA podem ser reaproveitados.',
        'Fazer inventário do que foi desenvolvido e cruzar com o que será usado na Unity.',
        'Validar compatibilidade técnica com a Unity junto ao Prof. Fred.',
        'Agendar reunião de validação e aprovação antes de avançar no desenvolvimento.'
      ]
    },
    {
      id: 'g-3',
      title: 'Otimização 3D e Organização',
      items: [
        'Principal risco de performance: quantidade de polígonos (reduzir árvores do entorno se pesar nos óculos e recortar área mantendo foco no viário).',
        'Melhorias desejadas (não obrigatórias): sombras (balanceando processamento), animações de carros/pedestres em movimento e sons ambiente.',
        'Espaços disponíveis na Facens: Sala D29 (máquina mais potente), Sala 13 e bancada com monitores.',
        'Canal GT_Splice no Microsoft Teams como ponto central de comunicação e incentivo ao trabalho remoto.'
      ]
    },
    {
      id: 'g-4',
      title: 'Etapa 2 (Posterior a Janeiro)',
      items: [
        'Conexão real-time com as câmeras da Splice (avaliando uso de roteadores 5G na mesma rede para baixa latência).',
        'Dados enriquecidos além da imagem: vestimenta, faixa etária e gênero estimado.',
        'Estatísticas e IA integradas com apoio do professor de IA.'
      ]
    }
  ],
  materials: [
    {
      id: 'm-1',
      title: 'Resumo e Transcrição da Reunião de Kickoff (09/11)',
      type: 'Ata / Transcrição',
      sharedBy: 'Ana Paula',
      referenceOrUrl: 'Grupo WhatsApp / Canal GT_Splice no Teams',
      notes: 'Diretrizes iniciais do desafio Splice, escopo de janeiro e orientações de uso da Unity.'
    },
    {
      id: 'm-2',
      title: 'SIGABEM_MalhaViva_VR.pptx e SIGABEM: Central de Controle de Mobilidade.pdf',
      type: 'Apresentação / PDF',
      sharedBy: 'Vânia',
      referenceOrUrl: 'Arquivos compartilhados em 10/11 (inclui referência ao GitHub do Tomita e Gabriel)',
      notes: 'Projeto da Malha Viva de Sorocaba desenvolvido na primeira capacitação da Splice.'
    },
    {
      id: 'm-3',
      title: 'Dossiê Consolidado de Fontes, Referências e Imagens (TIC 51)',
      type: 'Documento Técnico (PDF)',
      sharedBy: 'André / Ana Paula / Helton',
      referenceOrUrl: 'Dossie_Consolidado_Referencias_Imagens_TIC51.pdf',
      notes: 'Referências verificadas sobre Digital Shadow vs. Digital Twin, SIIS/SIS, WebXR, Three.js e LGPD.'
    },
    {
      id: 'm-4',
      title: 'Aplicativo Geo Capital Engine v3 e Omni-EcoRescue-Pitch.pdf',
      type: 'Repositório GitHub / PDF',
      sharedBy: 'Helton',
      referenceOrUrl: 'https://github.com/LeonardoGMendoza/aplicativo-geo-capital-engine-v3',
      notes: 'Projeto compartilhado para referência técnica da equipe.'
    },
    {
      id: 'm-5',
      title: 'Referência de Equipamento Óptico / Câmera (TPCAM-H20S)',
      type: 'Especificação Técnica',
      sharedBy: 'André',
      referenceOrUrl: 'https://comlaser.net/tpcam-h20s-gavio-mpo3/',
      notes: 'Exemplo prático de equipamento óptico ajustado para operação e licitações.'
    }
  ],
  tasks: [],
  team: [
    {
      id: 'ana',
      name: 'Ana Paula Batista',
      github: 'https://github.com/abatistaa',
      email: 'anapcb1308@gmail.com',
      notes: ''
    },
    {
      id: 'andre',
      name: 'André Rogério da Silva Filho',
      github: 'https://github.com/TheyDreez',
      notes: ''
    },
    {
      id: 'cosmo',
      name: 'Cosmo',
      notes: ''
    },
    {
      id: 'helton',
      name: 'Helton Rosa da Silva Abadia',
      github: 'https://github.com/heltonrsnet-cpu',
      notes: ''
    },
    {
      id: 'vania',
      name: 'Vânia',
      notes: ''
    }
  ]
};
