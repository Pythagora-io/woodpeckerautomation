import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Database, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/useToast';
import { testMongoDBConnection, updateMongoDBConnection } from '@/api/mongodb';
import { testWoodpeckerConnection, updateWoodpeckerApiKey } from '@/api/woodpecker';

export function Setup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [mongoUrl, setMongoUrl] = useState('');
  const [woodpeckerKey, setWoodpeckerKey] = useState('');
  const [mongoTesting, setMongoTesting] = useState(false);
  const [mongoSuccess, setMongoSuccess] = useState(false);
  const [woodpeckerTesting, setWoodpeckerTesting] = useState(false);
  const [woodpeckerSuccess, setWoodpeckerSuccess] = useState(false);

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
      const response: any = await testMongoDBConnection(mongoUrl);
      if (response.success) {
        setMongoSuccess(true);
        toast({
          title: 'Success',
          description: '✓ Connection successful',
        });
      }
    } catch (error: any) {
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

  const handleSaveMongo = async () => {
    if (!mongoSuccess) {
      toast({
        title: 'Error',
        description: 'Please test the connection first',
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Saving MongoDB connection...');
      await updateMongoDBConnection(mongoUrl);
      setStep(2);
    } catch (error: any) {
      console.error('Error saving MongoDB connection:', error);
      toast({
        title: 'Error',
        description: error.message,
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
      const response: any = await testWoodpeckerConnection(woodpeckerKey);
      if (response.success) {
        setWoodpeckerSuccess(true);
        toast({
          title: 'Success',
          description: `✓ Connected. Found ${response.campaignCount} campaigns.`,
        });
      }
    } catch (error: any) {
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

  const handleSaveWoodpecker = async () => {
    if (!woodpeckerSuccess) {
      toast({
        title: 'Error',
        description: 'Please test the connection first',
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Saving Woodpecker API key...');
      await updateWoodpeckerApiKey(woodpeckerKey);
      setStep(3);
    } catch (error: any) {
      console.error('Error saving Woodpecker API key:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to Automation Manager
          </h1>
          <p className="text-muted-foreground">
            Let's get you set up in just a few steps
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex items-center gap-2 ${
                s === step ? 'text-primary' : s < step ? 'text-green-600' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  s === step
                    ? 'border-primary bg-primary text-primary-foreground'
                    : s < step
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-muted'
                }`}
              >
                {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
              </div>
              <span className="font-medium hidden sm:inline">
                {s === 1 ? 'MongoDB' : s === 2 ? 'Woodpecker' : 'Complete'}
              </span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card className="backdrop-blur-sm bg-card/80 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6 text-purple-600" />
                Connect External MongoDB
              </CardTitle>
              <CardDescription>
                Enter your MongoDB connection URL to monitor user signups
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
                  onChange={(e) => {
                    setMongoUrl(e.target.value);
                    setMongoSuccess(false);
                  }}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleTestMongo}
                  disabled={mongoTesting || !mongoUrl}
                  variant="outline"
                  className="flex-1"
                >
                  {mongoTesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : mongoSuccess ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                      Connection Successful
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
                <Button
                  onClick={handleSaveMongo}
                  disabled={!mongoSuccess}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Save & Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="backdrop-blur-sm bg-card/80 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-blue-600" />
                Connect Woodpecker
              </CardTitle>
              <CardDescription>
                Enter your Woodpecker API key to manage campaigns
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
                  onChange={(e) => {
                    setWoodpeckerKey(e.target.value);
                    setWoodpeckerSuccess(false);
                  }}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleTestWoodpecker}
                  disabled={woodpeckerTesting || !woodpeckerKey}
                  variant="outline"
                  className="flex-1"
                >
                  {woodpeckerTesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : woodpeckerSuccess ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                      Connection Successful
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
                <Button
                  onClick={handleSaveWoodpecker}
                  disabled={!woodpeckerSuccess}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Save & Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="backdrop-blur-sm bg-card/80 border-2 text-center">
            <CardHeader>
              <div className="mx-auto rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-6 w-fit mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-2xl">All Set!</CardTitle>
              <CardDescription>
                You can now create your first automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}