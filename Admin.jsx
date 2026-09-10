import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Search, ShieldCheck } from 'lucide-react';

export default function Admin() {
  const [txns, setTxns] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchPhone, setSearchPhone] = useState('');

  const fetchData = async () => {
    const txnSnap = await getDocs(collection(db, 'transactions'));
    setTxns(txnSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

    const userSnap = await getDocs(collection(db, 'users'));
    setUsers(userSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveDeposit = async (txn) => {
    try {
      // 1. Mark transaction paid
      await updateDoc(doc(db, 'transactions', txn.id), { status: 'APPROVED' });
      // 2. Add coins to user
      await updateDoc(doc(db, 'users', txn.uid), { coins: increment(txn.coins) });

      toast.success('Deposit Approved & Coins Added!');
      fetchData();
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleApproveWithdraw = async (txn) => {
    try {
      // 1. Mark transaction completed
      await updateDoc(doc(db, 'transactions', txn.id), { status: 'APPROVED' });
      // 2. Deduct user coins
      await updateDoc(doc(db, 'users', txn.uid), { coins: increment(-txn.coins) });

      toast.success('Withdrawal Approved & Processed!');
      fetchData();
    } catch (err) {
      toast.error('Withdrawal approval failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#1F0F2A] text-white p-4 max-w-6xl mx-auto py-10">
      <div className="flex items-center gap-2 mb-8">
        <ShieldCheck className="w-8 h-8 text-pink-500" />
        <h1 className="text-3xl font-black">Admin Management Panel</h1>
      </div>

      {/* Pending Transactions Section */}
      <div className="bg-white/5 border border-pink-500/20 rounded-2xl p-6 mb-10">
        <h3 className="text-xl font-bold mb-4">Pending Requests</h3>
        <div className="space-y-4">
          {txns.filter((t) => t.status === 'PENDING').map((txn) => (
            <div key={txn.id} className="bg-black/40 border border-pink-500/20 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${txn.type === 'DEPOSIT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-pink-500/20 text-pink-400'}`}>
                  {txn.type}
                </span>
                <p className="font-black text-lg mt-1">{txn.coins} Coins</p>
                {txn.proofUrl && <a href={txn.proofUrl} target="_blank" rel="noreferrer" className="text-xs text-pink-400 underline">View Slip Proof</a>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => (txn.type === 'DEPOSIT' ? handleApproveDeposit(txn) : handleApproveWithdraw(txn))}
                  className="bg-emerald-600 hover:bg-emerald-500 p-2 rounded-lg text-white font-bold text-xs"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
