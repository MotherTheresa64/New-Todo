import React, { useState } from 'react';
import { CheckCircle, Circle, Plus, X } from 'lucide-react';
import { Subtask } from '../types';

interface SubtaskListProps {
  subtasks: Subtask[];
  onToggleSubtask: (subtaskId: string) => void;
  onAddSubtask: (title: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
}

const SubtaskList: React.FC<SubtaskListProps> = ({
  subtasks,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubtask = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (newSubtaskTitle.trim()) {
      onAddSubtask(newSubtaskTitle.trim());
      setNewSubtaskTitle('');
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSubtask();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewSubtaskTitle('');
    }
  };

  return (
    <div className="mt-4 space-y-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-200">Subtasks</h4>
        {!isAdding && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAdding(true);
            }}
            className="flex items-center gap-1 text-xs text-gray-300 hover:text-white transition-colors px-2 py-1 rounded"
          >
            <Plus size={12} />
            Add subtask
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSubtask(subtask.id);
              }}
              className="flex-shrink-0 p-1"
            >
              {subtask.completed ? (
                <CheckCircle size={18} className="text-green-400" />
              ) : (
                <Circle size={18} className="text-gray-400" />
              )}
            </button>
            <span
              className={`flex-1 text-sm ${
                subtask.completed
                  ? 'text-gray-400 line-through'
                  : 'text-gray-200'
              }`}
            >
              {subtask.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSubtask(subtask.id);
              }}
              className="flex-shrink-0 text-gray-400 hover:text-red-400 transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {isAdding && (
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <Circle size={18} className="text-gray-400" />
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              placeholder="Enter subtask title..."
              className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-400 focus:outline-none"
              autoFocus
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddSubtask(e);
              }}
              className="text-green-400 hover:text-green-300 transition-colors p-1"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAdding(false);
                setNewSubtaskTitle('');
              }}
              className="text-gray-400 hover:text-gray-300 transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtaskList; 