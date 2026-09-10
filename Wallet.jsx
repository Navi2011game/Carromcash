import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { db, storage } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import { ArrowDownCircle, ArrowUpCircle, Upload, Building2 } from 'lucide-react';

export default function Wallet() {
  const { user, userData } = useStore();
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' or 'withdraw'

  // Deposit Form State
  const [depositCoins, setDepositCoins] = useState(500);
  const [proofFile, setProofFile] = useState(null);
  const [depositing, setDepositing] = useState(false);

  // Withdraw Form State
  const [withdrawCoins, setWithdrawCoins] = useState(5000);
  const [bankDetails, setBankDetails] = useState({ bankName: '', accountNo: '', name: '' });
  const [withdrawing, setWithdrawing] = useState(false);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (depositCoins < 500) return toast.error('Minimum deposit is 500 Coins');
    if (!proofFile) return toast.error('Please upload payment slip proof');

    setDepositing(true);
    try {
      const storageRef = ref(storage, `receipts/${user.uid}_${Date.now()}`);
      await uploadBytes(storageRef, proofFile);
      const proofUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        type: 'DEPOSIT',
        coins: Number(depositCoins),
        status: 'PENDING',
        proofUrl,
        createdAt: Timestamp.now()
      });

      toast.success('Deposit Request Submitted for Approval!');
      setProofFile(null);
    } catch (err) {
      toast.error('Deposit submission failed');
      console.error(err);
    } finally {
      setDepositing(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (withdrawCoins < 5000) return toast.error('Minimum withdrawal is 5000 Coins');
    if ((userData?.coins || 0) < withdrawCoins) return toast.error('Insufficient Coin Balance');

    setWithdrawing(true);
    try {
      await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        type: 'WITHDRAW',
        coins: Number(withdrawCoins),
        status: 'PENDING',
        bankDetails,
        createdAt: Timestamp.now()
      });

      toast.success('Withdrawal Request Submitted!');
    } catch (err) {
      toast.error('Withdrawal failed');
      console.error(err);
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F0F2A] text-white p-4 max-w-2xl mx-auto py-10">
      <div className="bg-white/5 border border-pink-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-md">
        <h2 className="text-2xl font-black mb-6">Wallet Operations</h2>

        {/* Tabs */}
        <div className="flex bg-black/40 p-1 rounded-xl mb-8 border border-pink-500/20">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-2.5 font-bold rounded-lg text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'deposit' ? 'bg-pink-600 text-white' : 'text-gray-400'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4" /> Deposit
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-2.5 font-bold rounded-lg text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'withdraw' ? 'bg-pink-600 text-white' : 'text-gray-400'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" /> Withdraw
          </button>
        </div>

        {activeTab === 'deposit' ? (
          <form onSubmit={handleDeposit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-2">Coins to Deposit (Min 500)</label>
              <input
                type="number"
                min="500"
                value={depositCoins}
                onChange={(e) => setDepositCoins(e.target.value)}
                className="w-full bg-black/40 border border-pink-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-2">Upload Payment Proof</label>
              <input
                type="file"
                onChange={(e) => setProofFile(e.target.files[0])}
                className="w-full bg-black/40 border border-pink-500/30 rounded-xl p-3 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-pink-600 file:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={depositing}
              className="w-full bg-pink-600 hover:bg-pink-500 py-3.5 rounded-xl font-bold transition shadow-lg shadow-pink-600/30"
            >
              {depositing ? 'Submitting...' : 'Submit Deposit'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Coins to Withdraw (Min 5000)</label>
              <input
                type="number"
                min="5000"
                value={withdrawCoins}
                onChange={(e) => setWithdrawCoins(e.target.value)}
                className="w-full bg-black/40 border border-pink-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Bank Name</label>
              <input
                type="text"
                required
                placeholder="Commercial Bank / Sampath Bank"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                className="w-full bg-black/40 border border-pink-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Account Number</label>
              <input
                type="text"
                required
                value={bankDetails.accountNo}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNo: e.target.value })}
                className="w-full bg-black/40 border border-pink-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Account Holder Name</label>
              <input
                type="text"
                required
                value={bankDetails.name}
                onChange={(e) => setBankDetails({ ...bankDetails, name: e.target.value })}
                className="w-full bg-black/40 border border-pink-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500"
              />
            </div>
            <button
              type="submit"
              disabled={withdrawing}
              className="w-full bg-pink-600 hover:bg-pink-500 py-3.5 rounded-xl font-bold transition shadow-lg shadow-pink-600/30 mt-4"
            >
              {withdrawing ? 'Processing...' : 'Request Withdrawal'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
