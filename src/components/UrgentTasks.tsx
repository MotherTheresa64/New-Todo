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
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Urgent tasks</h2>
        {urgentTasks.length > 0 ? (
          urgentTasks.map(task => (
            <div 
              key={task.id} 
              className="flex items-center justify-between bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-3 hover:bg-red-900/30 transition-colors cursor-pointer"
              onClick={() => onEditTask?.(task)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={16} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{task.title}</span>
                    <span className="text-red-400 text-xs font-medium">URGENT</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-300">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(task.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric'
                      })}</span>
                    </div>
                    {task.startTime && task.endTime && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
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
                  <div className="text-gray-400 text-sm font-bold">Overdue</div>
                )}
                <div className="text-gray-400 text-xs">{task.progress}% complete</div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 mb-2">
            <p className="text-gray-400 text-sm text-center">No urgent tasks</p>
          </div>
        )}
      </div>
      
      <button
        onClick={onAddTask}
        className="w-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl p-4 flex items-center justify-center gap-2 text-white font-semibold hover:from-purple-600 hover:to-purple-800 transition-all duration-200"
      >
        <Plus size={20} />
        Add new task
      </button>
    </section>
  );
};

export default UrgentTasks; 