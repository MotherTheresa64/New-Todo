import React, { useState, useEffect, useRef } from 'react';
import { User, Grid, Bell, LogOut, Sparkles, Settings, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { currentUser, signOutUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - User info */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg cursor-pointer transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <User size={24} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              
              {/* User dropdown */}
              <div className="absolute top-full left-0 mt-2 w-48 card-modern opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100">
                <div className="p-3">
                  <div className="text-sm text-white/70 mb-2">Signed in as</div>
                  <div className="font-medium text-white">{currentUser?.email}</div>
                </div>
                <div className="border-t border-white/10">
                  <button className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                    <Settings size={16} className="inline mr-2" />
                    Settings
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">
                Hi, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
              </h1>
              <p className="text-white/70 text-sm">Ready to be productive today?</p>
            </div>
          </div>
          
          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="input-modern pl-10 pr-4 w-64 text-sm"
              />
            </div>

            {/* Dashboard Button */}
            <div className="relative" ref={dashboardRef}>
              <button 
                onClick={() => setShowDashboard(!showDashboard)}
                className="btn-secondary flex items-center space-x-2 relative"
              >
                <Grid size={20} className="text-white" />
                <span className="hidden sm:inline text-white">Dashboard</span>
                
                {/* Notification dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              </button>
              
              {/* Dashboard dropdown */}
              {showDashboard && (
                <div className="absolute top-full right-0 mt-2 w-64 card-modern animate-fade-in-up">
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        📊 View Analytics
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        📅 Calendar View
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        ⚙️ Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative btn-secondary"
              >
                <Bell size={20} className="text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              </button>
              
              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 card-modern animate-fade-in-up">
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-3">Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">Task Due Soon</div>
                          <div className="text-xs text-white/70">"Design Review" is due in 2 hours</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">Task Completed</div>
                          <div className="text-xs text-white/70">"API Integration" was marked complete</div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-3 text-center text-sm text-white/70 hover:text-white transition-colors">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sign Out */}
            <button 
              onClick={handleSignOut}
              className="btn-modern flex items-center space-x-2"
              title="Sign Out"
            >
              <LogOut size={20} className="text-white" />
              <span className="hidden sm:inline text-white">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute top-0 left-0 w-full h-1 gradient-primary"></div>
    </header>
  );
};

export default Header; 