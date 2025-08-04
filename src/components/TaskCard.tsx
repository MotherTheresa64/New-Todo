import React from 'react';
import { Clock, Calendar, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  variant?: 'large' | 'small';
  showProgress?: boolean;
  onEdit?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, variant = 'small', showProgress = true, onEdit }) => {
  const getGradientClass = (category?: string) => {
    switch (category) {
      case 'design':
        return 'from-purple-600 to-purple-800';
      case 'development':
        return 'from-blue-600 to-blue-800';
      case 'planning':
        return 'from-green-600 to-green-800';
      default:
        return 'from-purple-600 to-purple-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'text-green-400';
    if (progress >= 70) return 'text-purple-400';
    if (progress >= 40) return 'text-blue-400';
    return 'text-yellow-400';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    onEdit?.(task);
  };

  return (
    <div className={`relative bg-gradient-to-br ${getGradientClass(task.category)} rounded-xl p-6 ${
      variant === 'large' ? 'col-span-full' : ''
    } hover:scale-105 transition-transform cursor-pointer ${task.isUrgent ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}
    onClick={handleCardClick}
    >
              {showProgress && (
          <div className="absolute top-3 right-3">
            {task.progress === 100 ? (
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle size={24} className="text-white" />
              </div>
            ) : (
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/20"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`${getProgressColor(task.progress)} transition-all duration-300`}
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${task.progress}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {task.progress}%
                </span>
              </div>
            )}
          </div>
        )}

        {task.isUrgent && (
          <div className="absolute top-3 left-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle size={16} className="text-white" />
            </div>
          </div>
        )}


      
              <div className={`${variant === 'large' ? 'pr-16' : 'pr-12'} ${task.isUrgent ? 'pl-12' : ''}`}>
          <h3 className={`font-bold text-white ${variant === 'large' ? 'text-2xl' : 'text-lg'}`}>
            {task.title}
          </h3>
        
        {task.description && (
          <p className="text-gray-200 text-sm mt-1">{task.description}</p>
        )}
        
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-200">
          {task.startTime && task.endTime && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{task.startTime} am - {task.endTime} pm</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{new Date(task.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
        </div>
        
        {task.teamMembers && task.teamMembers.length > 0 && (
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-200">
            <Users size={14} />
            <span>{task.teamMembers.join(' ')}</span>
          </div>
        )}
        
        {variant === 'small' && showProgress && (
          <div className="mt-2 text-xs text-gray-200">
            Progress: {task.progress}%
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard; 