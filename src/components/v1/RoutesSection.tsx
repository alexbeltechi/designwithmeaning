'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { Route } from '@/lib/v1/mockRoutes';
import { RouteCard } from '@/components/v1/RouteCard';

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
  
  const displayedRoutes = showAll ? routes : routes.slice(0, 2);
  const bestRoute = routes[0]; // Already sorted by best

  return (
    <div className="space-y-4 mt-6" data-section="routes-section">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-sm font-medium">
            Select a Route
          </h2>
          <p className="text-xs text-muted-foreground">
            Best route is selected based on <strong>net output after gas</strong>.
          </p>
        </div>
        
        <div className="flex items-center space-x-2" data-section="advanced-toggle">
          <Switch
            id="advanced-mode"
            checked={viewMode === 'advanced'}
            onCheckedChange={(checked) => onViewModeChange(checked ? 'advanced' : 'simple')}
            data-component="shadcn-switch"
            data-id="advanced-mode"
          />
          <Label htmlFor="advanced-mode" className="text-sm cursor-pointer" data-component="shadcn-label">
            Advanced
          </Label>
        </div>
      </div>

      {/* Routes */}
      <RadioGroup value={selectedRouteId} onValueChange={onSelectRoute} data-component="shadcn-radio-group">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
      {routes.length > 2 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="w-full"
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
              Show {routes.length - 2} more routes
            </>
          )}
        </Button>
      )}
    </div>
  );
}

