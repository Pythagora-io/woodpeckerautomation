import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Filter } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';

interface SegmentFiltersProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  segmentOptions: any;
  register: any;
  setValue: any;
  watch: any;
}

export function SegmentFilters({ 
  enabled, 
  onEnabledChange, 
  segmentOptions, 
  setValue, 
  watch 
}: SegmentFiltersProps) {
  const segmentFilters = watch('segmentFilters') || { useCase: [], category: [], alternative: [] };

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-orange-600" />
            <CardTitle>User Segment Filters</CardTitle>
          </div>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
        <CardDescription>
          Optionally filter users by segment data (leave empty for all users)
        </CardDescription>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="useCase">Use Case</Label>
            <MultiSelect
              options={segmentOptions.useCases?.map((uc: string) => ({ label: uc, value: uc })) || []}
              selected={segmentFilters.useCase || []}
              onChange={(values) => setValue('segmentFilters.useCase', values)}
              placeholder="Select use cases"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <MultiSelect
              options={segmentOptions.categories?.map((cat: string) => ({ label: cat, value: cat })) || []}
              selected={segmentFilters.category || []}
              onChange={(values) => setValue('segmentFilters.category', values)}
              placeholder="Select categories"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternative">Alternative</Label>
            <MultiSelect
              options={segmentOptions.alternatives?.map((alt: string) => ({ label: alt, value: alt })) || []}
              selected={segmentFilters.alternative || []}
              onChange={(values) => setValue('segmentFilters.alternative', values)}
              placeholder="Select alternatives"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}