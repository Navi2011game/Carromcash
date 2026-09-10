import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { auth } from '../firebase';
import { Coins, LogOut, ShieldAlert, User, Dices } from 'lucide-react';

export default function Navbar() {
  const { user, userData, setUser, setUserData } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setUserData(null);
    navigate('/login');
  };

  return (
    <nav className="bg-[#1F0F2A]/80 backdrop-blur-md border-b border-pink-500/20 sticky top-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-105 transition-transform">
            <Dices className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Carrom<span className="text-pink-500">Cash</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user && userData ? (
            <>
              <Link to="/wallet" className="flex items-center gap-1.5 bg-pink-950/60 border border-pink-500/30 px-3 py-1.5 rounded-full text-pink-400 font-bold hover:bg-pink-900/40 transition">
                <Coins className="w-4 h-4 text-pink-500" />
                <span>{userData.coins}</span>
              </Link>
              
              <Link to="/dashboard" className="text-gray-300 hover:text-pink-400 font-medium text-sm hidden sm:block">Dashboard</Link>
              <Link to="/leaderboard" className="text-gray-300 hover:text-pink-400 font-medium text-sm hidden sm:block">Leaderboard</Link>
              
              {userData.isAdmin && (
                <Link to="/admin" className="flex items-center gap-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-md font-semibold hover:bg-red-500/30">
                  <ShieldAlert className="w-3.5 h-3.5" /> Admin
                </Link>
              )}

              <Link to="/profile" className="text-gray-300 hover:text-pink-400 p-2">
                <User className="w-5 h-5" />
              </Link>

              <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 p-2 transition">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-5 py-2 rounded-xl transition shadow-lg shadow-pink-600/30">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
