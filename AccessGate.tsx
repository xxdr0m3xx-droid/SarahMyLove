
import React, { useState } from 'react';

interface AccessGateProps {
  onAccess: (key: string) => void;
  onAdminRequest: () => void;
}

export const AccessGate: React.FC<AccessGateProps> = ({ onAccess, onAdminRequest }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === '51825') {
      onAccess(key);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffafa] px-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-200 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-red-100 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-block relative mb-6">
            <span className="text-7xl">🌹</span>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full border-4 border-white animate-ping"></div>
          </div>
          <h1 className="text-6xl font-romantic text-pink-600 mb-2 leading-tight">Our Sanctuary</h1>
          <p className="text-gray-400 font-bold tracking-[0.2em] text-[10px] uppercase">Established Forever</p>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-[0_32px_64px_-16px_rgba(255,182,193,0.4)] border border-white">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative group">
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className={`w-full bg-pink-50/50 border-2 ${error ? 'border-red-300' : 'border-pink-100'} group-hover:border-pink-200 focus:border-pink-400 outline-none rounded-2xl px-6 py-5 text-center text-3xl tracking-[0.4em] transition-all font-serif text-pink-600 placeholder:text-pink-100`}
                placeholder="•••••"
                maxLength={5}
              />
              <div className="absolute -bottom-6 left-0 right-0 text-center">
                 {error && <span className="text-red-400 text-xs font-bold animate-bounce block">That's not it, my love...</span>}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-pink-200 hover:shadow-pink-300 hover:scale-[1.02] active:scale-95 transition-all text-lg tracking-widest uppercase"
            >
              Enter Heart
            </button>
          </form>

          <div className="mt-12 flex justify-between items-center text-[10px] text-pink-300 uppercase tracking-widest font-black">
            <button onClick={onAdminRequest} className="hover:text-pink-600 transition-colors">Admin Access</button>
            <div className="flex gap-1">
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </div>
            <span>Private</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none opacity-40 px-6">
        <p className="font-romantic text-3xl text-pink-400">"In all the world, there is no heart for me like yours."</p>
      </div>
    </div>
  );
};
