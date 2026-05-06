import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";

interface SearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  debounceMs?: number;
  size?: "sm" | "default" | "lg";
}

const Search: React.FC<SearchProps> = ({
  placeholder = "Search here",
  onSearch,
  className,
  value: controlledValue,
  onChange,
  debounceMs = 300,
  size = "default",
}) => {
  const [internalValue, setInternalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const sizeClasses = {
    sm: "h-8 text-sm",
    default: "h-10",
    lg: "h-12 text-lg",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Update controlled component
    if (controlledValue !== undefined && onChange) {
      onChange(newValue);
    }

    // Update internal state for uncontrolled component
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    // Debounce search
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch?.(newValue);
    }, debounceMs);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      onSearch(value);
    }
  };

  const handleClear = () => {
    if (controlledValue !== undefined && onChange) {
      onChange("");
    } else {
      setInternalValue("");
    }
    onSearch?.("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Icon
        icon="mdi-magnify"
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-colors ${
          isFocused ? "text-primary" : ""
        }`}
        width="20"
        height="20"
      />

      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`pl-10 pr-10 ${sizeClasses[size]} bg-background border-border focus:border-primary focus:ring-primary`}
      />

      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-sm hover:bg-muted"
          aria-label="Clear search"
        >
          <Icon icon="mdi-close" width="16" height="16" />
        </button>
      )}
    </div>
  );
};

export default Search;
