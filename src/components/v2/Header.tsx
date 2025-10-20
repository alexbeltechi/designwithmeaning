'use client';

import { useRouter } from 'next/navigation';

interface HeaderProps {
  hideIP: boolean;
  onHideIPChange: (value: boolean) => void;
}

export function Header({ hideIP, onHideIPChange }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="w-full px-8 py-4 bg-[#111213]">
      {/* Centered container with max-width */}
      <div className="max-w-[1143px] mx-auto flex items-center justify-center gap-2.5">
        {/* Logo and Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-blue-600 flex items-center justify-center">
            <span className="text-base font-medium text-white tracking-[-0.3125px]">🦙</span>
          </div>
          <h1 className="text-[20px] font-bold text-white leading-[28px] tracking-[-0.4492px]">
            LlamaSwap
          </h1>
        </div>

        {/* Version Buttons */}
        <button
          onClick={() => router.push('/v1')}
          className="h-10 px-4 rounded-[10px] text-gray-400 hover:text-white transition-colors text-base leading-6 tracking-[-0.3125px]"
        >
          V1
        </button>
        <button
          className="h-10 px-4 rounded-[10px] bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          <span className="text-base font-medium leading-6 tracking-[-0.3125px]">V2</span>
        </button>

        {/* Wallet Button */}
        <button className="h-10 px-4 rounded-[10px] bg-[#1c1d21] hover:bg-[#2a2b30] text-white border-none transition-colors">
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
