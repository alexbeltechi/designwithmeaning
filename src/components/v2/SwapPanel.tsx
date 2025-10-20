'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowDownUp, Settings } from 'lucide-react';
import { TokenInput } from './TokenInput';
import { RouteSelector } from './RouteSelector';
import { Token, Chain } from '@/lib/v2/tokens';
import { SwapRoute } from '@/lib/v2/defillamaApi';

interface SwapPanelProps {
  chain: Chain;
  availableChains: Chain[];
  onChainChange: (chain: Chain) => void;
  fromToken: Token | null;
  toToken: Token | null;
  availableTokens: Token[];
  onFromTokenChange: (token: Token) => void;
  onToTokenChange: (token: Token) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  outputAmount: string;
  onOutputAmountChange: (amount: string) => void;
  fromUsdValue: string;
  toUsdValue: string;
  slippage: number;
  onSlippageChange: (slippage: number) => void;
  routes: SwapRoute[];
  selectedRouteId: string | null;
  onSelectRoute: (routeId: string) => void;
  loading: boolean;
  hideIP: boolean;
  onHideIPChange: (value: boolean) => void;
  isBuyUserEdited: boolean;
  isSellUserEdited: boolean;
  onRefresh: () => void;
}

const SLIPPAGE_PRESETS = [0.02, 0.1, 0.5, 1];

export function SwapPanel({
  chain,
  availableChains,
  onChainChange,
  fromToken,
  toToken,
  availableTokens,
  onFromTokenChange,
  onToTokenChange,
  amount,
  onAmountChange,
  outputAmount,
  onOutputAmountChange,
  fromUsdValue,
  toUsdValue,
  slippage,
  onSlippageChange,
  routes,
  selectedRouteId,
  onSelectRoute,
  loading,
  hideIP,
  onHideIPChange,
  isBuyUserEdited,
  isSellUserEdited,
  onRefresh,
}: SwapPanelProps) {
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [customSlippage, setCustomSlippage] = useState('');
  const chainDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chainDropdownRef.current && !chainDropdownRef.current.contains(event.target as Node)) {
        setShowChainDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwapTokens = () => {
    if (fromToken && toToken) {
      onFromTokenChange(toToken);
      onToTokenChange(fromToken);
      // Swap amounts too
      const tempAmount = amount;
      onAmountChange(outputAmount);
      onOutputAmountChange(tempAmount);
    }
  };

  const handleSlippageClick = (value: number) => {
    onSlippageChange(value);
    setCustomSlippage('');
  };

  const handleCustomSlippage = (value: string) => {
    setCustomSlippage(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      onSlippageChange(num);
    }
  };

  const showRoutes = amount && parseFloat(amount) > 0 && fromToken && toToken;

  return (
    <div className="w-full bg-[#1e1f24] rounded-2xl p-4 space-y-4">
      {/* Chain Selector Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white leading-7">Chain</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 h-5">
            <span className="text-sm text-gray-400 leading-5 tracking-[-0.1504px]">
              Hide IP
            </span>
            <button
              onClick={() => onHideIPChange(!hideIP)}
              className={`relative w-8 h-[18.398px] rounded-full border border-transparent transition-colors ${
                hideIP ? 'bg-blue-600' : 'bg-[#545458]'
              }`}
            >
              <span
                className={`absolute top-[1px] w-[14px] h-[14px] bg-white rounded-full transition-transform ${
                  hideIP ? 'left-[calc(100%-17px)]' : 'left-[3px]'
                }`}
              />
            </button>
          </div>
          <button className="w-5 h-5 text-white hover:opacity-80 transition-opacity">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chain Selector Button */}
      <div className="relative" ref={chainDropdownRef}>
        <button
          onClick={() => setShowChainDropdown(!showChainDropdown)}
          className="w-full h-[46px] bg-[#111213] rounded-xl px-4 flex items-center justify-between hover:bg-[#1a1c1e] transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl leading-7">{chain.icon}</span>
            <span className="text-base text-white leading-6 tracking-[-0.3125px]">
              {chain.name}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-white" />
        </button>

        {/* Chain Dropdown */}
        {showChainDropdown && (
          <div className="absolute top-full mt-2 w-full bg-[#111213] rounded-xl shadow-xl border border-zinc-700 overflow-hidden z-50">
            {availableChains.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onChainChange(c);
                  setShowChainDropdown(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-2 hover:bg-[#1a1c1e] transition-colors"
              >
                <span className="text-xl">{c.icon}</span>
                <span className="text-base text-white">{c.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Token Inputs */}
      <div className="space-y-1">
        <TokenInput
          label="You sell"
          value={amount}
          onChange={onAmountChange}
          selectedToken={fromToken}
          onTokenSelect={onFromTokenChange}
          availableTokens={availableTokens.filter(t => t.symbol !== toToken?.symbol)}
          usdValue={fromUsdValue}
          isUserEdited={isSellUserEdited}
          onUserEdit={() => {}}
        />
      </div>

      {/* Swap Button */}
      <div className="flex justify-center -my-3 relative z-10">
        <button
          onClick={handleSwapTokens}
          className="w-10 h-10 bg-[#111213] border-4 border-[#1e1f24] rounded-[10px] flex items-center justify-center hover:bg-[#1a1c1e] transition-colors"
          disabled={!fromToken || !toToken}
        >
          <ArrowDownUp className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* To Token */}
      <div className="space-y-1">
        <TokenInput
          label="You buy"
          value={outputAmount}
          onChange={onOutputAmountChange}
          selectedToken={toToken}
          onTokenSelect={onToTokenChange}
          availableTokens={availableTokens.filter(t => t.symbol !== fromToken?.symbol)}
          usdValue={toUsdValue}
          placeholder="Select token"
          isUserEdited={isBuyUserEdited}
          onUserEdit={() => {}}
        />
      </div>

      {/* Slippage Controls */}
      <div className="space-y-3">
        <p className="text-base text-white leading-6">Slippage (%)</p>
        <div className="flex items-center gap-2">
          {/* Custom Input - Moved to Left */}
          <input
            type="text"
            value={customSlippage}
            onChange={(e) => handleCustomSlippage(e.target.value)}
            placeholder={slippage.toString()}
            className="flex-1 h-9 rounded-[10px] bg-[#111213] border-transparent text-sm text-white text-center placeholder:text-white outline-none focus:ring-1 focus:ring-blue-600"
          />
          {/* Preset Buttons */}
          {SLIPPAGE_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => handleSlippageClick(preset)}
              className={`flex-1 h-9 rounded-[10px] text-sm text-white text-center transition-colors ${
                slippage === preset && !customSlippage
                  ? 'bg-[#111213]'
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Route Selector - Only show when amount is entered and tokens selected */}
      {showRoutes && (
        <>
          {loading ? (
            <div className="space-y-2 pt-4">
              <div className="flex items-center justify-between h-8">
                <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="h-[180px] bg-slate-900 rounded-[14px] animate-pulse" />
              <div className="h-[180px] bg-slate-900 rounded-[14px] animate-pulse" />
            </div>
          ) : routes.length > 0 ? (
            <div className="pt-4">
              <RouteSelector
                routes={routes}
                selectedRouteId={selectedRouteId}
                onSelectRoute={onSelectRoute}
                outputToken={toToken?.symbol || ''}
                onRefresh={onRefresh}
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
