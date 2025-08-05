import React, { useState, useEffect, useRef } from 'react';
import { User, Grid, Bell, LogOut, Sparkles, Settings, Search, Zap, Star, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { currentUser, signOutUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const greetings = [
    "Ready to be productive today?",
    "Let's make today amazing! ✨",
    "Time to crush your goals! 🚀",
    "You've got this! 💪",
    "Today is your day! 🌟"
  ];

  // Rotate greetings
  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % greetings.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [greetings.length]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (dashboardRef.current && !dashboardRef.current.contains(event.target as Node)) {
        setShowDashboard(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16">
          {/* Left side - User info with enhanced animations */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg cursor-pointer transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 hover:animate-glow">
                <User size={24} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              
              {/* Floating particles around user avatar */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-float" style={{ animationDelay: '0s' }}></div>
                <div className="absolute bottom-0 left-0 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-float" style={{ animationDelay: '0.5s' }}></div>
              </div>
              
              {/* User dropdown with enhanced animation */}
              <div className="absolute top-full left-0 mt-2 w-48 card-modern opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 animate-fade-in-up">
                <div className="p-3">
                  <div className="text-sm text-white/70 mb-2">Signed in as</div>
                  <div className="font-medium text-white flex items-center">
                    {currentUser?.email}
                    <Sparkles className="w-3 h-3 ml-1 text-yellow-400 animate-pulse" />
                  </div>
                </div>
                <div className="border-t border-white/10">
                  <button className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-300 flex items-center">
                    <Settings size={16} className="inline mr-2 hover:animate-spin" />
                    Settings
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white flex items-center animate-fade-in-up">
                <Heart className="w-5 h-5 mr-2 text-red-400 animate-pulse-slow" />
                Hi, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
              </h1>
              <p className="text-white/70 text-sm animate-fade-in-up transition-all duration-500">
                {greetings[greetingIndex]}
              </p>
            </div>
          </div>
          
          {/* Right side - Actions with enhanced interactions */}
          <div className="flex items-center space-x-3">
            {/* Search with enhanced animation */}
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 group-hover:text-white/80 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="input-modern pl-10 pr-4 w-64 text-sm group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {/* Dashboard Button with enhanced animation */}
            <div className="relative" ref={dashboardRef}>
              <button 
                onClick={() => setShowDashboard(!showDashboard)}
                className="btn-secondary flex items-center space-x-2 relative hover:animate-pulse-slow"
              >
                <Grid size={20} className="text-white" />
                <span className="hidden sm:inline text-white">Dashboard</span>
                
                {/* Enhanced notification dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse">
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
                </div>
              </button>
              
              {/* Dashboard dropdown with enhanced animation */}
              {showDashboard && (
                <div className="absolute top-full right-0 mt-2 w-64 card-modern animate-fade-in-up hover-lift">
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-400 animate-pulse" />
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105">
                        📊 View Analytics
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105">
                        📅 Calendar View
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105">
                        ⚙️ Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Notifications with enhanced animation */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative btn-secondary hover:animate-wiggle"
              >
                <Bell size={20} className="text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse">
                  <div className="absolute inset-0 bg-red-400 rounded-full animate-ping"></div>
                </div>
              </button>
              
              {/* Notifications dropdown with enhanced animation */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 card-modern animate-fade-in-up hover-lift">
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-3 flex items-center">
                      <Bell className="w-4 h-4 mr-2 text-red-400 animate-pulse" />
                      Notifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300 animate-slide-in-right">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 animate-pulse"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">Task Due Soon</div>
                          <div className="text-xs text-white/70">"Design Review" is due in 2 hours</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 animate-pulse"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">Task Completed</div>
                          <div className="text-xs text-white/70">"API Integration" was marked complete</div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-3 text-center text-sm text-white/70 hover:text-white transition-colors duration-300 hover:scale-105">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sign Out with enhanced animation */}
            <button 
              onClick={handleSignOut}
              className="btn-modern flex items-center space-x-2 hover:animate-pulse-slow"
              title="Sign Out"
            >
              <LogOut size={20} className="text-white" />
              <span className="hidden sm:inline text-white">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Enhanced decorative element */}
      <div className="absolute top-0 left-0 w-full h-1 gradient-primary animate-pulse-slow"></div>
      
      {/* Floating stars */}
      <div className="absolute top-4 right-20 text-white/20 animate-float">
        <Star className="w-3 h-3" />
      </div>
      <div className="absolute top-8 right-40 text-white/20 animate-float" style={{ animationDelay: '1s' }}>
        <Star className="w-2 h-2" />
      </div>
    </header>
  );
};

export default Header; 