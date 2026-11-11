'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Target,
  Kanban,
  BookOpen,
  Users,
  Download,
  Upload,
  RotateCcw,
  Plus,
  CheckCircle2,
  Circle,
  ExternalLink,
  Trash2,
  List,
  Columns3,
  Edit3,
  Check,
  Search,
  ArrowUpRight,
  FolderGit2,
  FileText,
  Presentation,
  Cpu,
  MessageSquare,
  Building2,
  Sparkles
} from 'lucide-react';
import {
  ProjectState,
  ProjectTask,
  TaskStatus,
  StudyMaterial,
  TeamMember
} from '@/types/project';
import { INITIAL_PROJECT_STATE } from '@/lib/seed-data';
import {
  loadProjectState,
  saveProjectState,
  resetToSeedState,
  exportStateAsJson
} from '@/lib/storage';

type ActiveTab = 'METAS' | 'KANBAN' | 'ESTUDO' | 'EQUIPE';

const STATUS_META: Record<
  TaskStatus,
  { label: string; dot: string; badge: string; border: string }
> = {
  PENDENTE: {
    label: 'Pendente',
    dot: 'bg-zinc-400',
    badge: 'bg-zinc-800/90 text-zinc-300 border-zinc-700',
    border: 'hover:border-zinc-600'
  },
  VALIDACAO: {
    label: 'Validação (Fred / Grupo)',
    dot: 'bg-amber-400',
    badge: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    border: 'hover:border-amber-700/60'
  },
  EM_ANDAMENTO: {
    label: 'Em Execução',
    dot: 'bg-indigo-400',
    badge: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60',
    border: 'hover:border-indigo-700/60'
  },
  CONCLUIDO: {
    label: 'Concluído',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    border: 'hover:border-emerald-700/60'
  }
};

const CATEGORY_META: Record<
  StudyMaterial['category'],
  { label: string; badge: string; icon: React.ComponentType<{ className?: string }> }
> = {
  ATA: {
    label: 'Ata / Kickoff',
    badge: 'bg-amber-950/60 text-amber-300 border-amber-800/50',
    icon: MessageSquare
  },
  APRESENTACAO: {
    label: 'Apresentação / PDF',
    badge: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/50',
    icon: Presentation
  },
  DOSSIE: {
    label: 'Dossiê Técnico',
    badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50',
    icon: FileText
  },
  REPOSITORIO: {
    label: 'Repositório GitHub',
    badge: 'bg-sky-950/60 text-sky-300 border-sky-800/50',
    icon: FolderGit2
  },
  HARDWARE: {
    label: 'Hardware / Óptica',
    badge: 'bg-purple-950/60 text-purple-300 border-purple-800/50',
    icon: Cpu
  }
};

