import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap } from 'lucide-react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface CampaignSelectorProps {
  campaigns: Array<{ id: number; name: string }>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: Record<string, { message?: string }>;
}

export function CampaignSelector({ campaigns, setValue, watch, errors }: CampaignSelectorProps) {
  const campaignId = watch('campaignId');

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Woodpecker Campaign
        </CardTitle>
        <CardDescription>Select the campaign to add users to</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="campaignId">Campaign *</Label>
          <Select
            value={campaignId ? String(campaignId) : ''}
            onValueChange={(value) => setValue('campaignId', Number(value), { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a campaign" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={String(campaign.id)}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.campaignId && (
            <p className="text-sm text-destructive">{errors.campaignId.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
