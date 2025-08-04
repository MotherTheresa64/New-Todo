import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Header from './components/Header';
import TaskCard from './components/TaskCard';
import TaskProgress from './components/TaskProgress';
import UrgentTasks from './components/UrgentTasks';
import Calendar from './components/Calendar';
import TodaysTasks from './components/TodaysTasks';
import TaskModal from './components/TaskModal';
import { useTasks } from './hooks/useTasks';
import { Task } from './types';

const App: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    getTasksByDate,
    getUrgentTasks,
    getTaskProgress,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [currentViewDate, setCurrentViewDate] = useState(new Date().toISOString().split('T')[0]);

  // Get tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => task.date === currentViewDate);
  const completedTasksForDate = tasksForSelectedDate.filter(task => task.progress === 100).length;
  const progress = { completed: completedTasksForDate, total: tasksForSelectedDate.length };
  // Get urgent tasks for the selected date or upcoming urgent tasks
  const urgentTasks = getUrgentTasks().filter(task => {
    const taskDate = new Date(task.date);
    const selectedDate = new Date(currentViewDate);
    const today = new Date();
    
    // Show urgent tasks for the selected date
    if (task.date === currentViewDate) return true;
    
    // Show upcoming urgent tasks (future dates)
    if (taskDate > today) return true;
    
    // Don't show past due urgent tasks unless it's the selected date
    return false;
  }).map(task => {
    // Calculate days left based on selected date
    const taskDate = new Date(task.date);
    const selectedDate = new Date(currentViewDate);
    const daysLeft = Math.ceil((taskDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      ...task,
      daysLeft: daysLeft > 0 ? daysLeft : 0,
      isDueToday: daysLeft === 0
    };
  });
  // const todaysTasks = getTasksByDate(currentViewDate);
  
  // Get the main featured task (first task for demo)
  const featuredTask = tasks[0] || null;
  
  // Get tasks for progress section (show up to 3 tasks, excluding the featured task)
  const progressTasks = tasks.slice(1, 4).filter(Boolean);
  
  // For the sidebar, show tasks for the selected date
  const todaysTasks = getTasksByDate(currentViewDate);
  const sidebarTasks = todaysTasks.length > 0 ? todaysTasks.slice(0, 2) : [];

  const handleAddTask = () => {
    setSelectedTask(undefined);
    setSelectedDate(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setSelectedDate(undefined);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (selectedTask) {
      updateTask(selectedTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const handleSaveAndClose = (taskData: Omit<Task, 'id'>) => {
    if (selectedTask) {
      updateTask(selectedTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsModalOpen(false);
  };

  const handleDateSelect = (date: string) => {
    setCurrentViewDate(date);
    // Don't open modal, just update the date filter
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };



  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    toggleSubtask(taskId, subtaskId);
  };

  const handleAddSubtask = (taskId: string, title: string) => {
    addSubtask(taskId, title);
  };

  const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
    deleteSubtask(taskId, subtaskId);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            {/* All Tasks Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">My Tasks</h2>
                  <p className="text-gray-300 text-sm">
                    {progress.completed}/{progress.total} task done
                  </p>
                </div>
                <button
                  onClick={handleAddTask}
                  className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg px-4 py-2 flex items-center gap-2 text-white font-semibold hover:from-purple-600 hover:to-purple-800 transition-all duration-200"
                >
                  <Plus size={16} />
                  Add Task
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.length > 0 ? (
                  tasks.filter(task => task.date === currentViewDate).map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      variant="small" 
                      onEdit={handleEditTask}
                    />
                  ))
                ) : (
                  <div className="col-span-full">
                    <div className="bg-gray-800 rounded-lg p-8 text-center">
                      <p className="text-gray-400 text-sm mb-4">No tasks scheduled for this date</p>
                      <button
                        onClick={handleAddTask}
                        className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg px-6 py-3 flex items-center gap-2 text-white font-semibold hover:from-purple-600 hover:to-purple-800 transition-all duration-200 mx-auto"
                      >
                        <Plus size={18} />
                        Add task for this date
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Urgent Tasks Section */}
            <UrgentTasks urgentTasks={urgentTasks} onAddTask={handleAddTask} onEditTask={handleEditTask} />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <Calendar onDateSelect={handleDateSelect} selectedDate={currentViewDate} />
            <TodaysTasks tasks={sidebarTasks} />
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onSaveAndClose={handleSaveAndClose}
        onDelete={handleDeleteTask}
        onToggleSubtask={handleToggleSubtask}
        onAddSubtask={handleAddSubtask}
        onDeleteSubtask={handleDeleteSubtask}
        task={selectedTask}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default App; 