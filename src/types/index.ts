export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  date: string;
  progress: number;
  teamMembers?: string[];
  isUrgent?: boolean;
  daysLeft?: number;
  isDueToday?: boolean;
  category?: 'design' | 'development' | 'planning' | 'other';
  subtasks?: Subtask[];
}

export interface TaskProgress {
  completed: number;
  total: number;
}

export interface CalendarDay {
  date: Date;
  isCurrentDay: boolean;
  hasTasks: boolean;
} 