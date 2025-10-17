import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HelpTipProps {
  content: string;
  className?: string;
}

export function HelpTip({ content, className = '' }: HelpTipProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className={`h-4 w-4 text-muted-foreground hover:text-foreground cursor-help transition-colors ${className}`} />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const HELP_CONTENT = {
  afterGas: 'The amount you\'ll receive after deducting estimated gas fees, helping you compare true net value.',
  priceImpact: 'How much the trade affects the token price. Lower is better—high impact means you\'re getting a worse rate.',
  reliability: 'Based on recent execution success rates for this route. 5 stars = highly reliable.',
  route: 'The path your trade takes through different liquidity sources. Fewer hops usually means lower gas.',
  slippage: 'Maximum price movement you\'ll accept. If the price moves more than this, your trade will revert.',
  minReceived: 'The minimum amount guaranteed based on your slippage tolerance. You may receive more, but never less.',
};

