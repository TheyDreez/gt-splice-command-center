import { ProjectState } from '@/types/project';

export const INITIAL_PROJECT_STATE: ProjectState = {
  lastUpdated: new Date().toISOString(),
  goals: [
    {
      id: 'g-jan',
      badge: 'ETAPA 1 • JANEIRO',
      title: 'Escopo da Primeira Entrega (Janeiro)',
      subtitle: 'Meta principal inegociável alinhada no kickoff de 09/11',
      items: [
        {
          id: 'gi-1',
          text: 'Ambiente do campus da Facens em Realidade Mista (MR), rodando direto em browser.',
          completed: false
        },
        {
          id: 'gi-2',
          text: 'Explorar o FRED / Unity para construir o artefato (Realidade Mista preferida por ser mais visual e impactante).',
          completed: false
        },
        {
          id: 'gi-3',
          text: 'Inserção dos pontos clicáveis (postes e câmeras) com destaque visual no modelo 3D.',
          completed: false
        },
        {
          id: 'gi-4',
          text: 'Definir em conjunto com a Splice os pontos de instalação das câmeras fornecidas.',
          completed: false
        },
        {
          id: 'gi-5',
          text: 'Estruturar o Plano de Trabalho do grupo como primeira entrega (datas intermediárias flexíveis; data final fixa).',
          completed: false
        }
      ]
    },
    {
      id: 'g-inv',
      badge: 'INVENTÁRIO & UNITY',
      title: 'Aproveitamento do Trabalho Anterior',
      subtitle: 'Cruzamento técnico antes de iniciar a codificação',
      items: [
        {
          id: 'gi-6',
          text: 'Fazer inventário do material da 1ª capacitação Splice (sensores, VR, acesso em tempo real) e do acervo do LIGA.',
          completed: false
        },
        {
          id: 'gi-7',
          text: 'Cruzar o que foi desenvolvido anteriormente com o que será utilizado na engine Unity.',
          completed: false
        },
        {
          id: 'gi-8',
          text: 'Validar compatibilidade técnica com a Unity junto ao Prof. Fred.',
          completed: false
        },
        {
          id: 'gi-9',
          text: 'Realizar reunião de validação e aprovação do plano antes de avançar no desenvolvimento.',
          completed: false
        }
      ]
    },
    {
      id: 'g-opt',
      badge: 'PERFORMANCE 3D & INFRA',
      title: 'Otimização do Modelo 3D & Organização',
      subtitle: 'Balanceamento entre qualidade gráfica e fluidez nos óculos/browser',
      items: [
        {
          id: 'gi-10',
          text: 'Mitigar risco de polígonos: reduzir árvores do entorno se pesar nos óculos e recortar a maquete mantendo foco no viário.',
          completed: false
        },
        {
          id: 'gi-11',
          text: 'Melhorias desejáveis (não obrigatórias): adicionar sombras (avaliando custo de processamento), animações de carros/pedestres e som ambiente.',
          completed: false
        },
        {
          id: 'gi-12',
          text: 'Utilizar espaços disponíveis: Sala D29 (máquina mais potente), Sala 13 e bancada com monitores extras.',
          completed: false
        },
        {
          id: 'gi-13',
          text: 'Centralizar comunicação no canal GT_Splice no Microsoft Teams e manter rotina colaborativa remota.',
          completed: true
        }
      ]
    },
    {
      id: 'g-etapa2',
      badge: 'ETAPA 2 • PÓS-JANEIRO',
      title: 'Conexão Real-Time, 5G e Inteligência Artificial',
      subtitle: 'Evolução posterior à entrega do ambiente MR de janeiro',
      items: [
        {
          id: 'gi-14',
          text: 'Conectar feed das câmeras da Splice em tempo real no clique do spot (avaliando roteadores 5G na mesma rede para baixa latência).',
          completed: false
        },
        {
          id: 'gi-15',
          text: 'Extrair dados enriquecidos além da imagem: vestimenta, faixa etária e gênero estimado.',
          completed: false
        },
        {
          id: 'gi-16',
          text: 'Integrar estatísticas e modelos de IA na etapa 2 com apoio do professor de IA.',
          completed: false
        }
      ]
    }
  ],
  materials: [
    {
      id: 'mat-1',
      title: 'Resumo e Transcrição Completa do Kickoff (09/11)',
      category: 'ATA',
      type: 'Ata & Transcrição',
      sharedBy: 'Ana Paula Batista',
      referenceOrUrl: 'Grupo WhatsApp GT_Splice Facens / Canal Teams GT_Splice',
      notes: 'Contém todas as diretrizes de escopo de janeiro, uso da Unity com o Fred, salas D29/13 e divisão em 2 etapas.'
    },
    {
      id: 'mat-2',
      title: 'SIGABEM: Central de Controle de Mobilidade & Malha Viva VR',
      category: 'APRESENTACAO',
      type: 'PPTX & PDF (1ª Capacitação)',
      sharedBy: 'Vânia',
      referenceOrUrl: 'SIGABEM_MalhaViva_VR.pptx / SIGABEM: Central de Controle de Mobilidade.pdf',
      notes: 'Projeto de Sorocaba proposto para a Splice no 1º semestre. Inclui a parte de app e referência ao GitHub (Tomita e Gabriel) com VR e 5G.'
    },
    {
      id: 'mat-3',
      title: 'Dossiê Consolidado de Fontes, Referências e Imagens (TIC 51)',
      category: 'DOSSIE',
      type: 'Caderno Técnico (PDF)',
      sharedBy: 'André / Ana Paula / Helton',
      referenceOrUrl: 'Dossie_Consolidado_Referencias_Imagens_TIC51.pdf',
      notes: '45 URLs auditadas: arquitetura Digital Shadow vs. Digital Twin, SIIS/SIS Splice, WebXR, Three.js, NIST e LGPD.'
    },
    {
      id: 'mat-4',
      title: 'Geo Capital Engine v3 & Pitch Omni-EcoRescue',
      category: 'REPOSITORIO',
      type: 'GitHub & PDF',
      sharedBy: 'Helton Rosa da Silva Abadia',
      referenceOrUrl: 'https://github.com/LeonardoGMendoza/aplicativo-geo-capital-engine-v3',
      notes: 'Repositório de engenharia geoespacial e arquivo Omni-EcoRescue-Pitch.pdf compartilhados para referência da equipe.'
    },
    {
      id: 'mat-5',
      title: 'Câmera Óptica/PTZ TPCAM-H20S (Gavião MPO3)',
      category: 'HARDWARE',
      type: 'Especificação de Equipamento',
      sharedBy: 'André Rogério da Silva Filho',
      referenceOrUrl: 'https://comlaser.net/tpcam-h20s-gavio-mpo3/',
      notes: 'Referência real de projeto óptico importado e adaptado internamente para atender requisitos de licitações.'
    }
  ],
  // Inicia vazio para o próprio grupo criar ou puxar das metas oficiais com 1 clique
  tasks: [],
  // Ordem estritamente alfabética, sem cargos pré-impostos
  team: [
    {
      id: 'ana',
      name: 'Ana Paula Batista',
      initials: 'AP',
      github: 'https://github.com/abatistaa',
      email: 'anapcb1308@gmail.com',
      focusArea: 'A definir em grupo',
      notes: ''
    },
    {
      id: 'andre',
      name: 'André Rogério da Silva Filho',
      initials: 'AF',
      github: 'https://github.com/TheyDreez',
      focusArea: 'A definir em grupo',
      notes: ''
    },
    {
      id: 'cosmo',
      name: 'Cosmo',
      initials: 'CO',
      focusArea: 'A definir em grupo',
      notes: ''
    },
    {
      id: 'helton',
      name: 'Helton Rosa da Silva Abadia',
      initials: 'HA',
      github: 'https://github.com/heltonrsnet-cpu',
      focusArea: 'A definir em grupo',
      notes: ''
    },
    {
      id: 'vania',
      name: 'Vânia',
      initials: 'VA',
      focusArea: 'A definir em grupo',
      notes: ''
    }
  ]
};
