import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Users, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/useToast';
import { getActivityLog } from '@/api/activity';

interface Activity {
  _id: string;
  automationId: string;
  automationName: string;
  timestamp: string;
  usersFound: number;
  usersAdded: number;
  status: string;
  errorMessage: string;
}

export function Activity() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      console.log('Loading activity log...');
      const response: any = await getActivityLog();
      setActivities(response.activities);
      console.log('Activity log loaded:', response.activities.length);
    } catch (error: any) {
      console.error('Error loading activity log:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge variant="default" className="gap-1 bg-green-600">
            <CheckCircle2 className="h-3 w-3" />
            Success
          </Badge>
        );
      case 'partial':
        return (
          <Badge variant="default" className="gap-1 bg-yellow-600">
            <AlertCircle className="h-3 w-3" />
            Partial
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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
            Activity Log
          </h1>
          <p className="text-muted-foreground mt-1">
            View recent automation executions and their results
          </p>
        </div>
      </div>

      {activities.length === 0 ? (
        <Card className="backdrop-blur-sm bg-card/50 border-2">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-6 mb-6">
              <Clock className="h-16 w-16 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No executions yet</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Automations will appear here once they run. Create and activate an automation to see activity.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity._id} className="backdrop-blur-sm bg-card/50 border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {activity.automationName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatDate(activity.timestamp)}
                    </CardDescription>
                  </div>
                  {getStatusBadge(activity.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Users Found:</span>
                    <span className="text-sm text-muted-foreground">{activity.usersFound}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Users Added:</span>
                    <span className="text-sm text-muted-foreground">{activity.usersAdded}</span>
                  </div>
                </div>
                {activity.errorMessage && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{activity.errorMessage}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}