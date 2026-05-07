import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Failed to load data.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Icon icon="lucide:alert-circle" className="w-10 h-10 text-destructive mb-4" />
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <Icon icon="lucide:refresh-cw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
