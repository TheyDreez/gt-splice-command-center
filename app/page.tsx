'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProjectState, ProjectTask, StudyMaterial, TaskStatus } from '@/types/project';
import { INITIAL_PROJECT_STATE } from '@/lib/seed-data';
import { loadProjectState, saveProjectState, resetToSeedState, exportStateAsJson } from '@/lib/storage';

type Tab = 'METAS' | 'ESTUDO' | 'TAREFAS' | 'EQUIPE';

export default function WorkspacePage() {
  const [state, setState] = useState<ProjectState>(INITIAL_PROJECT_STATE);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('METAS');

  // Campos de Nova Tarefa
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStage, setTaskStage] = useState('Entrega 1 (Janeiro)');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskNotes, setTaskNotes] = useState('');

  // Campos de Novo Material de Estudo
  const [matTitle, setMatTitle] = useState('');
  const [matType, setMatType] = useState('Documento / Link');
  const [matSharedBy, setMatSharedBy] = useState('');
  const [matUrl, setMatUrl] = useState('');
  const [matNotes, setMatNotes] = useState('');

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

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      title: taskTitle.trim(),
      stage: taskStage.trim() || 'Geral',
      assignee: taskAssignee.trim() || 'Em aberto',
      status: 'PENDENTE',
      notes: taskNotes.trim()
    };
    updateState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
    setTaskTitle('');
    setTaskAssignee('');
    setTaskNotes('');
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

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim()) return;
    const newMat: StudyMaterial = {
      id: `mat-${Date.now()}`,
      title: matTitle.trim(),
      type: matType.trim() || 'Referência',
      sharedBy: matSharedBy.trim() || '-',
      referenceOrUrl: matUrl.trim() || '-',
      notes: matNotes.trim()
    };
    updateState((prev) => ({
      ...prev,
      materials: [...prev.materials, newMat]
    }));
    setMatTitle('');
    setMatSharedBy('');
    setMatUrl('');
    setMatNotes('');
  };

  const handleDeleteMaterial = (id: string) => {
    updateState((prev) => ({
      ...prev,
      materials: prev.materials.filter((m) => m.id !== id)
    }));
  };

  const handleUpdateMember = (
    id: string,
    field: 'notes' | 'github' | 'email',
    value: string
  ) => {
    updateState((prev) => ({
      ...prev,
      team: prev.team.map((m) => (m.id === id ? { ...m, [field]: value } : m))
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans">
      <header className="border-b border-neutral-800 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-sm font-semibold text-neutral-100 tracking-tight">
              GT_Splice Facens
            </h1>
            <p className="text-xs text-neutral-500">
              Residência TIC 51: Ambiente de Estudo e Plano de Trabalho
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => exportStateAsJson(state)}
              className="px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition"
            >
              Exportar JSON
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition"
            >
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
                if (confirm('Restaurar dados iniciais e limpar tarefas locais?')) {
                  setState(resetToSeedState());
                }
              }}
              className="px-2.5 py-1.5 rounded text-neutral-500 hover:text-neutral-300 transition"
            >
              Resetar
            </button>
          </div>
        </div>

        <nav className="max-w-6xl mx-auto px-6 flex gap-6 text-xs font-medium border-t border-neutral-900">
          {(
            [
              { id: 'METAS', label: 'Metas Oficiais' },
              { id: 'ESTUDO', label: `Material de Estudo (${state.materials.length})` },
              { id: 'TAREFAS', label: `Plano de Trabalho (${state.tasks.length})` },
              { id: 'EQUIPE', label: 'Integrantes (A-Z)' }
            ] as { id: Tab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-neutral-100 text-neutral-100'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'METAS' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.goals.map((group) => (
                <div
                  key={group.id}
                  className="border border-neutral-800 bg-[#111111] rounded-md p-5"
                >
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 pb-2 border-b border-neutral-800">
                    {group.title}
                  </h2>
                  <ul className="space-y-2 text-xs text-neutral-300 list-disc pl-4">
                    {group.items.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ESTUDO' && (
          <div className="space-y-6">
            <div className="border border-neutral-800 bg-[#111111] rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 bg-[#141414]">
                      <th className="p-3 font-medium">Material / Arquivo</th>
                      <th className="p-3 font-medium">Tipo</th>
                      <th className="p-3 font-medium">Enviado por</th>
                      <th className="p-3 font-medium">Referência / Link</th>
                      <th className="p-3 font-medium">Notas</th>
                      <th className="p-3 font-medium w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {state.materials.map((mat) => (
                      <tr key={mat.id} className="hover:bg-neutral-900/40">
                        <td className="p-3 font-medium text-neutral-100">
                          {mat.title}
                        </td>
                        <td className="p-3 text-neutral-400">{mat.type}</td>
                        <td className="p-3 text-neutral-300">{mat.sharedBy}</td>
                        <td className="p-3 text-neutral-300 font-mono text-[11px]">
                          {mat.referenceOrUrl.startsWith('http') ? (
                            <a
                              href={mat.referenceOrUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="underline hover:text-white"
                            >
                              {mat.referenceOrUrl}
                            </a>
                          ) : (
                            mat.referenceOrUrl
                          )}
                        </td>
                        <td className="p-3 text-neutral-400">{mat.notes}</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteMaterial(mat.id)}
                            className="text-neutral-500 hover:text-red-400"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <form
              onSubmit={handleAddMaterial}
              className="border border-neutral-800 bg-[#111111] rounded-md p-4 space-y-3 text-xs"
            >
              <div className="font-medium text-neutral-300">
                Adicionar material de estudo
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Título do material"
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  className="bg-[#0a0a0a] border border-neutral-800 rounded px-3 py-2 text-neutral-100"
                />
                <input
                  type="text"
                  placeholder="Tipo (PDF, GitHub, Vídeo)"
                  value={matType}
                  onChange={(e) => setMatType(e.target.value)}
                  className="bg-[#0a0a0a] border border-neutral-800 rounded px-3 py-2 text-neutral-100"
                />
                <input
                  type="text"
                  placeholder="Compartilhado por"
                  value={matSharedBy}
                  onChange={(e) => setMatSharedBy(e.target.value)}
                  className="bg-[#0a0a0a] border border-neutral-800 rounded px-3 py-2 text-neutral-100"
                />
                <input
                  type="text"
                  placeholder="URL ou localização"
                  value={matUrl}
                  onChange={(e) => setMatUrl(e.target.value)}
                  className="bg-[#0a0a0a] border border-neutral-800 rounded px-3 py-2 text-neutral-100"
                />
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Observações..."
                  value={matNotes}
                  onChange={(e) => setMatNotes(e.target.value)}
                  className="flex-1 bg-[#0a0a0a] border border-neutral-800 rounded px-3 py-2 text-neutral-100"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-neutral-200 text-neutral-950 font-medium hover:bg-white transition"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'TAREFAS' && (
          <div className="space-y-6">
            <form
              onSubmit={handleAddTask}
              className="border border-neutral-800 bg-[#111111] rounded-md p-4 space-y-3 text-xs"
            >
              <div className="font-medium text-neutral-300">
                Cadastrar tarefa do grupo
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Descrição da tarefa"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="sm:col-span-2 bg-[#0a0a0a] border border-neutral-800 rounded px-3 py-2 text-neutral-100"
                />
                <input
                  type="text"
                  placeholder="Etapa"
                  value={taskStage}
                  onChange={(e) => setTaskStage(e.target.value)}
                  className="bg-[#0a0a0a] border border-neutral-800 rounded px-3 py-2 text-neutral-100"
                />
                <input
                  type="text"
                  placeholder="Responsável"
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="bg-[#0a0a0a] border border-neutral-800 rounded px-3 py-2 text-neutral-100"
                />
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Anotações adicionais (opcional)"
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  className="flex-1 bg-[#0a0a0a] border border-neutral-800 rounded px-3 py-2 text-neutral-100"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-neutral-200 text-neutral-950 font-medium hover:bg-white transition"
                >
                  Criar Tarefa
                </button>
              </div>
            </form>

            <div className="border border-neutral-800 bg-[#111111] rounded-md overflow-hidden">
              {state.tasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500">
                  Nenhuma tarefa cadastrada ainda. O grupo pode adicionar e distribuir as tarefas usando o formulário acima.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400 bg-[#141414]">
                        <th className="p-3 font-medium">Tarefa</th>
                        <th className="p-3 font-medium">Etapa</th>
                        <th className="p-3 font-medium">Responsável</th>
                        <th className="p-3 font-medium">Status</th>
                        <th className="p-3 font-medium w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {state.tasks.map((t) => (
                        <tr key={t.id} className="hover:bg-neutral-900/40">
                          <td className="p-3">
                            <span className="font-medium text-neutral-100 block">
                              {t.title}
                            </span>
                            {t.notes && (
                              <span className="text-neutral-500 text-[11px]">
                                {t.notes}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-neutral-400">{t.stage}</td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={t.assignee}
                              onChange={(e) =>
                                handleUpdateTask(t.id, { assignee: e.target.value })
                              }
                              className="bg-[#0a0a0a] border border-neutral-800 rounded px-2 py-1 text-neutral-200 w-44"
                            />
                          </td>
                          <td className="p-3">
                            <select
                              value={t.status}
                              onChange={(e) =>
                                handleUpdateTask(t.id, { status: e.target.value as TaskStatus })
                              }
                              className="bg-[#0a0a0a] border border-neutral-800 rounded px-2 py-1 text-neutral-200"
                            >
                              <option value="PENDENTE">Pendente</option>
                              <option value="EM_ANDAMENTO">Em andamento</option>
                              <option value="CONCLUIDO">Concluído</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteTask(t.id)}
                              className="text-neutral-500 hover:text-red-400"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'EQUIPE' && (
          <div className="border border-neutral-800 bg-[#111111] rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 bg-[#141414]">
                    <th className="p-3 font-medium">Integrante (A-Z)</th>
                    <th className="p-3 font-medium">GitHub</th>
                    <th className="p-3 font-medium">E-mail / Contato</th>
                    <th className="p-3 font-medium">Anotações / Frente (Definido pelo Grupo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {[...state.team]
                    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
                    .map((member) => (
                      <tr key={member.id} className="hover:bg-neutral-900/40">
                        <td className="p-3 font-medium text-neutral-100 whitespace-nowrap">
                          {member.name}
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            placeholder="https://github.com/..."
                            value={member.github || ''}
                            onChange={(e) =>
                              handleUpdateMember(member.id, 'github', e.target.value)
                            }
                            className="bg-[#0a0a0a] border border-neutral-800 rounded px-2.5 py-1 text-neutral-300 w-56 font-mono text-[11px]"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            placeholder="Contato"
                            value={member.email || ''}
                            onChange={(e) =>
                              handleUpdateMember(member.id, 'email', e.target.value)
                            }
                            className="bg-[#0a0a0a] border border-neutral-800 rounded px-2.5 py-1 text-neutral-300 w-48"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            placeholder="Em aberto..."
                            value={member.notes}
                            onChange={(e) =>
                              handleUpdateMember(member.id, 'notes', e.target.value)
                            }
                            className="w-full bg-[#0a0a0a] border border-neutral-800 rounded px-2.5 py-1 text-neutral-200"
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
