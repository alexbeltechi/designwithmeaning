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
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);
  const [hoveredLock, setHoveredLock] = useState<string | null>(null);
  
  // Reorder routes to show selected first, then others
  const reorderedRoutes = selectedRouteId
    ? [
        ...routes.filter(r => r.id === selectedRouteId),
        ...routes.filter(r => r.id !== selectedRouteId)
      ]
    : routes;
  
  const displayedRoutes = showAllRoutes ? reorderedRoutes : reorderedRoutes.slice(0, 2);
  const hiddenCount = reorderedRoutes.length - 2;

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

  // Find the best route to compare against
  const bestRoute = routes.find(r => r.isBest) || routes[0];

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
          const isBestRoute = route.isBest;
          
          // Calculate differences from best route
          const outputDiff = bestRoute ? ((route.outputAmount - bestRoute.outputAmount) / bestRoute.outputAmount * 100) : 0;
          const gasDiff = bestRoute ? route.gasUSD - bestRoute.gasUSD : 0;
          
          return (
            <button
              key={route.id}
              onClick={() => {
                onSelectRoute(route.id);
                // Collapse when selecting a route if expanded
                if (showAllRoutes) {
                  setShowAllRoutes(false);
                }
              }}
              className={`w-full rounded-[14px] p-[17px] space-y-2 transition-all duration-300 ${
                isSelected 
                  ? 'bg-[#0F172A] border-2 border-blue-600' 
                  : 'bg-[#111213] hover:bg-[#0F172A] border-2 border-transparent'
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
                      {outputDiff !== 0 && (
                        <span className="text-xs text-red-400 leading-4">
                          {outputDiff.toFixed(2)}%
                        </span>
                      )}
                      <div className="bg-zinc-600 rounded px-[5px] py-0.5">
                        <span className="text-xs text-white leading-4">FASTEST</span>
                      </div>
                    </div>
                  )}
                  {!route.isBest && !route.isFastest && outputDiff !== 0 && (
                    <span className="text-xs text-red-400 leading-4">
                      {outputDiff.toFixed(2)}%
                    </span>
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
                    <div 
                      className="relative flex items-center gap-0.5 py-0.5"
                      onMouseEnter={() => setHoveredLock(route.id)}
                      onMouseLeave={() => setHoveredLock(null)}
                    >
                      <Lock className="w-4 h-4 text-slate-500" />
                      {hoveredLock === route.id && (
                        <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-white text-gray-900 text-sm rounded-lg shadow-xl whitespace-nowrap z-50">
                          Token is approved for this aggregator.
                          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-blue-400 leading-5 tracking-[-0.1504px]">
                      {route.protocols.join(', ')}
                    </span>
                  </div>
                  <div 
                    className="relative flex items-center gap-0.5"
                    onMouseEnter={() => setHoveredStar(route.id)}
                    onMouseLeave={() => setHoveredStar(null)}
                  >
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-zinc-500 leading-5 tracking-[-0.1504px]">
                      {route.rating.toFixed(2)}
                    </span>
                    {hoveredStar === route.id && (
                      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-white text-gray-900 text-sm rounded-lg shadow-xl whitespace-nowrap z-50 w-[280px]">
                        Based on recent execution success rates for this route. 5 stars = highly reliable.
                        <div className="absolute top-full right-8 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                      </div>
                    )}
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
          className="w-full bg-[#111213] rounded-md px-4 py-2 flex items-center justify-center gap-2 hover:bg-[#0F172A] transition-colors"
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
