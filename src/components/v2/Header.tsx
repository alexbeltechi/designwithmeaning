'use client';

import { useRouter } from 'next/navigation';

interface HeaderProps {
  hideIP: boolean;
  onHideIPChange: (value: boolean) => void;
  onLogoClick: () => void;
}

export function Header({ hideIP, onHideIPChange, onLogoClick }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="w-full px-8 py-4 bg-[#111213]">
      {/* Centered container with max-width */}
      <div className="max-w-[1143px] mx-auto flex items-center justify-center gap-2.5">
        {/* Logo and Name - Clickable */}
        <button 
          onClick={onLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-[10px] bg-blue-600 flex items-center justify-center">
            <span className="text-base font-medium text-white tracking-[-0.3125px]">🦙</span>
          </div>
          <h1 className="text-[20px] font-bold text-white leading-[28px] tracking-[-0.4492px]">
            LlamaSwap
          </h1>
        </button>

        {/* Wallet Button */}
        <button className="h-10 px-4 rounded-[10px] bg-zinc-800 hover:bg-[#2a2b30] text-white border-none transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
            <span className="text-base font-medium leading-6 tracking-[-0.3125px]">
              0xf1...6g36
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}
