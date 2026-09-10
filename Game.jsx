import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { useStore } from '../store/useStore';
import { db } from '../firebase';
import { doc, updateDoc, addDoc, collection, Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { RefreshCw, Bot, Users } from 'lucide-react';

export default function Game() {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const { user, userData, refreshUserData } = useStore();

  const [mode, setMode] = useState('vsBot'); // 'vsBot' or '2player'
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [turn, setTurn] = useState('P1'); // 'P1' or 'P2' (or 'BOT')
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // 1. Setup Engine & World
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Constraint = Matter.Constraint,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create({
      gravity: { x: 0, y: 0 } // Top-down carrom board view
    });
    engineRef.current = engine;

    const width = 500;
    const height = 500;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: '#e0a96d' // Wooden board finish
      }
    });

    // 2. Board Boundaries & Pockets
    const wallOptions = { isStatic: true, render: { fillStyle: '#3d2314' } };
    const walls = [
      Bodies.rectangle(width / 2, 10, width, 20, wallOptions),
      Bodies.rectangle(width / 2, height - 10, width, 20, wallOptions),
      Bodies.rectangle(10, height / 2, 20, height, wallOptions),
      Bodies.rectangle(width - 10, height / 2, 20, height, wallOptions)
    ];

    // Pocket Sensors
    const pocketRadius = 25;
    const pockets = [
      Bodies.circle(35, 35, pocketRadius, { isSensor: true, isStatic: true, render: { fillStyle: '#1f0f2a' } }),
      Bodies.circle(width - 35, 35, pocketRadius, { isSensor: true, isStatic: true, render: { fillStyle: '#1f0f2a' } }),
      Bodies.circle(35, height - 35, pocketRadius, { isSensor: true, isStatic: true, render: { fillStyle: '#1f0f2a' } }),
      Bodies.circle(width - 35, height - 35, pocketRadius, { isSensor: true, isStatic: true, render: { fillStyle: '#1f0f2a' } })
    ];

    // 3. Pieces Setup (Puck options)
    const coinOptions = { friction: 0.02, restitution: 0.8, density: 0.05 };
    
    // Striker
    const striker = Bodies.circle(width / 2, height - 80, 16, {
      ...coinOptions,
      render: { fillStyle: '#ec4899', strokeStyle: '#ffffff', lineWidth: 3 },
      label: 'striker'
    });

    // Queen
    const queen = Bodies.circle(width / 2, height / 2, 12, {
      ...coinOptions,
      render: { fillStyle: '#fbbf24' },
      label: 'queen'
    });

    // White and Black Pieces arranged in center cluster
    const pieces = [];
    const radius = 12;
    const center = { x: width / 2, y: height / 2 };

    for (let i = 0; i < 9; i++) {
      const angle = (i * Math.PI) / 4.5;
      pieces.push(
        Bodies.circle(center.x + Math.cos(angle) * 25, center.y + Math.sin(angle) * 25, radius, {
          ...coinOptions,
          render: { fillStyle: i % 2 === 0 ? '#ffffff' : '#111111' },
          label: i % 2 === 0 ? 'white' : 'black'
        })
      );
    }

    Composite.add(engine.world, [...walls, ...pockets, striker, queen, ...pieces]);

    // Slingshot / Drag mechanism for Striker
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        render: { visible: true, strokeStyle: '#ec4899' }
      }
    });
    Composite.add(engine.world, mouseConstraint);

    // Collision Detection (Pockets)
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const isPocketA = pockets.includes(bodyA);
        const isPocketB = pockets.includes(bodyB);

        if (isPocketA || isPocketB) {
          const coin = isPocketA ? bodyB : bodyA;
          if (coin.label !== 'striker') {
            Composite.remove(engine.world, coin);
            setScore((prev) => ({
              ...prev,
              [turn === 'P1' ? 'p1' : 'p2']: prev[turn === 'P1' ? 'p1' : 'p2'] + (coin.label === 'queen' ? 50 : 10)
            }));
          } else {
            // Reset Striker to baseline on scratch
            Matter.Body.setPosition(striker, { x: width / 2, y: height - 80 });
            Matter.Body.setVelocity(striker, { x: 0, y: 0 });
          }
        }
      });
    });

    Runner.run(Runner.create(), engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      Engine.clear(engine);
    };
  }, [mode]);

  // Handle Bot Logic Trigger
  useEffect(() => {
    if (mode === 'vsBot' && turn === 'P2' && !gameOver) {
      setTimeout(() => {
        executeBotShot();
      }, 1000);
    }
  }, [turn, mode]);

  const executeBotShot = () => {
    if (!engineRef.current) return;
    const isFirstTimeUser = userData?.totalGames === 0;
    const isMiss = isFirstTimeUser ? Math.random() < 0.7 : Math.random() < 0.05; // 70% miss for easy, 95% accuracy for hard

    const forceX = isMiss ? (Math.random() - 0.5) * 0.05 : 0.02;
    const forceY = isMiss ? -0.02 : -0.08;

    // Apply force on striker
    const striker = engineRef.current.world.bodies.find((b) => b.label === 'striker');
    if (striker) {
      Matter.Body.applyForce(striker, striker.position, { x: forceX, y: forceY });
    }
    setTurn('P1');
  };

  const handleGameEnd = async (p1Won) => {
    setGameOver(true);
    const coinsChange = p1Won ? 200 : -100;

    try {
      // Update Firestore user record
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        coins: Math.max(0, (userData?.coins || 0) + coinsChange),
        totalGames: (userData?.totalGames || 0) + 1,
        totalWins: p1Won ? (userData?.totalWins || 0) + 1 : (userData?.totalWins || 0)
      });

      // Log game history
      await addDoc(collection(db, 'game_history'), {
        uid: user.uid,
        result: p1Won ? 'WIN' : 'LOSS',
        coinsChange,
        createdAt: Timestamp.now()
      });

      toast.success(p1Won ? 'You Won +200 Coins!' : 'Game Over -100 Coins');
      await refreshUserData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F0F2A] text-white p-4 flex flex-col items-center">
      {/* Mode Selector */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode('vsBot')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition ${
            mode === 'vsBot' ? 'bg-pink-600 text-white' : 'bg-white/5 text-gray-400'
          }`}
        >
          <Bot className="w-5 h-5" /> vs Bot ({userData?.totalGames === 0 ? 'Easy' : 'Hard'})
        </button>
        <button
          onClick={() => setMode('2player')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition ${
            mode === '2player' ? 'bg-pink-600 text-white' : 'bg-white/5 text-gray-400'
          }`}
        >
          <Users className="w-5 h-5" /> 2 Player Local
        </button>
      </div>

      {/* Score Header */}
      <div className="flex justify-between w-full max-w-[500px] mb-4 bg-white/5 p-4 rounded-xl border border-pink-500/20">
        <div>
          <p className="text-xs text-gray-400">Player 1</p>
          <h3 className="text-xl font-black text-pink-500">{score.p1} pts</h3>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Turn</p>
          <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-1 rounded font-bold">{turn}</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{mode === 'vsBot' ? 'Bot' : 'Player 2'}</p>
          <h3 className="text-xl font-black text-purple-400">{score.p2} pts</h3>
        </div>
      </div>

      {/* Canvas Mount Container */}
      <div className="border-4 border-[#3d2314] rounded-2xl overflow-hidden shadow-2xl" ref={sceneRef} />

      {/* Action Controls */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => handleGameEnd(true)}
          className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-sm font-bold"
        >
          Simulate Win (+200)
        </button>
        <button
          onClick={() => handleGameEnd(false)}
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl text-sm font-bold"
        >
          Simulate Defeat (-100)
        </button>
      </div>
    </div>
  );
}
