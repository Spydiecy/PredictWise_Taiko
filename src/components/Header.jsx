import React from 'react';
import { ConnectButton } from 'thirdweb/react';
import { createWallet } from 'thirdweb/wallets';
import { client } from '../client';
import { etherlink_testnet } from '../native-chains/etherlink';

const Header = () => {
  return (
    <div className="relative w-full">
      {/* Gradient line at the top */}
      <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff3366] to-transparent opacity-50" />

      <header className="flex items-center justify-between px-8 py-4 bg-[#0a0b0f]/95 backdrop-blur-sm">
        {/* Logo/Title section */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#ff3366] to-[#ff6699] rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200" />
            <div className="relative w-10 h-10 rounded-full bg-[#0a0b0f] flex items-center justify-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3366] to-[#ff6699] text-xl font-bold">
                Ω
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-xl font-bold tracking-wide">PredictWise</h1>
            <span className="text-[#ff3366]/60 text-xs tracking-wider">BETA</span>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Network Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1b1f]/50 border border-[#2a2b2f]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-gray-400 text-sm">testnet</span>
          </div>

          {/* Settings button */}
          <button className="relative group p-2.5 rounded-xl bg-[#1a1b1f]/50 border border-[#2a2b2f] hover:border-[#ff3366]/50 transition-colors duration-300">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-gray-400 group-hover:text-[#ff3366] transition-colors duration-300"
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </button>

          {/* Connect Wallet wrapper */}
          <div className="connect-wrapper">
            <ConnectButton
              client={client}
              chain={etherlink_testnet}
              wallets={[createWallet("io.metamask")]}
            />
          </div>
        </div>
      </header>

      {/* Gradient line at the bottom */}
      <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff3366] to-transparent opacity-30" />
    </div>
  );
};

export default Header;