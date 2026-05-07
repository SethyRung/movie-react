import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type CategoryOption = "popular" | "now_playing" | "upcoming" | "top_rated";

const CATEGORY_LABELS: Record<CategoryOption, string> = {
  popular: "Popular",
  now_playing: "Now Playing",
  upcoming: "Upcoming",
  top_rated: "Top Rated",
};

export type CategoryTabsProps = {
  value: CategoryOption;
  onChange: (value: CategoryOption) => void;
};

export function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as CategoryOption)}>
      <TabsList>
        {(Object.keys(CATEGORY_LABELS) as CategoryOption[]).map((key) => (
          <TabsTrigger key={key} value={key} className="cursor-pointer">
            {CATEGORY_LABELS[key]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
