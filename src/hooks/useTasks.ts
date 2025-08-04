import { useState, useCallback } from 'react';
import { Task, Subtask } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Landing page design',
      description: 'Design the main landing page',
      startTime: '10:00',
      endTime: '13:00',
      date: '2025-05-29',
      progress: 70,
      category: 'design',
      subtasks: [
        { id: '1-1', title: 'Create wireframes', completed: true },
        { id: '1-2', title: 'Design mockups', completed: true },
        { id: '1-3', title: 'Implement responsive design', completed: false },
        { id: '1-4', title: 'Add animations', completed: false }
      ]
    },
    {
      id: '2',
      title: 'UX Design',
      description: 'Task management mobile app',
      date: '2022-03-24',
      progress: 70,
      teamMembers: ['JD', 'JS', 'BW'],
      category: 'design',
      subtasks: [
        { id: '2-1', title: 'User research', completed: true },
        { id: '2-2', title: 'Create user personas', completed: true },
        { id: '2-3', title: 'Design user flows', completed: false },
        { id: '2-4', title: 'Prototype testing', completed: false }
      ]
    },
    {
      id: '3',
      title: 'API Payment',
      description: 'Progress',
      date: '2025-05-31',
      progress: 40,
      teamMembers: ['ACMJ'],
      category: 'development',
      subtasks: [
        { id: '3-1', title: 'Set up payment gateway', completed: true },
        { id: '3-2', title: 'Implement payment flow', completed: false },
        { id: '3-3', title: 'Add security measures', completed: false },
        { id: '3-4', title: 'Test payment system', completed: false }
      ]
    },
    {
      id: '4',
      title: 'Update work',
      description: 'Revision home page',
      date: '2025-06-01',
      progress: 100,
      category: 'development',
      subtasks: [
        { id: '4-1', title: 'Review current design', completed: true },
        { id: '4-2', title: 'Update content', completed: true },
        { id: '4-3', title: 'Optimize performance', completed: true },
        { id: '4-4', title: 'Deploy changes', completed: true }
      ]
    },
    {
      id: '5',
      title: 'Chat application',
      description: 'Build real-time chat feature',
      date: '2025-06-05',
      progress: 30,
      isUrgent: true,
      daysLeft: 2,
      category: 'development',
      subtasks: [
        { id: '5-1', title: 'Set up WebSocket connection', completed: true },
        { id: '5-2', title: 'Create chat interface', completed: false },
        { id: '5-3', title: 'Implement message handling', completed: false },
        { id: '5-4', title: 'Add user authentication', completed: false }
      ]
    },
    {
      id: '6',
      title: 'Creating website',
      description: 'Progress',
      startTime: '14:00',
      endTime: '15:00',
      date: '2025-06-05',
      progress: 80,
      category: 'development',
      subtasks: [
        { id: '6-1', title: 'Design homepage', completed: true },
        { id: '6-2', title: 'Create navigation', completed: true },
        { id: '6-3', title: 'Add contact form', completed: true },
        { id: '6-4', title: 'Optimize for mobile', completed: false }
      ]
    },
    {
      id: '7',
      title: 'August Project Planning',
      description: 'Plan Q4 initiatives',
      date: '2025-08-04',
      progress: 25,
      category: 'planning',
      subtasks: [
        { id: '7-1', title: 'Review Q3 results', completed: true },
        { id: '7-2', title: 'Set Q4 goals', completed: false },
        { id: '7-3', title: 'Allocate resources', completed: false },
        { id: '7-4', title: 'Create timeline', completed: false }
      ]
    },
    {
      id: '8',
      title: 'Team Meeting',
      description: 'Weekly standup',
      startTime: '09:00',
      endTime: '10:00',
      date: '2025-08-05',
      progress: 0,
      category: 'other',
      subtasks: [
        { id: '8-1', title: 'Prepare agenda', completed: false },
        { id: '8-2', title: 'Send invites', completed: false },
        { id: '8-3', title: 'Book meeting room', completed: false }
      ]
    },
    {
      id: '9',
      title: 'Database Migration',
      description: 'Upgrade to new version',
      date: '2025-08-15',
      progress: 60,
      isUrgent: true,
      daysLeft: 5,
      category: 'development',
      subtasks: [
        { id: '9-1', title: 'Backup current data', completed: true },
        { id: '9-2', title: 'Test migration script', completed: true },
        { id: '9-3', title: 'Run migration', completed: false },
        { id: '9-4', title: 'Verify data integrity', completed: false }
      ]
    }
  ]);

  const addTask = useCallback((newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
    };
    setTasks(prev => [...prev, task]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const moveTask = useCallback((id: string, newDate: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, date: newDate } : task
    ));
  }, []);

  const updateProgress = useCallback((id: string, progress: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, progress } : task
    ));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, progress: task.progress === 100 ? 0 : 100 } : task
    ));
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && task.subtasks) {
        const updatedSubtasks = task.subtasks.map(subtask =>
          subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        );
        const completedCount = updatedSubtasks.filter(sub => sub.completed).length;
        const progress = Math.round((completedCount / updatedSubtasks.length) * 100);
        return { ...task, subtasks: updatedSubtasks, progress };
      }
      return task;
    }));
  }, []);

  const addSubtask = useCallback((taskId: string, subtaskTitle: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newSubtask: Subtask = {
          id: `${taskId}-${Date.now()}`,
          title: subtaskTitle,
          completed: false
        };
        const updatedSubtasks = [...(task.subtasks || []), newSubtask];
        const completedCount = updatedSubtasks.filter(sub => sub.completed).length;
        const progress = Math.round((completedCount / updatedSubtasks.length) * 100);
        return { ...task, subtasks: updatedSubtasks, progress };
      }
      return task;
    }));
  }, []);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && task.subtasks) {
        const updatedSubtasks = task.subtasks.filter(sub => sub.id !== subtaskId);
        const completedCount = updatedSubtasks.filter(sub => sub.completed).length;
        const progress = updatedSubtasks.length > 0 ? Math.round((completedCount / updatedSubtasks.length) * 100) : 0;
        return { ...task, subtasks: updatedSubtasks, progress };
      }
      return task;
    }));
  }, []);

  const getTasksByDate = useCallback((date: string) => {
    return tasks.filter(task => task.date === date);
  }, [tasks]);

  const getUrgentTasks = useCallback(() => {
    return tasks.filter(task => task.isUrgent);
  }, [tasks]);

  const getTaskProgress = useCallback(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.progress === 100).length;
    return { completed: completedTasks, total: totalTasks };
  }, [tasks]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    updateProgress,
    toggleComplete,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    getTasksByDate,
    getUrgentTasks,
    getTaskProgress,
  };
}; 