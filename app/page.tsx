'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Kanban,
  PackageSearch,
  Cpu,
  Users,
  Download,
  Upload,
  RotateCcw,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  MapPin,
  Video,
  ShieldAlert,
  Layers,
  Trash2,
  List,
  Columns3,
  Edit3,
  Radio,
  Eye,
  Calendar,
  Check
} from 'lucide-react';
import {
  ProjectState,
  ProjectTask,
  TaskPhase,
  TaskStatus,
  TaskPriority,
  ValidationStatus,
  InventoryAsset,
  CameraSpot,
  TeamMember
} from '@/types/project';
import { INITIAL_PROJECT_STATE } from '@/lib/seed-data';
import {
  loadProjectState,
  saveProjectState,
  resetToSeedState,
  exportStateAsJson
} from '@/lib/storage';

type ActiveTab = 'DASHBOARD' | 'KANBAN' | 'INVENTARIO' | 'OTIMIZACAO_3D' | 'EQUIPE_DOSSIE';

const STATUS_LABELS: Record<TaskStatus, { label: string; badgeClass: string }> = {
  BACKLOG: { label: 'Backlog', badgeClass: 'bg-slate-800 text-slate-300 border-slate-700' },
  VALIDACAO_FRED: {
    label: 'Aguardando Validação (Fred/Coord)',
    badgeClass: 'bg-amber-950/70 text-amber-300 border-amber-700/60'
  },
  EM_ANDAMENTO: {
    label: 'Em Andamento',
    badgeClass: 'bg-cyan-950/70 text-cyan-300 border-cyan-700/60'
  },
  HOMOLOGACAO_D29: {
    label: 'Homologação (Sala D29 / Browser)',
    badgeClass: 'bg-purple-950/70 text-purple-300 border-purple-700/60'
  },
  CONCLUIDO: {
    label: 'Concluído',
    badgeClass: 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60'
  }
};

const PHASE_LABELS: Record<TaskPhase, string> = {
  FASE_0: 'Fase 0: Setup & Inventário (Imediato)',
  FASE_1: 'Fase 1: Entrega MR Browser (Janeiro/27)',
  FASE_2: 'Fase 2: Real-Time 5G & IA (Pós-Jan)'
};

const PRIORITY_LABELS: Record<TaskPriority, { label: string; color: string }> = {
  CRITICA: { label: 'Crítica', color: 'text-rose-400 bg-rose-950/50 border-rose-800/60' },
  OBRIGATORIA_JAN: {
    label: 'Obrigatória Jan/27',
    color: 'text-cyan-300 bg-cyan-950/50 border-cyan-800/60'
  },
  DESEJAVEL_STRETCH: {
    label: 'Desejável / Stretch Goal',
    color: 'text-purple-300 bg-purple-950/50 border-purple-800/60'
  },
  ETAPA_2: { label: 'Etapa 2 (5G + IA)', color: 'text-slate-300 bg-slate-800/70 border-slate-700' }
};

