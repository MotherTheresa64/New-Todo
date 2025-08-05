import React from 'react';
import { CheckCircle, AlertTriangle, Clock, Calendar, Tag } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'development':
        return 'gradient-primary';
      case 'design':
        return 'gradient-secondary';
      case 'planning':
        return 'gradient-success';
      case 'other':
        return 'gradient-warning';
      default:
        return 'gradient-primary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'development':
        return '💻';
      case 'design':
        return '🎨';
      case 'planning':
        return '📋';
      case 'other':
        return '📝';
      default:
        return '📌';
    }
  };

  const category = task.category || 'other';

  return (
    <div 
      onClick={onClick}
      className="card-modern cursor-pointer group animate-fade-in-up task-card-interactive ripple"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-white/70 text-sm line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        
        {/* Urgent indicator */}
        {task.isUrgent && (
          <div className="ml-3 flex items-center space-x-1 px-2 py-1 rounded-lg gradient-danger animate-pulse-slow">
            <AlertTriangle size={14} className="text-white animate-wiggle" />
            <span className="text-xs font-medium text-white">URGENT</span>
          </div>
        )}
      </div>

      {/* Progress section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/70">Progress</span>
          <span className="text-sm font-medium text-white">
            {task.progress === 100 ? (
              <div className="flex items-center space-x-1 animate-bounce-slow">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-green-400">Complete</span>
              </div>
            ) : (
              `${task.progress}%`
            )}
          </span>
        </div>
        <div className="progress-modern">
          <div 
            className="progress-fill"
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Task details */}
      <div className="space-y-2">
        {/* Date and time */}
        <div className="flex items-center space-x-3 text-sm text-white/70">
          <div className="flex items-center space-x-1 hover:scale-110 transition-transform">
            <Calendar size={14} />
            <span>{task.date}</span>
          </div>
          {task.startTime && task.endTime && (
            <div className="flex items-center space-x-1 hover:scale-110 transition-transform">
              <Clock size={14} />
              <span>{task.startTime} - {task.endTime}</span>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 ${getCategoryColor(category)} rounded-lg flex items-center justify-center hover:scale-125 transition-transform`}>
            <span className="text-xs">{getCategoryIcon(category)}</span>
          </div>
          <span className="text-sm text-white/70 capitalize">{category}</span>
        </div>

        {/* Subtasks count */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <Tag size={14} className="hover:rotate-12 transition-transform" />
            <span>
              {task.subtasks.filter(subtask => subtask.completed).length} of {task.subtasks.length} subtasks
            </span>
          </div>
        )}

        {/* Team members */}
        {task.teamMembers && task.teamMembers.length > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {task.teamMembers.slice(0, 3).map((member, index) => (
                <div
                  key={index}
                  className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white/20 hover:scale-110 transition-transform"
                >
                  {member.charAt(0)}
                </div>
              ))}
              {task.teamMembers.length > 3 && (
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white/20 hover:scale-110 transition-transform">
                  +{task.teamMembers.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-white/70">Team</span>
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Floating particles effect */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-float" style={{ animationDelay: '0s' }}></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-float" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
};

export default TaskCard; 