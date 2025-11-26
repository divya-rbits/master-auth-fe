import React, { useState, useEffect } from 'react';
import { PasswordInput } from './components/PasswordInput';
import { SecureContent } from './components/SecureContent';

enum AuthState {
  LOCKED,
  AUTHENTICATING,
  UNLOCKED
}

export default function App() {
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOCKED);
  const [showError, setShowError] = useState(false);

  const handleAttemptUnlock = (password: string) => {
    setAuthState(AuthState.AUTHENTICATING);
    setShowError(false);

    // Simulate network latency / hashing delay
    setTimeout(() => {
      // For demonstration, we accept "admin" or "password" or "1234"
      // In a real app, this would be validated against a hash or API
      if (password.length > 0) { 
        setAuthState(AuthState.UNLOCKED);
      } else {
        setAuthState(AuthState.LOCKED);
        setShowError(true);
        // Reset error state after animation plays to allow re-trigger
        setTimeout(() => setShowError(false), 500);
      }
    }, 800);
  };

  const handleLock = () => {
    setAuthState(AuthState.LOCKED);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-200 selection:bg-white selection:text-black overflow-hidden relative">
      
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
      </div>

      <div className="z-10 w-full max-w-md px-6">
        {authState === AuthState.UNLOCKED ? (
          <SecureContent onLock={handleLock} />
        ) : (
          <PasswordInput 
            onUnlock={handleAttemptUnlock} 
            isLoading={authState === AuthState.AUTHENTICATING}
            hasError={showError}
          />
        )}
      </div>

      {/* Footer Branding (Minimal) */}
      <div className="absolute bottom-8 text-center w-full text-zinc-800 text-xs tracking-widest uppercase font-semibold select-none pointer-events-none">
        Secure Access Terminal
      </div>
    </div>
  );
}