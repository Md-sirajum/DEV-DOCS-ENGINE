/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, User, Lock, Facebook, Fingerprint, RefreshCcw } from 'lucide-react';
import NetworkBackground from './NetworkBackground';
import CommandAlert from './CommandAlert';
import { VALID_USERNAMES, VALID_PASSWORDS } from '../types';

interface LoginViewProps {
  onSuccess: (username: string) => void;
}

export default function LoginView({ onSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Alert states
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const triggerAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      triggerAlert(
        'SECURITY_CHECK_EMPTY',
        'Authentication parameters cannot be null.\nPlease enter both node identifier and authorization code.'
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate cyber process handshake
    setTimeout(() => {
      const normalizedUser = username.trim().toLowerCase();
      const normalizedPass = password.trim();

      const isValidUser = VALID_USERNAMES.includes(normalizedUser as any);
      const isValidPass = VALID_PASSWORDS.includes(normalizedPass as any);

      if (isValidUser && isValidPass) {
        onSuccess(normalizedUser);
      } else {
        triggerAlert(
          'ACCESS_DENIED_SEC_ID_F42',
          `The credentials entered do not match authorization records.\n\nNODE_REF: auth-gateway-err\nSTATUS: 401 UNAUTHORIZED\nACTION: Establish secure link parameter verification before retry.`
        );
      }
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div id="login-viewport" className="relative flex min-h-screen items-center justify-center p-4 selection:bg-cyan-500/30 selection:text-white">
      {/* Dynamic Background Network */}
      <NetworkBackground />

      {/* Main card */}
      <motion.div
        id="login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950/45 p-8 shadow-3xl shadow-black/60 backdrop-blur-md"
      >
        {/* Glow corner accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute -bottom-10 left-1/2 -z-10 h-32 w-72 -translate-x-1/2 rounded-full bg-cyan-700/10 blur-[80px]" />

        {/* Center icon header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <motion.div
            id="login-shield-icon"
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-900/60 border border-white/10 shadow-inner shadow-cyan-500/10"
          >
            <svg
              className="h-9 w-9 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="cyber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
                <linearGradient id="cyber-grad-inner" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#67e8f9" />
                </linearGradient>
              </defs>
              <path
                d="M256 32L80 98v134c0 144 116 232 176 248 60-16 176-104 176-248V98L256 32z"
                fill="url(#cyber-grad)"
                opacity="0.15"
              />
              <path
                d="M256 50L102 108v118c0 125 101 202 154 216 53-14 154-91 154-216V108L256 50z"
                stroke="url(#cyber-grad)"
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M256 120L155 158v82c0 80 70 130 101 140 31-10 101-60 101-140v-82L256 120z"
                fill="url(#cyber-grad-inner)"
              />
              <circle cx="256" cy="210" r="28" fill="#090d16" />
              <path d="M256 226v46" stroke="#090d16" strokeWidth="14" strokeLinecap="round" />
            </svg>
          </motion.div>
          <h2 id="login-header-title" className="font-display text-xl font-bold tracking-[0.16em] text-white uppercase">
            -- DEV DOCS ENGINE --
          </h2>
          <p id="login-header-sub" className="mt-1 font-mono text-[10px] text-slate-400 tracking-wider">
            AUTHORIZED PROTOCOL GATEWAY // C-416A
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div id="input-group-user" className="relative group">
            <label className="block mb-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-400">
              User Identifier
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="h-4 w-4 transition-colors group-focus-within:text-cyan-400" />
              </span>
              <input
                id="login-user-input"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="USER"
                className="w-full rounded-xl border border-white/10 bg-zinc-900/40 py-3 pl-10 pr-4 font-mono text-xs text-white placeholder-slate-500 transition-all duration-300 focus:border-cyan-500 focus:bg-zinc-900/70 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div id="input-group-pass" className="relative group">
            <label className="block mb-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-400">
              Secure Access Code
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4 transition-colors group-focus-within:text-cyan-400" />
              </span>
              <input
                id="login-pass-input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full rounded-xl border border-white/10 bg-zinc-900/40 py-3 pl-10 pr-4 font-mono text-xs text-white placeholder-slate-500 transition-all duration-300 focus:border-cyan-500 focus:bg-zinc-900/70 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 px-4 py-3 text-xs font-mono font-bold tracking-widest text-white shadow-xl hover:from-cyan-500 hover:to-sky-500 hover:shadow-cyan-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCcw className="h-3.5 w-3.5 animate-spin text-white" />
                  AUTHENTICATING...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 uppercase tracking-widest">
                  <ShieldCheck className="h-4 w-4" />
                  ESTABLISH LINK
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Footer Contact area */}
        <div id="login-footer" className="mt-8 border-t border-white/5 pt-5 text-center">
          <p id="footer-contact-title" className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2.5">
            Contact our developer
          </p>
          <motion.a
            id="footer-fb-link"
            href="https://www.facebook.com/S.monir5403"
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/10 bg-zinc-900/60 hover:bg-zinc-900/90 hover:border-blue-500/40 px-4 py-2 transition-all group shadow-sm"
          >
            <Facebook className="h-4 w-4 text-slate-400 group-hover:text-[#1877F2] transition-colors" />
            <span className="font-display text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
              SIRAJUM MONIR
            </span>
          </motion.a>
        </div>
      </motion.div>

      {/* Customized alerts */}
      <CommandAlert
        isOpen={alertOpen}
        title={alertTitle}
        message={alertMessage}
        type="error"
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
}
