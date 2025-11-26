import React, { useEffect, useState } from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';

interface SecureContentProps {
  onLock: () => void;
}

export const SecureContent: React.FC<SecureContentProps> = ({ onLock }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in effect
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-sm'}`}>
      
      <div className="mb-8 p-4 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-500 shadow-2xl shadow-emerald-900/20">
        <ShieldCheck size={48} strokeWidth={1} />
      </div>

      <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-4">
        Access Granted
      </h1>
      
      <p className="text-zinc-500 max-w-sm mx-auto leading-relaxed mb-12">
        Welcome to the secure environment. All systems are operational and ready for command.
      </p>

      <button
        onClick={onLock}
        className="px-6 py-2 rounded-full border border-zinc-800 bg-transparent text-zinc-400 text-sm hover:text-white hover:border-zinc-600 transition-all duration-300 flex items-center gap-2"
      >
        <LogOut size={14} />
        <span>Terminate Session</span>
      </button>

    </div>
  );
};