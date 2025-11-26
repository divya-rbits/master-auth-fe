import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Lock } from 'lucide-react';

interface PasswordInputProps {
  onUnlock: (password: string) => void;
  isLoading: boolean;
  hasError: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ onUnlock, isLoading, hasError }) => {
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (password && !isLoading) {
      onUnlock(password);
    }
  };

  return (
    <div className={`flex flex-col items-center transition-opacity duration-500 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Icon Indicator */}
      <div className={`mb-12 transition-all duration-700 ${isFocused ? 'text-zinc-100 scale-110' : 'text-zinc-700 scale-100'}`}>
        <Lock size={32} strokeWidth={1.5} />
      </div>

      {/* Input Container */}
      <form onSubmit={handleSubmit} className={`relative w-full group ${hasError ? 'shake' : ''}`}>
        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent text-center text-4xl font-light tracking-[0.5em] text-white border-none outline-none placeholder-zinc-800 caret-transparent"
          placeholder="••••••"
          autoComplete="off"
        />
        
        {/* Custom Caret (Simulated for aesthetics) */}
        {isFocused && !isLoading && (
          <div 
            className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-zinc-400 -translate-y-1/2 cursor-blink pointer-events-none"
            style={{ 
              // Basic attempt to follow text. Real implementation requires canvas measurement or monospace fonts.
              // We'll stick to a centered static cursor effect or rely on the input's native caret for simplicity if this is tricky.
              // Hiding this simulation and using native caret with transparent color is better for reliability.
              // Actually, let's just use a bottom border animation.
              display: 'none' 
            }}
          />
        )}

        {/* Animated Underline */}
        <div className="absolute bottom-[-10px] left-0 w-full h-[1px] bg-zinc-800">
            <div 
                className={`h-full bg-white transition-all duration-500 ease-out mx-auto ${
                    isFocused || password.length > 0 ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`} 
            />
        </div>

      </form>

      {/* Action / Helper Text */}
      <div className="h-16 mt-8 flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center gap-2 text-zinc-500 text-sm tracking-widest uppercase animate-pulse">
            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <button 
            onClick={() => handleSubmit()}
            disabled={!password}
            className={`group flex items-center gap-2 text-zinc-500 hover:text-white transition-all duration-300 ${!password ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}
          >
            <span className="text-xs tracking-widest uppercase">Enter System</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

    </div>
  );
};