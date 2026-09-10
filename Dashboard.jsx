import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Play, Wallet, ArrowDownCircle, ArrowUpCircle, Trophy, Gift } from 'lucide-react';

export default function Dashboard() {
  const { userData, claimDailyBonus } = useStore();

  const handleClaimBonus = async () => {
    const success = await claimDailyBonus();
    if (success) {
      toast.success('+50 Daily Bonus Coins Claimed!');
    } else {
      toast.error('Daily Bonus already claimed. Try again in 24 hours!');
    }
  };

  return (
    <div className="min-h-screen bg-[#1F0F2A] text-white p-4 max-w-6xl mx-auto py-8">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-pink-900/40 to-pink-950/20 border border-pink-500/30 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Coin Balance</p>
            <h2 className="text-3xl font-black text-white mt-1">{userData?.coins || 0} <span className="text-pink-500 text-sm">LKR</span></h2>
          </div>
          <Wallet className="w-10 h-10 text-pink-500 opacity-80" />
        </div>

        <div className="bg-white/5 border border-pink-500/20 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Total Wins</p>
            <h2 className="text-3xl font-black text-white mt-1">{userData?.totalWins || 0}</h2>
          </div>
          <Trophy className="w-10 h-10 text-amber-500 opacity-80" />
        </div>

        <div className="bg-white/5 border border-pink-500/20 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Games Played</p>
            <h2 className="text-3xl font-black text-white mt-1">{userData?.totalGames || 0}</h2>
          </div>
          <button 
            onClick={handleClaimBonus}
            className="flex items-center gap-1 bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500/40 px-3 py-2 rounded-xl text-xs font-bold text-pink-300 transition"
          >
            <Gift className="w-4 h-4 text-pink-400" /> Daily Bonus
          </button>
        </div>
      </div>

      {/* Main Game Play Card */}
      <div className="bg-gradient-to-r from-pink-900/30 via-purple-900/20 to-black/40 border border-pink-500/30 p-8 rounded-3xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Ready to Strike?</h2>
          <p className="text-gray-300 max-w-md">Match against smart AI or play locally with friends. Win games to double your entry fee coins!</p>
        </div>
        <Link to="/game" className="w-full md:w-auto bg-pink-600 hover:bg-pink-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 text-lg transition">
          <Play className="fill-white w-5 h-5" /> Play Game Now
        </Link>
      </div>

      {/* Quick Navigation Action Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Link to="/wallet" className="bg-white/5 hover:bg-white/10 border border-pink-500/20 p-5 rounded-2xl flex items-center gap-3 transition">
          <ArrowDownCircle className="w-6 h-6 text-emerald-400" />
          <div>
            <h4 className="font-bold text-sm">Deposit</h4>
            <p className="text-xs text-gray-400">Add funds</p>
          </div>
        </Link>

        <Link to="/wallet" className="bg-white/5 hover:bg-white/10 border border-pink-500/20 p-5 rounded-2xl flex items-center gap-3 transition">
          <ArrowUpCircle className="w-6 h-6 text-pink-400" />
          <div>
            <h4 className="font-bold text-sm">Withdraw</h4>
            <p className="text-xs text-gray-400">Cash out</p>
          </div>
        </Link>

        <Link to="/leaderboard" className="bg-white/5 hover:bg-white/10 border border-pink-500/20 p-5 rounded-2xl flex items-center gap-3 transition col-span-2 md:col-span-1">
          <Trophy className="w-6 h-6 text-amber-400" />
          <div>
            <h4 className="font-bold text-sm">Leaderboard</h4>
            <p className="text-xs text-gray-400">Top rankings</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
