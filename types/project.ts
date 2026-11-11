export type TaskPhase = 'FASE_0' | 'FASE_1' | 'FASE_2';

export type TaskStatus =
  | 'BACKLOG'
  | 'VALIDACAO_FRED'
  | 'EM_ANDAMENTO'
  | 'HOMOLOGACAO_D29'
  | 'CONCLUIDO';

export type TaskPriority =
  | 'CRITICA'
  | 'OBRIGATORIA_JAN'
  | 'DESEJAVEL_STRETCH'
  | 'ETAPA_2';

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  phase: TaskPhase;
  status: TaskStatus;
  priority: TaskPriority;
  assignees: string[];
  updatedAt: string;
}

export type ValidationStatus =
  | 'PENDENTE'
  | 'EM_ANALISE'
  | 'COMPATIVEL'
  | 'REQUER_ADAPTACAO'
  | 'DESCARTADO';

export interface InventoryAsset {
  id: string;
  name: string;
  origin: string;
  owner: string;
  intendedUnityUse: string;
  validationStatus: ValidationStatus;
  notes: string;
}

export interface OptimizationItem {
  id: string;
  category: 'POLIGONOS' | 'SOMBRAS' | 'ANIMACAO_AUDIO' | 'WEBXR_BROWSER';
  title: string;
  targetMetric: string;
  owner: string;
  status: 'PENDENTE' | 'TESTANDO_D29' | 'OTIMIZADO' | 'DESCARTADO';
  impactLevel: 'ALTO' | 'MEDIO' | 'BAIXO';
}

export interface CameraSpot {
  id: string;
  code: string;
  locationInViario: string;
  model3DStatus: 'POSICIONADO' | 'PENDENTE_SPLICE' | 'INTERATIVO_MR';
  stage1Behavior: string;
  stage2Payloads: string[];
  coords?: { x: number; y: number };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  github?: string;
  email?: string;
  background: string;
}

export interface TechnicalQuestion {
  id: string;
  target: 'SPLICE' | 'PROF_FRED' | 'COORDENACAO_IA';
  question: string;
  context: string;
  status: 'ABERTA' | 'RESPONDIDA';
  resolutionNote?: string;
}

export interface ProjectState {
  lastUpdated: string;
  tasks: ProjectTask[];
  inventory: InventoryAsset[];
  optimizations: OptimizationItem[];
  spots: CameraSpot[];
  team: TeamMember[];
  questions: TechnicalQuestion[];
}
