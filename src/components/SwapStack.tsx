'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Settings, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SwapForm } from '@/components/SwapForm';
import { RoutesSection } from '@/components/RoutesSection';
import { ConfirmationDrawer } from '@/components/ConfirmationDrawer';
import { TrustFooter } from '@/components/TrustFooter';
import { Inputs, Route, getMockRoutes } from '@/lib/mockRoutes';

const STORAGE_KEYS = {
  SLIPPAGE: 'dwm-swap-slippage',
  VIEW_MODE: 'dwm-swap-view-mode',
  THEME: 'dwm-swap-theme',
  HIDE_IP: 'dwm-swap-hide-ip',
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
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">🦙AlpacaSwap</h1>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-emerald-600 dark:text-emerald-500 font-medium">
                  TOTAL SWAPPED: $23B
                </span>
                {' '}ACROSS 16.5M TRANSACTIONS
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={loading || routes.length === 0}
                className="rounded-full h-9 w-9 p-0"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-9 w-9 p-0"
                onClick={() => {/* Settings could open a dialog */}}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-9 w-9 p-0"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Hide IP Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="hide-ip"
              checked={hideIP}
              onCheckedChange={setHideIP}
              className="data-[state=checked]:bg-[#2664DC]"
            />
            <Label htmlFor="hide-ip" className="text-sm cursor-pointer">
              Hide IP
            </Label>
          </div>
        </div>

        {/* Swap Form */}
        <SwapForm
          onValidInputs={fetchRoutes}
          slippagePct={slippagePct}
          onSlippageChange={setSlippagePct}
          selectedRoute={selectedRoute}
        />

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
          <div className="space-y-3">
            <div className="h-[200px] rounded-lg border bg-muted/30 animate-pulse" />
            <div className="h-[200px] rounded-lg border bg-muted/30 animate-pulse" />
          </div>
        )}

        {/* Swap Button */}
        {routes.length > 0 && selectedRoute && !loading && (
          <Button
            size="lg"
            className="w-full bg-[#2664DC] hover:bg-[#1e4fb8] text-white"
            onClick={handleSwap}
          >
            Swap
          </Button>
        )}

        {/* Trust Footer */}
        <TrustFooter />
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

