import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Pause, Edit, Trash2, Clock, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/useToast';
import { getAutomations, toggleAutomationStatus, deleteAutomation } from '@/api/automations';
import { DeleteConfirmDialog } from '@/components/automations/DeleteConfirmDialog';
import { EmptyState } from '@/components/automations/EmptyState';

interface Automation {
  _id: string;
  name: string;
  status: boolean;
  frequency: string;
  frequencyDetails: any;
  campaignId: string;
  campaignName: string;
  timeValue: number;
  timeUnit: string;
  segmentFilters: any;
  lastRun: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null);

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = async () => {
    try {
      console.log('Loading automations...');
      const response: any = await getAutomations();
      setAutomations(response.automations);
      console.log('Automations loaded:', response.automations.length);
    } catch (error: any) {
      console.error('Error loading automations:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      console.log(`Toggling automation ${id} status to ${!currentStatus}`);
      await toggleAutomationStatus(id, !currentStatus);
      setAutomations(automations.map(auto => 
        auto._id === id ? { ...auto, status: !currentStatus } : auto
      ));
      toast({
        title: 'Success',
        description: `Automation turned ${!currentStatus ? 'ON' : 'OFF'}`,
      });
    } catch (error: any) {
      console.error('Error toggling automation status:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedAutomation) return;
    
    try {
      console.log(`Deleting automation ${selectedAutomation}`);
      await deleteAutomation(selectedAutomation);
      setAutomations(automations.filter(auto => auto._id !== selectedAutomation));
      toast({
        title: 'Success',
        description: 'Automation deleted successfully',
      });
      setDeleteDialogOpen(false);
      setSelectedAutomation(null);
    } catch (error: any) {
      console.error('Error deleting automation:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getFrequencyLabel = (frequency: string, details: any) => {
    switch (frequency) {
      case 'minute':
        return 'Every minute';
      case 'second':
        return 'Every second';
      case 'hour':
        return 'Every hour';
      case 'day':
        return `Every day at ${details.time || '00:00'}`;
      case 'week':
        return `Every ${details.day || 'Monday'} at ${details.time || '00:00'}`;
      default:
        return frequency;
    }
  };

  const getSegmentFilterSummary = (filters: any) => {
    const parts = [];
    if (filters.useCase && filters.useCase.length > 0) {
      parts.push(`Use Case: ${filters.useCase.join(', ')}`);
    }
    if (filters.category && filters.category.length > 0) {
      parts.push(`Category: ${filters.category.join(', ')}`);
    }
    if (filters.alternative && filters.alternative.length > 0) {
      parts.push(`Alternative: ${filters.alternative.join(', ')}`);
    }
    return parts.length > 0 ? parts.join(' | ') : 'No filters';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Automation Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your automated workflows and campaigns
          </p>
        </div>
        <Button 
          onClick={() => navigate('/automation/new')}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New Automation
        </Button>
      </div>

      {automations.length === 0 ? (
        <EmptyState onCreateNew={() => navigate('/automation/new')} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {automations.map((automation) => (
            <Card 
              key={automation._id} 
              className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-800 backdrop-blur-sm bg-card/50"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 group-hover:text-purple-600 transition-colors">
                      {automation.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant={automation.status ? 'default' : 'secondary'} className="gap-1">
                        {automation.status ? (
                          <>
                            <Play className="h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <Pause className="h-3 w-3" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </CardDescription>
                  </div>
                  <Switch
                    checked={automation.status}
                    onCheckedChange={() => handleToggleStatus(automation._id, automation.status)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Frequency:</span>
                    <span className="text-muted-foreground">
                      {getFrequencyLabel(automation.frequency, automation.frequencyDetails)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Campaign:</span>
                    <span className="text-muted-foreground truncate">
                      {automation.campaignName}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Timing:</span>
                    <span className="text-muted-foreground">
                      {automation.timeValue} {automation.timeUnit} after signup
                    </span>
                  </div>
                </div>

                {(automation.segmentFilters.useCase?.length > 0 || 
                  automation.segmentFilters.category?.length > 0 || 
                  automation.segmentFilters.alternative?.length > 0) && (
                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium mb-2">Segment Filters:</p>
                    <p className="text-xs text-muted-foreground">
                      {getSegmentFilterSummary(automation.segmentFilters)}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/automation/edit/${automation._id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:text-destructive"
                    onClick={() => {
                      setSelectedAutomation(automation._id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
}