import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firestoreService } from '../services/firestore';
import { Task, Subtask } from '../types';

export const useTasks = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user's tasks when user changes
  useEffect(() => {
    if (currentUser) {
      loadUserTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [currentUser]);

  const loadUserTasks = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      const userTasks = await firestoreService.getUserTasks(currentUser.uid);
      setTasks(userTasks);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = useCallback(async (taskData: Omit<Task, 'id'>) => {
    if (!currentUser) return;
    
    try {
      setError(null);
      const taskId = await firestoreService.addTask(currentUser.uid, taskData);
      const newTask: Task = {
        id: taskId,
        ...taskData
      };
      setTasks(prev => [newTask, ...prev]);
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task');
      throw err;
    }
  }, [currentUser]);

  const updateTask = useCallback(async (taskId: string, taskData: Partial<Task>) => {
    if (!currentUser) return;
    
    try {
      setError(null);
      await firestoreService.updateTask(currentUser.uid, taskId, taskData);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...taskData } : task
      ));
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
      throw err;
    }
  }, [currentUser]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (!currentUser) return;
    
    try {
      setError(null);
      await firestoreService.deleteTask(currentUser.uid, taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
      throw err;
    }
  }, [currentUser]);

  const toggleSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    if (!currentUser) return;
    
    try {
      setError(null);
      const task = tasks.find(t => t.id === taskId);
      if (!task || !task.subtasks) return;

      const updatedSubtasks = task.subtasks.map(subtask =>
        subtask.id === subtaskId 
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      );

      const completedSubtasks = updatedSubtasks.filter(subtask => subtask.completed).length;
      const progress = updatedSubtasks.length > 0 
        ? Math.round((completedSubtasks / updatedSubtasks.length) * 100)
        : 0;

      await firestoreService.updateTask(currentUser.uid, taskId, {
        subtasks: updatedSubtasks,
        progress
      });

      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, subtasks: updatedSubtasks, progress }
          : task
      ));
    } catch (err) {
      console.error('Error toggling subtask:', err);
      setError('Failed to update subtask');
      throw err;
    }
  }, [currentUser, tasks]);

  const addSubtask = useCallback(async (taskId: string, title: string) => {
    if (!currentUser) return;
    
    try {
      setError(null);
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const newSubtask: Subtask = {
        id: Date.now().toString(),
        title,
        completed: false
      };

      const updatedSubtasks = [...(task.subtasks || []), newSubtask];
      const completedSubtasks = updatedSubtasks.filter(subtask => subtask.completed).length;
      const progress = updatedSubtasks.length > 0 
        ? Math.round((completedSubtasks / updatedSubtasks.length) * 100)
        : 0;

      await firestoreService.updateTask(currentUser.uid, taskId, {
        subtasks: updatedSubtasks,
        progress
      });

      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, subtasks: updatedSubtasks, progress }
          : task
      ));
    } catch (err) {
      console.error('Error adding subtask:', err);
      setError('Failed to add subtask');
      throw err;
    }
  }, [currentUser, tasks]);

  const deleteSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    if (!currentUser) return;
    
    try {
      setError(null);
      const task = tasks.find(t => t.id === taskId);
      if (!task || !task.subtasks) return;

      const updatedSubtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId);
      const completedSubtasks = updatedSubtasks.filter(subtask => subtask.completed).length;
      const progress = updatedSubtasks.length > 0 
        ? Math.round((completedSubtasks / updatedSubtasks.length) * 100)
        : 0;

      await firestoreService.updateTask(currentUser.uid, taskId, {
        subtasks: updatedSubtasks,
        progress
      });

      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, subtasks: updatedSubtasks, progress }
          : task
      ));
    } catch (err) {
      console.error('Error deleting subtask:', err);
      setError('Failed to delete subtask');
      throw err;
    }
  }, [currentUser, tasks]);

  const getTasksByDate = useCallback(async (date: string): Promise<Task[]> => {
    if (!currentUser) return [];
    
    try {
      return await firestoreService.getTasksByDate(currentUser.uid, date);
    } catch (err) {
      console.error('Error getting tasks by date:', err);
      return [];
    }
  }, [currentUser]);

  const getUrgentTasks = useCallback(async (): Promise<Task[]> => {
    if (!currentUser) return [];
    
    try {
      return await firestoreService.getUrgentTasks(currentUser.uid);
    } catch (err) {
      console.error('Error getting urgent tasks:', err);
      return [];
    }
  }, [currentUser]);

  const getTaskProgress = useCallback(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.progress === 100).length;
    return { completed: completedTasks, total: totalTasks };
  }, [tasks]);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    getTasksByDate,
    getUrgentTasks,
    getTaskProgress,
    refreshTasks: loadUserTasks
  };
}; 