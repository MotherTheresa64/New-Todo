import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { Task } from '../types';

interface TodaysTasksProps {
  tasks: Task[];
}

const TodaysTasks: React.FC<TodaysTasksProps> = ({ tasks }) => {
  // Filter out any undefined tasks
  const validTasks = tasks.filter(task => task);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Tasks for selected date</h3>
      
      {validTasks.length > 0 ? (
        validTasks.map(task => (
          <div key={task.id} className="bg-gray-800 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">{task.title}</h4>
              <span className="text-blue-400 text-sm font-medium">{task.progress}%</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-300 mb-2">
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
                  day: 'numeric'
                })}</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm">No tasks scheduled for this date</p>
        </div>
      )}
    </div>
  );
};

export default TodaysTasks; 