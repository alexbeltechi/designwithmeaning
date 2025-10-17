'use client';

import { useState, useEffect } from 'react';
import { ArrowDownUp, ChevronDown, Settings2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Inputs, MOCK_CHAINS, MOCK_TOKENS, Route } from '@/lib/mockRoutes';
import { formatNumber } from '@/lib/format';
import { HelpTip, HELP_CONTENT } from '@/components/HelpTip';

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
  const [settingsOpen, setSettingsOpen] = useState(false);

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
    <>
      <Card className="p-5 space-y-2">
        {/* Chain Selector */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold">
            Chain
          </h1>
          <Select value={chain} onValueChange={setChain}>
            <SelectTrigger id="chain" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MOCK_CHAINS.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <span className="flex items-center gap-2">
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* From Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">
              You sell
            </h1>
            {fromTokenData && (
              <span className="text-xs text-muted-foreground">
                Bal: {formatNumber(fromTokenData.balance, 4)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1.5 text-xs text-primary hover:text-primary/80"
                  onClick={handleMaxClick}
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
              className="flex-1 text-lg h-12"
            />
            <Select value={fromToken} onValueChange={setFromToken}>
              <SelectTrigger className="w-[140px] h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOCK_TOKENS.filter((t) => t.id !== toToken).map((token) => (
                  <SelectItem key={token.id} value={token.id}>
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
            <p className="text-xs text-muted-foreground">
              ≈ ${formatNumber(parseFloat(amount) * 3782.5, 2)}
            </p>
          )}
        </div>

        {/* Flip Button */}
        <div className="flex justify-center -my-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFlip}
            className="rounded-full h-8 w-8 p-0"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">
              You buy
            </h1>
            {toTokenData && (
              <span className="text-xs text-muted-foreground">
                Bal: {formatNumber(toTokenData.balance, 2)}
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
              className="flex-1 text-lg h-12 bg-muted/30"
            />
            <Select value={toToken} onValueChange={setToToken}>
              <SelectTrigger className="w-[140px] h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOCK_TOKENS.filter((t) => t.id !== fromToken).map((token) => (
                  <SelectItem key={token.id} value={token.id}>
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
            <p className="text-xs text-muted-foreground">
              ≈ ${formatNumber(selectedRoute.outputFiat, 2)}
            </p>
          )}
        </div>

        {/* Slippage Controls at Bottom */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">Slippage tolerance</span>
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
                className={`flex-1 ${slippagePct === preset && !customSlippage ? 'bg-[#2664DC] hover:bg-[#1e4fb8] text-white' : ''}`}
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
                className="pr-6 h-9"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                %
              </span>
            </div>
          </div>
          {slippagePct > 1 && (
            <p className="text-xs text-amber-600 dark:text-amber-500">
              High slippage tolerance may result in unfavorable trades
            </p>
          )}
          {slippagePct < 0.1 && slippagePct > 0 && (
            <p className="text-xs text-blue-600 dark:text-blue-500">
              Very low slippage may cause transaction failures
            </p>
          )}
        </div>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Swap Settings</DialogTitle>
            <DialogDescription>
              Adjust your slippage tolerance and other preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label>Slippage Tolerance</Label>
                <HelpTip content={HELP_CONTENT.slippage} />
              </div>

              <div className="flex gap-2">
                {SLIPPAGE_PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    variant={slippagePct === preset && !customSlippage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSlippagePreset(preset)}
                    className="flex-1"
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
                    className="pr-6"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              {slippagePct > 1 && (
                <p className="text-xs text-amber-600 dark:text-amber-500">
                  High slippage tolerance may result in unfavorable trades
                </p>
              )}
              {slippagePct < 0.1 && slippagePct > 0 && (
                <p className="text-xs text-blue-600 dark:text-blue-500">
                  Very low slippage may cause transaction failures
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

