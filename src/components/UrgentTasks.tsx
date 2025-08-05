import React from 'react';
import { Plus, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { Task } from '../types';

interface UrgentTasksProps {
  urgentTasks: Task[];
  onAddTask: () => void;
  onEditTask?: (task: Task) => void;
}

const UrgentTasks: React.FC<UrgentTasksProps> = ({ urgentTasks, onAddTask, onEditTask }) => {
  return (
    <div className="space-y-4">
      {urgentTasks.length > 0 ? (
        urgentTasks.map(task => (
          <div 
            key={task.id} 
            className="card-modern cursor-pointer group animate-fade-in-up"
            onClick={() => onEditTask?.(task)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 gradient-danger rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-semibold group-hover:text-purple-200 transition-colors">
                      {task.title}
                    </span>
                    <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-xs font-medium">
                      URGENT
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-white/70">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(task.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric'
                      })}</span>
                    </div>
                    {task.startTime && task.endTime && (
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{task.startTime} - {task.endTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {task.isDueToday ? (
                  <div className="text-red-400 text-sm font-bold">Due today</div>
                ) : task.daysLeft && task.daysLeft > 0 ? (
                  <div className="text-red-400 text-sm font-bold">{task.daysLeft} days left</div>
                ) : (
                  <div className="text-white/50 text-sm font-bold">Overdue</div>
                )}
                <div className="text-white/50 text-xs mt-1">{task.progress}% complete</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="card-modern text-center py-8 animate-fade-in-up">
          <div className="w-12 h-12 gradient-danger rounded-xl flex items-center justify-center mx-auto mb-3">
            <AlertTriangle size={24} className="text-white" />
          </div>
          <p className="text-white/70 text-sm">No urgent tasks</p>
        </div>
      )}
      
      <button
        onClick={onAddTask}
        className="btn-modern w-full flex items-center justify-center space-x-2"
      >
        <Plus size={20} className="text-white" />
        <span>Add new task</span>
      </button>
    </div>
  );
};

export default UrgentTasks; 