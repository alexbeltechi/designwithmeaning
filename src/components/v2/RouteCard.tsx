'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Route } from '@/lib/v2/mockRoutes';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/v2/format';

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
      className={`relative cursor-pointer transition-all hover:border-blue-600/30 border-transparent rounded-[14px] ${
        isSelected 
          ? 'bg-slate-900 border-blue-600 border-2' 
          : 'bg-transparent border-transparent'
      }`}
      onClick={onSelect}
      data-component="shadcn-card"
      data-variant="route-card"
      data-state={isSelected ? 'selected' : 'default'}
      data-is-best={isBest}
    >
      <div className="p-[17px] space-y-2">
        {/* Header Row: Output Amount + Badges */}
        <div className="flex items-center justify-between">
          <p className="text-xl font-medium text-white leading-7">
            {formatNumber(route.outputAmount, 2)} USDC
          </p>
          <div className="flex items-center gap-2">
            {/* Reliability Score with Lock Icon */}
            {isBest && (
              <div className="flex items-center gap-1">
                <div className="text-green-600">🔒</div>
                <p className="text-sm font-normal text-white">{reliabilityScore}</p>
              </div>
            )}
            {/* BEST Badge */}
            {isBest && (
              <Badge className="bg-blue-600 text-white text-xs px-[5px] py-[1px] rounded-[4px] font-normal leading-4" data-component="shadcn-badge" data-variant="best">
                BEST
              </Badge>
            )}
            {/* Other Badges */}
            {route.badges && route.badges.filter(b => b !== 'BEST').map((badge) => (
              <Badge
                key={badge}
                className="bg-zinc-600 text-white text-xs px-[5px] py-[1px] rounded-[4px] font-normal leading-4"
                data-component="shadcn-badge"
                data-variant={badge.toLowerCase().replace('_', '-')}
              >
                {badge === 'FAST' ? 'FASTEST' : badge.replace('_', ' ')}
              </Badge>
            ))}
            {/* Percentage Difference (if not best) */}
            {!isBest && (
              <div className="rounded-[4px] px-[5px] py-[1px]">
                <p className="text-xs font-normal text-red-400 leading-4">-0.00%</p>
              </div>
            )}
          </div>
        </div>

        {/* After Gas + Provider Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-normal text-slate-400 leading-5">
              ≈{formatCurrency(route.outputFiat)} after gas fees
            </p>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-slate-400">💰 {formatCurrency(route.gasUSD)} via</span>
              <a 
                href="#" 
                className="text-blue-400 hover:text-blue-300 font-normal"
                onClick={(e) => e.stopPropagation()}
              >
                {route.aggregator}
              </a>
            </div>
          </div>
          {/* Description for BEST route */}
          {isBest && (
            <p className="text-sm font-normal text-slate-500 leading-5">
              {route.description}
            </p>
          )}
        </div>

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

