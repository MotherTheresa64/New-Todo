import React from 'react';
import TaskCard from './TaskCard';
import { Task } from '../types';

interface TaskProgressProps {
  tasks: Task[];
  progress: { completed: number; total: number };
  onEditTask?: (task: Task) => void;
}

const TaskProgress: React.FC<TaskProgressProps> = ({ tasks, progress, onEditTask }) => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Task Progress</h2>
        <p className="text-gray-300 text-sm">
          {progress.completed}/{progress.total} task done
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.length > 0 ? (
          tasks.slice(0, 3).map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              variant="small" 
              onEdit={onEditTask}
            />
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-400 text-sm">No tasks to display</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TaskProgress; 