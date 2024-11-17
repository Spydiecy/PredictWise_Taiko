import React from 'react';
import Header from './components/Header';
import PredictionBoard from './components/PredictionBoard';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      {/* Ambient background effects */}
      <div className="fixed inset-0 z-0">
        {/* Gradient orb - top right */}
        <div className="absolute -top-40 right-0 w-96 h-96 bg-[#ff3366] opacity-[0.15] blur-[128px] rounded-full" />
        
        {/* Gradient orb - bottom left */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff6699] opacity-[0.1] blur-[128px] rounded-full" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Navbar/Header */}
        <Header />

        {/* Page content */}
        <main className="relative min-h-[calc(100vh-80px)]">
          {/* Optional: Navigation breadcrumbs */}
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <span className="text-[#ff3366]">Home</span>
              <span className="text-gray-600">/</span>
              <span className="text-gray-400">Predictions</span>
            </nav>
          </div>

          {/* Main board */}
          <PredictionBoard />

          {/* Footer */}
          <footer className="w-full py-6 px-4 mt-12 border-t border-[#2a2b2f]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Left section */}
              <div className="text-gray-400 text-sm">
                © 2024 PredictWise Protocol. All rights reserved.
              </div>

              {/* Right section */}
              <div className="flex items-center gap-6">
                {/* Network status */}
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-gray-400 text-sm">Mainnet</span>
                </div>

                {/* Links */}
                <nav className="flex items-center gap-4 text-sm">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Docs
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy
                  </a>
                </nav>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Optional: Global loading indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-[#1a1b1f] border border-[#2a2b2f] rounded-lg px-4 py-2 flex items-center gap-3 shadow-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-gray-400 text-sm">Connected to Etherlink</span>
        </div>
      </div>
    </div>
  );
}

export default App;