/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, LogOut, Terminal, Sparkles, Plus, DollarSign, Crosshair, 
  Code, Eye, RotateCcw, X, ShieldAlert, Cpu, Laptop, RefreshCw 
} from 'lucide-react';

interface DashboardViewProps {
  username: string;
  onLogout: () => void;
  onNavigate: (view: 'page1' | 'tracking') => void;
}

// Default luxury HTML/JS template pre-loaded into the renderer
const DEFAULT_PRESET_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #030408;
      color: #38bdf8;
      font-family: monospace;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    .radar {
      position: relative;
      width: 180px;
      height: 180px;
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 50%;
      background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .radar::after {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      border-radius: 50%;
      background: conic-gradient(from 0deg, rgba(56,189,248,0.4) 0deg, transparent 90deg);
      animation: sweep 3s linear infinite;
    }
    .circle {
      position: absolute;
      border: 1px dashed rgba(56, 189, 248, 0.15);
      border-radius: 50%;
    }
    .c1 { width: 130px; height: 130px; }
    .c2 { width: 80px; height: 80px; }
    .ping {
      position: absolute;
      width: 6px;
      height: 6px;
      background: #2dd4bf;
      border-radius: 50%;
      box-shadow: 0 0 10px #2dd4bf;
      top: 40%;
      left: 35%;
      animation: ping-anim 2s infinite ease-out;
    }
    .label {
      margin-top: 15px;
      font-size: 11px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      text-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
    }
    @keyframes sweep {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes ping-anim {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 1; transform: scale(1.3); }
    }
  </style>
</head>
<body>
  <div class="radar">
    <div class="circle c1"></div>
    <div class="circle c2"></div>
    <div class="ping"></div>
  </div>
  <div class="label">> RENDER_SUCCESSFUL_NODE</div>
</body>
</html>`;

export default function DashboardView({ username, onLogout, onNavigate }: DashboardViewProps) {
  // Settings dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Real-time clock for developer aesthetic
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Modal Render states
  const [modalOpen, setModalOpen] = useState(false);
  const [rawHtml, setRawHtml] = useState(DEFAULT_PRESET_CODE);
  const [renderOutput, setRenderOutput] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  const handleExecuteRender = () => {
    setRenderOutput(rawHtml);
    setIframeKey(prev => prev + 1); // Cause iframe to reload cleanly
  };

  const handleResetRender = () => {
    setRawHtml(DEFAULT_PRESET_CODE);
    setRenderOutput(null);
  };

  return (
    <div id="dash-viewport" className="relative flex h-screen flex-col overflow-hidden text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-white">
      
      {/* Background Graphic cover */}
      <div 
        id="dash-bg-asset" 
        className="absolute inset-0 -z-50 h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ backgroundImage: 'url("/assets/bg-image.jpg")' }}
      />
      {/* Dark Ambient Layer */}
      <div className="absolute inset-0 -z-40 h-full w-full bg-zinc-950/80 backdrop-blur-xs" />

      {/* Header bar */}
      <header id="dash-header" className="relative flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-zinc-950/30 px-6 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 text-cyan-400" />
          <div>
            <h1 className="font-display text-sm font-bold tracking-widest text-white uppercase">
              Control Panel
            </h1>
            <p className="font-mono text-[9px] text-emerald-400 tracking-wider">
              ONLINE // USER: {username.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Top-Right: Dynamic Clock + Settings Cog */}
        <div className="flex items-center gap-5">
          <div className="hidden font-mono text-[10px] text-slate-400 tracking-widest md:block">
            {currentTime}
          </div>

          <div className="relative">
            <button
              id="dash-settings-cog"
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-zinc-900/40 text-slate-300 hover:border-cyan-500/30 hover:text-white hover:bg-zinc-900/80 active:scale-95 transition-all outline-none"
            >
              <Settings className={`h-5 w-5 transition-transform duration-500 ${dropdownOpen ? 'rotate-90' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                  <motion.div
                    id="dash-dropdown-panel"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 z-40 w-48 origin-top-right rounded-xl border border-white/10 bg-zinc-900/90 p-1.5 shadow-xl backdrop-blur-xl"
                  >
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">Security Menu</p>
                    </div>
                    <button
                      id="dash-logout-btn"
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 font-mono text-xs text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      TERMINATE_CONN
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main id="dash-main-grid" className="flex-1 flex flex-col items-center justify-center p-6 pb-28">
        
        {/* Minimalist developer workspace display board card */}
        <motion.div
          id="dash-developer-card"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative max-w-lg w-full rounded-2xl border border-white/10 bg-zinc-900/25 p-8 text-center shadow-2xl backdrop-blur-lg"
        >
          {/* Subtle decoration lines */}
          <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <div className="absolute -top-3 left-6 rounded-md bg-zinc-900 border border-white/5 px-2.5 py-0.5 font-mono text-[8px] text-cyan-400 tracking-[0.2em] uppercase">
            ACTIVE CODESHELL
          </div>
          
          <div className="flex flex-col items-center">
            {/* Interactive chip icon */}
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/5">
              <Cpu className="h-8 w-8 text-cyan-400 animate-pulse" />
            </div>

            <a
              id="dash-dev-name-link"
              href="https://www.facebook.com/S.monir5403"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="group/name block font-display text-2xl font-bold tracking-[0.25em] text-white hover:text-cyan-400 Transition-all duration-300 uppercase cursor-pointer"
            >
              SIRAJUM MONIR
            </a>
            <p id="dash-dev-subtitle" className="mt-1.5 font-mono text-xs text-slate-400 tracking-[0.16em] uppercase">
              --USING ONLY ADMIN--
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 w-full max-w-xs font-mono text-[10px]">
              <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-3 text-left">
                <span className="text-slate-500 uppercase block tracking-wider mb-1">ENV STATE</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  AUTHENTICATED
                </span>
              </div>
              <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-3 text-left">
                <span className="text-slate-500 uppercase block tracking-wider mb-1">DATA INTERFACE</span>
                <span className="text-cyan-400 font-semibold uppercase">SECURE_CLIENT</span>
              </div>
            </div>
          </div>
        </motion.div>

      </main>

      {/* Floating Navigation Dock */}
      <nav id="dash-dock-container" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          id="dash-dock"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/35 px-4 py-3 shadow-2xl backdrop-blur-xl"
        >
          {/* Button A ($) for Page 1 */}
          <button
            id="dash-btn-page1"
            type="button"
            onClick={() => onNavigate('page1')}
            title="Total Price"
            className="group relative flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900/80 border border-white/5 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400 hover:bg-zinc-900 transition-all active:scale-95 outline-none"
          >
            <DollarSign className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="absolute -top-10 scale-0 group-hover:scale-100 rounded-md bg-zinc-950 border border-white/10 px-2 py-1 font-mono text-[8.5px] text-emerald-400 hover:text-emerald-300 tracking-wider whitespace-nowrap transition-all uppercase font-semibold shadow-md">
              TOTAL PRICE
            </span>
          </button>

          {/* Button B (+) for Centered Code Render Modal */}
          <button
            id="dash-btn-render"
            type="button"
            onClick={() => setModalOpen(true)}
            title="Compile & Custom Sandbox (+)"
            className="group relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-600 text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-500 hover:to-sky-500 active:scale-95 transition-all outline-none"
          >
            <Plus className="h-6 w-6 transition-transform group-hover:rotate-90 duration-300" />
            <span className="absolute -top-10 scale-0 group-hover:scale-100 rounded-md bg-zinc-950 border border-white/10 px-2 py-1 font-mono text-[8px] text-white tracking-wider whitespace-nowrap transition-all">
              EXECUTE_RENDERER
            </span>
          </button>

          {/* Button C (Target Grid/Tracking) for tracking.html */}
          <button
            id="dash-btn-tracking"
            type="button"
            onClick={() => onNavigate('tracking')}
            title="Amazon Order Tracking"
            className="group relative flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900/80 border border-white/5 text-slate-400 hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-zinc-900 transition-all active:scale-95 outline-none"
          >
            <Crosshair className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="absolute -top-10 scale-0 group-hover:scale-100 rounded-md bg-zinc-950 border border-white/10 px-2 py-1 font-mono text-[8.5px] text-cyan-400 tracking-wider whitespace-nowrap transition-all uppercase font-semibold shadow-md">
              AMAZON ORDER TRACKING
            </span>
          </button>
        </motion.div>
      </nav>

      {/* Button B Custom HTML Modal Rendering Canvas Overlay */}
      <AnimatePresence>
        {modalOpen && (
          <div id="render-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/85 backdrop-blur-md"
            />

            {/* Main Modal dialog frame */}
            <motion.div
              id="render-modal-card"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="relative z-10 flex h-[85vh] w-full max-w-5xl flex-col rounded-2xl border border-white/10 bg-zinc-900/60 shadow-3xl backdrop-blur-2xl"
            >
              {/* Header block with visual controls */}
              <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/5 px-4">
                <div className="flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-cyan-400" />
                  <span className="font-display text-xs font-semibold tracking-wider text-slate-100 uppercase">
                    Sandbox Dynamic HTML Compiler
                  </span>
                </div>
                <button
                  id="render-modal-close"
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Dual Column workspace */}
              <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2">
                
                {/* Column A: Monospaced Textarea Code Input Editor */}
                <div className="flex flex-col border-b md:border-b-0 md:border-r border-white/5 p-4 min-h-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Code className="h-3.5 w-3.5 text-cyan-400" />
                      SOURCE_CODE (HTML / INLINE_STYLE / SCRIPTS)
                    </span>
                    <button
                      id="render-reset-preset"
                      type="button"
                      onClick={handleResetRender}
                      title="Reset presets"
                      className="text-slate-500 hover:text-cyan-400 transition-colors font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 hover:underline"
                    >
                      <RotateCcw className="h-3 w-3" />
                      PRESET_WIDGET
                    </button>
                  </div>
                  <textarea
                    id="render-code-textarea"
                    value={rawHtml}
                    onChange={(e) => setRawHtml(e.target.value)}
                    className="flex-1 w-full rounded-xl border border-white/5 bg-zinc-950/65 p-4 font-mono text-[11px] text-cyan-400/90 leading-relaxed placeholder-slate-600 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 focus:bg-zinc-950 transition-all resize-none"
                    placeholder="Enter standard vanilla HTML / CSS structures..."
                  />
                  
                  {/* Fire Button compile */}
                  <div className="mt-3">
                    <button
                      id="render-compile-btn"
                      type="button"
                      onClick={handleExecuteRender}
                      className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-3 text-xs font-mono font-bold tracking-widest text-white shadow-md hover:from-cyan-500 hover:to-teal-500 transition-all duration-200 active:scale-98"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin-slow text-white" />
                        COMPILE & EXECUTE VIEWPORT
                      </span>
                    </button>
                  </div>
                </div>

                {/* Column B: Render Viewport */}
                <div className="flex flex-col p-4 min-h-0 bg-zinc-950/20">
                  <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <Eye className="h-3.5 w-3.5 text-teal-400" />
                    LIVE_RENDER_CONTAINER (SANDBOXED)
                  </span>
                  
                  <div id="render-viewport" className="flex-1 rounded-xl border border-white/5 bg-zinc-950 overflow-hidden relative">
                    {renderOutput ? (
                      <iframe
                        key={iframeKey}
                        id="render-frame"
                        srcDoc={renderOutput}
                        title="Sandbox Viewport Render"
                        sandbox="allow-scripts"
                        className="w-full h-full border-none block bg-transparent"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-zinc-950">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-white/5 text-slate-500">
                          <Eye className="h-5 w-5" />
                        </div>
                        <p className="font-mono text-[10px] text-slate-400 tracking-wider">
                          AITING COMPILER TRIGGER INDICATION...
                        </p>
                        <p className="font-mono text-[8px] text-slate-600 uppercase tracking-widest mt-1">
                          Press 'COMPILE & EXECUTE' icon below editor columns to render.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Modal footer block */}
              <div className="flex h-12 shrink-0 items-center justify-end border-t border-white/5 bg-zinc-950/20 px-4">
                <button
                  id="render-modal-back-btn"
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-white/5 bg-zinc-900 px-4 py-2 font-mono text-[10px] font-medium text-slate-300 hover:text-white hover:bg-zinc-850 active:scale-95 transition-all outline-none"
                >
                  CLOSE_COMPILER
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
