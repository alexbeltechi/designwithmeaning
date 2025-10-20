'use client';

import { useState, useEffect } from 'react';
import { ArrowDownUp, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Inputs, MOCK_CHAINS, MOCK_TOKENS, Route } from '@/lib/v2/mockRoutes';
import { formatNumber } from '@/lib/v2/format';
import { HelpTip, HELP_CONTENT } from '@/components/v2/HelpTip';

interface SwapFormProps {
  onValidInputs: (inputs: Inputs) => void;
  slippagePct: number;
  onSlippageChange: (value: number) => void;
  selectedRoute: Route | null;
}

const SLIPPAGE_PRESETS = [0.1, 0.5, 1.0];

export function SwapForm({ onValidInputs, slippagePct, onSlippageChange, selectedRoute }: SwapFormProps) {
  const [chain, setChain] = useState(MOCK_CHAINS[0].id);
  const [fromToken, setFromToken] = useState(MOCK_TOKENS[0].id);
  const [toToken, setToToken] = useState(MOCK_TOKENS[1].id);
  const [amount, setAmount] = useState('');
  const [customSlippage, setCustomSlippage] = useState('');

  const fromTokenData = MOCK_TOKENS.find((t) => t.id === fromToken);
  const toTokenData = MOCK_TOKENS.find((t) => t.id === toToken);

  // Validate and emit inputs
  useEffect(() => {
    const numAmount = parseFloat(amount);
    if (
      chain &&
      fromToken &&
      toToken &&
      fromToken !== toToken &&
      amount &&
      numAmount > 0 &&
      !isNaN(numAmount)
    ) {
      onValidInputs({
        chain,
        fromToken,
        toToken,
        amount: numAmount,
        slippagePct,
      });
    }
  }, [chain, fromToken, toToken, amount, slippagePct, onValidInputs]);

  const handleFlip = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleMaxClick = () => {
    if (fromTokenData) {
      setAmount(fromTokenData.balance.toString());
    }
  };

  const handleSlippagePreset = (value: number) => {
    onSlippageChange(value);
    setCustomSlippage('');
  };

  const handleCustomSlippage = (value: string) => {
    setCustomSlippage(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0 && num <= 50) {
      onSlippageChange(num);
    }
  };

  return (
    <Card className="p-6 space-y-4 bg-zinc-950 border-zinc-800" data-component="shadcn-card" data-section="swap-form">
      {/* Chain Selector */}
      <div className="space-y-2" data-section="chain-selector">
        <h2 className="text-sm font-medium text-zinc-400">Chain</h2>
        <Select value={chain} onValueChange={setChain} data-component="shadcn-select" data-id="chain-select">
          <SelectTrigger id="chain" className="w-full bg-zinc-900 border-zinc-800" data-component="shadcn-select-trigger">
            <SelectValue />
          </SelectTrigger>
          <SelectContent data-component="shadcn-select-content">
            {MOCK_CHAINS.map((c) => (
              <SelectItem key={c.id} value={c.id} data-component="shadcn-select-item">
                <span className="flex items-center gap-2">
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* From Token - No "You sell" label */}
      <div className="space-y-2" data-section="from-token">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-400">From</span>
          {fromTokenData && (
            <span className="text-xs text-zinc-500">
              Balance: {formatNumber(fromTokenData.balance, 4)}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1.5 text-xs text-blue-500 hover:text-blue-400"
                onClick={handleMaxClick}
                data-component="shadcn-button"
                data-variant="ghost"
                data-action="max"
              >
                MAX
              </Button>
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            id="from-amount"
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 text-2xl h-14 bg-zinc-900 border-zinc-800 font-semibold"
            data-component="shadcn-input"
            data-type="number"
            data-size="lg"
          />
          <Select value={fromToken} onValueChange={setFromToken} data-component="shadcn-select" data-id="from-token">
            <SelectTrigger className="w-[140px] h-14 bg-zinc-900 border-zinc-800" data-component="shadcn-select-trigger" data-width="140px">
              <SelectValue />
            </SelectTrigger>
            <SelectContent data-component="shadcn-select-content">
              {MOCK_TOKENS.filter((t) => t.id !== toToken).map((token) => (
                <SelectItem key={token.id} value={token.id} data-component="shadcn-select-item">
                  <span className="flex items-center gap-2">
                    <span>{token.icon}</span>
                    <span>{token.symbol}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {fromTokenData && amount && parseFloat(amount) > 0 && (
          <p className="text-xs text-zinc-500">
            ≈ ${formatNumber(parseFloat(amount) * 3782.5, 2)}
          </p>
        )}
      </div>

      {/* Flip Button */}
      <div className="flex justify-center -my-2" data-section="flip-button">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFlip}
          className="rounded-full h-10 w-10 p-0 bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
          data-component="shadcn-button"
          data-variant="outline"
          data-shape="rounded-full"
        >
          <ArrowDownUp className="h-4 w-4" />
        </Button>
      </div>

      {/* To Token - No "You buy" label */}
      <div className="space-y-2" data-section="to-token">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-400">To</span>
          {toTokenData && (
            <span className="text-xs text-zinc-500">
              Balance: {formatNumber(toTokenData.balance, 2)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            id="to-amount"
            type="text"
            value={selectedRoute ? formatNumber(selectedRoute.outputAmount, 2) : ''}
            readOnly
            placeholder="0.0"
            className="flex-1 text-2xl h-14 bg-zinc-900/50 border-zinc-800 font-semibold"
            data-component="shadcn-input"
            data-state="readonly"
            data-size="lg"
          />
          <Select value={toToken} onValueChange={setToToken} data-component="shadcn-select" data-id="to-token">
            <SelectTrigger className="w-[140px] h-14 bg-zinc-900 border-zinc-800" data-component="shadcn-select-trigger" data-width="140px">
              <SelectValue />
            </SelectTrigger>
            <SelectContent data-component="shadcn-select-content">
              {MOCK_TOKENS.filter((t) => t.id !== fromToken).map((token) => (
                <SelectItem key={token.id} value={token.id} data-component="shadcn-select-item">
                  <span className="flex items-center gap-2">
                    <span>{token.icon}</span>
                    <span>{token.symbol}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedRoute && (
          <p className="text-xs text-zinc-500">
            ≈ ${formatNumber(selectedRoute.outputFiat, 2)}
          </p>
        )}
      </div>

      {/* Slippage Controls - Pill Style at Bottom */}
      <div className="pt-4 space-y-3 border-t border-zinc-800" data-section="slippage-controls">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-zinc-400">Slippage tolerance</span>
            <HelpTip content={HELP_CONTENT.slippage} />
          </div>
        </div>
        <div className="flex gap-2">
          {SLIPPAGE_PRESETS.map((preset) => (
            <Button
              key={preset}
              variant={slippagePct === preset && !customSlippage ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSlippagePreset(preset)}
              className={`flex-1 rounded-full ${
                slippagePct === preset && !customSlippage
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                  : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
              }`}
              data-component="shadcn-button"
              data-variant={slippagePct === preset && !customSlippage ? 'default' : 'outline'}
              data-type="slippage-preset"
            >
              {preset}%
            </Button>
          ))}
          <div className="relative flex-1">
            <Input
              type="number"
              placeholder="Custom"
              value={customSlippage}
              onChange={(e) => handleCustomSlippage(e.target.value)}
              className="pr-6 h-9 rounded-full bg-zinc-900 border-zinc-800"
              data-component="shadcn-input"
              data-type="custom-slippage"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
              %
            </span>
          </div>
        </div>
        {slippagePct > 1 && (
          <p className="text-xs text-amber-500">
            High slippage tolerance may result in unfavorable trades
          </p>
        )}
        {slippagePct < 0.1 && slippagePct > 0 && (
          <p className="text-xs text-blue-500">
            Very low slippage may cause transaction failures
          </p>
        )}
      </div>
    </Card>
  );
}

