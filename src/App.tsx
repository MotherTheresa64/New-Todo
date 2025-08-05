import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Header from './components/Header';
import TaskCard from './components/TaskCard';
import UrgentTasks from './components/UrgentTasks';
import Calendar from './components/Calendar';
import TodaysTasks from './components/TodaysTasks';
import TaskModal from './components/TaskModal';
import Login from './components/Login';
import { useTasks } from './hooks/useTasks';
import { useAuth } from './contexts/AuthContext';
import { Task } from './types';

const App: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    getTasksByDate,
    getUrgentTasks,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [currentViewDate, setCurrentViewDate] = useState(new Date().toISOString().split('T')[0]);
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);

  // Load urgent tasks and today's tasks when date changes
  useEffect(() => {
    const loadTasksForDate = async () => {
      try {
        const [urgent, today] = await Promise.all([
          getUrgentTasks(),
          getTasksByDate(currentViewDate)
        ]);
        
        // Process urgent tasks
        const processedUrgentTasks = urgent.filter(task => {
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

        setUrgentTasks(processedUrgentTasks);
        setTodaysTasks(today);
      } catch (err) {
        console.error('Error loading tasks for date:', err);
      }
    };

    if (currentUser) {
      loadTasksForDate();
    }
  }, [currentUser, currentViewDate, getUrgentTasks, getTasksByDate]);

  // If user is not authenticated, show login screen
  if (!currentUser) {
    return <Login />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => task.date === currentViewDate);
  const completedTasksForDate = tasksForSelectedDate.filter(task => task.progress === 100).length;
  const progress = { completed: completedTasksForDate, total: tasksForSelectedDate.length };
  
  // For the sidebar, show tasks for the selected date
  const sidebarTasks = todaysTasks.length > 0 ? todaysTasks.slice(0, 2) : [];

  const handleAddTask = () => {
    setSelectedTask(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, taskData);
      } else {
        await addTask(taskData);
      }
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleSaveAndClose = async (taskData: Omit<Task, 'id'>) => {
    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, taskData);
      } else {
        await addTask(taskData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleDateSelect = (date: string) => {
    setCurrentViewDate(date);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    try {
      await toggleSubtask(taskId, subtaskId);
    } catch (err) {
      console.error('Error toggling subtask:', err);
    }
  };

  const handleAddSubtask = async (taskId: string, title: string) => {
    try {
      await addSubtask(taskId, title);
    } catch (err) {
      console.error('Error adding subtask:', err);
    }
  };

  const handleDeleteSubtask = async (taskId: string, subtaskId: string) => {
    try {
      await deleteSubtask(taskId, subtaskId);
    } catch (err) {
      console.error('Error deleting subtask:', err);
    }
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
        selectedDate={undefined} // Removed selectedDate prop as it's not used in the modal
      />
    </div>
  );
};

export default App; 