export type TaskStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO';

export interface ProjectTask {
  id: string;
  title: string;
  stage: string;
  assignee: string;
  status: TaskStatus;
  notes: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  type: string;
  sharedBy: string;
  referenceOrUrl: string;
  notes: string;
}

export interface OfficialGoalGroup {
  id: string;
  code: string;
  title: string;
  items: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  github?: string;
  email?: string;
  notes: string;
}

export interface ProjectState {
  lastUpdated: string;
  goals: OfficialGoalGroup[];
  materials: StudyMaterial[];
  tasks: ProjectTask[];
  team: TeamMember[];
}