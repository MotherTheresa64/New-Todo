import React from 'react';
import { User, Grid, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { currentUser, signOutUser } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 md:p-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <User size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-white">
            Hi, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
          </h1>
          <p className="text-gray-300 text-xs md:text-sm">Be productive today.</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
          <Grid size={20} className="text-gray-300" />
        </button>
        <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
          <Bell size={20} className="text-gray-300" />
        </button>
        <button 
          onClick={handleSignOut}
          className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors"
          title="Sign Out"
        >
          <LogOut size={20} className="text-white" />
        </button>
      </div>
    </header>
  );
};

export default Header; 