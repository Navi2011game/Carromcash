import React, { useState, useEffect } from 'react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber, db } from '../firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Phone, Lock } from 'lucide-react';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('+94');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible'
    });
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      toast.success('OTP Sent Successfully!');
    } catch (err) {
      toast.error('Failed to send OTP. Check phone format.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await confirmationResult.confirm(otp);
      const user = res.user;

      // Check if user exists in Firestore, if not create doc with 200 coin welcome bonus
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          phone: user.phoneNumber,
          coins: 200, // Welcome Bonus
          isAdmin: false,
          totalGames: 0,
          totalWins: 0,
          lastLoginBonus: Timestamp.now(),
          createdAt: Timestamp.now()
        });
        toast.success('Welcome Bonus +200 Coins Added!');
      }

      toast.success('Successfully Logged In!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Invalid OTP Verification Code.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F0F2A] flex items-center justify-center px-4 py-12">
      <div id="recaptcha-container"></div>
      <div className="max-w-md w-full bg-white/5 border border-pink-500/20 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
        <h2 className="text-3xl font-black text-center text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400 text-center text-sm mb-8">Enter your phone number to continue</p>

        {!confirmationResult ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+94712345678"
                  required
                  className="w-full bg-black/40 border border-pink-500/30 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition"
            >
              {loading ? 'Sending OTP...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-2">Enter OTP</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  required
                  className="w-full bg-black/40 border border-pink-500/30 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition"
            >
              {loading ? 'Verifying...' : 'Verify & Enter'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