export default function GTSpliceCommandCenter() {
  const [state, setState] = useState<ProjectState>(INITIAL_PROJECT_STATE);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('DASHBOARD');

  // Filtros e Visão do Kanban
  const [kanbanViewMode, setKanbanViewMode] = useState<'BOARD' | 'LIST'>('BOARD');
  const [selectedPhase, setSelectedPhase] = useState<TaskPhase | 'ALL'>('ALL');
  const [selectedMember, setSelectedMember] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'ALL'>('ALL');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Modal de Criar / Editar Tarefa (<dialog>)
  const taskDialogRef = useRef<HTMLDialogElement | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState<TaskPhase>('FASE_1');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('OBRIGATORIA_JAN');
  const [newTaskAssignee, setNewTaskAssignee] = useState('A definir pelo grupo');

  // Modal de Novo Ativo de Inventário (<dialog>)
  const assetDialogRef = useRef<HTMLDialogElement | null>(null);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetOrigin, setNewAssetOrigin] = useState('');
  const [newAssetOwner, setNewAssetOwner] = useState('Equipe GT_Splice');
  const [newAssetUse, setNewAssetUse] = useState('');
  const [newAssetNotes, setNewAssetNotes] = useState('');

  // Edição inline nos cards da equipe
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  // Spot selecionado no Mapa 2D Interativo do Viário
  const [activeSpotId, setActiveSpotId] = useState<string>('spot-1');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loaded = loadProjectState();
    setState(loaded);
    setMounted(true);
  }, []);

  // Fallback para light-dismiss de <dialog closedby="any"> quando o browser não suporta nativamente
  useEffect(() => {
    if (!mounted || typeof HTMLDialogElement === 'undefined') return;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const outside = (e: PointerEvent, dialog: HTMLDialogElement) => {
        const r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      const dialogs = [taskDialogRef.current, assetDialogRef.current].filter(
        (d): d is HTMLDialogElement => d !== null
      );
      const cleanups: Array<() => void> = [];
      for (const dialog of dialogs) {
        let pressedOutside = false;
        const onDown = (e: PointerEvent) => {
          pressedOutside = outside(e, dialog);
        };
        const onUp = (e: PointerEvent) => {
          if (pressedOutside && outside(e, dialog)) dialog.close();
        };
        dialog.addEventListener('pointerdown', onDown);
        dialog.addEventListener('pointerup', onUp);
        cleanups.push(() => {
          dialog.removeEventListener('pointerdown', onDown);
          dialog.removeEventListener('pointerup', onUp);
        });
      }
      return () => cleanups.forEach((fn) => fn());
    }
  }, [mounted]);

  const updateState = (updater: (prev: ProjectState) => ProjectState) => {
    setState((prev) => {
      const next = updater(prev);
      saveProjectState(next);
      return next;
    });
  };

  // Ações de Modal de Tarefa
  const openCreateTaskModal = () => {
    setEditingTaskId(null);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskPhase('FASE_1');
    setNewTaskPriority('OBRIGATORIA_JAN');
    setNewTaskAssignee('A definir pelo grupo');
    taskDialogRef.current?.showModal();
  };

  const openEditTaskModal = (task: ProjectTask) => {
    setEditingTaskId(task.id);
    setNewTaskTitle(task.title);
    setNewTaskDesc(task.description);
    setNewTaskPhase(task.phase);
    setNewTaskPriority(task.priority);
    setNewTaskAssignee(task.assignees[0] || 'A definir pelo grupo');
    taskDialogRef.current?.showModal();
  };

  const closeTaskModal = () => {
    taskDialogRef.current?.close();
  };

  // Ações de Tarefas
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
      )
    }));
  };

  const handleTaskAssigneeChange = (taskId: string, assignee: string) => {
    updateState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? { ...t, assignees: [assignee], updatedAt: new Date().toISOString() }
          : t
      )
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    updateState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId)
    }));
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    if (editingTaskId) {
      updateState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === editingTaskId
            ? {
                ...t,
                title: newTaskTitle.trim(),
                description: newTaskDesc.trim() || t.description,
                phase: newTaskPhase,
                priority: newTaskPriority,
                assignees: [newTaskAssignee],
                updatedAt: new Date().toISOString()
              }
            : t
        )
      }));
    } else {
      const created: ProjectTask = {
        id: `t-${Date.now()}`,
        title: newTaskTitle.trim(),
        description: newTaskDesc.trim() || 'Tarefa adicionada pelo Plano de Trabalho Vivo.',
        phase: newTaskPhase,
        status: 'BACKLOG',
        priority: newTaskPriority,
        assignees: [newTaskAssignee],
        updatedAt: new Date().toISOString()
      };
      updateState((prev) => ({
        ...prev,
        tasks: [created, ...prev.tasks]
      }));
    }

    setNewTaskTitle('');
    setNewTaskDesc('');
    setEditingTaskId(null);
    closeTaskModal();
  };

  // Ações de Inventário
  const handleInventoryStatusChange = (id: string, validationStatus: ValidationStatus) => {
    updateState((prev) => ({
      ...prev,
      inventory: prev.inventory.map((item) =>
        item.id === id ? { ...item, validationStatus } : item
      )
    }));
  };

  const handleInventoryOwnerChange = (id: string, owner: string) => {
    updateState((prev) => ({
      ...prev,
      inventory: prev.inventory.map((item) =>
        item.id === id ? { ...item, owner } : item
      )
    }));
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim()) return;
    const created: InventoryAsset = {
      id: `inv-${Date.now()}`,
      name: newAssetName.trim(),
      origin: newAssetOrigin.trim() || 'Acervo GT_Splice Facens',
      owner: newAssetOwner,
      intendedUnityUse: newAssetUse.trim() || 'Em avaliação de integração com a engine Unity.',
      validationStatus: 'PENDENTE',
      notes: newAssetNotes.trim() || 'Adicionado manualmente ao inventário.'
    };
    updateState((prev) => ({
      ...prev,
      inventory: [...prev.inventory, created]
    }));
    setNewAssetName('');
    setNewAssetOrigin('');
    setNewAssetUse('');
    setNewAssetNotes('');
    assetDialogRef.current?.close();
  };

  // Ações de Otimização 3D & Spots
  const handleOptimizationStatusChange = (
    id: string,
    status: 'PENDENTE' | 'TESTANDO_D29' | 'OTIMIZADO' | 'DESCARTADO'
  ) => {
    updateState((prev) => ({
      ...prev,
      optimizations: prev.optimizations.map((opt) =>
        opt.id === id ? { ...opt, status } : opt
      )
    }));
  };

  const handleOptimizationOwnerChange = (id: string, owner: string) => {
    updateState((prev) => ({
      ...prev,
      optimizations: prev.optimizations.map((opt) =>
        opt.id === id ? { ...opt, owner } : opt
      )
    }));
  };

  const handleSpotStatusChange = (
    id: string,
    model3DStatus: CameraSpot['model3DStatus']
  ) => {
    updateState((prev) => ({
      ...prev,
      spots: prev.spots.map((s) => (s.id === id ? { ...s, model3DStatus } : s))
    }));
  };

  // Ações de Equipe (Edição Inline)
  const handleUpdateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    updateState((prev) => ({
      ...prev,
      team: prev.team.map((m) => (m.id === id ? { ...m, ...updates } : m))
    }));
  };

  // Ações de Dúvidas
  const handleToggleQuestion = (id: string) => {
    updateState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id
          ? { ...q, status: q.status === 'ABERTA' ? 'RESPONDIDA' : 'ABERTA' }
          : q
      )
    }));
  };

  // Importação JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result)) as ProjectState;
        if (parsed.tasks && parsed.inventory) {
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
      <div className="min-h-screen bg-[#090A0F] text-slate-200 flex items-center justify-center">
        <div className="animate-pulse text-cyan-400 font-mono text-sm">
          Inicializando GT_Splice Command Center...
        </div>
      </div>
    );
  }

  // Métricas e Contagem Regressiva Marco 1 (Janeiro/2027)
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter((t) => t.status === 'CONCLUIDO').length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const deadlineJan2027 = new Date('2027-01-31T23:59:59-03:00').getTime();
  const daysUntilMarco1 = Math.max(
    0,
    Math.ceil((deadlineJan2027 - Date.now()) / (1000 * 60 * 60 * 24))
  );

  const getPhaseProgress = (phase: TaskPhase) => {
    const phaseTasks = state.tasks.filter((t) => t.phase === phase);
    if (!phaseTasks.length) return 0;
    const done = phaseTasks.filter((t) => t.status === 'CONCLUIDO').length;
    return Math.round((done / phaseTasks.length) * 100);
  };

  const filteredTasks = state.tasks.filter((t) => {
    const phaseMatch = selectedPhase === 'ALL' || t.phase === selectedPhase;
    const priorityMatch = selectedPriority === 'ALL' || t.priority === selectedPriority;
    const memberMatch =
      selectedMember === 'ALL' ||
      t.assignees.some((a) => a.toLowerCase().includes(selectedMember.toLowerCase()));
    return phaseMatch && priorityMatch && memberMatch;
  });

  const activeSpot = state.spots.find((s) => s.id === activeSpotId) || state.spots[0];

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#12141D] border-b md:border-b-0 md:border-r border-[#1E2230] flex flex-col justify-between p-5 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 block">
                TIC 51 • Facens & Splice
              </span>
              <h1 className="text-lg font-bold tracking-tight text-white">
                GT_Splice Command Center
              </h1>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('DASHBOARD')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'DASHBOARD'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-[#191C28] hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Visão Geral & Marcos
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('KANBAN')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'KANBAN'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-[#191C28] hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-3">
                <Kanban className="w-4 h-4" />
                Plano de Trabalho (Kanban)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {completedTasks}/{totalTasks}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('INVENTARIO')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'INVENTARIO'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-[#191C28] hover:text-slate-200'
              }`}
            >
              <PackageSearch className="w-4 h-4" />
              Inventário SIGABEM & Unity
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('OTIMIZACAO_3D')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'OTIMIZACAO_3D'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-[#191C28] hover:text-slate-200'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Otimização 3D & Spots MR
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('EQUIPE_DOSSIE')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'EQUIPE_DOSSIE'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-[#191C28] hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Equipe, Dossiê & Dúvidas
            </button>
          </nav>
        </div>

        {/* AÇÕES DE BACKUP / COMPARTILHAMENTO */}
        <div className="mt-8 pt-4 border-t border-[#1E2230] space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
            Sincronização & Backup
          </div>
          <button
            type="button"
            onClick={() => exportStateAsJson(state)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#191C28] hover:bg-slate-800 text-xs font-medium text-slate-200 border border-[#262B3D] transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Exportar JSON para o Grupo
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#191C28] hover:bg-slate-800 text-xs font-medium text-slate-200 border border-[#262B3D] transition"
          >
            <Upload className="w-3.5 h-3.5 text-purple-400" />
            Importar JSON Atualizado
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
              if (confirm('Restaurar dados originais do Kickoff de 09/11?')) {
                setState(resetToSeedState());
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-[11px] text-slate-500 hover:text-rose-400 transition"
          >
            <RotateCcw className="w-3 h-3" />
            Resetar para Seed Original
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {/* TOP HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#1E2230]">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-1">
              <span>REALIDADE MISTA (MR) EM BROWSER</span>
              <span>•</span>
              <span>ENGINE UNITY</span>
              <span>•</span>
              <span>DIGITAL SHADOW + 5G</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Desafio Splice: Campus Facens em Realidade Mista
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* DESTAQUE MARCO 1 */}
            <div className="bg-[#12141D] border border-purple-500/30 px-3.5 py-2 rounded-xl flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-purple-400" />
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-300 block">
                  Marco 1: Janeiro/2027 (MR Browser)
                </span>
                <span className="text-xs font-bold text-white">
                  Faltam {daysUntilMarco1} dias • Prazo Inegociável
                </span>
              </div>
            </div>

            <div className="bg-[#12141D] border border-[#1E2230] px-4 py-2 rounded-xl">
              <span className="text-[11px] text-slate-400 block">Progresso Geral</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-cyan-400">{overallProgress}%</span>
                <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={openCreateTaskModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              Nova Tarefa
            </button>
          </div>
        </header>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* REGRA DE OURO / GOVERNANÇA */}
            <div className="bg-amber-950/30 border border-amber-700/50 rounded-2xl p-4 flex items-start gap-3.5">
              <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold text-amber-300 block mb-0.5">
                  Regra de Ouro (Governança Prof. Fred & Coordenação):
                </span>
                <p className="text-amber-200/80">
                  Validar compatibilidade do inventário SIGABEM/LIGA com a engine <strong>Unity</strong> junto ao <strong>Prof. Fred</strong> antes de acoplar código legado. O grupo deve concluir o inventário da 1ª capacitação (App SIGABEM da Vânia e módulo VR/5G do Tomita e Gabriel) e aprovar este Plano de Trabalho Vivo em reunião formal.
                </p>
              </div>
            </div>

            {/* CARDS DE FASES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {(['FASE_0', 'FASE_1', 'FASE_2'] as TaskPhase[]).map((phase) => {
                const progress = getPhaseProgress(phase);
                const count = state.tasks.filter((t) => t.phase === phase).length;
                return (
                  <div
                    key={phase}
                    className="bg-[#12141D] border border-[#1E2230] rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                        <span>{phase}</span>
                        <span>{count} entregas</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">
                        {PHASE_LABELS[phase]}
                      </h3>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">Concluído</span>
                        <span className="text-cyan-400 font-semibold">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ESCOPO DE JANEIRO vs ETAPA 2 + INFRAESTRUTURA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#12141D] border border-[#1E2230] rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  Escopo Obrigatório: 1ª Entrega (Janeiro/2027)
                </div>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Realidade Mista (MR) no Browser:</strong> Artefato construído na Unity rodando em navegador com foco visual impactante.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Foco no Viário e Spots Clicáveis:</strong> Em vez de focar nos prédios, destacar postes e câmeras clicáveis que abrem a visualização da câmera.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Otimização de Polígonos:</strong> Podar árvores do entorno e recortar a maquete para não travar nos óculos MR.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>O que fica para a Etapa 2:</strong> Conexão real-time via roteadores 5G e IA para vestimenta, faixa etária e gênero estimado (com apoio do prof. de IA).
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#12141D] border border-[#1E2230] rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                  <MapPin className="w-4 h-4" />
                  Infraestrutura & Recursos Disponíveis (Facens)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#181B26] border border-[#242938]">
                    <span className="font-bold text-white block mb-1">
                      Sala D29 (Máquina High-End)
                    </span>
                    <p className="text-slate-400">
                      Liberada para builds pesados da Unity, baking de sombras e testes de performance em Realidade Mista.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#181B26] border border-[#242938]">
                    <span className="font-bold text-white block mb-1">
                      Sala 13 & Bancada Central
                    </span>
                    <p className="text-slate-400">
                      Monitores extras disponíveis para trabalho em dupla/grupo nos encontros presenciais.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#181B26] border border-[#242938]">
                    <span className="font-bold text-white block mb-1">
                      Microsoft Teams (GT_Splice)
                    </span>
                    <p className="text-slate-400">
                      Canal central criado pela Ana Paula para contato direto com todos os professores sem ficar órfão de agenda.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#181B26] border border-[#242938]">
                    <span className="font-bold text-white block mb-1">
                      Trabalho Remoto Incentivado
                    </span>
                    <p className="text-slate-400">
                      Datas intermediárias são flexíveis (Plano Vivo), desde que o prazo final de janeiro não seja estourado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KANBAN */}
        {activeTab === 'KANBAN' && (
          <div className="space-y-5">
            {/* BARRA DE FILTROS & VISÃO (COLUNAS / LISTA) */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#12141D] p-4 rounded-2xl border border-[#1E2230]">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  aria-label="Filtrar por Fase"
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value as TaskPhase | 'ALL')}
                  className="bg-[#191C28] text-xs text-slate-200 px-3 py-2 rounded-lg border border-[#262B3D]"
                >
                  <option value="ALL">Todas as Fases (0, 1 e 2)</option>
                  <option value="FASE_0">Fase 0: Setup & Inventário</option>
                  <option value="FASE_1">Fase 1: Entrega Janeiro (MR Browser)</option>
                  <option value="FASE_2">Fase 2: Pós-Janeiro (5G + IA)</option>
                </select>

                <select
                  aria-label="Filtrar por Integrante ou Responsável"
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="bg-[#191C28] text-xs text-slate-200 px-3 py-2 rounded-lg border border-[#262B3D]"
                >
                  <option value="ALL">Todos os Integrantes / Responsáveis</option>
                  <option value="A definir">A definir pelo grupo</option>
                  <option value="Equipe GT_Splice">Equipe GT_Splice</option>
                  {state.team.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Filtrar por Prioridade"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as TaskPriority | 'ALL')}
                  className="bg-[#191C28] text-xs text-slate-200 px-3 py-2 rounded-lg border border-[#262B3D]"
                >
                  <option value="ALL">Todas as Prioridades</option>
                  <option value="CRITICA">Crítica</option>
                  <option value="OBRIGATORIA_JAN">Obrigatória Jan/27</option>
                  <option value="DESEJAVEL_STRETCH">Desejável / Stretch Goal</option>
                  <option value="ETAPA_2">Etapa 2 (5G + IA)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-[#191C28] p-1 rounded-xl border border-[#262B3D]">
                <button
                  type="button"
                  onClick={() => setKanbanViewMode('BOARD')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    kanbanViewMode === 'BOARD'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Columns3 className="w-3.5 h-3.5" />
                  Colunas
                </button>
                <button
                  type="button"
                  onClick={() => setKanbanViewMode('LIST')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    kanbanViewMode === 'LIST'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  Lista
                </button>
              </div>
            </div>

            {/* VISÃO EM COLUNAS DO KANBAN (COM DRAG & DROP + SELECT) */}
            {kanbanViewMode === 'BOARD' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((statusKey) => {
                  const colTasks = filteredTasks.filter((t) => t.status === statusKey);
                  return (
                    <div
                      key={statusKey}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (draggedTaskId) {
                          handleStatusChange(draggedTaskId, statusKey);
                          setDraggedTaskId(null);
                        }
                      }}
                      className="bg-[#12141D] border border-[#1E2230] rounded-2xl p-3.5 flex flex-col min-h-[420px]"
                    >
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E2230]">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${STATUS_LABELS[statusKey].badgeClass}`}
                        >
                          {STATUS_LABELS[statusKey].label}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {colTasks.length}
                        </span>
                      </div>

                      <div className="space-y-3 flex-1">
                        {colTasks.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={() => setDraggedTaskId(task.id)}
                            onDragEnd={() => setDraggedTaskId(null)}
                            className="bg-[#181B26] border border-[#252A3A] hover:border-cyan-500/40 rounded-xl p-3.5 space-y-2.5 transition cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${PRIORITY_LABELS[task.priority].color}`}
                              >
                                {PRIORITY_LABELS[task.priority].label}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditTaskModal(task)}
                                  className="text-slate-400 hover:text-cyan-300 transition"
                                  title="Editar tarefa"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-slate-500 hover:text-rose-400 transition"
                                  title="Remover tarefa"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <h4 className="text-xs font-semibold text-white leading-snug">
                              {task.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {task.description}
                            </p>

                            {/* RESPONSÁVEL / ASSUMIR TAREFA */}
                            <div className="pt-1 flex items-center justify-between gap-1">
                              <span className="text-[10px] text-slate-400">Resp:</span>
                              <select
                                aria-label={`Responsável por ${task.title}`}
                                value={task.assignees[0] || 'A definir pelo grupo'}
                                onChange={(e) =>
                                  handleTaskAssigneeChange(task.id, e.target.value)
                                }
                                className="bg-[#12141D] text-[10px] text-cyan-300 px-2 py-0.5 rounded border border-[#2B3147] max-w-[170px] truncate"
                              >
                                <option value="A definir pelo grupo">A definir pelo grupo</option>
                                <option value="Equipe GT_Splice">Equipe GT_Splice</option>
                                {state.team.map((m) => (
                                  <option key={m.id} value={m.name}>
                                    {m.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="pt-2 border-t border-[#232838]">
                              <select
                                aria-label={`Mudar status de ${task.title}`}
                                value={task.status}
                                onChange={(e) =>
                                  handleStatusChange(task.id, e.target.value as TaskStatus)
                                }
                                className="w-full bg-[#12141D] text-[11px] text-cyan-300 px-2 py-1 rounded border border-[#2B3147]"
                              >
                                {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((st) => (
                                  <option key={st} value={st}>
                                    Mover: {STATUS_LABELS[st].label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* VISÃO EM LISTA DO KANBAN */
              <div className="bg-[#12141D] border border-[#1E2230] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#171A26] text-slate-400 border-b border-[#1E2230]">
                        <th className="p-3.5">Entrega / Tarefa</th>
                        <th className="p-3.5">Fase</th>
                        <th className="p-3.5">Prioridade</th>
                        <th className="p-3.5">Responsável</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E2230]">
                      {filteredTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-[#161925]">
                          <td className="p-3.5 font-semibold text-white max-w-md">
                            {task.title}
                            <span className="block text-[11px] text-slate-400 font-normal mt-0.5">
                              {task.description}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-300">{task.phase}</td>
                          <td className="p-3.5">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${PRIORITY_LABELS[task.priority].color}`}
                            >
                              {PRIORITY_LABELS[task.priority].label}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <select
                              aria-label={`Responsável por ${task.title}`}
                              value={task.assignees[0] || 'A definir pelo grupo'}
                              onChange={(e) =>
                                handleTaskAssigneeChange(task.id, e.target.value)
                              }
                              className="bg-[#191C28] text-xs text-cyan-300 px-2.5 py-1.5 rounded-lg border border-[#2B3147]"
                            >
                              <option value="A definir pelo grupo">A definir pelo grupo</option>
                              <option value="Equipe GT_Splice">Equipe GT_Splice</option>
                              {state.team.map((m) => (
                                <option key={m.id} value={m.name}>
                                  {m.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-3.5">
                            <select
                              aria-label={`Status de ${task.title}`}
                              value={task.status}
                              onChange={(e) =>
                                handleStatusChange(task.id, e.target.value as TaskStatus)
                              }
                              className="bg-[#191C28] text-xs text-slate-200 px-2.5 py-1.5 rounded-lg border border-[#2B3147]"
                            >
                              {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((st) => (
                                <option key={st} value={st}>
                                  {STATUS_LABELS[st].label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditTaskModal(task)}
                                className="text-slate-400 hover:text-cyan-300"
                                title="Editar"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-slate-500 hover:text-rose-400"
                                title="Excluir"
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
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INVENTÁRIO SIGABEM & UNITY */}
        {activeTab === 'INVENTARIO' && (
          <div className="bg-[#12141D] border border-[#1E2230] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[#1E2230] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Inventário da Capacitação Splice (SIGABEM / Malha Viva) & Acervo LIGA
                </h3>
                <p className="text-xs text-slate-400">
                  Cruzamento do material anterior para validação de compatibilidade com a Unity junto ao Prof. Fred.
                </p>
              </div>
              <button
                type="button"
                onClick={() => assetDialogRef.current?.showModal()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#191C28] hover:bg-slate-800 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition shrink-0"
              >
                <Plus className="w-4 h-4" />
                Novo Ativo de Inventário
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#171A26] text-slate-400 border-b border-[#1E2230]">
                    <th className="p-3.5">Ativo / Artefato</th>
                    <th className="p-3.5">Origem</th>
                    <th className="p-3.5">Responsável / Focal</th>
                    <th className="p-3.5">Uso Pretendido na Unity</th>
                    <th className="p-3.5">Status c/ Prof. Fred</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2230]">
                  {state.inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-[#161925]">
                      <td className="p-3.5 font-semibold text-white">
                        {item.name}
                        <span className="block text-[11px] text-slate-400 font-normal mt-0.5">
                          {item.notes}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300">{item.origin}</td>
                      <td className="p-3.5">
                        <select
                          aria-label={`Responsável por ${item.name}`}
                          value={item.owner}
                          onChange={(e) =>
                            handleInventoryOwnerChange(item.id, e.target.value)
                          }
                          className="bg-[#191C28] text-xs text-cyan-300 px-2.5 py-1.5 rounded-lg border border-[#2B3147]"
                        >
                          <option value="Equipe GT_Splice">Equipe GT_Splice</option>
                          <option value="A definir pelo grupo">A definir pelo grupo</option>
                          {state.team.map((m) => (
                            <option key={m.id} value={m.name}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3.5 text-slate-300 max-w-xs">
                        {item.intendedUnityUse}
                      </td>
                      <td className="p-3.5">
                        <select
                          aria-label={`Status de validação de ${item.name}`}
                          value={item.validationStatus}
                          onChange={(e) =>
                            handleInventoryStatusChange(
                              item.id,
                              e.target.value as ValidationStatus
                            )
                          }
                          className="bg-[#191C28] text-xs text-slate-200 px-2.5 py-1.5 rounded-lg border border-[#2B3147]"
                        >
                          <option value="PENDENTE">Pendente Validação</option>
                          <option value="EM_ANALISE">Em Análise pelo Grupo</option>
                          <option value="COMPATIVEL">Compatível c/ Unity</option>
                          <option value="REQUER_ADAPTACAO">Requer Adaptação</option>
                          <option value="DESCARTADO">Descartado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: OTIMIZAÇÃO 3D & SPOTS (COM MAPA 2D INTERATIVO DO VIÁRIO) */}
        {activeTab === 'OTIMIZACAO_3D' && (
          <div className="space-y-6">
            {/* MAPA INTERATIVO 2D DO VIÁRIO FACENS */}
            <div className="bg-[#12141D] border border-[#1E2230] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <h3 className="text-base font-bold text-white">
                      Simulador 2D do Sistema Viário Facens (Preview de Spots MR)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Clique nos postes da Splice no traçado do viário para simular o comportamento da Etapa 1 (Janeiro/27) e o payload 5G/IA da Etapa 2.
                  </p>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                  Recorte Otimizado: Apenas Malha Viária
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
                {/* CANVAS SVG DO VIÁRIO */}
                <div className="lg:col-span-2 bg-[#0B0D14] border border-[#1E2230] rounded-xl p-4 relative overflow-hidden flex flex-col justify-between min-h-[260px]">
                  <svg
                    viewBox="0 0 100 70"
                    className="w-full h-56 select-none"
                    role="img"
                    aria-label="Mapa esquemático 2D do sistema viário da Facens com 3 postes clicáveis da Splice"
                  >
                    {/* Grid de fundo */}
                    <defs>
                      <pattern id="viarioGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path
                          d="M 10 0 L 0 0 0 10"
                          fill="none"
                          stroke="#161A29"
                          strokeWidth="0.3"
                        />
                      </pattern>
                    </defs>
                    <rect width="100" height="70" fill="url(#viarioGrid)" />

                    {/* Zona de poda de árvores (entorno descartado) */}
                    <rect
                      x="3"
                      y="4"
                      width="94"
                      height="62"
                      rx="4"
                      fill="none"
                      stroke="#1E293B"
                      strokeDasharray="2 2"
                      strokeWidth="0.5"
                    />
                    <text x="6" y="9" fill="#475569" fontSize="2.6" fontFamily="monospace">
                      ZONA DE CORTE POLIGONAL (ÁRVORES DO ENTORNO REMOVIDAS)
                    </text>

                    {/* Blocos de referência (baixa prioridade visual) */}
                    <rect x="12" y="48" width="14" height="8" rx="1" fill="#141824" stroke="#262B3D" strokeWidth="0.4" />
                    <text x="14" y="53" fill="#64748B" fontSize="2.3">Portaria</text>

                    <rect x="44" y="20" width="16" height="9" rx="1" fill="#141824" stroke="#262B3D" strokeWidth="0.4" />
                    <text x="46" y="25.5" fill="#64748B" fontSize="2.3">Biblioteca</text>

                    <rect x="72" y="12" width="20" height="10" rx="1" fill="#19162B" stroke="#6D28D9" strokeWidth="0.5" />
                    <text x="74" y="18" fill="#C4B5FD" fontSize="2.3">LIGA / Sala D29</text>

                    {/* Eixo Viário Principal (Destaque Realidade Mista) */}
                    <path
                      d="M 8 44 Q 35 44 52 36 T 90 22"
                      fill="none"
                      stroke="#0E7490"
                      strokeWidth="5"
                      strokeLinecap="round"
                      opacity="0.35"
                    />
                    <path
                      d="M 8 44 Q 35 44 52 36 T 90 22"
                      fill="none"
                      stroke="#22D3EE"
                      strokeWidth="1.2"
                      strokeDasharray="2 1.5"
                    />

                    {/* Postes/Câmeras Clicáveis */}
                    {state.spots.map((spot, idx) => {
                      const cx = spot.coords?.x ?? (20 + idx * 30);
                      const cy = spot.coords?.y ?? (45 - idx * 10);
                      const isSelected = spot.id === activeSpot.id;
                      return (
                        <g
                          key={spot.id}
                          onClick={() => setActiveSpotId(spot.id)}
                          className="cursor-pointer"
                        >
                          {isSelected && (
                            <circle
                              cx={cx}
                              cy={cy}
                              r="6.5"
                              fill="rgba(34, 211, 238, 0.18)"
                              stroke="#22D3EE"
                              strokeWidth="0.5"
                            />
                          )}
                          <circle
                            cx={cx}
                            cy={cy}
                            r="3.2"
                            fill={isSelected ? '#22D3EE' : '#A855F7'}
                            stroke="#090A0F"
                            strokeWidth="0.8"
                          />
                          <text
                            x={cx - 8}
                            y={cy + 7}
                            fill={isSelected ? '#67E8F9' : '#CBD5E1'}
                            fontSize="2.6"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {spot.code}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-[#181C2B]">
                    <span>Clique em um pin no viário para inspecionar o Spot MR</span>
                    <span className="font-mono text-cyan-400">
                      Selecionado: {activeSpot.code}
                    </span>
                  </div>
                </div>

                {/* INSPECTOR DO SPOT SELECIONADO */}
                <div className="bg-[#181B26] border border-cyan-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/60">
                        {activeSpot.code}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                        <Eye className="w-3.5 h-3.5" />
                        Inspector MR
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">
                      {activeSpot.locationInViario}
                    </h4>

                    <div className="p-3 rounded-lg bg-[#12141D] border border-[#232838] text-xs space-y-1">
                      <span className="text-[10px] font-mono uppercase text-cyan-400 block">
                        Comportamento Etapa 1 (Janeiro/27):
                      </span>
                      <p className="text-slate-200">{activeSpot.stage1Behavior}</p>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1.5">
                        Atributos & Telemetria Etapa 2 (5G + IA):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeSpot.stage2Payloads.map((p) => (
                          <span
                            key={p}
                            className="text-[10px] px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/50"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#242938]">
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Status do Modelo 3D na Unity:
                    </label>
                    <select
                      aria-label={`Status do modelo 3D para ${activeSpot.code}`}
                      value={activeSpot.model3DStatus}
                      onChange={(e) =>
                        handleSpotStatusChange(
                          activeSpot.id,
                          e.target.value as CameraSpot['model3DStatus']
                        )
                      }
                      className="w-full bg-[#12141D] text-xs text-cyan-300 px-2.5 py-1.5 rounded-lg border border-[#2B3147]"
                    >
                      <option value="PENDENTE_SPLICE">Pendente Posição Splice</option>
                      <option value="POSICIONADO">Posicionado no Viário 3D</option>
                      <option value="INTERATIVO_MR">Interativo no Browser (MR)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#12141D] border border-[#1E2230] rounded-2xl p-5">
              <h3 className="text-base font-bold text-white mb-1">
                Orçamento de Performance 3D & Polígonos
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Balanceamento entre qualidade visual (sombras, animações de carros/pedestres) e performance nos óculos de Realidade Mista.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.optimizations.map((opt) => (
                  <div
                    key={opt.id}
                    className="p-4 rounded-xl bg-[#181B26] border border-[#242938] flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-1">
                        <span>{opt.category}</span>
                        <span>IMPACTO: {opt.impactLevel}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{opt.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{opt.targetMetric}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#232838]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400">Focal:</span>
                        <select
                          aria-label={`Responsável por ${opt.title}`}
                          value={opt.owner}
                          onChange={(e) =>
                            handleOptimizationOwnerChange(opt.id, e.target.value)
                          }
                          className="bg-[#12141D] text-xs text-cyan-300 px-2 py-1 rounded border border-[#2B3147]"
                        >
                          <option value="Equipe GT_Splice">Equipe GT_Splice</option>
                          <option value="A definir pelo grupo">A definir pelo grupo</option>
                          {state.team.map((m) => (
                            <option key={m.id} value={m.name}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <select
                        aria-label={`Status de otimização para ${opt.title}`}
                        value={opt.status}
                        onChange={(e) =>
                          handleOptimizationStatusChange(
                            opt.id,
                            e.target.value as
                              | 'PENDENTE'
                              | 'TESTANDO_D29'
                              | 'OTIMIZADO'
                              | 'DESCARTADO'
                          )
                        }
                        className="bg-[#12141D] text-xs text-purple-300 px-2.5 py-1 rounded border border-[#2B3147]"
                      >
                        <option value="PENDENTE">Pendente</option>
                        <option value="TESTANDO_D29">Testando na Sala D29</option>
                        <option value="OTIMIZADO">Otimizado (60 FPS)</option>
                        <option value="DESCARTADO">Removido por Peso</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SPOTS DE CÂMERAS E POSTES (CARDS) */}
            <div className="bg-[#12141D] border border-[#1E2230] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Video className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Registro Geral dos Pontos Clicáveis (Postes e Câmeras Splice)
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {state.spots.map((spot) => (
                  <div
                    key={spot.id}
                    className="p-4 rounded-xl bg-[#181B26] border border-[#242938] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/50">
                        {spot.code}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {spot.model3DStatus}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {spot.locationInViario}
                    </h4>
                    <p className="text-xs text-slate-300">
                      <strong>Entrega Jan/27:</strong> {spot.stage1Behavior}
                    </p>
                    <div className="pt-2">
                      <span className="text-[11px] text-slate-400 block mb-1">
                        Dados Enriquecidos (Etapa 2: IA + 5G):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {spot.stage2Payloads.map((p) => (
                          <span
                            key={p}
                            className="text-[10px] px-2 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-800/50"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: EQUIPE, DOSSIÊ & DÚVIDAS */}
        {activeTab === 'EQUIPE_DOSSIE' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white">
                  Integrantes do GT_Splice Facens
                </h3>
                <p className="text-xs text-slate-400">
                  Clique em Editar em qualquer card para personalizar sua função, foco e notas diretamente na interface.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.team.map((member) => {
                const isEditing = editingMemberId === member.id;
                return (
                  <div
                    key={member.id}
                    className={`bg-[#12141D] border rounded-2xl p-5 flex flex-col justify-between transition ${
                      isEditing ? 'border-cyan-500/60 ring-1 ring-cyan-500/30' : 'border-[#1E2230]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-base font-bold text-white">{member.name}</h4>
                        <button
                          type="button"
                          onClick={() => setEditingMemberId(isEditing ? null : member.id)}
                          className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border transition font-medium ${
                            isEditing
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              : 'bg-[#181B26] text-slate-400 hover:text-cyan-300 border-[#262B3D]'
                          }`}
                        >
                          {isEditing ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Concluir
                            </>
                          ) : (
                            <>
                              <Edit3 className="w-3.5 h-3.5" /> Editar
                            </>
                          )}
                        </button>
                      </div>

                      {isEditing ? (
                        <div className="space-y-3 pt-1">
                          <div>
                            <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                              Função / Foco no Projeto
                            </label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) =>
                                handleUpdateTeamMember(member.id, { role: e.target.value })
                              }
                              placeholder="Ex: Integração Unity, Documentação, etc."
                              className="w-full bg-[#181B26] border border-[#2B3147] rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                              Atuação, Notas & Preferências
                            </label>
                            <textarea
                              rows={3}
                              value={member.background}
                              onChange={(e) =>
                                handleUpdateTeamMember(member.id, { background: e.target.value })
                              }
                              placeholder="Descreva seu foco ou preferência no grupo..."
                              className="w-full bg-[#181B26] border border-[#2B3147] rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                                GitHub
                              </label>
                              <input
                                type="text"
                                value={member.github || ''}
                                onChange={(e) =>
                                  handleUpdateTeamMember(member.id, { github: e.target.value })
                                }
                                placeholder="https://github.com/..."
                                className="w-full bg-[#181B26] border border-[#2B3147] rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                                E-mail
                              </label>
                              <input
                                type="email"
                                value={member.email || ''}
                                onChange={(e) =>
                                  handleUpdateTeamMember(member.id, { email: e.target.value })
                                }
                                placeholder="nome@exemplo.com"
                                className="w-full bg-[#181B26] border border-[#2B3147] rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-xs text-cyan-400 block mt-0.5 mb-2 font-medium">
                            {member.role}
                          </span>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {member.background}
                          </p>
                        </>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="mt-4 flex flex-wrap items-center gap-3 pt-2 border-t border-[#1A1E2B]">
                        {member.github && (
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200 font-mono"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {member.github.replace('https://github.com/', '@')}
                          </a>
                        )}
                        {member.email && (
                          <span className="text-[11px] font-mono text-slate-400">
                            {member.email}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CHECKLIST DE PERGUNTAS PARA VALIDAÇÃO */}
            <div className="bg-[#12141D] border border-[#1E2230] rounded-2xl p-5">
              <h3 className="text-base font-bold text-white mb-1">
                Pauta de Validação (Reunião Prof. Fred, Splice & Coordenação IA)
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Clique no status da pergunta durante a reunião presencial ou no Teams para marcar como validada.
              </p>

              <div className="space-y-3">
                {state.questions.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-[#181B26] border border-[#242938] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                        Destinatário: {q.target}
                      </span>
                      <h4 className="text-sm font-semibold text-white">{q.question}</h4>
                      <p className="text-xs text-slate-400">{q.context}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleQuestion(q.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 border transition ${
                        q.status === 'RESPONDIDA'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700'
                          : 'bg-amber-950/60 text-amber-300 border-amber-700'
                      }`}
                    >
                      {q.status === 'RESPONDIDA' ? 'Validada ✓' : 'Pendente Reunião'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL NATIVO <dialog> PARA CRIAR / EDITAR TAREFA */}
      <dialog
        ref={taskDialogRef}
        aria-labelledby="task-dialog-title"
        {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        className="bg-[#12141D] text-slate-100 border border-[#262B3D] rounded-2xl max-w-md w-full p-6 shadow-2xl backdrop:bg-black/75"
      >
        <h3 id="task-dialog-title" className="text-lg font-bold text-white mb-4">
          {editingTaskId
            ? 'Editar Tarefa do Plano de Trabalho'
            : 'Adicionar Tarefa ao Plano de Trabalho'}
        </h3>
        <form onSubmit={handleSaveTask} className="space-y-3.5 text-xs">
          <div>
            <label htmlFor="task-title-input" className="block text-slate-400 mb-1">
              Título da Entrega
            </label>
            <input
              id="task-title-input"
              type="text"
              required
              autoFocus
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Ex: Exportar protótipo WebXR da maquete recortada"
              className="w-full bg-[#191C28] border border-[#2B3147] rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label htmlFor="task-desc-input" className="block text-slate-400 mb-1">
              Descrição Técnica
            </label>
            <textarea
              id="task-desc-input"
              rows={3}
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              placeholder="Detalhes do que será validado na Sala D29 ou junto ao Fred..."
              className="w-full bg-[#191C28] border border-[#2B3147] rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="task-phase-select" className="block text-slate-400 mb-1">
                Fase
              </label>
              <select
                id="task-phase-select"
                value={newTaskPhase}
                onChange={(e) => setNewTaskPhase(e.target.value as TaskPhase)}
                className="w-full bg-[#191C28] border border-[#2B3147] rounded-lg px-2.5 py-2 text-white"
              >
                <option value="FASE_0">Fase 0 (Inventário)</option>
                <option value="FASE_1">Fase 1 (Janeiro MR)</option>
                <option value="FASE_2">Fase 2 (5G + IA)</option>
              </select>
            </div>

            <div>
              <label htmlFor="task-priority-select" className="block text-slate-400 mb-1">
                Prioridade
              </label>
              <select
                id="task-priority-select"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                className="w-full bg-[#191C28] border border-[#2B3147] rounded-lg px-2.5 py-2 text-white"
              >
                <option value="CRITICA">Crítica</option>
                <option value="OBRIGATORIA_JAN">Obrigatória Jan/27</option>
                <option value="DESEJAVEL_STRETCH">Stretch Goal</option>
                <option value="ETAPA_2">Etapa 2</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="task-assignee-select" className="block text-slate-400 mb-1">
              Responsável Principal
            </label>
            <select
              id="task-assignee-select"
              value={newTaskAssignee}
              onChange={(e) => setNewTaskAssignee(e.target.value)}
              className="w-full bg-[#191C28] border border-[#2B3147] rounded-lg px-2.5 py-2 text-white"
            >
              <option value="A definir pelo grupo">A definir pelo grupo</option>
              <option value="Equipe GT_Splice">Equipe GT_Splice</option>
              {state.team.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400"
            >
              {editingTaskId ? 'Atualizar Tarefa' : 'Salvar Tarefa'}
            </button>
          </div>
        </form>
      </dialog>

      {/* MODAL NATIVO <dialog> PARA NOVO ATIVO DE INVENTÁRIO */}
      <dialog
        ref={assetDialogRef}
        aria-labelledby="asset-dialog-title"
        {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        className="bg-[#12141D] text-slate-100 border border-[#262B3D] rounded-2xl max-w-md w-full p-6 shadow-2xl backdrop:bg-black/75"
      >
        <h3 id="asset-dialog-title" className="text-lg font-bold text-white mb-4">
          Catalogar Novo Ativo no Inventário Unity
        </h3>
        <form onSubmit={handleCreateAsset} className="space-y-3.5 text-xs">
          <div>
            <label htmlFor="asset-name-input" className="block text-slate-400 mb-1">
              Nome do Ativo / Repositório
            </label>
            <input
              id="asset-name-input"
              type="text"
              required
              autoFocus
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
              placeholder="Ex: Scripts WebRTC / Malha Viária FBX"
              className="w-full bg-[#191C28] border border-[#2B3147] rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="asset-origin-input" className="block text-slate-400 mb-1">
                Origem
              </label>
              <input
                id="asset-origin-input"
                type="text"
                value={newAssetOrigin}
                onChange={(e) => setNewAssetOrigin(e.target.value)}
                placeholder="Ex: Capacitação Splice / LIGA"
                className="w-full bg-[#191C28] border border-[#2B3147] rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label htmlFor="asset-owner-select" className="block text-slate-400 mb-1">
                Focal / Responsável
              </label>
              <select
                id="asset-owner-select"
                value={newAssetOwner}
                onChange={(e) => setNewAssetOwner(e.target.value)}
                className="w-full bg-[#191C28] border border-[#2B3147] rounded-lg px-2.5 py-2 text-white"
              >
                <option value="Equipe GT_Splice">Equipe GT_Splice</option>
                <option value="A definir pelo grupo">A definir pelo grupo</option>
                {state.team.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="asset-use-input" className="block text-slate-400 mb-1">
              Uso Pretendido na Unity
            </label>
            <textarea
              id="asset-use-input"
              rows={2}
              value={newAssetUse}
              onChange={(e) => setNewAssetUse(e.target.value)}
              placeholder="Como este artefato será aproveitado na cena MR..."
              className="w-full bg-[#191C28] border border-[#2B3147] rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label htmlFor="asset-notes-input" className="block text-slate-400 mb-1">
              Observações / Links
            </label>
            <input
              id="asset-notes-input"
              type="text"
              value={newAssetNotes}
              onChange={(e) => setNewAssetNotes(e.target.value)}
              placeholder="Ex: Validar com Prof. Fred na próxima aula"
              className="w-full bg-[#191C28] border border-[#2B3147] rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => assetDialogRef.current?.close()}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400"
            >
              Adicionar ao Inventário
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
