'use client';

import { useState } from 'react';
import { HelpCircle, Fuel, Lock, Star, ChevronDown, RefreshCw } from 'lucide-react';
import { SwapRoute } from '@/lib/v2/defillamaApi';

interface RouteSelectorProps {
  routes: SwapRoute[];
  selectedRouteId: string | null;
  onSelectRoute: (routeId: string) => void;
  outputToken: string;
  onRefresh: () => void;
}

export function RouteSelector({
  routes,
  selectedRouteId,
  onSelectRoute,
  outputToken,
  onRefresh,
}: RouteSelectorProps) {
  const [showAllRoutes, setShowAllRoutes] = useState(false);
  const [fadeInStates, setFadeInStates] = useState<Record<string, boolean>>({});
  
  const displayedRoutes = showAllRoutes ? routes : routes.slice(0, 2);
  const hiddenCount = routes.length - 2;

  const handleRefresh = () => {
    // Reset fade states
    setFadeInStates({});
    // Call refresh
    onRefresh();
  };

  // Trigger fade-in for each route progressively
  useState(() => {
    routes.forEach((route, index) => {
      setTimeout(() => {
        setFadeInStates(prev => ({ ...prev, [route.id]: true }));
      }, index * 100); // 100ms delay between each card
    });
  });

  const handleToggleRoutes = () => {
    setShowAllRoutes(!showAllRoutes);
  };

  return (
    <div className="w-full space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between h-8">
        <div className="flex items-center gap-1">
          <h3 className="text-lg font-semibold text-white leading-7">
            Select a Route
          </h3>
          <button className="w-4 h-4 text-zinc-500 hover:text-zinc-400">
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        <button 
          onClick={handleRefresh}
          className="w-8 h-8 rounded-[10px] hover:bg-[#1e1f24] transition-colors flex items-center justify-center group"
        >
          <RefreshCw className="w-4 h-4 text-white group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* Routes List */}
      <div className="space-y-2">
        {displayedRoutes.map((route, index) => {
          const isSelected = route.id === selectedRouteId;
          const isFadedIn = fadeInStates[route.id];
          
          return (
            <button
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              className={`w-full bg-slate-900 rounded-[14px] p-[17px] space-y-2 transition-all duration-300 hover:bg-slate-800 ${
                isSelected ? 'border-2 border-blue-600' : 'border-2 border-transparent'
              } ${isFadedIn ? 'opacity-100' : 'opacity-0'}`}
              style={{
                transitionDelay: `${index * 50}ms`
              }}
            >
              {/* Route Header */}
              <div className="flex items-center justify-between">
                <p className="text-xl font-medium text-white leading-7 tracking-[-0.4395px]">
                  {route.outputAmount.toFixed(4)} {outputToken}
                </p>
                <div className="flex items-center gap-2">
                  {route.isBest && (
                    <div className="bg-blue-600 rounded px-[5px] py-0.5">
                      <span className="text-xs text-white leading-4">BEST</span>
                    </div>
                  )}
                  {route.isFastest && !route.isBest && (
                    <div className="flex items-center gap-2">
                      {route.percentDiff !== 0 && (
                        <span className="text-xs text-red-400 leading-4">
                          {route.percentDiff.toFixed(2)}%
                        </span>
                      )}
                      <div className="bg-zinc-600 rounded px-[5px] py-0.5">
                        <span className="text-xs text-white leading-4">FASTEST</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Route Details */}
              <div className="space-y-2">
                {/* USD Value and Gas */}
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-400 leading-5 tracking-[-0.1504px]">
                    ≈${route.outputAmountUSD.toFixed(2)} after gas fees
                  </p>
                  <div className="flex items-center gap-1">
                    <Fuel className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-gray-400 leading-5 tracking-[-0.1504px]">
                      ${route.gasUSD.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Protocol and Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 py-0.5">
                      <Lock className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-sm text-blue-400 leading-5 tracking-[-0.1504px]">
                      {route.protocols.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-slate-500 leading-5 tracking-[-0.1504px]">
                      {route.rating.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Show More/Fewer Button */}
      {routes.length > 2 && (
        <button
          onClick={handleToggleRoutes}
          className="w-full bg-slate-900 rounded-md px-4 py-2 flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <ChevronDown className={`w-[10.667px] h-[10.667px] text-white transition-transform ${showAllRoutes ? 'rotate-180' : ''}`} />
          <span className="text-sm font-medium text-white leading-6">
            {showAllRoutes 
              ? 'Show fewer routes'
              : `Show ${hiddenCount} more route${hiddenCount !== 1 ? 's' : ''}`
            }
          </span>
        </button>
      )}
    </div>
  );
}
