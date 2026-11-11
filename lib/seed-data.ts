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
      id: 'goal-fase-0',
      title: 'Fase 0: Organização, Acessos e Inventário (Imediato)',
      items: [
        'Centralizar a comunicação da equipe no grupo de WhatsApp e no Microsoft Teams',
        'Regularizar acessos institucionais da Facens junto à coordenação e TI',
        'Consolidar ata formal de reunião e descritivo etapa a etapa com o Prof. Fred',
        'Realizar inventário do projeto SIGABEM / Malha Viva e acervo do laboratório LIGA',
        'Validar compatibilidade técnica do inventário legado com a engine Unity antes de codificar'
      ]
    },
    {
      id: 'goal-fase-1',
      title: 'Fase 1: Primeira Entrega: Janeiro/2027 (Prazo Final Inegociável)',
      items: [
        'Nivelamento inicial na engine Unity e exploração da maquete 3D do campus',
        'Otimização de polígonos: recorte focado no sistema viário da Facens e poda de árvores',
        'Definir junto à Splice o posicionamento exato dos pontos clicáveis (postes e câmeras) no viário',
        'Implementar UI/UX e interatividade dos spots 3D no ambiente de Realidade Mista (MR)',
        'Configurar exportação e execução do artefato de Realidade Mista rodando direto no Browser (WebGL/WebXR)',
        'Melhoria desejável (Stretch Goal): iluminação e sombras balanceadas testadas na Sala D29',
        'Melhoria desejável (Stretch Goal): animações de contexto no viário (veículos e pedestres simulados)'
      ]
    },
    {
      id: 'goal-fase-2',
      title: 'Fase 2: Segunda Etapa: Pós-Janeiro (Conexão Real-Time, 5G e IA)',
      items: [
        'Conectar feed de câmeras da Splice em tempo real via rede 5G para baixa latência',
        'Integrar camada de Inteligência Artificial para extração de atributos: vestimenta, faixa etária e gênero estimado',
        'Integrar dados de telemetria do sistema SIIS/SIS da Splice (LPR, radar e acústica) em arquitetura Digital Shadow'
      ]
    }
  ],
  materials: [
    {
      id: 'mat-1',
      title: 'SIGABEM: Central de Controle de Mobilidade (App)',
      type: 'Apresentação e Documento (PPTX / PDF)',
      sharedBy: 'Equipe GT_Splice',
      referenceOrUrl: 'SIGABEM_MalhaViva_VR.pptx e PDF',
      notes: 'Referência de regras de negócio, interface de mobilidade e alertas para as câmeras.'
    },
    {
      id: 'mat-2',
      title: 'Módulo Malha Viva VR + Sensores 5G Real-Time',
      type: 'Repositório GitHub',
      sharedBy: 'Equipe GT_Splice',
      referenceOrUrl: 'GitHub Tomita & Gabriel',
      notes: 'Scripts de telemetria e visualização VR para validação de compatibilidade com Unity.'
    },
    {
      id: 'mat-3',
      title: 'Maquete 3D do Campus Facens (Base LIGA)',
      type: 'Modelo 3D (FBX / Unity Scene)',
      sharedBy: 'Equipe GT_Splice',
      referenceOrUrl: 'Laboratório LIGA / Facens',
      notes: 'Cena base para recorte viário, poda de árvores periféricas e inserção dos spots.'
    },
    {
      id: 'mat-4',
      title: 'Geo Capital Engine v3 (Omni-EcoRescue)',
      type: 'Repositório GitHub',
      sharedBy: 'Equipe GT_Splice',
      referenceOrUrl: 'https://github.com/LeonardoGMendoza/aplicativo-geo-capital-engine-v3',
      notes: 'Estruturação de camadas geoespaciais e apresentação técnica.'
    },
    {
      id: 'mat-5',
      title: 'Hardware Óptico / Câmera Referência (Comlaser TPCAM-H20S)',
      type: 'Especificação Técnica',
      sharedBy: 'Equipe GT_Splice',
      referenceOrUrl: 'https://comlaser.net',
      notes: 'Benchmark de especificações ópticas, PTZ e telemetria para os postes 3D.'
    },
    {
      id: 'mat-6',
      title: 'Dossiê Consolidado TIC 51 (Digital Shadow e 5G)',
      type: 'Documento Técnico',
      sharedBy: 'Equipe GT_Splice',
      referenceOrUrl: 'Dossiê Fase 1 TIC 51',
      notes: 'Fundamentação ISO 23247, fluxo unidirecional físico para digital e conformidade LGPD.'
    }
  ],
  tasks: [
    // FASE 0
    {
      id: 't-01',
      title: 'Criar grupo GT_Splice Facens (WhatsApp) e canal GT_Splice no Teams',
      stage: 'Fase 0: Setup & Inventário',
      assignee: 'A definir pelo grupo',
      status: 'CONCLUIDO',
      notes: 'Centralizar a comunicação da equipe e professores em canais oficiais.'
    },
    {
      id: 't-02',
      title: 'Regularizar acessos pendentes ao Microsoft Teams junto à Laura e TI',
      stage: 'Fase 0: Setup & Inventário',
      assignee: 'A definir pelo grupo',
      status: 'EM_ANDAMENTO',
      notes: 'Garantir login institucional de todos no Teams da Facens.'
    },
    {
      id: 't-03',
      title: 'Consolidar ata oficial da Laura e descritivo etapa a etapa do Prof. Fred',
      stage: 'Fase 0: Setup & Inventário',
      assignee: 'A definir pelo grupo',
      status: 'CONCLUIDO',
      notes: 'Anexar alinhamento formal para guiar o Plano de Trabalho.'
    },
    {
      id: 't-04',
      title: 'Inventário técnico do acervo SIGABEM / Malha Viva VR e LIGA',
      stage: 'Fase 0: Setup & Inventário',
      assignee: 'A definir pelo grupo',
      status: 'EM_ANDAMENTO',
      notes: 'Catalogar PPTX/PDF do SIGABEM e modelo 3D atual do LIGA.'
    },
    {
      id: 't-05',
      title: 'Cruzar inventário anterior com a Unity e validar compatibilidade com Prof. Fred',
      stage: 'Fase 0: Setup & Inventário',
      assignee: 'A definir pelo grupo',
      status: 'EM_ANDAMENTO',
      notes: 'Verificar conversão de scripts e modelos com a arquitetura Unity do professor.'
    },
    {
      id: 't-06',
      title: 'Apresentar e aprovar o Plano de Trabalho Vivo em reunião de validação',
      stage: 'Fase 0: Setup & Inventário',
      assignee: 'A definir pelo grupo',
      status: 'PENDENTE',
      notes: 'Aprovar o escopo integrado antes de iniciar a codificação.'
    },

    // FASE 1 (JANEIRO/2027)
    {
      id: 't-07',
      title: 'Nivelamento na engine Unity com o Prof. Fred e importação da maquete base',
      stage: 'Fase 1: Entrega MR Janeiro/27',
      assignee: 'A definir pelo grupo',
      status: 'EM_ANDAMENTO',
      notes: 'Alinhar o fluxo de trabalho na Unity com toda a equipe.'
    },
    {
      id: 't-08',
      title: 'Otimização 3D: Podar árvores do entorno e recortar malha focando no viário',
      stage: 'Fase 1: Entrega MR Janeiro/27',
      assignee: 'A definir pelo grupo',
      status: 'PENDENTE',
      notes: 'Reduzir polígonos e draw calls para manter taxa de quadros alta no browser.'
    },
    {
      id: 't-09',
      title: 'Definir junto à Splice os pontos exatos de postes e câmeras no viário',
      stage: 'Fase 1: Entrega MR Janeiro/27',
      assignee: 'A definir pelo grupo',
      status: 'PENDENTE',
      notes: 'Mapear coordenadas reais dos spots na maquete 3D da Facens.'
    },
    {
      id: 't-10',
      title: 'Implementar UI/UX dos Spots clicáveis (Postes/Câmeras) no modelo 3D',
      stage: 'Fase 1: Entrega MR Janeiro/27',
      assignee: 'A definir pelo grupo',
      status: 'PENDENTE',
      notes: 'Exibir painel de visualização ao clicar no poste no ambiente MR.'
    },
    {
      id: 't-11',
      title: 'Build e Homologação do ambiente em Realidade Mista (MR) rodando em Browser',
      stage: 'Fase 1: Entrega MR Janeiro/27',
      assignee: 'A definir pelo grupo',
      status: 'PENDENTE',
      notes: 'Garantir execução via WebGL/WebXR fluida para a entrega de janeiro.'
    },
    {
      id: 't-12',
      title: '[Stretch Goal] Implementar iluminação e sombras balanceadas na Sala D29',
      stage: 'Fase 1: Entrega MR Janeiro/27',
      assignee: 'A definir pelo grupo',
      status: 'PENDENTE',
      notes: 'Testar baking de sombras na máquina de alta performance da Sala D29.'
    },
    {
      id: 't-13',
      title: '[Stretch Goal] Adicionar animações de veículos, pedestres e som ambiente',
      stage: 'Fase 1: Entrega MR Janeiro/27',
      assignee: 'A definir pelo grupo',
      status: 'PENDENTE',
      notes: 'Enriquecer o viário com simulação leve sem comprometer performance.'
    },

    // FASE 2 (PÓS-JANEIRO)
    {
      id: 't-14',
      title: 'Conectar stream real-time das câmeras Splice via rede 5G / roteadores',
      stage: 'Fase 2: 5G & IA',
      assignee: 'A definir pelo grupo',
      status: 'PENDENTE',
      notes: 'Testar transmissão de baixa latência na rede 5G do campus.'
    },
    {
      id: 't-15',
      title: 'Integrar IA para extração de atributos (vestimenta, idade e gênero estimado)',
      stage: 'Fase 2: 5G & IA',
      assignee: 'A definir pelo grupo',
      status: 'PENDENTE',
      notes: 'Enriquecer imagens com modelos de visão computacional apoiados pelo prof. de IA.'
    },
    {
      id: 't-16',
      title: 'Acoplar telemetria SIIS/SIS (LPR, radar e classificação acústica)',
      stage: 'Fase 2: 5G & IA',
      assignee: 'A definir pelo grupo',
      status: 'PENDENTE',
      notes: 'Consolidar a camada de Digital Shadow com telemetria operacional.'
    }
  ]
};
