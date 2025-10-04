import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface TimingSelectorProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: Record<string, { message?: string }>;
}

export function TimingSelector({ register, setValue, watch, errors }: TimingSelectorProps) {
  const timingUnit = watch('timingUnit');

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-600" />
          Timing After Signup
        </CardTitle>
        <CardDescription>When should users be added after they sign up?</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timingValue">Time Value *</Label>
            <Input
              id="timingValue"
              type="number"
              min="1"
              placeholder="2"
              {...register('timingValue', {
                required: 'Time value is required',
                min: { value: 1, message: 'Time value must be greater than 0' }
              })}
            />
            {errors.timingValue && (
              <p className="text-sm text-destructive">{errors.timingValue.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="timingUnit">Time Unit *</Label>
            <Select
              value={timingUnit || ''}
              onValueChange={(value) => setValue('timingUnit', value, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
            {errors.timingUnit && (
              <p className="text-sm text-destructive">{errors.timingUnit.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
