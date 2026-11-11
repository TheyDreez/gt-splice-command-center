import { ProjectState } from '@/types/project';

export const INITIAL_PROJECT_STATE: ProjectState = {
  lastUpdated: new Date().toISOString(),
  team: [
    {
      id: 'andre',
      name: 'André Rogério da Silva Filho',
      role: 'Arquitetura, Integração Web/3D & Repositórios (Admin)',
      github: 'https://github.com/TheyDreez',
      background: 'Pesquisador LIGA/Facens, Arquitetura Digital Shadow 3D, Full-Stack & Hardware/Câmeras (ref. Comlaser TPCAM-H20S).'
    },
    {
      id: 'ana',
      name: 'Ana Paula Batista',
      role: 'Gestão, Documentação, Alinhamento Teams & Pesquisa',
      github: 'https://github.com/abatistaa',
      email: 'anapcb1308@gmail.com',
      background: 'Criadora do GT_Splice no Teams e WhatsApp; participou da 1ª capacitação Splice no 1º semestre.'
    },
    {
      id: 'helton',
      name: 'Helton Rosa da Silva Abadia',
      role: 'Desenvolvimento, Integração & Apoio Técnico',
      github: 'https://github.com/heltonrsnet-cpu',
      background: 'Apresentação dos 4 desafios TIC 51; colaborador no projeto Geo Capital Engine v3 (Omni-EcoRescue).'
    },
    {
      id: 'vania',
      name: 'Vânia',
      role: 'Especialista Capacitação Splice & App Mobilidade',
      background: 'Autora do módulo de aplicativo no projeto SIGABEM (Central de Controle de Mobilidade / Malha Viva VR no 1º semestre).'
    },
    {
      id: 'cosmo',
      name: 'Cosmo',
      role: 'Especialista em Game Dev, Unity & Otimização 3D',
      background: '25+ anos de experiência em jogos e otimização de polígonos/sombras; empresa própria na área de reconhecimento e detecção.'
    }
  ],
  tasks: [
    // FASE 0
    {
      id: 't-01',
      title: 'Criar grupo GT_Splice Facens (WhatsApp) e canal GT_Splice no Microsoft Teams',
      description: 'Centralizar a comunicação da equipe e dos professores para evitar informações dispersas.',
      phase: 'FASE_0',
      status: 'CONCLUIDO',
      priority: 'CRITICA',
      assignees: ['Ana Paula Batista'],
      updatedAt: '2026-11-09T11:16:00Z'
    },
    {
      id: 't-02',
      title: 'Regularizar acessos pendentes ao Microsoft Teams junto à Laura e TI',
      description: 'Validar login institucional da Facens para todos os integrantes acessarem o canal GT_Splice.',
      phase: 'FASE_0',
      status: 'EM_ANDAMENTO',
      priority: 'CRITICA',
      assignees: ['Ana Paula Batista'],
      updatedAt: '2026-11-10T18:00:00Z'
    },
    {
      id: 't-03',
      title: 'Consolidar ata oficial da Laura e descritivo etapa a etapa do Prof. Fred',
      description: 'Anexar a transcrição da reunião e o descritivo formal do desafio Splice para guiar o Plano de Trabalho.',
      phase: 'FASE_0',
      status: 'CONCLUIDO',
      priority: 'OBRIGATORIA_JAN',
      assignees: ['Ana Paula Batista', 'André Rogério da Silva Filho'],
      updatedAt: '2026-11-10T19:20:00Z'
    },
    {
      id: 't-04',
      title: 'Inventário técnico do acervo SIGABEM / Malha Viva VR e LIGA',
      description: 'Catalogar o PPTX/PDF do SIGABEM (App da Vânia + VR/5G do Tomita e Gabriel no GitHub) e o modelo 3D atual do LIGA.',
      phase: 'FASE_0',
      status: 'EM_ANDAMENTO',
      priority: 'CRITICA',
      assignees: ['André Rogério da Silva Filho', 'Vânia', 'Ana Paula Batista'],
      updatedAt: '2026-11-10T19:30:00Z'
    },
    {
      id: 't-05',
      title: 'Cruzar inventário anterior com a Unity e validar compatibilidade com Prof. Fred',
      description: 'Verificar se os scripts, modelos e integrações da 1ª capacitação conversam com a arquitetura Unity proposta pelo Fred.',
      phase: 'FASE_0',
      status: 'VALIDACAO_FRED',
      priority: 'CRITICA',
      assignees: ['André Rogério da Silva Filho', 'Cosmo', 'Vânia'],
      updatedAt: '2026-11-10T20:00:00Z'
    },
    {
      id: 't-06',
      title: 'Apresentar e aprovar o Plano de Trabalho Vivo em reunião de validação',
      description: 'Primeira entrega solicitada pela coordenação: validar a combinação do material anterior com o novo escopo antes de codificar.',
      phase: 'FASE_0',
      status: 'BACKLOG',
      priority: 'CRITICA',
      assignees: ['André Rogério da Silva Filho', 'Ana Paula Batista', 'Helton Rosa da Silva Abadia', 'Vânia', 'Cosmo'],
      updatedAt: '2026-11-10T20:00:00Z'
    },

    // FASE 1 (JANEIRO)
    {
      id: 't-07',
      title: 'Nivelamento na engine Unity com o Prof. Fred e importação da maquete base',
      description: 'Acompanhar o passo a passo inicial na Unity garantindo que todo o grupo domine o fluxo do projeto.',
      phase: 'FASE_1',
      status: 'EM_ANDAMENTO',
      priority: 'OBRIGATORIA_JAN',
      assignees: ['André Rogério da Silva Filho', 'Ana Paula Batista', 'Helton Rosa da Silva Abadia', 'Vânia', 'Cosmo'],
      updatedAt: '2026-11-10T21:00:00Z'
    },
    {
      id: 't-08',
      title: 'Otimização 3D: Podar árvores do entorno e recortar malha focando no viário',
      description: 'Reduzir contagem de polígonos para evitar travamentos nos óculos de Realidade Mista e no navegador.',
      phase: 'FASE_1',
      status: 'BACKLOG',
      priority: 'CRITICA',
      assignees: ['Cosmo', 'André Rogério da Silva Filho'],
      updatedAt: '2026-11-10T21:00:00Z'
    },
    {
      id: 't-09',
      title: 'Definir junto à Splice os pontos exatos de postes e câmeras no viário',
      description: 'Mapear onde ficarão os spots clicáveis no modelo 3D da Facens de acordo com a oferta de câmeras da Splice.',
      phase: 'FASE_1',
      status: 'BACKLOG',
      priority: 'OBRIGATORIA_JAN',
      assignees: ['André Rogério da Silva Filho', 'Ana Paula Batista', 'Vânia'],
      updatedAt: '2026-11-10T21:00:00Z'
    },
    {
      id: 't-10',
      title: 'Implementar UI/UX dos Spots clicáveis (Postes/Câmeras) no modelo 3D',
      description: 'Ao clicar no ponto em Realidade Mista, abrir o painel visualizador da câmera com destaque visual claro.',
      phase: 'FASE_1',
      status: 'BACKLOG',
      priority: 'OBRIGATORIA_JAN',
      assignees: ['André Rogério da Silva Filho', 'Cosmo', 'Helton Rosa da Silva Abadia'],
      updatedAt: '2026-11-10T21:00:00Z'
    },
    {
      id: 't-11',
      title: 'Build e Homologação do ambiente em Realidade Mista (MR) rodando em Browser',
      description: 'Garantir execução fluida via WebXR/WebGL no navegador para a entrega inegociável de janeiro.',
      phase: 'FASE_1',
      status: 'BACKLOG',
      priority: 'CRITICA',
      assignees: ['André Rogério da Silva Filho', 'Cosmo'],
      updatedAt: '2026-11-10T21:00:00Z'
    },
    {
      id: 't-12',
      title: '[Stretch Goal] Implementar iluminação e sombras balanceadas na Sala D29',
      description: 'O modelo atual não possui sombras. Testar sombras baked/mistas na máquina potente da Sala D29 sem derrubar o FPS.',
      phase: 'FASE_1',
      status: 'BACKLOG',
      priority: 'DESEJAVEL_STRETCH',
      assignees: ['Cosmo'],
      updatedAt: '2026-11-10T21:00:00Z'
    },
    {
      id: 't-13',
      title: '[Stretch Goal] Adicionar animações de veículos, pedestres e som ambiente',
      description: 'Enriquecer o viário do campus com tráfego simulado e áudio espacial leve.',
      phase: 'FASE_1',
      status: 'BACKLOG',
      priority: 'DESEJAVEL_STRETCH',
      assignees: ['Cosmo', 'Helton Rosa da Silva Abadia'],
      updatedAt: '2026-11-10T21:00:00Z'
    },

    // FASE 2 (PÓS-JANEIRO)
    {
      id: 't-14',
      title: 'Conectar stream real-time das câmeras Splice via rede 5G / roteadores',
      description: 'Colocar câmeras e aplicação na mesma rede 5G para baixa latência e exibir o vídeo real no instante do clique.',
      phase: 'FASE_2',
      status: 'BACKLOG',
      priority: 'ETAPA_2',
      assignees: ['André Rogério da Silva Filho', 'Helton Rosa da Silva Abadia'],
      updatedAt: '2026-11-10T21:00:00Z'
    },
    {
      id: 't-15',
      title: 'Integrar IA para extração de atributos (vestimenta, idade e gênero estimado)',
      description: 'Com apoio do professor de IA e expertise do Cosmo/André, enriquecer a imagem capturada com metadados analíticos.',
      phase: 'FASE_2',
      status: 'BACKLOG',
      priority: 'ETAPA_2',
      assignees: ['Cosmo', 'André Rogério da Silva Filho', 'Helton Rosa da Silva Abadia'],
      updatedAt: '2026-11-10T21:00:00Z'
    },
    {
      id: 't-16',
      title: 'Acoplar telemetria SIIS/SIS (LPR, radar e classificação acústica)',
      description: 'Consolidar a camada de Digital Shadow unidirecional exibindo séries históricas e eventos operacionais.',
      phase: 'FASE_2',
      status: 'BACKLOG',
      priority: 'ETAPA_2',
      assignees: ['André Rogério da Silva Filho', 'Ana Paula Batista', 'Helton Rosa da Silva Abadia'],
      updatedAt: '2026-11-10T21:00:00Z'
    }
  ],
  inventory: [
    {
      id: 'inv-1',
      name: 'SIGABEM: Central de Controle de Mobilidade (App)',
      origin: '1ª Capacitação Splice (1º Semestre) - PDF/PPTX',
      owner: 'Vânia / Ana Paula',
      intendedUnityUse: 'Referência de regras de negócio, UI de mobilidade e fluxos de alerta para o painel das câmeras.',
      validationStatus: 'EM_ANALISE',
      notes: 'Arquivos SIGABEM_MalhaViva_VR.pptx e PDF compartilhados no grupo em 10/11.'
    },
    {
      id: 'inv-2',
      name: 'Módulo Malha Viva VR + Sensores 5G Real-Time',
      origin: 'GitHub Tomita & Gabriel (1ª Capacitação Splice)',
      owner: 'Vânia (Ponte com repositório)',
      intendedUnityUse: 'Avaliar reaproveitamento dos scripts de conexão em tempo real e visualização VR na Unity.',
      validationStatus: 'PENDENTE',
      notes: 'Extrair link do GitHub nos PDFs enviados pela Vânia e validar com o Prof. Fred.'
    },
    {
      id: 'inv-3',
      name: 'Maquete 3D do Campus Facens (Base LIGA)',
      origin: 'Laboratório LIGA / Facens',
      owner: 'Prof. Fred / Equipe LIGA',
      intendedUnityUse: 'Cena base na Unity que será recortada (foco no viário) e otimizada (redução de árvores).',
      validationStatus: 'COMPATIVEL',
      notes: 'Atualmente focada nos prédios e sem sombras; mudaremos o destaque para postes e câmeras.'
    },
    {
      id: 'inv-4',
      name: 'Geo Capital Engine v3 (Omni-EcoRescue)',
      origin: 'GitHub LeonardoGMendoza/aplicativo-geo-capital-engine-v3',
      owner: 'Helton Abadia',
      intendedUnityUse: 'Referência de estruturação de camadas geoespaciais e apresentação executiva.',
      validationStatus: 'EM_ANALISE',
      notes: 'Compartilhado pelo Helton em 10/11.'
    },
    {
      id: 'inv-5',
      name: 'Referência de Hardware Óptico/PTZ (Comlaser TPCAM-H20S)',
      origin: 'Acervo Técnico André (Projeto Coreia / Licitações)',
      owner: 'André Filho',
      intendedUnityUse: 'Benchmark de especificações de câmera e telemetria óptica para modelagem dos pontos.',
      validationStatus: 'COMPATIVEL',
      notes: 'Link comlaser.net enviado em 09/11.'
    },
    {
      id: 'inv-6',
      name: 'Dossiê Consolidado TIC 51 (Arquitetura Digital Shadow)',
      origin: 'Fase 1 Residência TIC 51 (03/11/2026)',
      owner: 'André, Ana Paula e Helton',
      intendedUnityUse: 'Fundamentação teórica (NIST/ISO 23247), distinção Digital Shadow vs. Twin e requisitos LGPD.',
      validationStatus: 'COMPATIVEL',
      notes: '45 URLs auditadas e validadas.'
    }
  ],
  optimizations: [
    {
      id: 'opt-1',
      category: 'POLIGONOS',
      title: 'Poda de árvores do entorno do campus',
      targetMetric: 'Reduzir draw calls e manter 60+ FPS no Browser/Óculos MR',
      owner: 'Cosmo',
      status: 'PENDENTE',
      impactLevel: 'ALTO'
    },
    {
      id: 'opt-2',
      category: 'POLIGONOS',
      title: 'Recorte geométrico do terreno mantendo foco no sistema viário',
      targetMetric: 'Eliminar malhas periféricas fora do campo de visão das câmeras',
      owner: 'Cosmo / André',
      status: 'PENDENTE',
      impactLevel: 'ALTO'
    },
    {
      id: 'opt-3',
      category: 'SOMBRAS',
      title: 'Implementação de Lightmaps / Sombras otimizadas',
      targetMetric: 'Adicionar profundidade visual sem estourar orçamento de GPU no WebXR',
      owner: 'Cosmo',
      status: 'TESTANDO_D29',
      impactLevel: 'ALTO'
    },
    {
      id: 'opt-4',
      category: 'ANIMACAO_AUDIO',
      title: 'Waypoints de veículos, pedestres e som ambiente no viário',
      targetMetric: 'Simulação leve por instanciamento sem física pesada',
      owner: 'Cosmo / Helton',
      status: 'PENDENTE',
      impactLevel: 'MEDIO'
    }
  ],
  spots: [
    {
      id: 'spot-1',
      code: 'POSTE-SPLICE-01',
      locationInViario: 'Entrada Principal / Portaria Viário Facens',
      model3DStatus: 'PENDENTE_SPLICE',
      stage1Behavior: 'Highlight 3D clicável em MR -> Abre modal com stream simulado da portaria',
      stage2Payloads: ['Stream RTSP/WebRTC Real-Time', 'LPR (Placas)', 'Contagem de Fluxo'],
      coords: { x: 18, y: 55 }
    },
    {
      id: 'spot-2',
      code: 'POSTE-SPLICE-02',
      locationInViario: 'Eixo Central: Próximo à Biblioteca (Radar + Câmera)',
      model3DStatus: 'PENDENTE_SPLICE',
      stage1Behavior: 'Highlight 3D clicável em MR -> Abre painel visualizador do cruzamento central',
      stage2Payloads: ['Stream Real-Time 5G', 'Velocidade Radar', 'Classificação Acústica', 'Vestimenta / Idade / Gênero'],
      coords: { x: 52, y: 42 }
    },
    {
      id: 'spot-3',
      code: 'POSTE-SPLICE-03',
      locationInViario: 'Acesso Laboratórios / LIGA & Prédio D (Sala D29)',
      model3DStatus: 'PENDENTE_SPLICE',
      stage1Behavior: 'Highlight 3D clicável em MR -> Exibe visão de pedestres e estacionamento interno',
      stage2Payloads: ['Stream Real-Time 5G', 'IA Pedestres (Vestimenta, Faixa Etária, Gênero Estimado)'],
      coords: { x: 78, y: 30 }
    }
  ],
  questions: [
    {
      id: 'q-1',
      target: 'PROF_FRED',
      question: 'Como faremos a ponte técnica entre os artefatos da 1ª capacitação (SIGABEM / VR do Tomita e Gabriel) e o novo projeto na Unity?',
      context: 'Obrigatório validar em reunião antes de iniciar o acoplamento de código para evitar retrabalho.',
      status: 'ABERTA'
    },
    {
      id: 'q-2',
      target: 'SPLICE',
      question: 'Qual é a localização exata dos postes/câmeras que a Splice disponibilizará no campus e qual protocolo de vídeo será entregue?',
      context: 'Necessário para posicionar os pins 3D na Etapa 1 (Janeiro) e preparar o player de baixa latência via roteador 5G na Etapa 2.',
      status: 'ABERTA'
    },
    {
      id: 'q-3',
      target: 'SPLICE',
      question: 'A API do sistema SIIS/SIS envia eventos em tempo real (Webhooks / WebSocket) ou precisaremos estruturar rotinas de polling?',
      context: 'Levantado no Guia de Investigação e no Dossiê Consolidado (também confirmar se a sigla oficial no projeto será SIIS ou SIS).',
      status: 'ABERTA'
    },
    {
      id: 'q-4',
      target: 'COORDENACAO_IA',
      question: 'Quais modelos e diretrizes de anonimização (LGPD) utilizaremos para extrair vestimenta, faixa etária e gênero estimado na Etapa 2?',
      context: 'A coordenação informou que teremos apoio do professor de IA após a entrega de janeiro para estruturar esses metadados.',
      status: 'ABERTA'
    }
  ]
};
