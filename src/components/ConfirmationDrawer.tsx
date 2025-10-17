'use client';

import { Star } from 'lucide-react';
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
import { Route } from '@/lib/mockRoutes';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format';

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

  const content = (
    <div className="space-y-4 py-4">
      {/* Swap Summary */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">You pay</span>
          <span className="font-semibold">
            {formatNumber(amount, 4)} {fromToken}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">You receive</span>
          <span className="font-semibold text-lg">
            {formatNumber(route.outputAmount, 2)} {toToken}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Value after gas</span>
          <span className="font-medium text-emerald-600 dark:text-emerald-500">
            {formatCurrency(route.outputFiat)}
          </span>
        </div>
      </div>

      <Separator />

      {/* Route Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Route</span>
          <span className="font-medium">{route.aggregator}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Reliability</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < route.reliabilityStars
                    ? 'fill-yellow-500 text-yellow-500'
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>

        {route.badges && route.badges.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Features</span>
            <div className="flex flex-wrap gap-1.5 justify-end">
              {route.badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Trade Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Min. received</span>
          <span className="font-medium">
            {formatNumber(minReceived, 2)} {toToken}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Price impact</span>
          <span className={`font-medium ${
            route.priceImpactPct > 1 ? 'text-amber-600 dark:text-amber-500' : ''
          }`}>
            {formatPercent(route.priceImpactPct)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Gas fee</span>
          <span className="font-medium">{formatCurrency(route.gasUSD)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Slippage tolerance</span>
          <span className="font-medium">{formatPercent(slippagePct)}</span>
        </div>
      </div>

      {/* Warning if high impact */}
      {route.priceImpactPct > 5 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3 text-sm text-amber-600 dark:text-amber-500">
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
        className="w-full bg-[#2664DC] hover:bg-[#1e4fb8] text-white"
      >
        Confirm Swap (Stub)
      </Button>
      <p className="text-xs text-left text-muted-foreground w-full mt-2">
        This is a prototype. No actual transaction will be executed.
      </p>
    </>
  );

  // Mobile: Use Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-auto max-h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Confirm Swap</SheetTitle>
            <SheetDescription>
              Review your swap details before confirming
            </SheetDescription>
          </SheetHeader>
          {content}
          <SheetFooter>
            {footer}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Use Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Swap</DialogTitle>
          <DialogDescription>
            Review your swap details before confirming
          </DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter className="flex-col">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

