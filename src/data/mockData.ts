import { Task } from '../types';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Landing page design',
    description: 'Design the main landing page',
    startTime: '10:00',
    endTime: '13:00',
    date: '2025-05-29',
    progress: 70,
    category: 'design'
  },
  {
    id: '2',
    title: 'UX Design',
    description: 'Task management mobile app',
    date: '2022-03-24',
    progress: 70,
    teamMembers: ['JD', 'JS', 'BW'],
    category: 'design'
  },
  {
    id: '3',
    title: 'API Payment',
    description: 'Progress',
    date: '2025-05-31',
    progress: 40,
    teamMembers: ['ACMJ'],
    category: 'development'
  },
  {
    id: '4',
    title: 'Update work',
    description: 'Revision home page',
    date: '2025-06-01',
    progress: 100,
    category: 'development'
  },
  {
    id: '5',
    title: 'Chat application',
    description: 'Build real-time chat feature',
    date: '2025-06-05',
    progress: 30,
    isUrgent: true,
    daysLeft: 2,
    category: 'development'
  },
  {
    id: '6',
    title: 'Creating website',
    description: 'Progress',
    startTime: '14:00',
    endTime: '15:00',
    date: '2025-06-05',
    progress: 80,
    category: 'development'
  }
];

export const getTaskProgress = (): { completed: number; total: number } => {
  // For demo purposes, show 30/40 as in the design
  return { completed: 30, total: 40 };
};

export const getTodaysTasks = (): Task[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockTasks.filter(task => task.date === today);
};

export const getUrgentTasks = (): Task[] => {
  return mockTasks.filter(task => task.isUrgent);
}; 