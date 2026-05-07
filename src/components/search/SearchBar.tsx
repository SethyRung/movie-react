import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";

export type SearchBarProps = {
  placeholder?: string;
  defaultValue?: string;
  onSearch: (query: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

export function SearchBar({
  placeholder = "Search movies...",
  defaultValue = "",
  onSearch,
  inputRef,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <Icon
        icon="lucide:search"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
      />
      <Input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10 pr-4 h-10"
      />
    </form>
  );
}
