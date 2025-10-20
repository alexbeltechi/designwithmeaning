'use client';

import { Star, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Route } from '@/lib/v1/mockRoutes';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/v1/format';
import { HelpTip, HELP_CONTENT } from '@/components/v1/HelpTip';

interface RouteCardProps {
  route: Route;
  isSelected: boolean;
  isBest: boolean;
  onSelect: () => void;
  viewMode: 'simple' | 'advanced';
}

export function RouteCard({
  route,
  isSelected,
  isBest,
  onSelect,
  viewMode,
}: RouteCardProps) {
  const bestRoute = isBest;
  const diffPercent = isBest ? 0 : ((route.outputFiat - route.outputFiat) / route.outputFiat) * 100;

  return (
    <Card
      className={`relative cursor-pointer transition-all hover:border-[#2664DC]/50 ${
        isSelected ? 'border-[#2664DC] border-2' : ''
      }`}
      onClick={onSelect}
      data-component="shadcn-card"
      data-variant="route-card"
      data-state={isSelected ? 'selected' : 'default'}
      data-is-best={isBest}
    >
      <div className="p-3 pb-3 space-y-2">
        {/* BEST Badge - Top Left */}
        {isBest && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-emerald-600 text-white text-xs" data-component="shadcn-badge" data-variant="best">
              BEST
            </Badge>
          </div>
        )}

        {/* Checkmark - Top Right */}
        {isSelected && (
          <div className="absolute top-3 right-3">
            <Check className="h-4 w-4" style={{ color: '#2664DC' }} />
          </div>
        )}

        {/* Header with Output */}
        <div className="flex items-start gap-2" style={{ paddingTop: '8px' }}>
          <div className="flex-1 space-y-0.5">
            {/* Output Amount */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold">
                {formatNumber(route.outputAmount, 2)}
              </span>
              <span className="text-sm text-muted-foreground">
                USDC
              </span>
            </div>

            {/* Fiat + After Gas */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>≈ {formatCurrency(route.outputFiat)} after gas</span>
              <HelpTip content={HELP_CONTENT.afterGas} />
            </div>

            {/* Other Badges (excluding BEST) */}
            {route.badges && route.badges.filter(b => b !== 'BEST').length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {route.badges.filter(b => b !== 'BEST').map((badge) => (
                  <Badge
                    key={badge}
                    variant="secondary"
                    className={
                      badge === 'LOW_GAS'
                        ? 'bg-blue-600/90 text-white text-xs'
                        : badge === 'FAST'
                        ? 'bg-orange-600/90 text-white text-xs'
                        :                   badge === 'MEV_PROTECTED'
                    ? 'bg-purple-600/90 text-white text-xs'
                    : 'text-xs'
                }
                data-component="shadcn-badge"
                data-variant={badge.toLowerCase().replace('_', '-')}
              >
                    {badge.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reliability Stars */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
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
          <span className="text-xs text-muted-foreground">Reliability</span>
          <HelpTip content={HELP_CONTENT.reliability} />
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-snug">
          {route.description}
        </p>

        {/* Advanced Meta */}
        {viewMode === 'advanced' && (
          <div className="pt-2 mt-2 border-t border-border/50 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Price Impact</span>
              <span className="font-medium">{formatPercent(route.priceImpactPct)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Gas</span>
              <span className="font-medium">{formatCurrency(route.gasUSD)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Hops</span>
              <span className="font-medium">{route.hops}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Success Rate</span>
              <span className="font-medium">{formatPercent(route.successRatePct, 1)}</span>
            </div>
            <div className="flex items-center justify-between col-span-2">
              <span className="text-muted-foreground">Aggregator</span>
              <span className="font-medium">{route.aggregator}</span>
            </div>
          </div>
        )}

        {/* Non-best warning */}
        {!isBest && isSelected && diffPercent < -0.5 && (
          <div className="text-xs text-amber-600 dark:text-amber-500 bg-amber-500/10 rounded px-2 py-1 mt-1.5">
            You&apos;ll receive ~{Math.abs(diffPercent).toFixed(2)}% less vs Best
          </div>
        )}
      </div>
    </Card>
  );
}

