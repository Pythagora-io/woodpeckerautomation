import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';

interface TimingSelectorProps {
  register: ReturnType<typeof import('react-hook-form').useForm>['register'];
  errors: Record<string, { message?: string }>;
}

export function TimingSelector({ register, errors }: TimingSelectorProps) {
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
            <Label htmlFor="timeValue">Time Value *</Label>
            <Input
              id="timeValue"
              type="number"
              min="1"
              placeholder="2"
              {...register('timeValue', { 
                required: 'Time value is required',
                min: { value: 1, message: 'Time value must be greater than 0' }
              })}
            />
            {errors.timeValue && (
              <p className="text-sm text-destructive">{errors.timeValue.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeUnit">Time Unit *</Label>
            <Select {...register('timeUnit', { required: 'Time unit is required' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
            {errors.timeUnit && (
              <p className="text-sm text-destructive">{errors.timeUnit.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}