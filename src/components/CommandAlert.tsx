/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ShieldAlert, CheckCircle, SquareTerminal } from 'lucide-react';

interface CommandAlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'error' | 'success' | 'system';
  onClose: () => void;
}

export default function CommandAlert({
  isOpen,
  title,
  message,
  type = 'system',
  onClose,
}: CommandAlertProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div id="cmd-alert-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            id="cmd-alert-panel"
            initial={{ scale: 0.93, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900/40 p-6 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

            <div className="flex flex-col items-center text-center">
              {/* Icon Status */}
              <div id="cmd-alert-icon" className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800/40 border border-white/10 text-cyan-400">
                {type === 'error' && (
                  <ShieldAlert className="h-6 w-6 text-rose-500 animate-pulse" />
                )}
                {type === 'success' && (
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                )}
                {type === 'system' && (
                  <Terminal className="h-6 w-6 text-cyan-400" />
                )}
              </div>

              {/* Title & Sub */}
              <h3 id="cmd-alert-title" className="font-display text-lg font-semibold tracking-wide text-white uppercase mb-2">
                {title}
              </h3>
              
              <div className="rounded-lg bg-zinc-950/60 border border-white/5 p-3 w-full mb-6">
                <p id="cmd-alert-desc" className="font-mono text-xs text-slate-300 leading-relaxed text-left break-all whitespace-pre-wrap">
                  {message}
                </p>
              </div>

              {/* Action */}
              <button
                id="cmd-alert-btn"
                type="button"
                onClick={onClose}
                className="w-full relative group overflow-hidden rounded-xl bg-zinc-950 px-4 py-3 text-xs font-mono font-medium text-slate-200 border border-white/10 hover:border-slate-100/30 shadow-lg active:scale-98 transition-all duration-200"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <SquareTerminal className="h-4 w-4 text-cyan-400" />
                  DISMISS_DIAGNOSTIC
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-cyan-950/20 via-sky-950/20 to-transparent transition-transform duration-300" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
