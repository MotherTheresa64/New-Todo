import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task, Subtask } from '../types';
import SubtaskList from './SubtaskList';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  onSaveAndClose?: (task: Omit<Task, 'id'>) => void;
  onDelete?: (id: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onAddSubtask?: (taskId: string, title: string) => void;
  onDeleteSubtask?: (taskId: string, subtaskId: string) => void;
  task?: Task;
  selectedDate?: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onSaveAndClose,
  onDelete,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
  task, 
  selectedDate 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    date: selectedDate || new Date().toISOString().split('T')[0],
    category: 'design' as 'design' | 'development' | 'planning' | 'other',
    teamMembers: '',
    isUrgent: false,
    daysLeft: 0,
    subtasks: [] as Subtask[]
  });

  useEffect(() => {
    if (task) {
      // Editing existing task - populate with task data
      setFormData({
        title: task.title,
        description: task.description || '',
        startTime: task.startTime || '',
        endTime: task.endTime || '',
        date: task.date,
        category: task.category || 'design',
        teamMembers: task.teamMembers?.join(', ') || '',
        isUrgent: task.isUrgent || false,
        daysLeft: task.daysLeft || 0,
        subtasks: task.subtasks || []
      });
    } else {
      // Adding new task - start with blank slate
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        date: selectedDate || today,
        category: 'design',
        teamMembers: '',
        isUrgent: false,
        daysLeft: 0,
        subtasks: []
      });
    }
  }, [task, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate progress based on subtasks
    const completedSubtasks = formData.subtasks.filter(sub => sub.completed).length;
    const progress = formData.subtasks.length > 0 ? Math.round((completedSubtasks / formData.subtasks.length) * 100) : 0;
    
    const newTask: Omit<Task, 'id'> = {
      title: formData.title,
      description: formData.description,
      startTime: formData.startTime || undefined,
      endTime: formData.endTime || undefined,
      date: formData.date,
      progress,
      category: formData.category,
      teamMembers: formData.teamMembers ? formData.teamMembers.split(',').map(s => s.trim()) : undefined,
      isUrgent: formData.isUrgent,
      daysLeft: formData.daysLeft || undefined,
      subtasks: formData.subtasks
    };

    onSave(newTask);
    
    // Close modal only when adding a new task (not when editing)
    if (!task) {
      onClose();
    }
  };

  const handleSaveAndClose = () => {
    // Calculate progress based on subtasks
    const completedSubtasks = formData.subtasks.filter(sub => sub.completed).length;
    const progress = formData.subtasks.length > 0 ? Math.round((completedSubtasks / formData.subtasks.length) * 100) : 0;
    
    const newTask: Omit<Task, 'id'> = {
      title: formData.title,
      description: formData.description,
      startTime: formData.startTime || undefined,
      endTime: formData.endTime || undefined,
      date: formData.date,
      progress,
      category: formData.category,
      teamMembers: formData.teamMembers ? formData.teamMembers.split(',').map(s => s.trim()) : undefined,
      isUrgent: formData.isUrgent,
      daysLeft: formData.daysLeft || undefined,
      subtasks: formData.subtasks
    };

    onSaveAndClose?.(newTask);
  };

  const handleDelete = () => {
    if (task && onDelete) {
      if (window.confirm('Are you sure you want to delete this task?')) {
        onDelete(task.id);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-gray-800 rounded-xl p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target !== e.currentTarget) {
            e.preventDefault();
          }
        }}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date Due *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="design">Design</option>
              <option value="development">Development</option>
              <option value="planning">Planning</option>
              <option value="other">Other</option>
            </select>
          </div>



          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team Members (comma separated)
            </label>
            <input
              type="text"
              value={formData.teamMembers}
              onChange={(e) => setFormData(prev => ({ ...prev, teamMembers: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              placeholder="JD, JS, BW"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isUrgent}
                onChange={(e) => setFormData(prev => ({ ...prev, isUrgent: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-300">Urgent Task</span>
            </label>
          </div>

          {formData.isUrgent && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Days Left
              </label>
              <input
                type="number"
                min="0"
                value={formData.daysLeft}
                onChange={(e) => setFormData(prev => ({ ...prev, daysLeft: parseInt(e.target.value) || 0 }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          )}

          {/* Subtasks Section */}
          <div onClick={(e) => e.stopPropagation()}>
            <SubtaskList
              subtasks={formData.subtasks}
              onToggleSubtask={(subtaskId) => {
                const updatedSubtasks = formData.subtasks.map(subtask =>
                  subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
                );
                const completedCount = updatedSubtasks.filter(sub => sub.completed).length;
                const progress = Math.round((completedCount / updatedSubtasks.length) * 100);
                setFormData(prev => ({ 
                  ...prev, 
                  subtasks: updatedSubtasks,
                  progress: updatedSubtasks.length > 0 ? progress : 0
                }));
              }}
              onAddSubtask={(title) => {
                const newSubtask: Subtask = {
                  id: `${Date.now()}`,
                  title,
                  completed: false
                };
                const updatedSubtasks = [...formData.subtasks, newSubtask];
                const completedCount = updatedSubtasks.filter(sub => sub.completed).length;
                const progress = Math.round((completedCount / updatedSubtasks.length) * 100);
                setFormData(prev => ({ 
                  ...prev, 
                  subtasks: updatedSubtasks,
                  progress: updatedSubtasks.length > 0 ? progress : 0
                }));
              }}
              onDeleteSubtask={(subtaskId) => {
                const updatedSubtasks = formData.subtasks.filter(sub => sub.id !== subtaskId);
                const completedCount = updatedSubtasks.filter(sub => sub.completed).length;
                const progress = updatedSubtasks.length > 0 ? Math.round((completedCount / updatedSubtasks.length) * 100) : 0;
                setFormData(prev => ({ 
                  ...prev, 
                  subtasks: updatedSubtasks,
                  progress
                }));
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {task && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            {task ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveAndClose}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors text-sm font-medium"
                >
                  Save & Close
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors text-sm font-medium"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors text-sm font-medium"
              >
                Add Task
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal; 