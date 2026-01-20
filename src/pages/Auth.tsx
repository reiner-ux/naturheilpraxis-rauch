import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Mail, ArrowLeft, Loader2, Shield, UserPlus, LogIn, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Alert, AlertDescription } from '@/components/ui/alert';

const emailSchema = z.string().trim().email({ message: "Ungültige E-Mail-Adresse" }).max(255);

type AuthStep = 'email' | 'verification';
type AuthMode = 'login' | 'registration';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

  const [mode, setMode] = useState<AuthMode>('login');
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
    } catch {
      toast({
        title: language === 'de' ? 'Ungültige E-Mail' : 'Invalid Email',
        description: language === 'de' ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' : 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await supabase.functions.invoke('request-verification-code', {
        body: { email, type: mode },
      });

      if (response.error) {
        // Supabase returns a generic message for non-2xx; try to extract the JSON body error
        let message = response.error.message || 'Fehler beim Senden des Codes';
        try {
          const body = await response.error.context?.response?.json();
          if (body?.error) message = body.error;
        } catch {
          // ignore parsing errors
        }
        throw new Error(message);
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      setUserId(response.data.userId);
      setStep('verification');
      
      toast({
        title: language === 'de' ? 'Code gesendet' : 'Code Sent',
        description: language === 'de' 
          ? 'Ein Bestätigungscode wurde an Ihre E-Mail gesendet.' 
          : 'A verification code has been sent to your email.',
      });
    } catch (error: any) {
      const errorMessage = error.message || '';
      
      // Check if this is a "already registered" error (409) - auto-switch to login
      if (mode === 'registration' && errorMessage.includes('bereits registriert')) {
        toast({
          title: language === 'de' ? 'Bereits registriert' : 'Already Registered',
          description: language === 'de' 
            ? 'Diese E-Mail ist bereits registriert. Wechsel zum Anmelden...' 
            : 'This email is already registered. Switching to login...',
        });
        // Auto-switch to login tab after a short delay
        setTimeout(() => {
          setMode('login');
        }, 1500);
      } else {
        toast({
          title: language === 'de' ? 'Fehler' : 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCodeVerification = async () => {
    if (code.length !== 6) {
      toast({
        title: language === 'de' ? 'Ungültiger Code' : 'Invalid Code',
        description: language === 'de' ? 'Bitte geben Sie den 6-stelligen Code ein.' : 'Please enter the 6-digit code.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await supabase.functions.invoke('verify-code', {
        body: { email, code, type: mode },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Fehler bei der Verifizierung');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      // Use the token to sign in
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: response.data.token,
        type: 'magiclink',
      });

      if (verifyError) {
        throw verifyError;
      }

      toast({
        title: language === 'de' ? 'Erfolgreich' : 'Success',
        description: mode === 'registration'
          ? (language === 'de' ? 'Registrierung erfolgreich! Sie sind jetzt angemeldet.' : 'Registration successful! You are now logged in.')
          : (language === 'de' ? 'Anmeldung erfolgreich!' : 'Login successful!'),
      });

      navigate('/anamnesebogen');
    } catch (error: any) {
      toast({
        title: language === 'de' ? 'Fehler' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);

    try {
      const response = await supabase.functions.invoke('request-verification-code', {
        body: { email, type: mode },
      });

      if (response.error) {
        let message = response.error.message || 'Fehler beim erneuten Senden';
        try {
          const body = await response.error.context?.response?.json();
          if (body?.error) message = body.error;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: language === 'de' ? 'Code erneut gesendet' : 'Code Resent',
        description: language === 'de' 
          ? 'Ein neuer Code wurde an Ihre E-Mail gesendet.' 
          : 'A new code has been sent to your email.',
      });
    } catch (error: any) {
      toast({
        title: language === 'de' ? 'Fehler' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setCode('');
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode as AuthMode);
    setStep('email');
    setCode('');
    setEmail('');
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {language === 'de' ? 'Patientenportal' : 'Patient Portal'}
            </CardTitle>
            <CardDescription>
              {language === 'de' 
                ? 'Sichere Anmeldung mit E-Mail-Bestätigung' 
                : 'Secure login with email verification'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 'email' ? (
              <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    {language === 'de' ? 'Anmelden' : 'Login'}
                  </TabsTrigger>
                  <TabsTrigger value="registration" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    {language === 'de' ? 'Registrieren' : 'Register'}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-login">
                        {language === 'de' ? 'E-Mail-Adresse' : 'Email Address'}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email-login"
                          type="email"
                          placeholder="ihre.email@beispiel.de"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {language === 'de' ? 'Wird gesendet...' : 'Sending...'}
                        </>
                      ) : (
                        language === 'de' ? 'Code senden' : 'Send Code'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="registration">
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-register">
                        {language === 'de' ? 'E-Mail-Adresse' : 'Email Address'}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email-register"
                          type="email"
                          placeholder="ihre.email@beispiel.de"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    {/* Hint box for already registered users */}
                    <Alert className="bg-sage-50 border-sage-200">
                      <Info className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-sm">
                        {language === 'de' 
                          ? 'Bereits registriert? Bitte wechseln Sie zum Tab "Anmelden".' 
                          : 'Already registered? Please switch to the "Login" tab.'}
                      </AlertDescription>
                    </Alert>
                    
                    <p className="text-sm text-muted-foreground">
                      {language === 'de' 
                        ? 'Nach der Registrierung können Sie Ihren Anamnesebogen online ausfüllen und verwalten.' 
                        : 'After registration, you can fill out and manage your medical history form online.'}
                    </p>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {language === 'de' ? 'Wird gesendet...' : 'Sending...'}
                        </>
                      ) : (
                        language === 'de' ? 'Registrieren' : 'Register'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-6">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="mb-2 -ml-2"
                  disabled={loading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {language === 'de' ? 'Zurück' : 'Back'}
                </Button>

                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-lg">
                    {language === 'de' ? 'Bestätigungscode eingeben' : 'Enter Verification Code'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de' 
                      ? `Wir haben einen 6-stelligen Code an ${email} gesendet.` 
                      : `We sent a 6-digit code to ${email}.`}
                  </p>
                </div>

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={(value) => setCode(value)}
                    disabled={loading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button 
                  onClick={handleCodeVerification} 
                  className="w-full" 
                  disabled={loading || code.length !== 6}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {language === 'de' ? 'Wird verifiziert...' : 'Verifying...'}
                    </>
                  ) : (
                    language === 'de' ? 'Bestätigen' : 'Verify'
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-sm"
                  >
                    {language === 'de' ? 'Code erneut senden' : 'Resend code'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Auth;
