import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Clock, Calendar, Tag, Sparkles, Zap, Star } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

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

  // Show completion animation when progress reaches 100%
  React.useEffect(() => {
    if (task.progress === 100 && !showCompletion) {
      setShowCompletion(true);
      setTimeout(() => setShowCompletion(false), 2000);
    }
  }, [task.progress, showCompletion]);

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card-modern cursor-pointer group animate-fade-in-up task-card-interactive ripple relative overflow-hidden"
    >
      {/* Completion celebration effect */}
      {showCompletion && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 animate-pulse rounded-2xl"></div>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{
                left: `${20 + (i * 10)}%`,
                top: `${20 + (i * 5)}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-bounce-slow">
              <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <span className="text-white font-bold text-sm">Completed!</span>
            </div>
          </div>
        </div>
      )}

      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors duration-300 flex items-center">
            {task.title}
            {task.isUrgent && (
              <Zap className="w-4 h-4 ml-2 text-red-400 animate-pulse" />
            )}
          </h3>
          {task.description && (
            <p className="text-white/70 text-sm line-clamp-2 group-hover:text-white/90 transition-colors duration-300">
              {task.description}
            </p>
          )}
        </div>
        
        {/* Urgent indicator with enhanced animation */}
        {task.isUrgent && (
          <div className="ml-3 flex items-center space-x-1 px-2 py-1 rounded-lg gradient-danger animate-pulse-slow hover:scale-110 transition-transform duration-300">
            <AlertTriangle size={14} className="text-white animate-wiggle" />
            <span className="text-xs font-medium text-white">URGENT</span>
          </div>
        )}
      </div>

      {/* Progress section with enhanced animation */}
      <div className="mb-4 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/70 group-hover:text-white transition-colors duration-300">Progress</span>
          <span className="text-sm font-medium text-white">
            {task.progress === 100 ? (
              <div className="flex items-center space-x-1 animate-bounce-slow">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-green-400">Complete</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <span>{task.progress}%</span>
                {task.progress > 50 && (
                  <Star className="w-3 h-3 text-yellow-400 animate-pulse" />
                )}
              </div>
            )}
          </span>
        </div>
        <div className="progress-modern relative overflow-hidden">
          <div 
            className="progress-fill transition-all duration-1000 ease-out"
            style={{ width: `${task.progress}%` }}
          ></div>
          {/* Animated progress particles */}
          {isHovered && task.progress > 0 && (
            <div className="absolute inset-0">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/60 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * task.progress}%`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task details with enhanced interactions */}
      <div className="space-y-2 relative z-10">
        {/* Date and time with hover effects */}
        <div className="flex items-center space-x-3 text-sm text-white/70">
          <div className="flex items-center space-x-1 hover:scale-110 transition-transform duration-300 group-hover:text-white">
            <Calendar size={14} className="group-hover:animate-pulse" />
            <span>{task.date}</span>
          </div>
          {task.startTime && task.endTime && (
            <div className="flex items-center space-x-1 hover:scale-110 transition-transform duration-300 group-hover:text-white">
              <Clock size={14} className="group-hover:animate-pulse" />
              <span>{task.startTime} - {task.endTime}</span>
            </div>
          )}
        </div>

        {/* Category with enhanced animation */}
        <div className="flex items-center space-x-2">
          <div 
            className={`w-6 h-6 ${getCategoryColor(category)} rounded-lg flex items-center justify-center hover:scale-125 transition-transform duration-300 group-hover:animate-bounce-slow`}
          >
            <span className="text-xs">{getCategoryIcon(category)}</span>
          </div>
          <span className="text-sm text-white/70 capitalize group-hover:text-white transition-colors duration-300">{category}</span>
        </div>

        {/* Subtasks count with animation */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <Tag size={14} className="hover:rotate-12 transition-transform duration-300 group-hover:text-white" />
            <span className="group-hover:text-white transition-colors duration-300">
              {task.subtasks.filter(subtask => subtask.completed).length} of {task.subtasks.length} subtasks
            </span>
            {task.subtasks.filter(subtask => subtask.completed).length === task.subtasks.length && (
              <CheckCircle size={12} className="text-green-400 animate-pulse" />
            )}
          </div>
        )}

        {/* Team members with enhanced hover effects */}
        {task.teamMembers && task.teamMembers.length > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {task.teamMembers.slice(0, 3).map((member, index) => (
                <div
                  key={index}
                  className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white/20 hover:scale-110 transition-transform duration-300 hover:animate-bounce-slow"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {member.charAt(0)}
                </div>
              ))}
              {task.teamMembers.length > 3 && (
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white/20 hover:scale-110 transition-transform duration-300">
                  +{task.teamMembers.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-white/70 group-hover:text-white transition-colors duration-300">Team</span>
          </div>
        )}
      </div>

      {/* Enhanced hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Floating particles effect */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-float" style={{ animationDelay: '0s' }}></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-float" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/2 right-4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-float" style={{ animationDelay: '1s' }}></div>
      
      {/* Click ripple effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-active:opacity-100 transition-opacity duration-150"></div>
      </div>
    </div>
  );
};

export default TaskCard; 