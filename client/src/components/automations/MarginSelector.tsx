import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface MarginSelectorProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: Record<string, { message?: string }>;
}

export function MarginSelector({ register, setValue, watch, errors }: MarginSelectorProps) {
  const marginUnit = watch('marginUnit');

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Time Window Margin
        </CardTitle>
        <CardDescription>
          How wide should the time window be around the target timing?
          For example, if set to "2 hours after signup" with a margin of "1 hour",
          it will fetch users who signed up between 1-3 hours ago.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="marginValue">Margin Value *</Label>
            <Input
              id="marginValue"
              type="number"
              min="1"
              placeholder="1"
              {...register('marginValue', {
                required: 'Margin value is required',
                min: { value: 1, message: 'Margin value must be greater than 0' }
              })}
            />
            {errors.marginValue && (
              <p className="text-sm text-destructive">{errors.marginValue.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="marginUnit">Margin Unit *</Label>
            <Select
              value={marginUnit || ''}
              onValueChange={(value) => setValue('marginUnit', value, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
            {errors.marginUnit && (
              <p className="text-sm text-destructive">{errors.marginUnit.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
