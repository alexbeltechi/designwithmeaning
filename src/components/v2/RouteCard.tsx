'use client';

import { Check, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Route } from '@/lib/v2/mockRoutes';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/v2/format';
import { HelpTip, HELP_CONTENT } from '@/components/v2/HelpTip';

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
  const reliabilityScore = (route.reliabilityStars * 20).toFixed(0); // Convert 5-star to 0-100 scale

  return (
    <Card
      className={`relative cursor-pointer transition-all hover:border-blue-600/50 bg-zinc-950 border-zinc-800 ${
        isSelected ? 'border-blue-600 border-2 shadow-lg shadow-blue-600/20' : ''
      }`}
      onClick={onSelect}
      data-component="shadcn-card"
      data-variant="route-card"
      data-state={isSelected ? 'selected' : 'default'}
      data-is-best={isBest}
    >
      <div className="p-4 space-y-3">
        {/* Header Row: Aggregator + Badges + Checkmark */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Aggregator Name as Link */}
            <a 
              href="#" 
              className="text-base font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {route.aggregator}
              <ExternalLink className="h-3 w-3" />
            </a>
            
            {/* Badges */}
            {isBest && (
              <Badge className="bg-emerald-600 text-white text-xs px-2 py-0.5" data-component="shadcn-badge" data-variant="best">
                BEST
              </Badge>
            )}
            {route.badges && route.badges.filter(b => b !== 'BEST').map((badge) => (
              <Badge
                key={badge}
                variant="secondary"
                className={
                  badge === 'LOW_GAS'
                    ? 'bg-blue-600/90 text-white text-xs px-2 py-0.5'
                    : badge === 'FAST'
                    ? 'bg-orange-600/90 text-white text-xs px-2 py-0.5'
                    : badge === 'MEV_PROTECTED'
                    ? 'bg-purple-600/90 text-white text-xs px-2 py-0.5'
                    : 'text-xs px-2 py-0.5'
                }
                data-component="shadcn-badge"
                data-variant={badge.toLowerCase().replace('_', '-')}
              >
                {badge.replace('_', ' ')}
              </Badge>
            ))}
          </div>

          {/* Checkmark for Selected */}
          {isSelected && (
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-blue-500" />
            </div>
          )}
        </div>

        {/* Output Amount Row */}
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-white">
            {formatNumber(route.outputAmount, 2)}
          </span>
          <span className="text-sm text-zinc-500">
            USDC
          </span>
          <span className="text-sm text-emerald-500 font-medium">
            ≈ {formatCurrency(route.outputFiat)} after gas
          </span>
        </div>

        {/* Numeric Reliability Score */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">Reliability:</span>
            <span className="font-semibold text-emerald-500">{reliabilityScore}/100</span>
            <HelpTip content={HELP_CONTENT.reliability} />
          </div>
          
          {/* Gas Cost */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">Gas:</span>
            <span className="font-medium text-white">{formatCurrency(route.gasUSD)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-500 leading-relaxed">
          {route.description}
        </p>

        {/* Advanced Meta */}
        {viewMode === 'advanced' && (
          <div className="pt-3 mt-3 border-t border-zinc-800 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Price Impact</span>
              <span className="font-medium text-white">{formatPercent(route.priceImpactPct)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Hops</span>
              <span className="font-medium text-white">{route.hops}</span>
            </div>
            <div className="flex items-center justify-between col-span-2">
              <span className="text-zinc-500">Success Rate</span>
              <span className="font-medium text-white">{formatPercent(route.successRatePct, 1)}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

