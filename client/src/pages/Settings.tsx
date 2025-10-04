import { useEffect, useState } from 'react';
import { ArrowLeft, Database, Zap, RefreshCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/useToast';
import { getConnectionStatus } from '@/api/settings';
import { testMongoDBConnection, updateMongoDBConnection } from '@/api/mongodb';
import { testWoodpeckerConnection, updateWoodpeckerApiKey, getWoodpeckerCampaigns } from '@/api/woodpecker';

export function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<{
    mongodb?: { connected: boolean };
    woodpecker?: { connected: boolean };
  }>({});
  const [mongoUrl, setMongoUrl] = useState('');
  const [woodpeckerKey, setWoodpeckerKey] = useState('');
  const [mongoTesting, setMongoTesting] = useState(false);
  const [woodpeckerTesting, setWoodpeckerTesting] = useState(false);
  const [refreshingCampaigns, setRefreshingCampaigns] = useState(false);

  useEffect(() => {
    loadConnectionStatus();
  }, []);

  const loadConnectionStatus = async () => {
    try {
      console.log('Loading connection status...');
      const response = await getConnectionStatus() as {
        mongodb?: { connected: boolean };
        woodpecker?: { connected: boolean };
      };
      setConnectionStatus(response);
      console.log('Connection status loaded:', response);
    } catch (error) {
      console.error('Error loading connection status:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    }
  };

  const handleTestMongo = async () => {
    if (!mongoUrl) {
      toast({
        title: 'Error',
        description: 'Please enter a MongoDB connection URL',
        variant: 'destructive'
      });
      return;
    }

    try {
      setMongoTesting(true);
      console.log('Testing MongoDB connection...');
      const response = await testMongoDBConnection(mongoUrl) as { success: boolean };
      if (response.success) {
        toast({
          title: 'Success',
          description: '✓ Connection successful',
        });
      }
    } catch (error) {
      console.error('MongoDB connection test failed:', error);
      toast({
        title: 'Error',
        description: '✗ Connection failed. Please check your URL.',
        variant: 'destructive'
      });
    } finally {
      setMongoTesting(false);
    }
  };

  const handleUpdateMongo = async () => {
    if (!mongoUrl) {
      toast({
        title: 'Error',
        description: 'Please enter a MongoDB connection URL',
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Updating MongoDB connection...');
      await updateMongoDBConnection(mongoUrl);
      toast({
        title: 'Success',
        description: 'MongoDB connection updated successfully',
      });
      setMongoUrl('');
      loadConnectionStatus();
    } catch (error) {
      console.error('Error updating MongoDB connection:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    }
  };

  const handleTestWoodpecker = async () => {
    if (!woodpeckerKey) {
      toast({
        title: 'Error',
        description: 'Please enter a Woodpecker API key',
        variant: 'destructive'
      });
      return;
    }

    try {
      setWoodpeckerTesting(true);
      console.log('Testing Woodpecker connection...');
      const response = await testWoodpeckerConnection(woodpeckerKey) as {
        success: boolean;
        campaignCount: number;
      };
      if (response.success) {
        toast({
          title: 'Success',
          description: `✓ Connected. Found ${response.campaignCount} campaigns.`,
        });
      }
    } catch (error) {
      console.error('Woodpecker connection test failed:', error);
      toast({
        title: 'Error',
        description: '✗ Connection failed. Please check your API key.',
        variant: 'destructive'
      });
    } finally {
      setWoodpeckerTesting(false);
    }
  };

  const handleUpdateWoodpecker = async () => {
    if (!woodpeckerKey) {
      toast({
        title: 'Error',
        description: 'Please enter a Woodpecker API key',
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Updating Woodpecker API key...');
      await updateWoodpeckerApiKey(woodpeckerKey);
      toast({
        title: 'Success',
        description: 'Woodpecker API key updated successfully',
      });
      setWoodpeckerKey('');
      loadConnectionStatus();
    } catch (error) {
      console.error('Error updating Woodpecker API key:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    }
  };

  const handleRefreshCampaigns = async () => {
    try {
      setRefreshingCampaigns(true);
      console.log('Refreshing campaigns...');
      const response = await getWoodpeckerCampaigns() as {
        campaigns: Array<{ id: string; name: string }>;
      };
      toast({
        title: 'Success',
        description: `Refreshed ${response.campaigns.length} campaigns`,
      });
    } catch (error) {
      console.error('Error refreshing campaigns:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setRefreshingCampaigns(false);
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
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your integrations and connections
          </p>
        </div>
      </div>

      <Card className="backdrop-blur-sm bg-card/50 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-600" />
            External MongoDB Connection
          </CardTitle>
          <CardDescription>
            Current status: {' '}
            {connectionStatus.mongodb?.connected ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <XCircle className="h-3 w-3" />
                Disconnected
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mongoUrl">MongoDB Connection URL</Label>
            <Input
              id="mongoUrl"
              type="password"
              placeholder="mongodb://username:password@host:port/database"
              value={mongoUrl}
              onChange={(e) => setMongoUrl(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleTestMongo}
              disabled={mongoTesting || !mongoUrl}
              variant="outline"
            >
              {mongoTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
            <Button
              onClick={handleUpdateMongo}
              disabled={!mongoUrl}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Update Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-card/50 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Woodpecker Integration
          </CardTitle>
          <CardDescription>
            Current status: {' '}
            {connectionStatus.woodpecker?.connected ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <XCircle className="h-3 w-3" />
                Disconnected
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="woodpeckerKey">Woodpecker API Key</Label>
            <Input
              id="woodpeckerKey"
              type="password"
              placeholder="Enter your API key"
              value={woodpeckerKey}
              onChange={(e) => setWoodpeckerKey(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleTestWoodpecker}
              disabled={woodpeckerTesting || !woodpeckerKey}
              variant="outline"
            >
              {woodpeckerTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
            <Button
              onClick={handleUpdateWoodpecker}
              disabled={!woodpeckerKey}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Update API Key
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={handleRefreshCampaigns}
              disabled={refreshingCampaigns}
              variant="outline"
              className="w-full"
            >
              {refreshingCampaigns ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Campaigns
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}