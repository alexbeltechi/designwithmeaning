'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/v2/Header';
import { SwapPanel } from '@/components/v2/SwapPanel';
import { RouteSelector } from '@/components/v2/RouteSelector';
import { Button } from '@/components/ui/button';
import { fetchSwapRoutes, SwapRoute, getBestRoute } from '@/lib/v2/defillamaApi';
import { Token, Chain, AVAILABLE_TOKENS, AVAILABLE_CHAINS, getTokenPrice } from '@/lib/v2/tokens';

type EditMode = 'sell' | 'buy' | null;

export default function V2Page() {
  const [hideIP, setHideIP] = useState(false);
  
  // Default state: Ethereum chain, ETH token selected, amount is 0
  const [chain, setChain] = useState<Chain>(AVAILABLE_CHAINS[0]); // Ethereum
  const [fromToken, setFromToken] = useState<Token | null>(AVAILABLE_TOKENS[0]); // ETH
  const [toToken, setToToken] = useState<Token | null>(null); // No token selected
  const [amount, setAmount] = useState('0'); // Default 0
  const [outputAmount, setOutputAmount] = useState('0');
  const [slippage, setSlippage] = useState(0.3);
  const [routes, setRoutes] = useState<SwapRoute[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fromTokenPrice, setFromTokenPrice] = useState(0);
  const [toTokenPrice, setToTokenPrice] = useState(0);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [isBuyUserEdited, setIsBuyUserEdited] = useState(false);
  const [isSellUserEdited, setIsSellUserEdited] = useState(false);

  // Fetch token prices
  useEffect(() => {
    async function loadPrices() {
      if (fromToken) {
        const price = await getTokenPrice(fromToken.symbol);
        setFromTokenPrice(price);
      }
      if (toToken) {
        const price = await getTokenPrice(toToken.symbol);
        setToTokenPrice(price);
      }
    }
    loadPrices();
  }, [fromToken, toToken]);

  // Fetch routes when inputs change
  const loadRoutes = useCallback(async (limitToOne = false) => {
    // Only fetch routes if we have all required inputs and amount > 0
    const amt = parseFloat(amount);
    if (!amount || amt <= 0 || !fromToken || !toToken) {
      setRoutes([]);
      setSelectedRouteId(null);
      return;
    }

    setLoading(true);
    try {
      const fetchedRoutes = await fetchSwapRoutes({
        chain: chain.id,
        fromToken: fromToken.address,
        toToken: toToken.address,
        amount: amt,
        slippage,
      });
      
      // If user is typing in buy field, limit to 1 route
      const routesToShow = limitToOne ? [fetchedRoutes[0]] : fetchedRoutes;
      setRoutes(routesToShow);
      
      // Auto-select best route
      const bestRoute = getBestRoute(routesToShow);
      if (bestRoute) {
        setSelectedRouteId(bestRoute.id);
        
        // If user is typing in sell field, update buy amount
        if (editMode === 'sell' && !isBuyUserEdited) {
          setOutputAmount(bestRoute.outputAmount.toFixed(4));
        }
      }
    } catch (error) {
      console.error('Failed to fetch routes:', error);
      setRoutes([]);
      setSelectedRouteId(null);
    } finally {
      setLoading(false);
    }
  }, [chain.id, fromToken, toToken, amount, slippage, editMode, isBuyUserEdited]);

  // Load routes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (editMode) {
        loadRoutes(editMode === 'buy');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [loadRoutes, editMode]);

  // Refresh routes when slippage changes
  useEffect(() => {
    if (editMode && amount && parseFloat(amount) > 0 && fromToken && toToken) {
      // Add a slight delay to show loading animation
      const timeoutId = setTimeout(() => {
        loadRoutes(editMode === 'buy');
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [slippage, editMode, amount, fromToken, toToken, loadRoutes]);

  const handleSellAmountChange = (value: string) => {
    setAmount(value);
    setEditMode('sell');
    setIsSellUserEdited(true);
    setIsBuyUserEdited(false); // Reset buy edited state
  };

  const handleBuyAmountChange = (value: string) => {
    setOutputAmount(value);
    setEditMode('buy');
    setIsBuyUserEdited(true);
    setIsSellUserEdited(false); // Reset sell edited state
    
    // Calculate reverse: what amount of fromToken do I need?
    // This is a simplified calculation - in production use actual route data
    const buyAmt = parseFloat(value);
    if (buyAmt > 0 && fromTokenPrice > 0 && toTokenPrice > 0) {
      const sellAmt = (buyAmt * toTokenPrice) / fromTokenPrice;
      setAmount(sellAmt.toFixed(6));
    }
  };

  const handleFromTokenChange = (token: Token) => {
    setFromToken(token);
    setEditMode('sell');
    // Trigger routes refresh with new token
    if (toToken && amount && parseFloat(amount) > 0) {
      setTimeout(() => loadRoutes(false), 100);
    }
  };

  const handleToTokenChange = (token: Token) => {
    setToToken(token);
    // Trigger routes refresh with new token
    if (fromToken && amount && parseFloat(amount) > 0) {
      setEditMode('sell');
      setTimeout(() => loadRoutes(false), 100);
    }
  };

  const handleRefresh = () => {
    loadRoutes(editMode === 'buy');
  };

  const handleLogoClick = () => {
    // Reset to initial state
    setFromToken(AVAILABLE_TOKENS[0]); // ETH
    setToToken(null);
    setAmount('0');
    setOutputAmount('0');
    setRoutes([]);
    setSelectedRouteId(null);
    setEditMode(null);
    setIsBuyUserEdited(false);
    setIsSellUserEdited(false);
  };

  const selectedRoute = routes.find(r => r.id === selectedRouteId);

  // Calculate USD values - hide when amount is 0
  const fromUsdValue = amount && fromToken && parseFloat(amount) > 0
    ? `~$${(parseFloat(amount) * fromTokenPrice).toFixed(2)}`
    : '';

  const toUsdValue = outputAmount && toToken && parseFloat(outputAmount) > 0
    ? `~$${(parseFloat(outputAmount) * toTokenPrice).toFixed(2)}`
    : '';

  const handleSwap = () => {
    if (!selectedRoute || !fromToken || !toToken) return;
    
    alert(`Swap initiated!\n\nFrom: ${amount} ${fromToken.symbol}\nTo: ${outputAmount} ${toToken.symbol}\nProtocol: ${selectedRoute.protocols.join(', ')}\nGas: $${selectedRoute.gasUSD.toFixed(4)}\n\nThis is a prototype - no actual transaction will occur.`);
  };

  // Determine button text and state
  const getButtonState = () => {
    const hasValidAmount = amount && parseFloat(amount) > 0;
    const hasValidOutputAmount = outputAmount && parseFloat(outputAmount) > 0;
    
    // Check if either sell or buy has an amount
    if (!hasValidAmount && !hasValidOutputAmount) {
      return { text: 'Enter an amount', disabled: true, className: 'bg-[#1E3A8A] text-white text-opacity-40 cursor-not-allowed' };
    }
    
    // If amount is entered but no token selected
    if ((hasValidAmount && !toToken) || (hasValidOutputAmount && !fromToken)) {
      return { text: 'Choose a token', disabled: true, className: 'bg-[#1E3A8A] text-white text-opacity-40 cursor-not-allowed' };
    }
    
    // If tokens selected but no valid routes
    if (routes.length === 0 && fromToken && toToken) {
      return { text: 'No routes available', disabled: true, className: 'bg-[#1E3A8A] text-white text-opacity-40 cursor-not-allowed' };
    }
    
    return { text: 'Swap', disabled: false, className: 'bg-blue-600 hover:bg-blue-700 text-white' };
  };

  const buttonState = getButtonState();

  const showRoutes = amount && parseFloat(amount) > 0 && fromToken && toToken;

  return (
    <div className="min-h-screen bg-[#111213]">
      <Header hideIP={hideIP} onHideIPChange={setHideIP} onLogoClick={handleLogoClick} />
      
      <main className="w-full px-4 md:px-8 pb-20 pt-6">
        <div className="max-w-[1143px] mx-auto flex flex-col items-center gap-6">
          {/* Announcement Banner */}
          <p className="text-base text-gray-400 leading-6 tracking-[-0.3125px] text-center">
            📊 Total Llama swaps: $15.7M accross 18.2M transactions
          </p>

          {/* Swap Section - constrained to 400px */}
          <div className="w-full max-w-[400px] flex flex-col items-stretch gap-4">
            <SwapPanel
              chain={chain}
              availableChains={AVAILABLE_CHAINS}
              onChainChange={setChain}
              fromToken={fromToken}
              toToken={toToken}
              availableTokens={AVAILABLE_TOKENS}
              onFromTokenChange={handleFromTokenChange}
              onToTokenChange={handleToTokenChange}
              amount={amount}
              onAmountChange={handleSellAmountChange}
              outputAmount={outputAmount}
              onOutputAmountChange={handleBuyAmountChange}
              fromUsdValue={fromUsdValue}
              toUsdValue={toUsdValue}
              slippage={slippage}
              onSlippageChange={setSlippage}
              hideIP={hideIP}
              onHideIPChange={setHideIP}
              isBuyUserEdited={isBuyUserEdited}
              isSellUserEdited={isSellUserEdited}
              onRefresh={handleRefresh}
            />

            {/* Route Selector - Outside gray card on plain background */}
            {showRoutes && (
              <>
                {loading ? (
                  <div className="space-y-2 pt-4">
                    <div className="flex items-center justify-between h-8">
                      <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
                    </div>
                    <div className="h-[180px] bg-zinc-800 rounded-[14px] animate-pulse border-t border-white/10" />
                    <div className="h-[180px] bg-zinc-800 rounded-[14px] animate-pulse border-t border-white/10" />
                  </div>
                ) : routes.length > 0 ? (
                  <div className="pt-2">
                    <RouteSelector
                      routes={routes}
                      selectedRouteId={selectedRouteId}
                      onSelectRoute={setSelectedRouteId}
                      outputToken={toToken?.symbol || ''}
                      onRefresh={handleRefresh}
                    />
                  </div>
                ) : null}
              </>
            )}

            {/* Swap Button - After routes section */}
            <Button
              onClick={handleSwap}
              disabled={buttonState.disabled}
              className={`w-full h-12 rounded-[10px] text-base font-medium leading-6 tracking-[-0.3125px] transition-colors ${buttonState.className}`}
            >
              {buttonState.text}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

