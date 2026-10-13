import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 transition active:scale-95"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-500" />
          <span>Add to Home</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    SC
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">SmartCare App</h3>
                    <p className="text-xs text-slate-500">Add to iPhone / iPad Home Screen</p>
                  </div>
                </div>
                <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">1</span>
                  <p>Tap the <strong>Share</strong> button (box with an arrow pointing up) in your Safari toolbar at the bottom.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">2</span>
                  <p>Scroll down and tap <strong>Add to Home Screen</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">3</span>
                  <p>Tap <strong>Add</strong> in the top right. Launch SmartCare instantly with full offline access!</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-semibold text-white shadow-md transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Generic fallback button for testing on desktop browsers
  return (
    <button
      onClick={() => alert('To install SmartCare as an app: click the Install icon in your browser URL bar or Add to Home Screen in browser menu.')}
      className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-800/70 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      title="PWA Installable App"
    >
      <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
      <span>Install PWA</span>
    </button>
  );
};