export default function GTSpliceWorkspace() {
  const [state, setState] = useState<ProjectState>(INITIAL_PROJECT_STATE);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('METAS');

  // Filtros do Kanban
  const [viewMode, setViewMode] = useState<'BOARD' | 'LIST'>('BOARD');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('ALL');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Modal de Tarefa (<dialog>)
  const taskDialogRef = useRef<HTMLDialogElement | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStage, setTaskStage] = useState('Entrega 1 (Janeiro)');
  const [taskAssignee, setTaskAssignee] = useState('Em aberto');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('PENDENTE');
  const [taskNotes, setTaskNotes] = useState('');

  // Modal de Material de Estudo (<dialog>)
  const matDialogRef = useRef<HTMLDialogElement | null>(null);
  const [matTitle, setMatTitle] = useState('');
  const [matCategory, setMatCategory] = useState<StudyMaterial['category']>('DOSSIE');
  const [matType, setMatType] = useState('Documento / Link');
  const [matSharedBy, setMatSharedBy] = useState('');
  const [matUrl, setMatUrl] = useState('');
  const [matNotes, setMatNotes] = useState('');

  // Edição inline de integrante
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setState(loadProjectState());
    setMounted(true);
  }, []);

  const updateState = (updater: (prev: ProjectState) => ProjectState) => {
    setState((prev) => {
      const next = updater(prev);
      saveProjectState(next);
      return next;
    });
  };

  // Alternar check de item nas Metas Oficiais
  const handleToggleGoalItem = (groupId: string, itemId: string) => {
    updateState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === groupId
          ? {
              ...g,
              items: g.items.map((it) =>
                it.id === itemId ? { ...it, completed: !it.completed } : it
              )
            }
          : g
      )
    }));
  };

  // Transformar uma Meta Oficial em Tarefa no Kanban com 1 clique
  const handleConvertGoalToTask = (goalText: string, groupTitle: string) => {
    const newTask: ProjectTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: goalText,
      stage: groupTitle,
      assignee: 'Em aberto',
      status: 'PENDENTE',
      notes: 'Criada a partir das Metas Oficiais do Kickoff.',
      createdAt: new Date().toISOString()
    };
    updateState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));
    setActiveTab('KANBAN');
  };

  // Modal de Tarefas
  const openCreateTaskModal = (defaultStatus: TaskStatus = 'PENDENTE') => {
    setEditingTaskId(null);
    setTaskTitle('');
    setTaskStage('Entrega 1 (Janeiro)');
    setTaskAssignee('Em aberto');
    setTaskStatus(defaultStatus);
    setTaskNotes('');
    taskDialogRef.current?.showModal();
  };

  const openEditTaskModal = (task: ProjectTask) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskStage(task.stage);
    setTaskAssignee(task.assignee);
    setTaskStatus(task.status);
    setTaskNotes(task.notes);
    taskDialogRef.current?.showModal();
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTaskId) {
      updateState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === editingTaskId
            ? {
                ...t,
                title: taskTitle.trim(),
                stage: taskStage.trim() || 'Geral',
                assignee: taskAssignee.trim() || 'Em aberto',
                status: taskStatus,
                notes: taskNotes.trim()
              }
            : t
        )
      }));
    } else {
      const created: ProjectTask = {
        id: `task-${Date.now()}`,
        title: taskTitle.trim(),
        stage: taskStage.trim() || 'Geral',
        assignee: taskAssignee.trim() || 'Em aberto',
        status: taskStatus,
        notes: taskNotes.trim(),
        createdAt: new Date().toISOString()
      };
      updateState((prev) => ({
        ...prev,
        tasks: [created, ...prev.tasks]
      }));
    }
    taskDialogRef.current?.close();
  };

  const handleUpdateTask = (id: string, patch: Partial<ProjectTask>) => {
    updateState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t))
    }));
  };

  const handleDeleteTask = (id: string) => {
    updateState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id)
    }));
  };

  // Materiais de Estudo
  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim()) return;
    const created: StudyMaterial = {
      id: `mat-${Date.now()}`,
      title: matTitle.trim(),
      category: matCategory,
      type: matType.trim() || 'Referência',
      sharedBy: matSharedBy.trim() || 'Equipe GT_Splice',
      referenceOrUrl: matUrl.trim() || '-',
      notes: matNotes.trim()
    };
    updateState((prev) => ({
      ...prev,
      materials: [...prev.materials, created]
    }));
    setMatTitle('');
    setMatUrl('');
    setMatNotes('');
    matDialogRef.current?.close();
  };

  const handleDeleteMaterial = (id: string) => {
    updateState((prev) => ({
      ...prev,
      materials: prev.materials.filter((m) => m.id !== id)
    }));
  };

  // Equipe
  const handleUpdateMember = (id: string, patch: Partial<TeamMember>) => {
    updateState((prev) => ({
      ...prev,
      team: prev.team.map((m) => (m.id === id ? { ...m, ...patch } : m))
    }));
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(String(ev.target?.result)) as ProjectState;
        if (parsed.goals && parsed.materials) {
          setState(parsed);
          saveProjectState(parsed);
        }
      } catch {
        alert('Arquivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-400 flex items-center justify-center text-sm font-mono">
        Carregando workspace GT_Splice...
      </div>
    );
  }

  // Métricas das Metas Oficiais e Tarefas
  const allGoalItems = state.goals.flatMap((g) => g.items);
  const completedGoalItems = allGoalItems.filter((i) => i.completed).length;
  const goalsProgress =
    allGoalItems.length > 0
      ? Math.round((completedGoalItems / allGoalItems.length) * 100)
      : 0;

  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter((t) => t.status === 'CONCLUIDO').length;

  const filteredTasks = state.tasks.filter((t) => {
    const matchAssignee =
      selectedAssignee === 'ALL' ||
      t.assignee.toLowerCase().includes(selectedAssignee.toLowerCase());
    const matchQuery =
      !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.stage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchAssignee && matchQuery;
  });

  const sortedTeam = [...state.team].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR')
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col lg:flex-row">
      {/* SIDEBAR EXECUTIVA ESTILO LINEAR / VERCEL */}
      <aside className="w-full lg:w-64 bg-[#0e0e11] border-b lg:border-b-0 lg:border-r border-zinc-800/80 flex flex-col justify-between p-4 shrink-0">
        <div className="space-y-6">
          {/* IDENTIDADE DO GRUPO */}
          <div className="flex items-center gap-3 px-2 pt-1">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
              GT
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-semibold text-zinc-100 truncate">
                  GT_Splice Facens
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  TIC 51
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate">
                Campus em Realidade Mista
              </p>
            </div>
          </div>

          {/* NAVEGAÇÃO PRINCIPAL */}
          <nav className="space-y-1">
            <div className="px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Workspace
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('METAS')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                activeTab === 'METAS'
                  ? 'bg-zinc-800/90 text-white border border-zinc-700/70'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Target className="w-4 h-4 text-indigo-400" />
                Metas Oficiais (Kickoff)
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {completedGoalItems}/{allGoalItems.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ESTUDO')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                activeTab === 'ESTUDO'
                  ? 'bg-zinc-800/90 text-white border border-zinc-700/70'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Acervo & Estudo
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {state.materials.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('KANBAN')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                activeTab === 'KANBAN'
                  ? 'bg-zinc-800/90 text-white border border-zinc-700/70'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Kanban className="w-4 h-4 text-sky-400" />
                Plano de Trabalho
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {completedTasks}/{totalTasks}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('EQUIPE')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                activeTab === 'EQUIPE'
                  ? 'bg-zinc-800/90 text-white border border-zinc-700/70'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-amber-400" />
                Integrantes (A-Z)
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {state.team.length}
              </span>
            </button>
          </nav>

          {/* AMBIENTES E SALAS FACENS */}
          <div className="px-3 py-3 rounded-xl bg-[#121216] border border-zinc-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-200">
              <Building2 className="w-3.5 h-3.5 text-zinc-400" />
              Infraestrutura Facens
            </div>
            <div className="text-[11px] text-zinc-400 space-y-1 leading-relaxed">
              <div>• <strong className="text-zinc-200">Sala D29:</strong> Máquina potente (Unity)</div>
              <div>• <strong className="text-zinc-200">Sala 13:</strong> Bancada e monitores</div>
              <div>• <strong className="text-zinc-200">Teams:</strong> Canal <code className="text-zinc-300">GT_Splice</code></div>
            </div>
          </div>
        </div>

        {/* EXPORTAR / IMPORTAR JSON */}
        <div className="pt-4 mt-6 border-t border-zinc-800/80 space-y-2">
          <button
            type="button"
            onClick={() => exportStateAsJson(state)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-200 border border-zinc-800 transition"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            Exportar Backup (.JSON)
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-200 border border-zinc-800 transition"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            Importar Backup (.JSON)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJson}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => {
              if (confirm('Restaurar o estado padrão (mantendo apenas as metas oficiais e os materiais de estudo)?')) {
                setState(resetToSeedState());
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition"
          >
            <RotateCcw className="w-3 h-3" />
            Restaurar padrão inicial
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="border-b border-zinc-800/80 bg-[#0c0c0f]/90 backdrop-blur px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
              <span>SPLICE • UNIFACENS • MCTI / SOFTEX</span>
              <span>•</span>
              <span className="text-indigo-400">REALIDADE MISTA (UNITY / BROWSER)</span>
            </div>
            <h2 className="text-lg font-semibold text-white tracking-tight mt-0.5">
              {activeTab === 'METAS' && 'Metas Oficiais & Escopo do Desafio (Kickoff 09/11)'}
              {activeTab === 'ESTUDO' && 'Acervo Técnico & Materiais para Inventário'}
              {activeTab === 'KANBAN' && 'Plano de Trabalho Vivo & Quadro de Tarefas'}
              {activeTab === 'EQUIPE' && 'Integrantes do Grupo GT_Splice (Ordem Alfabética)'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-[#121216] border border-zinc-800 text-xs">
              <span className="text-zinc-400">Checklist Oficial:</span>
              <span className="font-mono font-semibold text-white">{goalsProgress}%</span>
              <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all"
                  style={{ width: `${goalsProgress}%` }}
                />
              </div>
            </div>

            {activeTab === 'ESTUDO' ? (
              <button
                type="button"
                onClick={() => matDialogRef.current?.showModal()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Adicionar Material
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openCreateTaskModal('PENDENTE')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Nova Tarefa do Grupo
              </button>
            )}
          </div>
        </header>

        {/* CONTEÚDO DAS ABAS */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* ABA 1: METAS OFICIAIS */}
          {activeTab === 'METAS' && (
            <div className="space-y-6">
              {/* FAIXA DE RESUMO EXECUTIVO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#111115] border border-zinc-800/90">
                  <span className="text-[11px] font-mono uppercase text-zinc-400">
                    1ª Entrega Oficial
                  </span>
                  <div className="text-base font-semibold text-white mt-1">
                    Janeiro / 2027
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Ambiente MR rodando em browser com pontos clicáveis no viário.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#111115] border border-zinc-800/90">
                  <span className="text-[11px] font-mono uppercase text-zinc-400">
                    Engine & Validação
                  </span>
                  <div className="text-base font-semibold text-white mt-1">
                    Unity + Prof. Fred
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Fazer inventário do material anterior e validar compatibilidade.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#111115] border border-zinc-800/90">
                  <span className="text-[11px] font-mono uppercase text-zinc-400">
                    Ponto Crítico 3D
                  </span>
                  <div className="text-base font-semibold text-white mt-1">
                    Polígonos vs. Sombras
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Podar árvores do entorno, focar no viário e testar na Sala D29.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#111115] border border-zinc-800/90">
                  <span className="text-[11px] font-mono uppercase text-zinc-400">
                    Etapa 2 (Posterior)
                  </span>
                  <div className="text-base font-semibold text-white mt-1">
                    Real-Time 5G & IA
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Stream ao vivo das câmeras Splice + vestimenta, idade e gênero.
                  </p>
                </div>
              </div>

              {/* CARDS INTERATIVOS DAS METAS OFICIAIS */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {state.goals.map((group) => {
                  const doneCount = group.items.filter((i) => i.completed).length;
                  return (
                    <div
                      key={group.id}
                      className="rounded-xl bg-[#111115] border border-zinc-800/90 flex flex-col justify-between overflow-hidden"
                    >
                      <div className="p-5 border-b border-zinc-800/80 flex items-start justify-between gap-4 bg-[#141419]">
                        <div>
                          <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950/70 text-indigo-300 border border-indigo-800/60 mb-1.5">
                            {group.badge}
                          </span>
                          <h3 className="text-base font-semibold text-white">
                            {group.title}
                          </h3>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {group.subtitle}
                          </p>
                        </div>
                        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800 shrink-0">
                          {doneCount}/{group.items.length}
                        </span>
                      </div>

                      <div className="p-4 divide-y divide-zinc-800/60">
                        {group.items.map((item) => (
                          <div
                            key={item.id}
                            className="py-3 first:pt-1 last:pb-1 flex items-start justify-between gap-3 group"
                          >
                            <button
                              type="button"
                              onClick={() => handleToggleGoalItem(group.id, item.id)}
                              className="flex items-start gap-3 text-left flex-1"
                            >
                              {item.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <Circle className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 shrink-0 mt-0.5" />
                              )}
                              <span
                                className={`text-xs leading-relaxed ${
                                  item.completed
                                    ? 'line-through text-zinc-500'
                                    : 'text-zinc-200'
                                }`}
                              >
                                {item.text}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleConvertGoalToTask(item.text, group.title)
                              }
                              title="Enviar este item como tarefa para o Plano de Trabalho"
                              className="opacity-80 sm:opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-medium text-zinc-200 border border-zinc-700 transition shrink-0"
                            >
                              <Plus className="w-3 h-3" />
                              Virar Tarefa
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA 2: MATERIAL DE ESTUDO E ACERVO */}
          {activeTab === 'ESTUDO' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {state.materials.map((mat) => {
                  const cat = CATEGORY_META[mat.category] || CATEGORY_META.DOSSIE;
                  const IconComponent = cat.icon;
                  const isUrl = mat.referenceOrUrl.startsWith('http');
                  return (
                    <div
                      key={mat.id}
                      className="rounded-xl bg-[#111115] border border-zinc-800/90 hover:border-zinc-700 p-5 flex flex-col justify-between transition"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded border ${cat.badge}`}
                          >
                            <IconComponent className="w-3 h-3" />
                            {cat.label}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteMaterial(mat.id)}
                            className="text-zinc-500 hover:text-rose-400 transition"
                            title="Remover material"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-white leading-snug">
                            {mat.title}
                          </h3>
                          <span className="text-[11px] text-zinc-400 block mt-0.5">
                            {mat.type} • Compartilhado por <strong className="text-zinc-300">{mat.sharedBy}</strong>
                          </span>
                        </div>

                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {mat.notes}
                        </p>
                      </div>

                      <div className="pt-3 mt-4 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                        {isUrl ? (
                          <a
                            href={mat.referenceOrUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-400 hover:text-indigo-300 truncate"
                          >
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{mat.referenceOrUrl}</span>
                          </a>
                        ) : (
                          <span className="text-[11px] font-mono text-zinc-400 truncate">
                            {mat.referenceOrUrl}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA 3: PLANO DE TRABALHO (KANBAN & LISTA) */}
          {activeTab === 'KANBAN' && (
            <div className="space-y-5">
              {/* BARRA DE CONTROLE */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111115] p-3.5 rounded-xl border border-zinc-800/90">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filtrar tarefas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-[#09090b] text-xs text-zinc-200 pl-8 pr-3 py-1.5 rounded-lg border border-zinc-800 focus:outline-none focus:border-zinc-600"
                    />
                  </div>

                  <select
                    value={selectedAssignee}
                    onChange={(e) => setSelectedAssignee(e.target.value)}
                    className="bg-[#09090b] text-xs text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-800"
                  >
                    <option value="ALL">Todos os integrantes</option>
                    <option value="Em aberto">Em aberto</option>
                    {sortedTeam.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#09090b] p-1 rounded-lg border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setViewMode('BOARD')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                        viewMode === 'BOARD'
                          ? 'bg-zinc-800 text-white'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Columns3 className="w-3.5 h-3.5" />
                      Quadro
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('LIST')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                        viewMode === 'LIST'
                          ? 'bg-zinc-800 text-white'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      Tabela
                    </button>
                  </div>
                </div>
              </div>

              {viewMode === 'BOARD' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {(
                    ['PENDENTE', 'VALIDACAO', 'EM_ANDAMENTO', 'CONCLUIDO'] as TaskStatus[]
                  ).map((st) => {
                    const colTasks = filteredTasks.filter((t) => t.status === st);
                    const meta = STATUS_META[st];
                    return (
                      <div
                        key={st}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedTaskId) {
                            handleUpdateTask(draggedTaskId, { status: st });
                            setDraggedTaskId(null);
                          }
                        }}
                        className="rounded-xl bg-[#111115] border border-zinc-800/90 p-3.5 flex flex-col min-h-[480px]"
                      >
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                            <span className="text-xs font-semibold text-zinc-200">
                              {meta.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900">
                              {colTasks.length}
                            </span>
                            <button
                              type="button"
                              onClick={() => openCreateTaskModal(st)}
                              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                              title="Adicionar nesta coluna"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {colTasks.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-zinc-800/70 rounded-lg">
                            <p className="text-xs text-zinc-500 mb-2">
                              Nenhuma tarefa em {meta.label.toLowerCase()}.
                            </p>
                            <button
                              type="button"
                              onClick={() => openCreateTaskModal(st)}
                              className="inline-flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 transition"
                            >
                              <Plus className="w-3 h-3" />
                              Criar tarefa
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2.5 flex-1">
                            {colTasks.map((task) => (
                              <div
                                key={task.id}
                                draggable
                                onDragStart={() => setDraggedTaskId(task.id)}
                                onDragEnd={() => setDraggedTaskId(null)}
                                className={`p-3.5 rounded-lg bg-[#16161c] border border-zinc-800 ${meta.border} space-y-2.5 transition cursor-grab active:cursor-grabbing`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 truncate">
                                    {task.stage}
                                  </span>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => openEditTaskModal(task)}
                                      className="p-1 text-zinc-400 hover:text-white"
                                      title="Editar"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="p-1 text-zinc-500 hover:text-rose-400"
                                      title="Excluir"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <h4 className="text-xs font-medium text-zinc-100 leading-snug">
                                  {task.title}
                                </h4>

                                {task.notes && (
                                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                                    {task.notes}
                                  </p>
                                )}

                                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                                  <select
                                    value={task.assignee}
                                    onChange={(e) =>
                                      handleUpdateTask(task.id, {
                                        assignee: e.target.value
                                      })
                                    }
                                    className="bg-[#09090b] text-[11px] text-zinc-300 px-2 py-1 rounded border border-zinc-800 max-w-[140px] truncate"
                                  >
                                    <option value="Em aberto">Em aberto</option>
                                    {sortedTeam.map((m) => (
                                      <option key={m.id} value={m.name}>
                                        {m.name}
                                      </option>
                                    ))}
                                  </select>

                                  <select
                                    value={task.status}
                                    onChange={(e) =>
                                      handleUpdateTask(task.id, {
                                        status: e.target.value as TaskStatus
                                      })
                                    }
                                    className="bg-[#09090b] text-[11px] text-zinc-400 px-2 py-1 rounded border border-zinc-800"
                                  >
                                    <option value="PENDENTE">Pendente</option>
                                    <option value="VALIDACAO">Validação</option>
                                    <option value="EM_ANDAMENTO">Execução</option>
                                    <option value="CONCLUIDO">Concluído</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl bg-[#111115] border border-zinc-800/90 overflow-hidden">
                  {filteredTasks.length === 0 ? (
                    <div className="p-10 text-center text-xs text-zinc-500">
                      Nenhuma tarefa cadastrada. Clique em <strong>Nova Tarefa do Grupo</strong> ou converta qualquer item na aba <strong>Metas Oficiais</strong>.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#141419] text-zinc-400 border-b border-zinc-800">
                            <th className="p-3.5 font-medium">Tarefa</th>
                            <th className="p-3.5 font-medium">Etapa</th>
                            <th className="p-3.5 font-medium">Responsável</th>
                            <th className="p-3.5 font-medium">Status</th>
                            <th className="p-3.5 font-medium text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/80">
                          {filteredTasks.map((task) => (
                            <tr key={task.id} className="hover:bg-zinc-900/40">
                              <td className="p-3.5 font-medium text-white">
                                {task.title}
                                {task.notes && (
                                  <span className="block text-[11px] text-zinc-400 font-normal mt-0.5">
                                    {task.notes}
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 font-mono text-zinc-400">
                                {task.stage}
                              </td>
                              <td className="p-3.5">
                                <select
                                  value={task.assignee}
                                  onChange={(e) =>
                                    handleUpdateTask(task.id, {
                                      assignee: e.target.value
                                    })
                                  }
                                  className="bg-[#09090b] text-xs text-zinc-200 px-2.5 py-1 rounded border border-zinc-800"
                                >
                                  <option value="Em aberto">Em aberto</option>
                                  {sortedTeam.map((m) => (
                                    <option key={m.id} value={m.name}>
                                      {m.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="p-3.5">
                                <select
                                  value={task.status}
                                  onChange={(e) =>
                                    handleUpdateTask(task.id, {
                                      status: e.target.value as TaskStatus
                                    })
                                  }
                                  className="bg-[#09090b] text-xs text-zinc-200 px-2.5 py-1 rounded border border-zinc-800"
                                >
                                  <option value="PENDENTE">Pendente</option>
                                  <option value="VALIDACAO">Validação</option>
                                  <option value="EM_ANDAMENTO">Em Execução</option>
                                  <option value="CONCLUIDO">Concluído</option>
                                </select>
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => openEditTaskModal(task)}
                                    className="text-zinc-400 hover:text-white"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="text-zinc-500 hover:text-rose-400"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ABA 4: INTEGRANTES EM ORDEM ALFABÉTICA */}
          {activeTab === 'EQUIPE' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sortedTeam.map((member) => {
                  const isEditing = editingMemberId === member.id;
                  const memberTasks = state.tasks.filter((t) =>
                    t.assignee.toLowerCase().includes(member.name.toLowerCase())
                  ).length;

                  return (
                    <div
                      key={member.id}
                      className={`rounded-xl bg-[#111115] border p-5 flex flex-col justify-between transition ${
                        isEditing ? 'border-indigo-500/70' : 'border-zinc-800/90'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-200 shrink-0">
                              {member.initials}
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-white">
                                {member.name}
                              </h3>
                              <span className="inline-block text-[11px] text-zinc-400 mt-0.5">
                                {member.focusArea || 'A definir em grupo'}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setEditingMemberId(isEditing ? null : member.id)
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-300 border border-zinc-800 transition"
                          >
                            {isEditing ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" /> Salvar
                              </>
                            ) : (
                              <>
                                <Edit3 className="w-3 h-3" /> Definir Foco
                              </>
                            )}
                          </button>
                        </div>

                        {isEditing ? (
                          <div className="space-y-3 pt-2 border-t border-zinc-800/80 text-xs">
                            <div>
                              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                                Frente / Atuação (definida pelo grupo)
                              </label>
                              <input
                                type="text"
                                value={member.focusArea}
                                onChange={(e) =>
                                  handleUpdateMember(member.id, {
                                    focusArea: e.target.value
                                  })
                                }
                                placeholder="Ex: Unity 3D, Integração, Documentação..."
                                className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                                Notas / Observações
                              </label>
                              <textarea
                                rows={2}
                                value={member.notes}
                                onChange={(e) =>
                                  handleUpdateMember(member.id, {
                                    notes: e.target.value
                                  })
                                }
                                placeholder="Anotações livres..."
                                className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                                  GitHub URL
                                </label>
                                <input
                                  type="text"
                                  value={member.github || ''}
                                  onChange={(e) =>
                                    handleUpdateMember(member.id, {
                                      github: e.target.value
                                    })
                                  }
                                  placeholder="https://github.com/..."
                                  className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px]"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                                  E-mail / Contato
                                </label>
                                <input
                                  type="text"
                                  value={member.email || ''}
                                  onChange={(e) =>
                                    handleUpdateMember(member.id, {
                                      email: e.target.value
                                    })
                                  }
                                  placeholder="email@exemplo.com"
                                  className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white text-[11px]"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-400 leading-relaxed min-h-[36px]">
                            {member.notes ||
                              'Clique em "Definir Foco" para anotar o que ficou combinado para este integrante.'}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          {member.github ? (
                            <a
                              href={member.github}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-zinc-300 hover:text-white"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              {member.github.replace('https://github.com/', '@')}
                            </a>
                          ) : (
                            <span className="text-[11px] text-zinc-500">
                              Sem GitHub vinculado
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-mono text-zinc-400">
                          {memberTasks} {memberTasks === 1 ? 'tarefa' : 'tarefas'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL DE TAREFA */}
      <dialog
        ref={taskDialogRef}
        className="bg-[#111115] text-zinc-100 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl"
      >
        <h3 className="text-base font-semibold text-white mb-4">
          {editingTaskId ? 'Editar Tarefa' : 'Nova Tarefa do Grupo'}
        </h3>
        <form onSubmit={handleSaveTask} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Descrição da Tarefa</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Ex: Validar modelos do SIGABEM com o Prof. Fred"
              className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1">Etapa</label>
              <input
                type="text"
                value={taskStage}
                onChange={(e) => setTaskStage(e.target.value)}
                placeholder="Ex: Entrega 1 (Janeiro)"
                className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Status</label>
              <select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-2.5 py-2 text-white"
              >
                <option value="PENDENTE">Pendente</option>
                <option value="VALIDACAO">Validação (Fred / Grupo)</option>
                <option value="EM_ANDAMENTO">Em Execução</option>
                <option value="CONCLUIDO">Concluído</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Responsável</label>
            <select
              value={taskAssignee}
              onChange={(e) => setTaskAssignee(e.target.value)}
              className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-2.5 py-2 text-white"
            >
              <option value="Em aberto">Em aberto (definir em grupo)</option>
              {sortedTeam.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Observações Técnicas</label>
            <textarea
              rows={3}
              value={taskNotes}
              onChange={(e) => setTaskNotes(e.target.value)}
              placeholder="Detalhes adicionais..."
              className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => taskDialogRef.current?.close()}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 font-semibold hover:bg-white"
            >
              Salvar
            </button>
          </div>
        </form>
      </dialog>

      {/* MODAL DE MATERIAL DE ESTUDO */}
      <dialog
        ref={matDialogRef}
        className="bg-[#111115] text-zinc-100 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl"
      >
        <h3 className="text-base font-semibold text-white mb-4">
          Adicionar Material de Estudo
        </h3>
        <form onSubmit={handleSaveMaterial} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Título do Material</label>
            <input
              type="text"
              required
              value={matTitle}
              onChange={(e) => setMatTitle(e.target.value)}
              placeholder="Ex: Repositório Tomita & Gabriel / Cena Unity"
              className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1">Categoria</label>
              <select
                value={matCategory}
                onChange={(e) =>
                  setMatCategory(e.target.value as StudyMaterial['category'])
                }
                className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-2.5 py-2 text-white"
              >
                <option value="DOSSIE">Dossiê Técnico</option>
                <option value="APRESENTACAO">Apresentação / PDF</option>
                <option value="REPOSITORIO">Repositório GitHub</option>
                <option value="HARDWARE">Hardware / Óptica</option>
                <option value="ATA">Ata / Kickoff</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Compartilhado por</label>
              <input
                type="text"
                value={matSharedBy}
                onChange={(e) => setMatSharedBy(e.target.value)}
                placeholder="Nome"
                className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Link ou Localização</label>
            <input
              type="text"
              value={matUrl}
              onChange={(e) => setMatUrl(e.target.value)}
              placeholder="https://... ou local no Teams/WhatsApp"
              className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Notas sobre o conteúdo</label>
            <textarea
              rows={2}
              value={matNotes}
              onChange={(e) => setMatNotes(e.target.value)}
              placeholder="O que podemos aproveitar deste arquivo..."
              className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => matDialogRef.current?.close()}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 font-semibold hover:bg-white"
            >
              Adicionar
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
