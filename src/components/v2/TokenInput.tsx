'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Token } from '@/lib/v2/tokens';

interface TokenInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  availableTokens: Token[];
  usdValue: string;
  readOnly?: boolean;
  placeholder?: string;
  isUserEdited?: boolean;
  onUserEdit?: () => void;
}

export function TokenInput({
  label,
  value,
  onChange,
  selectedToken,
  onTokenSelect,
  availableTokens,
  usdValue,
  readOnly = false,
  placeholder = 'Select token',
  isUserEdited = false,
  onUserEdit,
}: TokenInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      
      // If pre-filled (not user-edited), select all text so user can type over it
      // This includes "0" - when user types, it will replace the "0"
      if (!isUserEdited) {
        inputRef.current.select();
      }
      // If user-edited (white), cursor is placed naturally where clicked
    }
  }, [isEditing, isUserEdited, value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTokenDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAmountClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!readOnly && selectedToken) {
      setIsEditing(true);
      if (onUserEdit) {
        onUserEdit();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Allow only numbers and one decimal point
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      onChange(val);
      if (onUserEdit) {
        onUserEdit();
      }
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const displayValue = value || '0';
  
  // Color logic: zinc-700 if not user edited (calculated), white if user edited
  const textColor = isUserEdited ? 'text-white' : 'text-zinc-700';

  return (
    <div className="bg-[#111213] rounded-xl p-4 space-y-4">
      {/* Label */}
      <label className="block text-sm text-gray-400 leading-5">
        {label}
      </label>

      {/* Amount and Token Selector */}
      <div className="flex items-center gap-3 h-[42px]">
        {/* Amount Display/Input */}
        <div className="flex-1 relative" onClick={handleAmountClick}>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={`w-full bg-transparent border-none outline-none text-[30px] font-semibold leading-9 tracking-[-0.225px] ${textColor} p-0`}
              placeholder="0"
            />
          ) : (
            <p 
              className={`text-[30px] font-semibold leading-9 tracking-[-0.225px] ${textColor} cursor-text select-none`}
              style={{ minHeight: '36px' }}
            >
              {displayValue}
            </p>
          )}
        </div>

        {/* Token Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowTokenDropdown(!showTokenDropdown)}
            className="w-[140px] h-[42px] bg-zinc-800 rounded-[10px] px-3 flex items-center gap-2 hover:bg-zinc-700 transition-colors"
          >
            {selectedToken ? (
              <>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">{selectedToken.icon}</span>
                </div>
                <span className="flex-1 text-base text-white leading-6 tracking-[-0.3125px]">
                  {selectedToken.symbol}
                </span>
              </>
            ) : (
              <span className="flex-1 text-base text-white leading-6 tracking-[-0.3125px]">
                {placeholder}
              </span>
            )}
            <ChevronDown className="w-4 h-4 text-white shrink-0" />
          </button>

          {/* Token Dropdown */}
          {showTokenDropdown && (
            <div className="absolute top-full mt-2 w-[140px] bg-[#1e1f24] rounded-lg shadow-xl border border-zinc-700 overflow-hidden z-50">
              {availableTokens.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => {
                    onTokenSelect(token);
                    setShowTokenDropdown(false);
                  }}
                  className="w-full px-3 py-2.5 flex items-center gap-2 hover:bg-zinc-800 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">{token.icon}</span>
                  </div>
                  <span className="text-base text-white">{token.symbol}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* USD Value */}
      <div className="text-sm text-gray-400 leading-5 tracking-[-0.1504px]">
        {usdValue}
      </div>
    </div>
  );
}
