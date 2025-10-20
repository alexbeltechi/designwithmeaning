'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Route } from '@/lib/v2/mockRoutes';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/v2/format';

interface ConfirmationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route: Route | null;
  fromToken: string;
  toToken: string;
  amount: number;
  slippagePct: number;
  onConfirm: () => void;
}

export function ConfirmationDrawer({
  open,
  onOpenChange,
  route,
  fromToken,
  toToken,
  amount,
  slippagePct,
  onConfirm,
}: ConfirmationDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!route) return null;

  const minReceived = route.outputAmount * (1 - slippagePct / 100);
  const reliabilityScore = (route.reliabilityStars * 20).toFixed(0);

  const content = (
    <div className="space-y-4 py-4" data-section="confirmation-content">
      {/* Swap Summary */}
      <div className="space-y-3 bg-[#141618] p-4 rounded-xl border-transparent" data-section="swap-summary">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">You pay</span>
          <span className="font-semibold text-white">
            {formatNumber(amount, 4)} {fromToken}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">You receive</span>
          <span className="font-semibold text-lg text-white">
            {formatNumber(route.outputAmount, 2)} {toToken}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Value after gas</span>
          <span className="font-medium text-green-600">
            {formatCurrency(route.outputFiat)}
          </span>
        </div>
      </div>

      <Separator className="bg-gray-800" data-component="shadcn-separator" />

      {/* Route Details */}
      <div className="space-y-3" data-section="route-details">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Route</span>
          <span className="font-medium text-white">{route.aggregator}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Reliability</span>
          <span className="font-semibold text-green-600">{reliabilityScore}/100</span>
        </div>

        {route.badges && route.badges.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Features</span>
            <div className="flex flex-wrap gap-1.5 justify-end">
              {route.badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs bg-gray-800 text-gray-300" data-component="shadcn-badge" data-variant="secondary">
                  {badge.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator className="bg-gray-800" data-component="shadcn-separator" />

      {/* Trade Details */}
      <div className="space-y-3" data-section="trade-details">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Min. received</span>
          <span className="font-medium text-white">
            {formatNumber(minReceived, 2)} {toToken}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Price impact</span>
          <span className={`font-medium ${
            route.priceImpactPct > 1 ? 'text-amber-500' : 'text-white'
          }`}>
            {formatPercent(route.priceImpactPct)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Gas fee</span>
          <span className="font-medium text-white">{formatCurrency(route.gasUSD)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Slippage tolerance</span>
          <span className="font-medium text-white">{formatPercent(slippagePct)}</span>
        </div>
      </div>

      {/* Warning if high impact */}
      {route.priceImpactPct > 5 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3 text-sm text-amber-500">
          High price impact. Consider reducing your trade size.
        </div>
      )}
    </div>
  );

  const footer = (
    <>
      <Button
        onClick={onConfirm}
        size="lg"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        data-component="shadcn-button"
        data-variant="default"
        data-size="lg"
        data-action="confirm"
      >
        Confirm Swap (Stub)
      </Button>
      <p className="text-xs text-left text-gray-500 w-full mt-2">
        This is a prototype. No actual transaction will be executed.
      </p>
    </>
  );

  // Mobile: Use Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange} data-component="shadcn-sheet">
        <SheetContent side="bottom" className="h-auto max-h-[90vh] overflow-y-auto bg-[#1e1f24] border-gray-800" data-component="shadcn-sheet-content">
          <SheetHeader data-component="shadcn-sheet-header">
            <SheetTitle className="text-white" data-component="shadcn-sheet-title">Confirm Swap</SheetTitle>
            <SheetDescription className="text-gray-400" data-component="shadcn-sheet-description">
              Review your swap details before confirming
            </SheetDescription>
          </SheetHeader>
          {content}
          <SheetFooter data-component="shadcn-sheet-footer">
            {footer}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Use Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange} data-component="shadcn-dialog">
      <DialogContent className="max-w-md bg-[#1e1f24] border-gray-800" data-component="shadcn-dialog-content">
        <DialogHeader data-component="shadcn-dialog-header">
          <DialogTitle className="text-white" data-component="shadcn-dialog-title">Confirm Swap</DialogTitle>
          <DialogDescription className="text-gray-400" data-component="shadcn-dialog-description">
            Review your swap details before confirming
          </DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter className="flex-col" data-component="shadcn-dialog-footer">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

