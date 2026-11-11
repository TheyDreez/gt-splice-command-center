export type TaskStatus = 'PENDENTE' | 'VALIDACAO' | 'EM_ANDAMENTO' | 'CONCLUIDO';

export interface ProjectTask {
  id: string;
  title: string;
  stage: string;
  assignee: string;
  status: TaskStatus;
  notes: string;
  createdAt: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  category: 'APRESENTACAO' | 'REPOSITORIO' | 'DOSSIE' | 'HARDWARE' | 'ATA';
  type: string;
  sharedBy: string;
  referenceOrUrl: string;
  notes: string;
}

export interface OfficialGoalItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface OfficialGoalGroup {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  items: OfficialGoalItem[];
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  github?: string;
  email?: string;
  focusArea: string;
  notes: string;
}

export interface ProjectState {
  lastUpdated: string;
  goals: OfficialGoalGroup[];
  materials: StudyMaterial[];
  tasks: ProjectTask[];
  team: TeamMember[];
}
