export type ProjectStatus = 'not-started' | 'in-progress' | 'on-hold' | 'completed';

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  status: ProjectStatus;
  startDate: Date;
  dueDate?: Date;
  completedDate?: Date;
  assignedToId: string; // ID of the freelancer or agency member
  createdBy: string; // ID of the creator (agency owner, member, or freelancer)
  createdAt: Date;
  updatedAt: Date;
  budget?: number;
  currency?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignedToId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
}

export interface ProjectWithTasks extends Project {
  tasks: Task[];
} 