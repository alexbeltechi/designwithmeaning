'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Settings, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SwapForm } from '@/components/v2/SwapForm';
import { RoutesSection } from '@/components/v2/RoutesSection';
import { ConfirmationDrawer } from '@/components/v2/ConfirmationDrawer';
import { TrustFooter } from '@/components/v2/TrustFooter';
import { Inputs, Route, getMockRoutes } from '@/lib/v2/mockRoutes';

const STORAGE_KEYS = {
  SLIPPAGE: 'dwm-swap-slippage-v2',
  VIEW_MODE: 'dwm-swap-view-mode-v2',
  THEME: 'dwm-swap-theme-v2',
  HIDE_IP: 'dwm-swap-hide-ip-v2',
};

export function SwapStack() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [currentInputs, setCurrentInputs] = useState<Inputs | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Persisted state
  const [slippagePct, setSlippagePct] = useState(0.5);
  const [viewMode, setViewMode] = useState<'simple' | 'advanced'>('simple');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [hideIP, setHideIP] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSlippage = localStorage.getItem(STORAGE_KEYS.SLIPPAGE);
      const savedViewMode = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      const savedHideIP = localStorage.getItem(STORAGE_KEYS.HIDE_IP);
      
      if (savedSlippage) {
        const num = parseFloat(savedSlippage);
        if (!isNaN(num)) setSlippagePct(num);
      }
      
      if (savedViewMode === 'simple' || savedViewMode === 'advanced') {
        setViewMode(savedViewMode);
      }
      
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      }
      
      if (savedHideIP === 'true') {
        setHideIP(true);
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SLIPPAGE, slippagePct.toString());
    }
  }, [slippagePct]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
    }
  }, [viewMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.HIDE_IP, hideIP.toString());
    }
  }, [hideIP]);

  // Fetch routes when inputs are valid
  const fetchRoutes = useCallback((inputs: Inputs) => {
    setLoading(true);
    setCurrentInputs(inputs);
    
    // Simulate network delay
    setTimeout(() => {
      const newRoutes = getMockRoutes(inputs);
      setRoutes(newRoutes);
      // Auto-select best route
      if (newRoutes.length > 0) {
        setSelectedRouteId(newRoutes[0].id);
      }
      setLoading(false);
    }, 300);
  }, []);

  const handleRefresh = () => {
    if (currentInputs) {
      fetchRoutes(currentInputs);
    }
  };

  const handleSwap = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    // Stub - just close the drawer and show success
    setConfirmOpen(false);
    alert('Swap confirmed! (This is a prototype - no actual transaction)');
  };

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || null;

  return (
    <div className="min-h-screen bg-black" data-component="swap-stack">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="space-y-4 mb-8" data-section="header">
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity text-white" 
                onClick={() => window.location.reload()}
              >
                🦙AlpacaSwap
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                <span className="text-emerald-500 font-medium">
                  TOTAL SWAPPED: $23B
                </span>
                {' '}ACROSS 16.5M TRANSACTIONS
              </p>
            </div>
            
            {/* Top Right: Settings/Hide IP/Theme/Refresh */}
            <div className="flex items-center gap-4" data-section="header-actions">
              {/* Hide IP Toggle */}
              <div className="flex items-center space-x-2" data-section="hide-ip-toggle">
                <Switch
                  id="hide-ip"
                  checked={hideIP}
                  onCheckedChange={setHideIP}
                  data-component="shadcn-switch"
                  data-id="hide-ip"
                />
                <Label htmlFor="hide-ip" className="text-sm cursor-pointer text-zinc-400" data-component="shadcn-label">
                  Hide IP
                </Label>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={loading || routes.length === 0}
                className="rounded-full h-9 w-9 p-0 hover:bg-zinc-900"
                data-component="shadcn-button"
                data-variant="ghost"
                data-shape="rounded-full"
                data-action="refresh"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-9 w-9 p-0 hover:bg-zinc-900"
                onClick={() => {/* Settings could open a dialog */}}
                data-component="shadcn-button"
                data-variant="ghost"
                data-shape="rounded-full"
                data-action="settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-9 w-9 p-0 hover:bg-zinc-900"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                data-component="shadcn-button"
                data-variant="ghost"
                data-shape="rounded-full"
                data-action="theme-toggle"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Swap Form (Left) | Routes (Right) on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Swap Form */}
          <div className="space-y-6">
            <SwapForm
              onValidInputs={fetchRoutes}
              slippagePct={slippagePct}
              onSlippageChange={setSlippagePct}
              selectedRoute={selectedRoute}
            />

            {/* Swap Button - Below form on left side */}
            {routes.length > 0 && selectedRoute && !loading && (
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-semibold"
                onClick={handleSwap}
                data-component="shadcn-button"
                data-variant="default"
                data-size="lg"
                data-action="swap"
              >
                Swap
              </Button>
            )}

            {/* Trust Footer on mobile only */}
            <div className="lg:hidden">
              <TrustFooter />
            </div>
          </div>

          {/* Right Column: Routes Section */}
          <div className="space-y-6">
            {/* Routes Section - Only show when routes are available */}
            {routes.length > 0 && !loading && (
              <RoutesSection
                routes={routes}
                selectedRouteId={selectedRouteId}
                onSelectRoute={setSelectedRouteId}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            )}

            {/* Loading State */}
            {loading && (
              <div className="space-y-3" data-section="loading-state">
                <div className="h-[180px] rounded-lg border border-zinc-800 bg-zinc-950 animate-pulse" data-component="skeleton" />
                <div className="h-[180px] rounded-lg border border-zinc-800 bg-zinc-950 animate-pulse" data-component="skeleton" />
                <div className="h-[180px] rounded-lg border border-zinc-800 bg-zinc-950 animate-pulse" data-component="skeleton" />
              </div>
            )}
          </div>
        </div>

        {/* Trust Footer on desktop - at bottom */}
        <div className="hidden lg:block">
          <TrustFooter />
        </div>
      </div>

      {/* Confirmation Drawer */}
      {currentInputs && selectedRoute && (
        <ConfirmationDrawer
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          route={selectedRoute}
          fromToken={currentInputs.fromToken}
          toToken={currentInputs.toToken}
          amount={currentInputs.amount}
          slippagePct={slippagePct}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

