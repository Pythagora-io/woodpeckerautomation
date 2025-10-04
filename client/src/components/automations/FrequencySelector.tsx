import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';

interface FrequencySelectorProps {
  frequency: string;
  register: any;
  setValue: any;
  watch: any;
}

export function FrequencySelector({ frequency, register, setValue, watch }: FrequencySelectorProps) {
  const frequencyDetails = watch('frequencyDetails') || {};

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" />
          Trigger Frequency
        </CardTitle>
        <CardDescription>How often should this automation run?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency *</Label>
          <Select
            value={frequency}
            onValueChange={(value) => {
              setValue('frequency', value);
              setValue('frequencyDetails', {});
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minute">Every minute</SelectItem>
              <SelectItem value="second">Every second</SelectItem>
              <SelectItem value="hour">Every hour</SelectItem>
              <SelectItem value="day">Every day</SelectItem>
              <SelectItem value="week">Every week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {frequency === 'day' && (
          <div className="space-y-2">
            <Label htmlFor="time">Run at (time) *</Label>
            <Input
              id="time"
              type="time"
              value={frequencyDetails.time || '09:00'}
              onChange={(e) => setValue('frequencyDetails', { time: e.target.value })}
            />
          </div>
        )}

        {frequency === 'week' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day of week *</Label>
              <Select
                value={frequencyDetails.day || 'Monday'}
                onValueChange={(value) => setValue('frequencyDetails', { ...frequencyDetails, day: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekTime">Run at (time) *</Label>
              <Input
                id="weekTime"
                type="time"
                value={frequencyDetails.time || '09:00'}
                onChange={(e) => setValue('frequencyDetails', { ...frequencyDetails, time: e.target.value })}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}