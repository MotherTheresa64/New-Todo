import React, { useState, useEffect } from 'react';
import { Plus, AlertTriangle, Sparkles, Zap, Star } from 'lucide-react';
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
  const [showConfetti, setShowConfetti] = useState(false);

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

  // Show confetti when all tasks are completed
  useEffect(() => {
    const tasksForSelectedDate = tasks.filter(task => task.date === currentViewDate);
    const completedTasks = tasksForSelectedDate.filter(task => task.progress === 100);
    
    if (tasksForSelectedDate.length > 0 && completedTasks.length === tasksForSelectedDate.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [tasks, currentViewDate]);

  // If user is not authenticated, show login screen
  if (!currentUser) {
    return <Login />;
  }

  // Show loading state with enhanced animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-pulse">
              <Sparkles className="w-8 h-8 text-white/60 mx-auto" />
            </div>
          </div>
          <p className="text-white text-lg font-medium animate-pulse">Loading your tasks...</p>
          <p className="text-white/60 text-sm mt-2 animate-fade-in-up">Preparing your productivity dashboard</p>
        </div>
      </div>
    );
  }

  // Show error state with retry animation
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 flex items-center justify-center">
        <div className="text-center animate-bounce-slow">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <p className="text-white mb-4 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-modern animate-glow"
          >
            <Zap className="w-4 h-4 mr-2" />
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute text-white/20 animate-pulse-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            <Star className="w-3 h-3" />
          </div>
        ))}
      </div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content - 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            {/* Add Task Button with enhanced animation */}
            <div className="flex justify-between items-center animate-fade-in-up">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 animate-pulse-slow" />
                  My Tasks
                </h2>
                <p className="text-white/70">
                  {progress.total === 0 
                    ? "No tasks yet. Create your first task to get started!" 
                    : `${progress.completed} of ${progress.total} tasks completed`
                  }
                </p>
              </div>
              <button
                onClick={handleAddTask}
                className="btn-modern flex items-center space-x-2 ripple hover-glow animate-pulse-slow"
              >
                <Plus size={20} className="text-white" />
                <span>Add Task</span>
              </button>
            </div>

            {/* Tasks Grid with staggered animations */}
            {tasksForSelectedDate.length === 0 ? (
              <div className="card-modern text-center py-12 animate-fade-in-up hover-lift">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
                  <Plus size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No tasks for this date</h3>
                <p className="text-white/70 mb-6">Create a new task to get started with your productivity journey</p>
                <button
                  onClick={handleAddTask}
                  className="btn-modern ripple hover-glow"
                >
                  Create Your First Task
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tasksForSelectedDate.map((task, index) => (
                  <div
                    key={task.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <TaskCard
                      task={task}
                      onClick={() => handleEditTask(task)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Urgent Tasks Section with enhanced styling */}
            <div className="space-y-4 animate-slide-in-right">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <AlertTriangle size={24} className="text-red-400 animate-pulse" />
                <span>Urgent Tasks</span>
              </h3>
              <UrgentTasks 
                urgentTasks={urgentTasks} 
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
              />
            </div>
          </div>

          {/* Sidebar - 1 column with animations */}
          <div className="space-y-6">
            {/* Calendar with enhanced animation */}
            <div className="card-modern animate-fade-in-up hover-lift">
              <Calendar
                selectedDate={currentViewDate}
                onDateSelect={handleDateSelect}
              />
            </div>

            {/* Today's Tasks with animation */}
            <div className="card-modern animate-slide-in-right hover-lift">
              <TodaysTasks tasks={sidebarTasks} />
            </div>
          </div>
        </div>
      </main>

      {/* Task Modal with enhanced backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
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