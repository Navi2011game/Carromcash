import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Trophy, Medal, Crown } from 'lucide-react';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('coins', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        const topUsers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setLeaders(topUsers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#1F0F2A] text-white p-4 max-w-4xl mx-auto py-10">
      <div className="text-center mb-10">
        <Crown className="w-12 h-12 text-amber-400 mx-auto mb-2" />
        <h2 className="text-3xl font-black">Top Carrom Masters</h2>
        <p className="text-sm text-gray-400">Highest coin holders across Sri Lanka</p>
      </div>

      <div className="bg-white/5 border border-pink-500/20 rounded-2xl p-4 backdrop-blur-md">
        {loading ? (
          <p className="text-center py-8 text-pink-500 font-bold">Loading Top Masters...</p>
        ) : (
          <div className="space-y-3">
            {leaders.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-pink-500/10 hover:border-pink-500/30 transition"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-pink-950/60 border border-pink-500/30 flex items-center justify-center font-bold text-sm text-pink-400">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-white">{player.phone ? player.phone.replace(/(\d{5})\d{4}/, '$1****') : 'Anonymous'}</h4>
                    <p className="text-xs text-gray-400">{player.totalWins || 0} Wins</p>
                  </div>
                </div>
                <div className="font-black text-pink-400">
                  {player.coins} <span className="text-xs text-gray-400">Coins</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
