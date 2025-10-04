import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onCreateNew: () => void;
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-6 mb-6">
        <Zap className="h-16 w-16 text-purple-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No automations yet</h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Create your first automation to start adding users to Woodpecker campaigns automatically based on signup timing and segments.
      </p>
      <Button 
        onClick={onCreateNew}
        size="lg"
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        Create Your First Automation
      </Button>
    </div>
  );
}