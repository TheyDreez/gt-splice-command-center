'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Radar,
  Kanban,
  BookOpen,
  Users,
  Download,
  Upload,
  RotateCcw,
  Plus,
  CheckCircle2,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Trash2,
  List,
  Columns3,
  Edit3,
  Calendar,
  Check,
  Target,
  Search,
  Video,
  Radio,
  Route
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

type ActiveTab = 'DASHBOARD' | 'KANBAN' | 'MATERIAIS' | 'EQUIPE';

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; badgeClass: string; borderHover: string }
> = {
  PENDENTE: {
    label: 'Pendente',
    badgeClass: 'bg-[#132038] text-slate-300 border-[#23385E]',
    borderHover: 'hover:border-slate-500/60'
  },
  EM_ANDAMENTO: {
    label: 'Em Andamento',
    badgeClass: 'bg-[#004B8D]/40 text-sky-300 border-[#0066CC]/60',
    borderHover: 'hover:border-sky-500/50'
  },
  CONCLUIDO: {
    label: 'Concluído',
    badgeClass: 'bg-[#00A859]/25 text-emerald-300 border-[#00A859]/60',
    borderHover: 'hover:border-emerald-500/50'
  }
};

export default function GTSpliceCommandCenter() {
  const [state, setState] = useState<ProjectState>(INITIAL_PROJECT_STATE);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('DASHBOARD');

  // Filtros e Visão do Kanban
  const [kanbanViewMode, setKanbanViewMode] = useState<'BOARD' | 'LIST'>('BOARD');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Modal de Criar / Editar Tarefa (<dialog>)
  const taskDialogRef = useRef<HTMLDialogElement | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStage, setTaskStage] = useState('Fase 1: Entrega MR Janeiro/27');
  const [taskAssignee, setTaskAssignee] = useState('A definir pelo grupo');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('PENDENTE');
  const [taskNotes, setTaskNotes] = useState('');

  // Modal de Material de Estudo (<dialog>)
  const materialDialogRef = useRef<HTMLDialogElement | null>(null);
  const [matTitle, setMatTitle] = useState('');
  const [matType, setMatType] = useState('Documento Técnico');
  const [matSharedBy, setMatSharedBy] = useState('Equipe GT_Splice');
  const [matRefOrUrl, setMatRefOrUrl] = useState('');
  const [matNotes, setMatNotes] = useState('');

  // Edição inline dos membros da equipe
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loaded = loadProjectState();
    setState(loaded);
    setMounted(true);
  }, []);

  const updateState = (updater: (prev: ProjectState) => ProjectState) => {
    setState((prev) => {
      const next = updater(prev);
      saveProjectState(next);
      return next;
    });
  };

  // Ações de Tarefas
  const openCreateTaskModal = () => {
    setEditingTaskId(null);
    setTaskTitle('');
    setTaskStage('Fase 1: Entrega MR Janeiro/27');
    setTaskAssignee('A definir pelo grupo');
    setTaskStatus('PENDENTE');
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

  const closeTaskModal = () => {
    taskDialogRef.current?.close();
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
                stage: taskStage.trim(),
                assignee: taskAssignee,
                status: taskStatus,
                notes: taskNotes.trim()
              }
            : t
        )
      }));
    } else {
      const newTask: ProjectTask = {
        id: `t-${Date.now()}`,
        title: taskTitle.trim(),
        stage: taskStage.trim(),
        assignee: taskAssignee,
        status: taskStatus,
        notes: taskNotes.trim()
      };
      updateState((prev) => ({
        ...prev,
        tasks: [newTask, ...prev.tasks]
      }));
    }

    setEditingTaskId(null);
    closeTaskModal();
  };

  const handlePromoteGoalToTask = (itemText: string, groupTitle: string) => {
    const newTask: ProjectTask = {
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      title: itemText,
      stage: groupTitle,
      assignee: 'A definir pelo grupo',
      status: 'PENDENTE',
      notes: 'Criada a partir das Metas Oficiais do Kickoff.'
    };
    updateState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));
    setActiveTab('KANBAN');
  };

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    }));
  };

  const handleTaskAssigneeChange = (taskId: string, newAssignee: string) => {
    updateState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, assignee: newAssignee } : t))
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    updateState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId)
    }));
  };

  // Ações de Materiais de Estudo
  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim()) return;
    const newMat: StudyMaterial = {
      id: `mat-${Date.now()}`,
      title: matTitle.trim(),
      type: matType.trim(),
      sharedBy: matSharedBy,
      referenceOrUrl: matRefOrUrl.trim() || 'Referência técnica compartilhada no grupo',
      notes: matNotes.trim()
    };
    updateState((prev) => ({
      ...prev,
      materials: [...prev.materials, newMat]
    }));
    setMatTitle('');
    setMatType('Documento Técnico');
    setMatSharedBy('Equipe GT_Splice');
    setMatRefOrUrl('');
    setMatNotes('');
    materialDialogRef.current?.close();
  };

  const handleMaterialSharedByChange = (matId: string, sharedBy: string) => {
    updateState((prev) => ({
      ...prev,
      materials: prev.materials.map((m) => (m.id === matId ? { ...m, sharedBy } : m))
    }));
  };

  const handleDeleteMaterial = (matId: string) => {
    updateState((prev) => ({
      ...prev,
      materials: prev.materials.filter((m) => m.id !== matId)
    }));
  };

  // Ações de Equipe (Edição Inline)
  const handleUpdateMember = (id: string, updates: Partial<TeamMember>) => {
    updateState((prev) => ({
      ...prev,
      team: prev.team.map((m) => (m.id === id ? { ...m, ...updates } : m))
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
        if (parsed.tasks && parsed.team && parsed.goals) {
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
      <div className="min-h-screen bg-[#070D17] text-slate-200 flex items-center justify-center">
        <div className="animate-pulse text-[#00A859] font-mono text-sm">
          Inicializando GT_Splice Command Center...
        </div>
      </div>
    );
  }

  // Métricas
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter((t) => t.status === 'CONCLUIDO').length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const deadlineJan2027 = new Date('2027-01-31T23:59:59-03:00').getTime();
  const daysUntilMarco1 = Math.max(
    0,
    Math.ceil((deadlineJan2027 - Date.now()) / (1000 * 60 * 60 * 24))
  );

  const sortedTeam = [...state.team].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR')
  );

  const availableStages = Array.from(new Set(state.tasks.map((t) => t.stage)));

  const filteredTasks = state.tasks.filter((task) => {
    const matchStage = selectedStage === 'ALL' || task.stage === selectedStage;
    const matchAssignee =
      selectedAssignee === 'ALL' ||
      task.assignee.toLowerCase().includes(selectedAssignee.toLowerCase());
    const matchQuery =
      searchQuery.trim() === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStage && matchAssignee && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#070D17] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* SIDEBAR : IDENTIDADE VISUAL SPLICE SMART SOLUTIONS (AZUL #004B8D + VERDE SIIS #00A859) */}
      <aside className="w-full md:w-72 bg-[#0C1524] border-b md:border-b-0 md:border-r border-[#1B2B48] flex flex-col justify-between p-5 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#004B8D] to-[#00A859] flex items-center justify-center shadow-lg shadow-[#004B8D]/25">
              <Radar className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#00A859] block">
                TIC 51 • Facens & Splice
              </span>
              <h1 className="text-lg font-bold tracking-tight text-white">
                GT_Splice CCO
              </h1>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('DASHBOARD')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'DASHBOARD'
                  ? 'bg-[#004B8D]/30 text-white border border-[#0066CC]/50'
                  : 'text-slate-400 hover:bg-[#111D32] hover:text-slate-200'
              }`}
            >
              <Target className="w-4 h-4 text-[#00A859]" />
              Metas Oficiais (Kickoff)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('MATERIAIS')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'MATERIAIS'
                  ? 'bg-[#004B8D]/30 text-white border border-[#0066CC]/50'
                  : 'text-slate-400 hover:bg-[#111D32] hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-sky-400" />
                Materiais de Estudo
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#132038] text-slate-300 border border-[#1E3256]">
                {state.materials.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('KANBAN')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'KANBAN'
                  ? 'bg-[#004B8D]/30 text-white border border-[#0066CC]/50'
                  : 'text-slate-400 hover:bg-[#111D32] hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-3">
                <Kanban className="w-4 h-4 text-amber-400" />
                Plano de Trabalho
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#132038] text-slate-300 border border-[#1E3256]">
                {completedTasks}/{totalTasks}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('EQUIPE')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'EQUIPE'
                  ? 'bg-[#004B8D]/30 text-white border border-[#0066CC]/50'
                  : 'text-slate-400 hover:bg-[#111D32] hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-3">
                <Users className="w-4 h-4 text-emerald-400" />
                Equipe GT_Splice (A-Z)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#132038] text-slate-300 border border-[#1E3256]">
                {state.team.length}
              </span>
            </button>
          </nav>

          {/* INFRAESTRUTURA FACENS */}
          <div className="mt-6 p-3.5 rounded-xl bg-[#111D32]/80 border border-[#1B2B48] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
              <MapPin className="w-3.5 h-3.5 text-[#00A859]" />
              Espaços & Canais Facens
            </div>
            <div className="text-[11px] text-slate-300 space-y-1 leading-relaxed">
              <div>• <strong>Sala D29:</strong> Máquina potente (Unity)</div>
              <div>• <strong>Sala 13:</strong> Bancada e monitores</div>
              <div>• <strong>Teams:</strong> Canal <code className="text-[#00A859]">GT_Splice</code></div>
            </div>
          </div>
        </div>

        {/* BACKUP & RESTAURAÇÃO */}
        <div className="mt-8 pt-4 border-t border-[#1B2B48] space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
            Sincronização & Backup
          </div>
          <button
            type="button"
            onClick={() => exportStateAsJson(state)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#111D32] hover:bg-[#162642] text-xs font-medium text-slate-200 border border-[#213559] transition"
          >
            <Download className="w-3.5 h-3.5 text-[#00A859]" />
            Exportar JSON
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#111D32] hover:bg-[#162642] text-xs font-medium text-slate-200 border border-[#213559] transition"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            Importar JSON
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
              if (confirm('Restaurar dados originais do projeto?')) {
                setState(resetToSeedState());
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-[11px] text-slate-500 hover:text-rose-400 transition"
          >
            <RotateCcw className="w-3 h-3" />
            Resetar Seed
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {/* CABEÇALHO SUPERIOR */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#1B2B48]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#00A859] font-mono mb-1">
              <span className="inline-flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" />
                RESIDÊNCIA TIC 51
              </span>
              <span>•</span>
              <span className="text-sky-400">REALIDADE MISTA (MR) EM BROWSER</span>
              <span>•</span>
              <span className="text-slate-300">UNITY & 5G</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Desafio Splice: Campus Facens em Realidade Mista
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* MARCO 1 */}
            <div className="bg-[#0C1524] border border-[#004B8D]/60 px-3.5 py-2 rounded-xl flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#00A859]" />
              <div>
                <span className="text-[10px] font-mono uppercase text-sky-300 block">
                  Marco 1: Janeiro/2027 (MR Browser)
                </span>
                <span className="text-xs font-bold text-white">
                  Faltam {daysUntilMarco1} dias • Prazo Inegociável
                </span>
              </div>
            </div>

            <div className="bg-[#0C1524] border border-[#1B2B48] px-4 py-2 rounded-xl">
              <span className="text-[11px] text-slate-400 block">Progresso Geral</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#00A859]">{overallProgress}%</span>
                <div className="w-24 h-2 bg-[#132038] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#004B8D] to-[#00A859]"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={openCreateTaskModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#004B8D] to-[#00A859] hover:from-[#0059A8] hover:to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-[#004B8D]/25 transition"
            >
              <Plus className="w-4 h-4" />
              Nova Tarefa
            </button>
          </div>
        </header>

        {/* ABA 1: METAS OFICIAIS */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* FAIXA DE PILARES OFICIAIS SPLICE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-[#0C1524] border border-[#1B2B48] rounded-2xl p-4 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#004B8D]/25 border border-[#0066CC]/40 text-sky-300">
                  <Route className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-sky-400 block">
                    Recorte 3D
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    Viário & Spots Clicáveis
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Focar no sistema viário e destacar postes e câmeras no modelo 3D.
                  </p>
                </div>
              </div>

              <div className="bg-[#0C1524] border border-[#1B2B48] rounded-2xl p-4 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#00A859]/20 border border-[#00A859]/40 text-[#00A859]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#00A859] block">
                    Validação Unity
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    Inventário + Prof. Fred
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Cruzar material da capacitação Splice com a Unity antes de codificar.
                  </p>
                </div>
              </div>

              <div className="bg-[#0C1524] border border-[#1B2B48] rounded-2xl p-4 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-amber-300 block">
                    Performance MR
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    Polígonos, Sombras & D29
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Reduzir árvores do entorno e testar sombras/animações na Sala D29.
                  </p>
                </div>
              </div>

              <div className="bg-[#0C1524] border border-[#1B2B48] rounded-2xl p-4 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/40 text-sky-300">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-sky-300 block">
                    Etapa 2 (Pós-Janeiro)
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    Real-Time 5G & IA
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Conexão ao vivo com câmeras + vestimenta, faixa etária e gênero.
                  </p>
                </div>
              </div>
            </div>

            {/* CARDS DAS METAS OFICIAIS (state.goals) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-[#00A859]" />
                <h3 className="text-base font-bold text-white">
                  Metas Oficiais do Kickoff (Clique em + Tarefa para puxar para o Plano de Trabalho)
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {state.goals.map((goal, index) => (
                  <div
                    key={goal.id}
                    className="bg-[#0C1524] border border-[#1B2B48] rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2 pb-2 border-b border-[#1B2B48]">
                        <span className="text-[#00A859] font-semibold">
                          BLOCO 0{index + 1}
                        </span>
                        <span>{goal.items.length} diretrizes</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-3">
                        {goal.title}
                      </h4>

                      <ul className="space-y-2.5 text-xs text-slate-200">
                        {goal.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-[#111D32]/60 border border-[#1B2B48] hover:border-[#004B8D] transition"
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="w-2 h-2 rounded-full bg-[#00A859] shrink-0 mt-1.5" />
                              <span className="leading-relaxed">{item}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handlePromoteGoalToTask(item, goal.title)}
                              className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#004B8D]/40 hover:bg-[#004B8D] text-[10px] font-mono text-sky-200 border border-[#0066CC]/50 transition"
                              title="Transformar em tarefa no quadro"
                            >
                              <Plus className="w-3 h-3" />
                              Tarefa
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: KANBAN & PLANO DE TRABALHO */}
        {activeTab === 'KANBAN' && (
          <div className="space-y-5">
            {/* BARRA DE FILTROS & BUSCA */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0C1524] p-4 rounded-2xl border border-[#1B2B48]">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar tarefas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#111D32] text-xs text-slate-200 pl-8 pr-3 py-2 rounded-lg border border-[#213559] focus:outline-none focus:border-[#00A859]"
                  />
                </div>

                <select
                  aria-label="Filtrar por Etapa"
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="bg-[#111D32] text-xs text-slate-200 px-3 py-2 rounded-lg border border-[#213559]"
                >
                  <option value="ALL">Todas as Etapas</option>
                  {availableStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Filtrar por Responsável"
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className="bg-[#111D32] text-xs text-slate-200 px-3 py-2 rounded-lg border border-[#213559]"
                >
                  <option value="ALL">Todos os Responsáveis</option>
                  <option value="A definir">A definir pelo grupo</option>
                  {sortedTeam.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-[#111D32] p-1 rounded-xl border border-[#213559]">
                <button
                  type="button"
                  onClick={() => setKanbanViewMode('BOARD')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    kanbanViewMode === 'BOARD'
                      ? 'bg-[#004B8D] text-white'
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
                      ? 'bg-[#004B8D] text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  Lista
                </button>
              </div>
            </div>

            {/* VISÃO EM COLUNAS */}
            {kanbanViewMode === 'BOARD' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO'] as TaskStatus[]).map(
                  (statusKey) => {
                    const colTasks = filteredTasks.filter((t) => t.status === statusKey);
                    return (
                      <div
                        key={statusKey}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedTaskId) {
                            handleTaskStatusChange(draggedTaskId, statusKey);
                            setDraggedTaskId(null);
                          }
                        }}
                        className="bg-[#0C1524] border border-[#1B2B48] rounded-2xl p-4 flex flex-col min-h-[460px]"
                      >
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1B2B48]">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${STATUS_CONFIG[statusKey].badgeClass}`}
                          >
                            {STATUS_CONFIG[statusKey].label}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {colTasks.length}
                          </span>
                        </div>

                        {colTasks.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#1B2B48] rounded-xl">
                            <p className="text-xs text-slate-400 mb-2">
                              Nenhuma tarefa em {STATUS_CONFIG[statusKey].label}.
                            </p>
                            <button
                              type="button"
                              onClick={openCreateTaskModal}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111D32] hover:bg-[#162642] text-xs text-sky-300 border border-[#213559] transition"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Nova Tarefa
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3 flex-1">
                            {colTasks.map((task) => (
                              <div
                                key={task.id}
                                draggable
                                onDragStart={() => setDraggedTaskId(task.id)}
                                onDragEnd={() => setDraggedTaskId(null)}
                                className={`bg-[#111D32] border border-[#1E3256] ${STATUS_CONFIG[statusKey].borderHover} rounded-xl p-3.5 space-y-2.5 transition cursor-grab active:cursor-grabbing`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0C1524] text-[#00A859] border border-[#1B2B48]">
                                    {task.stage}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => openEditTaskModal(task)}
                                      className="text-slate-400 hover:text-sky-300 transition"
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

                                {task.notes && (
                                  <p className="text-[11px] text-slate-300 leading-relaxed">
                                    {task.notes}
                                  </p>
                                )}

                                <div className="pt-1 flex items-center justify-between gap-1">
                                  <span className="text-[10px] text-slate-400">Resp:</span>
                                  <select
                                    aria-label={`Responsável por ${task.title}`}
                                    value={task.assignee}
                                    onChange={(e) =>
                                      handleTaskAssigneeChange(task.id, e.target.value)
                                    }
                                    className="bg-[#0C1524] text-[10px] text-sky-300 px-2 py-0.5 rounded border border-[#213559] max-w-[170px] truncate"
                                  >
                                    <option value="A definir pelo grupo">
                                      A definir pelo grupo
                                    </option>
                                    {sortedTeam.map((m) => (
                                      <option key={m.id} value={m.name}>
                                        {m.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="pt-2 border-t border-[#1B2B48]">
                                  <select
                                    aria-label={`Mudar status de ${task.title}`}
                                    value={task.status}
                                    onChange={(e) =>
                                      handleTaskStatusChange(
                                        task.id,
                                        e.target.value as TaskStatus
                                      )
                                    }
                                    className="w-full bg-[#0C1524] text-[11px] text-[#00A859] px-2 py-1 rounded border border-[#213559]"
                                  >
                                    <option value="PENDENTE">Mover: Pendente</option>
                                    <option value="EM_ANDAMENTO">
                                      Mover: Em Andamento
                                    </option>
                                    <option value="CONCLUIDO">Mover: Concluído</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              /* VISÃO EM LISTA */
              <div className="bg-[#0C1524] border border-[#1B2B48] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#111D32] text-slate-300 border-b border-[#1B2B48]">
                        <th className="p-3.5">Tarefa</th>
                        <th className="p-3.5">Etapa</th>
                        <th className="p-3.5">Responsável</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1B2B48]">
                      {filteredTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-[#111D32]/60">
                          <td className="p-3.5 font-semibold text-white max-w-md">
                            {task.title}
                            {task.notes && (
                              <span className="block text-[11px] text-slate-400 font-normal mt-0.5">
                                {task.notes}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 font-mono text-[#00A859]">
                            {task.stage}
                          </td>
                          <td className="p-3.5">
                            <select
                              aria-label={`Responsável por ${task.title}`}
                              value={task.assignee}
                              onChange={(e) =>
                                handleTaskAssigneeChange(task.id, e.target.value)
                              }
                              className="bg-[#111D32] text-xs text-sky-300 px-2.5 py-1.5 rounded-lg border border-[#213559]"
                            >
                              <option value="A definir pelo grupo">
                                A definir pelo grupo
                              </option>
                              {sortedTeam.map((m) => (
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
                                handleTaskStatusChange(
                                  task.id,
                                  e.target.value as TaskStatus
                                )
                              }
                              className="bg-[#111D32] text-xs text-slate-200 px-2.5 py-1.5 rounded-lg border border-[#213559]"
                            >
                              <option value="PENDENTE">Pendente</option>
                              <option value="EM_ANDAMENTO">Em Andamento</option>
                              <option value="CONCLUIDO">Concluído</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditTaskModal(task)}
                                className="text-slate-400 hover:text-sky-300"
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

        {/* ABA 3: MATERIAIS DE ESTUDO & INVENTÁRIO */}
        {activeTab === 'MATERIAIS' && (
          <div className="space-y-6">
            <div className="bg-[#0C1524] border border-[#1B2B48] rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-[#1B2B48] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Acervo & Materiais de Estudo do Projeto
                  </h3>
                  <p className="text-xs text-slate-400">
                    Apresentações, repositórios legados, especificações ópticas e documentos técnicos compartilhados.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => materialDialogRef.current?.showModal()}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#004B8D] hover:bg-[#0059A8] text-white text-xs font-semibold border border-sky-400/30 transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Novo Material
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#111D32] text-slate-300 border-b border-[#1B2B48]">
                      <th className="p-3.5">Título / Material</th>
                      <th className="p-3.5">Tipo</th>
                      <th className="p-3.5">Compartilhado por</th>
                      <th className="p-3.5">Referência / URL</th>
                      <th className="p-3.5">Notas & Relevância</th>
                      <th className="p-3.5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B2B48]">
                    {state.materials.map((mat) => (
                      <tr key={mat.id} className="hover:bg-[#111D32]/60">
                        <td className="p-3.5 font-semibold text-white max-w-xs">
                          {mat.title}
                        </td>
                        <td className="p-3.5 text-sky-300 font-mono">{mat.type}</td>
                        <td className="p-3.5">
                          <select
                            aria-label={`Responsável por ${mat.title}`}
                            value={mat.sharedBy}
                            onChange={(e) =>
                              handleMaterialSharedByChange(mat.id, e.target.value)
                            }
                            className="bg-[#111D32] text-xs text-[#00A859] px-2 py-1 rounded border border-[#213559]"
                          >
                            <option value="Equipe GT_Splice">Equipe GT_Splice</option>
                            {sortedTeam.map((m) => (
                              <option key={m.id} value={m.name}>
                                {m.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3.5 font-mono text-sky-300 max-w-xs truncate">
                          {mat.referenceOrUrl.startsWith('http') ? (
                            <a
                              href={mat.referenceOrUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {mat.referenceOrUrl}
                            </a>
                          ) : (
                            mat.referenceOrUrl
                          )}
                        </td>
                        <td className="p-3.5 text-slate-300 max-w-sm">
                          {mat.notes}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteMaterial(mat.id)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                            title="Remover material"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ABA 4: EQUIPE GT_SPLICE */}
        {activeTab === 'EQUIPE' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white">
                  Integrantes do Grupo GT_Splice Facens
                </h3>
                <p className="text-xs text-slate-400">
                  Lista em ordem alfabética. Clique em Editar para registrar notas, links de repositório e contatos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedTeam.map((member) => {
                const isEditing = editingMemberId === member.id;
                return (
                  <div
                    key={member.id}
                    className={`bg-[#0C1524] border rounded-2xl p-5 flex flex-col justify-between transition ${
                      isEditing
                        ? 'border-[#00A859] ring-1 ring-[#00A859]/30'
                        : 'border-[#1B2B48]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-base font-bold text-white">{member.name}</h4>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingMemberId(isEditing ? null : member.id)
                          }
                          className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border transition font-medium ${
                            isEditing
                              ? 'bg-[#00A859]/20 text-emerald-300 border-[#00A859]/50'
                              : 'bg-[#111D32] text-slate-300 hover:text-white border-[#213559]'
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
                              Notas & Preferências
                            </label>
                            <textarea
                              rows={3}
                              value={member.notes}
                              onChange={(e) =>
                                handleUpdateMember(member.id, { notes: e.target.value })
                              }
                              placeholder="Descreva seu foco ou notas no grupo..."
                              className="w-full bg-[#111D32] border border-[#213559] rounded-lg px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <div>
                              <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
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
                                className="w-full bg-[#111D32] border border-[#213559] rounded-lg px-2.5 py-1.5 text-xs text-white"
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
                                  handleUpdateMember(member.id, {
                                    email: e.target.value
                                  })
                                }
                                placeholder="nome@exemplo.com"
                                className="w-full bg-[#111D32] border border-[#213559] rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                          {member.notes || 'Atuação e foco a definir pelo grupo.'}
                        </p>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-[#1B2B48]">
                        {member.github ? (
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-[#00A859] hover:text-emerald-300 font-mono"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {member.github.replace('https://github.com/', '@')}
                          </a>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500">
                            GitHub não informado
                          </span>
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
          </div>
        )}
      </main>

      {/* MODAL PARA CRIAR / EDITAR TAREFA */}
      <dialog
        ref={taskDialogRef}
        className="bg-[#0C1524] text-slate-100 border border-[#213559] rounded-2xl max-w-md w-full p-6 shadow-2xl backdrop:bg-black/75"
      >
        <h3 className="text-lg font-bold text-white mb-4">
          {editingTaskId ? 'Editar Tarefa' : 'Adicionar Tarefa ao Plano de Trabalho'}
        </h3>
        <form onSubmit={handleSaveTask} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Título da Tarefa</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Ex: Nivelamento Unity e exportação WebGL"
              className="w-full bg-[#111D32] border border-[#213559] rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Etapa / Fase</label>
            <input
              type="text"
              required
              value={taskStage}
              onChange={(e) => setTaskStage(e.target.value)}
              placeholder="Ex: Fase 1: Entrega MR Janeiro/27"
              className="w-full bg-[#111D32] border border-[#213559] rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Responsável</label>
              <select
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
                className="w-full bg-[#111D32] border border-[#213559] rounded-lg px-2.5 py-2 text-white"
              >
                <option value="A definir pelo grupo">A definir pelo grupo</option>
                {sortedTeam.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Status</label>
              <select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                className="w-full bg-[#111D32] border border-[#213559] rounded-lg px-2.5 py-2 text-white"
              >
                <option value="PENDENTE">Pendente</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="CONCLUIDO">Concluído</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Notas e Detalhes</label>
            <textarea
              rows={3}
              value={taskNotes}
              onChange={(e) => setTaskNotes(e.target.value)}
              placeholder="Critérios de aceitação, testes na Sala D29, links..."
              className="w-full bg-[#111D32] border border-[#213559] rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2 rounded-lg bg-[#111D32] text-slate-300 hover:bg-[#162642]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#00A859] text-slate-950 font-semibold hover:bg-emerald-400"
            >
              {editingTaskId ? 'Atualizar Tarefa' : 'Salvar Tarefa'}
            </button>
          </div>
        </form>
      </dialog>

      {/* MODAL PARA NOVO MATERIAL DE ESTUDO */}
      <dialog
        ref={materialDialogRef}
        className="bg-[#0C1524] text-slate-100 border border-[#213559] rounded-2xl max-w-md w-full p-6 shadow-2xl backdrop:bg-black/75"
      >
        <h3 className="text-lg font-bold text-white mb-4">
          Catalogar Novo Material de Estudo
        </h3>
        <form onSubmit={handleSaveMaterial} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Título do Material</label>
            <input
              type="text"
              required
              value={matTitle}
              onChange={(e) => setMatTitle(e.target.value)}
              placeholder="Ex: Tutorial WebXR Unity / PDF Malha Viva"
              className="w-full bg-[#111D32] border border-[#213559] rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Tipo</label>
              <input
                type="text"
                value={matType}
                onChange={(e) => setMatType(e.target.value)}
                placeholder="Ex: Repositório, Modelo 3D, PDF..."
                className="w-full bg-[#111D32] border border-[#213559] rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Compartilhado por</label>
              <select
                value={matSharedBy}
                onChange={(e) => setMatSharedBy(e.target.value)}
                className="w-full bg-[#111D32] border border-[#213559] rounded-lg px-2.5 py-2 text-white"
              >
                <option value="Equipe GT_Splice">Equipe GT_Splice</option>
                {sortedTeam.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Referência ou URL</label>
            <input
              type="text"
              value={matRefOrUrl}
              onChange={(e) => setMatRefOrUrl(e.target.value)}
              placeholder="https://... ou nome do arquivo compartilhado"
              className="w-full bg-[#111D32] border border-[#213559] rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Notas & Relevância</label>
            <textarea
              rows={2}
              value={matNotes}
              onChange={(e) => setMatNotes(e.target.value)}
              placeholder="Como esse material auxilia as entregas da Residência..."
              className="w-full bg-[#111D32] border border-[#213559] rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => materialDialogRef.current?.close()}
              className="px-4 py-2 rounded-lg bg-[#111D32] text-slate-300 hover:bg-[#162642]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#00A859] text-slate-950 font-semibold hover:bg-emerald-400"
            >
              Salvar Material
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}