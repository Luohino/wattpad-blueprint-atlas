import { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Book } from 'lucide-react';

export default function Auth() {
  const { user, sendSignupOTP, verifySignupOTP, signIn, sendForgotPasswordOTP, verifyForgotPasswordOTP, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState('email'); // email, otp, details, complete

  // Sign in form data
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Sign up form data
  const [signUpData, setSignUpData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
    username: '',
    displayName: '',
    profilePicture: null as File | null
  });

  // Forgot password form data
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'reset') {
      setActiveTab('forgot');
    }
  }, [searchParams]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signIn(signInData.email, signInData.password);

    if (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const handleSignUpStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await sendSignupOTP(signUpData.email);

    if (error) {
      setError(error.message);
    } else {
      setCurrentStep('otp');
    }
    setIsLoading(false);
  };

  const handleSignUpStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await verifySignupOTP(
      signUpData.email,
      signUpData.otp,
      signUpData.password,
      signUpData.username,
      signUpData.displayName
    );

    if (error) {
      setError(error.message);
    } else {
      setCurrentStep('complete');
      setTimeout(() => {
        setActiveTab('signin');
        setCurrentStep('email');
        setSignUpData({
          email: '',
          otp: '',
          password: '',
          confirmPassword: '',
          username: '',
          displayName: '',
          profilePicture: null
        });
      }, 2000);
    }
    setIsLoading(false);
  };

  const handleSignUpStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setCurrentStep('details');
  };

  const handleForgotPasswordStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await sendForgotPasswordOTP(forgotPasswordData.email);

    if (error) {
      setError(error.message);
    } else {
      setCurrentStep('otp');
    }
    setIsLoading(false);
  };

  const handleForgotPasswordStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }
    if (forgotPasswordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    const { error } = await verifyForgotPasswordOTP(
      forgotPasswordData.email,
      forgotPasswordData.otp,
      forgotPasswordData.newPassword
    );

    if (error) {
      setError(error.message);
    } else {
      setActiveTab('signin');
      setCurrentStep('email');
      setForgotPasswordData({
        email: '',
        otp: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Book className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold text-foreground">Wattpad Clone</h1>
        </div>

        <Tabs value={activeTab} onValueChange={(tab) => {
          setActiveTab(tab);
          setCurrentStep('email');
          setError('');
        }} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="forgot">Forgot Password</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your account to continue reading and writing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  {currentStep === 'email' && 'Enter your email to get started'}
                  {currentStep === 'otp' && 'Enter the OTP sent to your email'}
                  {currentStep === 'details' && 'Complete your profile'}
                  {currentStep === 'complete' && 'Account created successfully!'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentStep === 'email' && (
                  <form onSubmit={handleSignUpStep1} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                        required
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Send OTP
                    </Button>
                  </form>
                )}

                {currentStep === 'otp' && (
                  <form onSubmit={handleSignUpStep3} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Enter OTP sent to {signUpData.email}</Label>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={signUpData.otp}
                          onChange={(value) => setSignUpData({...signUpData, otp: value})}
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={signUpData.password}
                          onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={signUpData.confirmPassword}
                          onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Continue
                    </Button>
                  </form>
                )}

                {currentStep === 'details' && (
                  <form onSubmit={handleSignUpStep2} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={signUpData.username}
                          onChange={(e) => setSignUpData({...signUpData, username: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={signUpData.displayName}
                          onChange={(e) => setSignUpData({...signUpData, displayName: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
                      <Input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setSignUpData({...signUpData, profilePicture: file});
                        }}
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Create Account
                    </Button>
                  </form>
                )}

                {currentStep === 'complete' && (
                  <div className="text-center space-y-4">
                    <div className="text-green-600 font-semibold">
                      Account created successfully! Redirecting to sign in...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forgot">
            <Card>
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                  {currentStep === 'email' && 'Enter your email to receive OTP'}
                  {currentStep === 'otp' && 'Enter OTP and set new password'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentStep === 'email' && (
                  <form onSubmit={handleForgotPasswordStep1} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resetEmail">Email</Label>
                      <Input
                        id="resetEmail"
                        type="email"
                        value={forgotPasswordData.email}
                        onChange={(e) => setForgotPasswordData({...forgotPasswordData, email: e.target.value})}
                        required
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Send OTP
                    </Button>
                  </form>
                )}

                {currentStep === 'otp' && (
                  <form onSubmit={handleForgotPasswordStep2} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Enter OTP sent to {forgotPasswordData.email}</Label>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={forgotPasswordData.otp}
                          onChange={(value) => setForgotPasswordData({...forgotPasswordData, otp: value})}
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={forgotPasswordData.newPassword}
                          onChange={(e) => setForgotPasswordData({...forgotPasswordData, newPassword: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                        <Input
                          id="confirmNewPassword"
                          type="password"
                          value={forgotPasswordData.confirmNewPassword}
                          onChange={(e) => setForgotPasswordData({...forgotPasswordData, confirmNewPassword: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Reset Password
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}