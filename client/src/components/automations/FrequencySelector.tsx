import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';

interface FrequencySelectorProps {
  frequency: string;
  register: ReturnType<typeof import('react-hook-form').useForm>['register'];
  setValue: ReturnType<typeof import('react-hook-form').useForm>['setValue'];
  watch: ReturnType<typeof import('react-hook-form').useForm>['watch'];
}

export function FrequencySelector({ frequency, register, setValue, watch }: FrequencySelectorProps) {
  const timeOfDay = watch('timeOfDay');
  const dayOfWeek = watch('dayOfWeek');

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
              // Clear frequency-specific fields when changing frequency
              if (value !== 'day' && value !== 'week') {
                setValue('timeOfDay', undefined);
                setValue('dayOfWeek', undefined);
              }
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
            <Label htmlFor="timeOfDay">Run at (time) *</Label>
            <Input
              id="timeOfDay"
              type="time"
              value={timeOfDay || '09:00'}
              onChange={(e) => setValue('timeOfDay', e.target.value, { shouldValidate: true })}
            />
          </div>
        )}

        {frequency === 'week' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">Day of week *</Label>
              <Select
                value={dayOfWeek !== undefined ? String(dayOfWeek) : '1'}
                onValueChange={(value) => setValue('dayOfWeek', Number(value), { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dayNames.map((day, index) => (
                    <SelectItem key={index} value={String(index)}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekTimeOfDay">Run at (time) *</Label>
              <Input
                id="weekTimeOfDay"
                type="time"
                value={timeOfDay || '09:00'}
                onChange={(e) => setValue('timeOfDay', e.target.value, { shouldValidate: true })}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
