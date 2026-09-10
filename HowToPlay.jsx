// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Profile() {
  const { userData, user } = useStore();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      const q = query(collection(db, 'game_history'), where('uid', '==', user.uid));
      const snap = await getDocs(q);
      setHistory(snap.docs.map((d) => d.data()));
    };
    fetchHistory();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#1F0F2A] text-white p-4 max-w-3xl mx-auto py-10">
      <div className="bg-white/5 border border-pink-500/20 p-6 rounded-2xl mb-8">
        <h2 className="text-2xl font-black">{userData?.phone}</h2>
        <p className="text-pink-400 font-bold mt-1">{userData?.coins} Coins Available</p>
      </div>

      <h3 className="text-xl font-bold mb-4">Game Match History</h3>
      <div className="space-y-3">
        {history.map((game, i) => (
          <div key={i} className="bg-black/30 border border-pink-500/10 p-4 rounded-xl flex justify-between items-center">
            <span className={game.result === 'WIN' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {game.result}
            </span>
            <span className="font-bold">{game.coinsChange > 0 ? `+${game.coinsChange}` : game.coinsChange} Coins</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// src/pages/HowToPlay.jsx
export function HowToPlay() {
  return (
    <div className="min-h-screen bg-[#1F0F2A] text-white p-4 max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-black mb-6">Carrom Rules & Gameplay</h1>
      <div className="space-y-4 text-gray-300">
        <p>1. Pocket all designated pieces before your opponent to claim victory.</p>
        <p>2. Pocketing the Queen gives 50 bonus points, but must be covered by another piece on the next shot.</p>
        <p>3. 1 Coin = 1 LKR real-value balance.</p>
      </div>
    </div>
  );
}
