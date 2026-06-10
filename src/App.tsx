/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView, UserSession } from './types';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import Page1View from './components/Page1View';
import TrackingView from './components/TrackingView';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [session, setSession] = useState<UserSession>({
    isAuthenticated: false,
    username: '',
  });

  // Keep track of url alignments to simulate traditional HTML files structure
  // within a high performance SPA environment.
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      if (path.endsWith('/dashboard.html') && session.isAuthenticated) {
        setCurrentView('dashboard');
      } else if (path.endsWith('/page1.html') && session.isAuthenticated) {
        setCurrentView('page1');
      } else if (path.endsWith('/tracking.html') && session.isAuthenticated) {
        setCurrentView('tracking');
      } else {
        // Default index fallback/login routing
        setCurrentView('login');
        if (session.isAuthenticated) {
          // If already logged in, align back to dashboard
          changePath('/dashboard.html', 'dashboard');
        } else if (!window.location.pathname.endsWith('/index.html') && window.location.pathname !== '/') {
          // Force align URL
          window.history.replaceState({}, '', '/index.html');
        }
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, [session.isAuthenticated]);

  const changePath = (newPath: string, view: AppView) => {
    window.history.pushState({}, '', newPath);
    setCurrentView(view);
  };

  const handleLoginSuccess = (username: string) => {
    setSession({
      isAuthenticated: true,
      username,
    });
    changePath('/dashboard.html', 'dashboard');
  };

  const handleLogout = () => {
    setSession({
      isAuthenticated: false,
      username: '',
    });
    // Remove history states and align back
    changePath('/index.html', 'login');
  };

  const handleNavigate = (view: 'page1' | 'tracking') => {
    if (view === 'page1') {
      changePath('/page1.html', 'page1');
    } else if (view === 'tracking') {
      changePath('/tracking.html', 'tracking');
    }
  };

  const handleBackToDashboard = () => {
    changePath('/dashboard.html', 'dashboard');
  };

  return (
    <div className="h-full w-full">
      <AnimatePresence mode="wait">
        {currentView === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="h-full w-full"
          >
            <LoginView onSuccess={handleLoginSuccess} />
          </motion.div>
        )}

        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="h-full w-full"
          >
            <DashboardView
              username={session.username}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          </motion.div>
        )}

        {currentView === 'page1' && (
          <motion.div
            key="page1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="h-full w-full"
          >
            <Page1View onBack={handleBackToDashboard} />
          </motion.div>
        )}

        {currentView === 'tracking' && (
          <motion.div
            key="tracking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="h-full w-full"
          >
            <TrackingView onBack={handleBackToDashboard} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
