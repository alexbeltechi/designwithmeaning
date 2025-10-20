import { Shield, CheckCircle2, TrendingUp } from 'lucide-react';

export function TrustFooter() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-800">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-emerald-500" />
          <span>Route data aggregated by DeFiLlama</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
          <span>Audited aggregators</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          <span>99.9% historical execution</span>
        </div>
      </div>
    </div>
  );
}

