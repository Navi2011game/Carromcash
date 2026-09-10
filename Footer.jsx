import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#120819] border-t border-pink-500/10 py-10 px-4 mt-auto text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div>
          <h3 className="text-xl font-black text-white">Carrom<span className="text-pink-500">Cash</span></h3>
          <p className="text-xs text-gray-400 max-w-sm mt-2">
            The premier destination for competitive Carrom enthusiasts. Skill, Strategy, and Rewards all in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <Link to="/how-to-play" className="hover:text-pink-400 transition">How to Play</Link>
          <Link to="/leaderboard" className="hover:text-pink-400 transition">Leaderboard</Link>
          <Link to="/wallet" className="hover:text-pink-400 transition">Wallet & Rules</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-pink-900/20 mt-8 pt-4 text-center text-xs text-gray-500">
        © 2026 CarromCash. All rights reserved. 1 Coin = 1 LKR.
      </div>
    </footer>
  );
}
