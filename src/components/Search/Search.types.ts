export interface SearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  debounceMs?: number;
  size?: 'sm' | 'default' | 'lg';
}