import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ShieldCheck, Cpu, Smartphone, Award, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#1F0F2A] text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
            Master the <span className="text-pink-500">Board</span>, Win Real <span className="text-pink-500">Cash</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Experience the most realistic professional Carrom game on your browser. Compete with the world's best players, defeat the AI, and turn your skills into real money.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/game" className="bg-pink-600 hover:bg-pink-500 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-pink-600/40 flex items-center justify-center gap-2 transition">
              Start Playing <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/how-to-play" className="bg-white/5 hover:bg-white/10 text-white font-semibold text-lg px-8 py-4 rounded-xl border border-pink-500/20 backdrop-blur-sm transition">
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Proof / Social Section */}
      <section className="py-8 bg-pink-950/20 border-y border-pink-500/10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-around gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold text-white">Joined by 10,000+ Carrom Masters</h3>
            <p className="text-sm text-gray-400">Join the largest competitive board gaming platform in LK.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-pink-900/40 border border-pink-500/30 px-4 py-2 rounded-xl text-pink-400 font-bold text-sm">
              +200 Coins Daily Signup
            </div>
            <div className="bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-xl text-amber-300 font-bold text-sm">
              👑 Queen Pocketed!
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-pink-500/20 p-8 rounded-2xl backdrop-blur-md">
            <ShieldCheck className="w-12 h-12 text-pink-500 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Instant Payouts</h3>
            <p className="text-gray-300">
              Withdraw your winnings instantly. 1 Coin equals 1 LKR, transferred directly to your bank account.
            </p>
          </div>
          <div className="bg-white/5 border border-pink-500/20 p-8 rounded-2xl backdrop-blur-md">
            <Cpu className="w-12 h-12 text-pink-500 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Adaptive AI</h3>
            <p className="text-gray-300">
              Play against our smart bot. It adapts to your skill level, from Easy for beginners to Hard for pros.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-[#180B22]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-pink-950/10 border border-pink-500/10">
              <div className="w-12 h-12 rounded-full bg-pink-600 font-black text-xl flex items-center justify-center mx-auto mb-4">1</div>
              <h4 className="text-xl font-bold mb-2">Register</h4>
              <p className="text-sm text-gray-400">Sign up with your phone number via OTP. Get a daily login bonus to start your first game.</p>
            </div>
            <div className="p-6 rounded-xl bg-pink-950/10 border border-pink-500/10">
              <div className="w-12 h-12 rounded-full bg-pink-600 font-black text-xl flex items-center justify-center mx-auto mb-4">2</div>
              <h4 className="text-xl font-bold mb-2">Play & Win</h4>
              <p className="text-sm text-gray-400">Choose between local multiplayer or challenge the AI. Pocket the queen and coins to win.</p>
            </div>
            <div className="p-6 rounded-xl bg-pink-950/10 border border-pink-500/10">
              <div className="w-12 h-12 rounded-full bg-pink-600 font-black text-xl flex items-center justify-center mx-auto mb-4">3</div>
              <h4 className="text-xl font-bold mb-2">Withdraw</h4>
              <p className="text-sm text-gray-400">Accumulate coins in your wallet and withdraw them directly to your bank account once you hit the limit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-500/30 p-10 rounded-3xl backdrop-blur-md">
          <h2 className="text-3xl font-black mb-6">Ready to prove your Carrom Mastery?</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/login" className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition">
              Create Free Account
            </Link>
            <Link to="/leaderboard" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition">
              View Leaderboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
