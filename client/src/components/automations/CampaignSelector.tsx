import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap } from 'lucide-react';

interface CampaignSelectorProps {
  campaigns: any[];
  register: any;
  errors: any;
}

export function CampaignSelector({ campaigns, register, errors }: CampaignSelectorProps) {
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
          <Select {...register('campaignId', { required: 'Campaign is required' })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a campaign" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
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