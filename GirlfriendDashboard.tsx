
import React, { useState, useEffect } from 'react';
import { ContentItem, ANNIVERSARY_DATE } from '../types';

interface GirlfriendDashboardProps {
  content: ContentItem[];
  onLogout: () => void;
}

const AtmosphericEffects = ({ type }: { type: 'roses' | 'hearts' | 'none' }) => {
  if (type === 'none') return null;
  const particles = Array.from({ length: 15 });
  const char = type === 'roses' ? '🌹' : '❤';

  return (
    <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden">
      {particles.map((_, i) => (
        <div
          key={i}
          className="absolute animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            fontSize: `${Math.random() * 20 + 20}px`,
            animationDuration: `${Math.random() * 5 + 5}s`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: 0.4
          }}
        >
          {char}
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0); opacity: 0; }
          10% { opacity: 0.4; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall { animation: fall linear infinite; }
      `}</style>
    </div>
  );
};

const DualCountdown = () => {
  const [anniversaryTime, setAnniversaryTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [monthsaryTime, setMonthsaryTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      let nextAnniv = new Date(now.getFullYear(), ANNIVERSARY_DATE.month, ANNIVERSARY_DATE.day);
      if (now > nextAnniv) nextAnniv = new Date(now.getFullYear() + 1, ANNIVERSARY_DATE.month, ANNIVERSARY_DATE.day);
      const annivDiff = nextAnniv.getTime() - now.getTime();

      let nextMonth = new Date(now.getFullYear(), now.getMonth(), ANNIVERSARY_DATE.day);
      if (now > nextMonth) nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, ANNIVERSARY_DATE.day);
      const monthDiff = nextMonth.getTime() - now.getTime();

      setAnniversaryTime({ days: Math.floor(annivDiff / 86400000), hours: Math.floor((annivDiff / 3600000) % 24), mins: Math.floor((annivDiff / 60000) % 60), secs: Math.floor((annivDiff / 1000) % 60) });
      setMonthsaryTime({ days: Math.floor(monthDiff / 86400000), hours: Math.floor((monthDiff / 3600000) % 24), mins: Math.floor((monthDiff / 60000) % 60), secs: Math.floor((monthDiff / 1000) % 60) });
      
      let lastAnniv = new Date(nextAnniv.getFullYear() - 1, ANNIVERSARY_DATE.month, ANNIVERSARY_DATE.day);
      setProgress(Math.min(100, ((now.getTime() - lastAnniv.getTime()) / (nextAnniv.getTime() - lastAnniv.getTime())) * 100));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const Unit = ({ val, label, color }: { val: number, label: string, color: string }) => (
    <div className="flex flex-col items-center">
      <span className={`text-2xl font-bold font-serif ${color}`}>{val.toString().padStart(2, '0')}</span>
      <span className="text-[8px] uppercase tracking-tighter text-slate-400 font-bold">{label}</span>
    </div>
  );

  return (
    <div className="w-full space-y-8">
      <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-sm">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-pink-400 mb-4">Next Monthsary</h4>
        <div className="flex justify-around">
          <Unit val={monthsaryTime.days} label="Days" color="text-pink-600" />
          <Unit val={monthsaryTime.hours} label="Hours" color="text-pink-600" />
          <Unit val={monthsaryTime.mins} label="Mins" color="text-pink-600" />
          <Unit val={monthsaryTime.secs} label="Secs" color="text-pink-600" />
        </div>
      </div>
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-[2rem] border border-pink-100 shadow-md">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-4">Anniversary: June 18</h4>
        <div className="flex justify-around mb-6">
          <Unit val={anniversaryTime.days} label="Days" color="text-rose-600" />
          <Unit val={anniversaryTime.hours} label="Hours" color="text-rose-600" />
          <Unit val={anniversaryTime.mins} label="Mins" color="text-rose-600" />
          <Unit val={anniversaryTime.secs} label="Secs" color="text-rose-600" />
        </div>
        <div className="h-1.5 w-full bg-rose-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-rose-400 to-pink-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export const GirlfriendDashboard: React.FC<GirlfriendDashboardProps> = ({ content, onLogout }) => {
  const [mood, setMood] = useState<'roses' | 'hearts' | 'none'>('roses');
  const [kisses, setKisses] = useState<{ id: number; x: number; y: number }[]>([]);
  const sortedContent = [...content].sort((a, b) => b.timestamp - a.timestamp);

  const sendKiss = (e: React.MouseEvent) => {
    setKisses(prev => [...prev, { id: Date.now(), x: e.clientX, y: e.clientY }]);
    setTimeout(() => setKisses(prev => prev.slice(1)), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fffafa] pb-32 overflow-x-hidden" onClick={(e) => { if ((e.target as HTMLElement).tagName === 'DIV') sendKiss(e); }}>
      <AtmosphericEffects type={mood} />
      
      <div className="fixed inset-0 pointer-events-none z-[200]">
        {kisses.map(k => (
          <div key={k.id} className="absolute text-4xl transform -translate-y-20" style={{ left: k.x - 20, top: k.y - 20, animation: 'float-up 2s forwards ease-out' }}>💋</div>
        ))}
      </div>

      <nav className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 z-[100] bg-white/30 backdrop-blur-xl border-b border-pink-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-pulse">💖</span>
          <span className="font-romantic text-2xl text-pink-600 font-bold">Us Forever</span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex bg-white/50 p-1 rounded-full border border-pink-100">
             {['🌹', '❤'].map((m, idx) => (
               <button key={idx} onClick={() => setMood(idx === 0 ? 'roses' : 'hearts')} className="p-2 hover:scale-110 transition-all">{m}</button>
             ))}
          </div>
          <button onClick={onLogout} className="px-6 py-2 rounded-full bg-white/50 text-pink-600 font-bold text-[10px] uppercase tracking-widest border border-pink-100">Exit</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        <aside className="lg:col-span-4 space-y-8">
          <div className="text-center p-10 bg-white rounded-[3rem] shadow-xl shadow-pink-100/50 border border-pink-50">
             <div className="w-32 h-32 mx-auto bg-gradient-to-tr from-pink-400 to-rose-300 rounded-full p-1 mb-6">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-5xl">👸</div>
             </div>
             <h2 className="text-4xl font-romantic text-pink-600 mb-2">My Everything</h2>
             <DualCountdown />
          </div>
          <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 text-center">
             <h3 className="text-indigo-900 font-bold mb-2">Send a Kiss?</h3>
             <button onClick={(e) => sendKiss(e)} className="bg-indigo-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-200 hover:scale-110 active:scale-95 transition-all">Send Kiss 💋</button>
          </div>
        </aside>

        <main className="lg:col-span-8">
          <div className="columns-1 md:columns-2 gap-8">
            {sortedContent.map((item) => (
              <div key={item.id} className="break-inside-avoid mb-8 bg-white rounded-[2.5rem] shadow-2xl shadow-pink-100/30 overflow-hidden border border-white hover:-translate-y-2 transition-all duration-500 group">
                {item.type === 'video' && (
                  <div className="bg-black relative">
                    <video controls src={item.content} className="w-full h-auto aspect-video" />
                    <div className="p-6 bg-slate-900/90 text-white">
                      <h3 className="font-romantic text-3xl">{item.title}</h3>
                    </div>
                  </div>
                )}

                {item.type === 'photo' && (
                  <div className="relative">
                    <img src={item.content} alt={item.title} className="w-full h-auto" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-pink-900/60 text-white">
                      <h3 className="font-romantic text-4xl">{item.title}</h3>
                    </div>
                  </div>
                )}

                {item.type === 'poem' && (
                  <div className="p-10 bg-gradient-to-b from-white to-pink-50/30">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 font-serif border-b border-pink-100 pb-2">{item.title}</h3>
                    <div className="font-serif italic text-lg leading-loose">
                      {item.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-1">
                          {item.title && line.toUpperCase().startsWith(item.title[i]?.toUpperCase()) ? (
                            <span className="text-pink-600 font-bold text-2xl mr-1">{line[0]}</span>
                          ) : null}
                          {item.title && line.toUpperCase().startsWith(item.title[i]?.toUpperCase()) ? line.substring(1) : line}
                        </p>
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-pink-100 text-right"><span className="text-pink-400 font-romantic text-3xl">— Love</span></div>
                  </div>
                )}

                {item.type === 'voice' && (
                  <div className="p-10 text-center">
                    <div className="inline-flex h-16 w-16 bg-pink-500 rounded-full items-center justify-center text-white mb-6">🎙</div>
                    <h3 className="text-2xl font-serif font-bold mb-6">{item.title}</h3>
                    <audio controls src={item.content} className="w-full h-10" />
                  </div>
                )}

                <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  <span className="text-pink-300">❤</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes float-up { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-200px) scale(1.5); opacity: 0; } }
      `}</style>
    </div>
  );
};
