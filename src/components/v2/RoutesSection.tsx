'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';
import { Route } from '@/lib/v2/mockRoutes';
import { RouteCard } from '@/components/v2/RouteCard';

interface RoutesSectionProps {
  routes: Route[];
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  viewMode: 'simple' | 'advanced';
  onViewModeChange: (mode: 'simple' | 'advanced') => void;
}

export function RoutesSection({
  routes,
  selectedRouteId,
  onSelectRoute,
  viewMode,
  onViewModeChange,
}: RoutesSectionProps) {
  const [showAll, setShowAll] = useState(false);
  
  const displayedRoutes = showAll ? routes : routes.slice(0, 3);
  const bestRoute = routes[0]; // Already sorted by best

  return (
    <div className="bg-[#1e1f24] p-4 rounded-[16px] shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] space-y-4" data-section="routes-section">
      {/* Section Header */}
      <div className="flex items-center justify-between h-8">
        <div className="flex items-center gap-1">
          <h2 className="text-lg font-semibold text-white leading-7">
            Select a Route
          </h2>
          <div className="text-gray-400">ℹ️</div>
        </div>
        
        <button className="p-0 h-8 w-8 flex items-center justify-center hover:bg-gray-800 rounded-[10px]">
          <div className="text-white">⚙️</div>
        </button>
      </div>

      {/* Routes - List Style (not grid) */}
      <RadioGroup value={selectedRouteId} onValueChange={onSelectRoute} data-component="shadcn-radio-group">
        <div className="space-y-3">
          {displayedRoutes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              isSelected={route.id === selectedRouteId}
              isBest={route.id === bestRoute.id}
              onSelect={() => onSelectRoute(route.id)}
              viewMode={viewMode}
            />
          ))}
        </div>
      </RadioGroup>

      {/* Show All Toggle */}
      {routes.length > 3 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="w-full bg-transparent border-transparent hover:bg-gray-800/50 text-gray-400"
          data-component="shadcn-button"
          data-variant="outline"
          data-action="toggle-routes"
          data-state={showAll ? 'expanded' : 'collapsed'}
        >
          {showAll ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Show fewer routes
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Show {routes.length - 3} more routes
            </>
          )}
        </Button>
      )}
    </div>
  );
}

