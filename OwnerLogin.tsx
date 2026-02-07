
import React, { useState } from 'react';

interface OwnerLoginProps {
  onLogin: (code: string) => boolean;
  onBack: () => void;
}

export const OwnerLogin: React.FC<OwnerLoginProps> = ({ onLogin, onBack }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(code)) {
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full backdrop-blur-xl bg-white/10 p-8 rounded-[2rem] border border-white/20 shadow-2xl z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-500 mb-6 shadow-lg shadow-pink-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.148l.873-3.115m0 0a2 2 0 102.828 2.828l.873-3.115m-1.872-1.414h5a2 2 0 012 2v3m-5-8V7a3 3 0 016 0v4m-3 5h.01" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Owner Authentication</h1>
          <p className="text-slate-400 text-sm">Enter the restricted access code</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder:text-slate-600`}
            placeholder="000000"
          />
          {error && <p className="text-red-400 text-xs text-center animate-pulse">Invalid Code. Access Denied.</p>}
          
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold shadow-xl shadow-pink-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Authorize Session
          </button>
        </form>

        <button 
          onClick={onBack}
          className="mt-8 w-full text-slate-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-medium"
        >
          Return to Gate
        </button>
      </div>
    </div>
  );
};
