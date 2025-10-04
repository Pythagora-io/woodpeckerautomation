import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/useToast';
import { createAutomation, updateAutomation, getAutomationById } from '@/api/automations';
import { getWoodpeckerCampaigns } from '@/api/woodpecker';
import { getSegmentOptions } from '@/api/mongodb';
import { FrequencySelector } from '@/components/automations/FrequencySelector';
import { CampaignSelector } from '@/components/automations/CampaignSelector';
import { TimingSelector } from '@/components/automations/TimingSelector';
import { SegmentFilters } from '@/components/automations/SegmentFilters';

interface FormData {
  name: string;
  frequency: string;
  frequencyDetails: Record<string, unknown>;
  campaignId: string;
  timeValue: number;
  timeUnit: string;
  segmentFilters: {
    useCase: string[];
    category: string[];
    alternative: string[];
  };
}

export function AutomationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Array<{ id: string; name: string }>>([]);
  const [segmentOptions, setSegmentOptions] = useState<{
    useCases?: string[];
    categories?: string[];
    alternatives?: string[];
  }>({});
  const [enableSegmentFilters, setEnableSegmentFilters] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      frequency: 'hour',
      frequencyDetails: {},
      campaignId: '',
      timeValue: 2,
      timeUnit: 'hours',
      segmentFilters: {
        useCase: [],
        category: [],
        alternative: []
      }
    }
  });

  const frequency = watch('frequency');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      loadAutomation(id);
    }
  }, [id, isEditMode]);

  const loadData = async () => {
    try {
      console.log('Loading campaigns and segment options...');
      const [campaignsRes, segmentRes] = await Promise.all([
        getWoodpeckerCampaigns(),
        getSegmentOptions()
      ]) as [
        { campaigns: Array<{ id: string; name: string }> },
        { useCases?: string[]; categories?: string[]; alternatives?: string[] }
      ];
      setCampaigns(campaignsRes.campaigns);
      setSegmentOptions(segmentRes);
      console.log('Data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    }
  };

  const loadAutomation = async (automationId: string) => {
    try {
      console.log(`Loading automation ${automationId}...`);
      const response = await getAutomationById(automationId) as {
        automation: {
          name: string;
          frequency: string;
          frequencyDetails: Record<string, unknown>;
          campaignId: string;
          timeValue: number;
          timeUnit: string;
          segmentFilters: {
            useCase: string[];
            category: string[];
            alternative: string[];
          };
        };
      };
      const automation = response.automation;

      setValue('name', automation.name);
      setValue('frequency', automation.frequency);
      setValue('frequencyDetails', automation.frequencyDetails);
      setValue('campaignId', automation.campaignId);
      setValue('timeValue', automation.timeValue);
      setValue('timeUnit', automation.timeUnit);
      setValue('segmentFilters', automation.segmentFilters);

      const hasFilters = automation.segmentFilters.useCase?.length > 0 ||
                        automation.segmentFilters.category?.length > 0 ||
                        automation.segmentFilters.alternative?.length > 0;
      setEnableSegmentFilters(hasFilters);

      console.log('Automation loaded successfully');
    } catch (error) {
      console.error('Error loading automation:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    }
  };

  const onSubmit = async (data: FormData, turnOn: boolean = false) => {
    try {
      setLoading(true);
      console.log('Submitting automation:', { ...data, status: turnOn });

      const payload = {
        ...data,
        status: turnOn,
        segmentFilters: enableSegmentFilters ? data.segmentFilters : {
          useCase: [],
          category: [],
          alternative: []
        }
      };

      if (isEditMode && id) {
        await updateAutomation(id, payload);
        toast({
          title: 'Success',
          description: 'Automation updated successfully',
        });
      } else {
        await createAutomation(payload);
        toast({
          title: 'Success',
          description: `Automation created ${turnOn ? 'and activated' : 'as draft'}`,
        });
      }

      navigate('/');
    } catch (error) {
      console.error('Error saving automation:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {isEditMode ? 'Edit Automation' : 'Create New Automation'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode ? 'Update your automation settings' : 'Set up a new automated workflow'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
        <Card className="backdrop-blur-sm bg-card/50 border-2">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Give your automation a descriptive name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="name">Automation Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Welcome Campaign - 2 hours after signup"
                {...register('name', { required: 'Automation name is required' })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <FrequencySelector
          frequency={frequency}
          register={register}
          setValue={setValue}
          watch={watch}
        />

        <CampaignSelector
          campaigns={campaigns}
          register={register}
          errors={errors}
        />

        <TimingSelector
          register={register}
          errors={errors}
        />

        <SegmentFilters
          enabled={enableSegmentFilters}
          onEnabledChange={setEnableSegmentFilters}
          segmentOptions={segmentOptions}
          register={register}
          setValue={setValue}
          watch={watch}
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="outline"
            disabled={loading}
            className="flex-1"
          >
            <Save className="mr-2 h-4 w-4" />
            {isEditMode ? 'Save Changes' : 'Save as Draft'}
          </Button>
          {!isEditMode && (
            <Button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data, true))}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Power className="mr-2 h-4 w-4" />
              Save & Turn On
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}