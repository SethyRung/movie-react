import { Link } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function NotFoundPage() {
  usePageTitle("Page Not Found");

  return (
    <PageContainer className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <Icon icon="lucide:film" className="w-16 h-16 text-muted-foreground mb-6" />
      <h1 className="font-heading text-4xl font-bold text-foreground mb-2">404</h1>
      <p className="text-lg text-muted-foreground mb-2">Page not found</p>
      <p className="text-sm text-muted-foreground mb-8 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">
          <Icon icon="lucide:house" className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </Button>
    </PageContainer>
  );
}
