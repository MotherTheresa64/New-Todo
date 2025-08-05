import React, { useState, useEffect } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content - 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            {/* Add Task Button */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">My Tasks</h2>
                <p className="text-white/70">
                  {progress.total === 0 
                    ? "No tasks yet. Create your first task to get started!" 
                    : `${progress.completed} of ${progress.total} tasks completed`
                  }
                </p>
              </div>
              <button
                onClick={handleAddTask}
                className="btn-modern flex items-center space-x-2"
              >
                <Plus size={20} className="text-white" />
                <span>Add Task</span>
              </button>
            </div>

            {/* Tasks Grid */}
            {tasksForSelectedDate.length === 0 ? (
              <div className="card-modern text-center py-12 animate-fade-in-up">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plus size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No tasks for this date</h3>
                <p className="text-white/70 mb-6">Create a new task to get started with your productivity journey</p>
                <button
                  onClick={handleAddTask}
                  className="btn-modern"
                >
                  Create Your First Task
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tasksForSelectedDate.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => handleEditTask(task)}
                  />
                ))}
              </div>
            )}

            {/* Urgent Tasks Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <AlertTriangle size={24} className="text-red-400" />
                <span>Urgent Tasks</span>
              </h3>
              <UrgentTasks 
                urgentTasks={urgentTasks} 
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
              />
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Calendar */}
            <div className="card-modern">
              <Calendar
                selectedDate={currentViewDate}
                onDateSelect={handleDateSelect}
              />
            </div>

            {/* Today's Tasks */}
            <div className="card-modern">
              <TodaysTasks tasks={sidebarTasks} />
            </div>
          </div>
        </div>
      </main>

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
              selectedDate={undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App; 