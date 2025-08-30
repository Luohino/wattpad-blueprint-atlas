import { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Book, ArrowLeft, Upload } from 'lucide-react';

type SignupStep = 'email' | 'otp' | 'password' | 'profile';
type ForgotStep = 'email' | 'otp' | 'password';

export default function Auth() {
  const { user, loading, sendSignUpOTP, verifyOTPAndSignUp, checkEmailExists, signIn, sendPasswordResetOTP, resetPasswordWithOTP } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode'); // 'reset' for password reset
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  
  // Multi-step states
  const [signupStep, setSignupStep] = useState<SignupStep>('email');
  const [forgotStep, setForgotStep] = useState<ForgotStep>('email');
  
  // Form data
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
    username: '',
    displayName: '',
    profilePic: ''
  });
  const [forgotData, setForgotData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (mode === 'reset') {
      setCurrentTab('forgot');
      setForgotStep('password');
    }
  }, [mode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

    // Check if email exists first
    const { exists } = await checkEmailExists(signInData.email);
    if (!exists) {
      setError('No account found with this email address');
      setIsLoading(false);
      return;
    }

    const { error } = await signIn(signInData.email, signInData.password);
    
    if (error) {
      setError(error.message);
    }
    
    setIsLoading(false);
  };

  const handleSignupEmailStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await sendSignUpOTP(signupData.email);
    
    if (error) {
      setError(error.message);
    } else {
      setSignupStep('otp');
      toast({
        title: "OTP Sent",
        description: "Check your email for the verification code",
      });
    }
    
    setIsLoading(false);
  };

  const handleSignupOTPStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.otp.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    setSignupStep('password');
  };

  const handleSignupPasswordStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setSignupStep('profile');
  };

  const handleSignupComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await verifyOTPAndSignUp(
      signupData.email,
      signupData.otp,
      signupData.password,
      signupData.username,
      signupData.displayName
    );
    
    if (error) {
      setError(error.message);
    } else {
      toast({
        title: "Account Created",
        description: "Welcome to our community!",
      });
    }
    
    setIsLoading(false);
  };

  const handleForgotEmailStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await sendPasswordResetOTP(forgotData.email);
    
    if (error) {
      setError(error.message);
    } else {
      setForgotStep('otp');
      toast({
        title: "Reset Code Sent",
        description: "Check your email for the password reset code",
      });
    }
    
    setIsLoading(false);
  };

  const handleForgotOTPStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotData.otp.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    setForgotStep('password');
  };

  const handleForgotPasswordStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (forgotData.password !== forgotData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (forgotData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const { error } = await resetPasswordWithOTP(
      forgotData.email,
      forgotData.otp,
      forgotData.password
    );
    
    if (error) {
      setError(error.message);
    } else {
      toast({
        title: "Password Reset",
        description: "Your password has been successfully reset",
      });
      setCurrentTab('signin');
      setForgotStep('email');
      setForgotData({ email: '', otp: '', password: '', confirmPassword: '' });
    }
    
    setIsLoading(false);
  };

  const resetSignupFlow = () => {
    setSignupStep('email');
    setSignupData({
      email: '',
      otp: '',
      password: '',
      confirmPassword: '',
      username: '',
      displayName: '',
      profilePic: ''
    });
    setError('');
  };

  const resetForgotFlow = () => {
    setForgotStep('email');
    setForgotData({ email: '', otp: '', password: '', confirmPassword: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Book className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold text-foreground">Wattpad Clone</h1>
        </div>

        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="forgot">Forgot Password</TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Sign in to continue reading and writing</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      required
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                {signupStep !== 'email' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetSignupFlow}
                    className="w-fit mb-2"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
                <CardTitle>
                  {signupStep === 'email' && 'Create Account'}
                  {signupStep === 'otp' && 'Verify Email'}
                  {signupStep === 'password' && 'Create Password'}
                  {signupStep === 'profile' && 'Complete Profile'}
                </CardTitle>
                <CardDescription>
                  {signupStep === 'email' && 'Enter your email to get started'}
                  {signupStep === 'otp' && 'Enter the 6-digit code sent to your email'}
                  {signupStep === 'password' && 'Create a secure password'}
                  {signupStep === 'profile' && 'Set up your profile'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Email Step */}
                {signupStep === 'email' && (
                  <form onSubmit={handleSignupEmailStep} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Verification Code
                    </Button>
                  </form>
                )}

                {/* OTP Step */}
                {signupStep === 'otp' && (
                  <form onSubmit={handleSignupOTPStep} className="space-y-4">
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={signupData.otp}
                        onChange={(value) => setSignupData({ ...signupData, otp: value })}
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
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full">
                      Verify Code
                    </Button>
                  </form>
                )}

                {/* Password Step */}
                {signupStep === 'password' && (
                  <form onSubmit={handleSignupPasswordStep} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full">
                      Continue
                    </Button>
                  </form>
                )}

                {/* Profile Step */}
                {signupStep === 'profile' && (
                  <form onSubmit={handleSignupComplete} className="space-y-4">
                    <div className="flex justify-center">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={signupData.profilePic} />
                          <AvatarFallback>
                            <Upload className="h-8 w-8" />
                          </AvatarFallback>
                        </Avatar>
                        <Input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setSignupData({ ...signupData, profilePic: url });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="signup-username">Username</Label>
                      <Input
                        id="signup-username"
                        value={signupData.username}
                        onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-display-name">Display Name</Label>
                      <Input
                        id="signup-display-name"
                        value={signupData.displayName}
                        onChange={(e) => setSignupData({ ...signupData, displayName: e.target.value })}
                        required
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forgot Password Tab */}
          <TabsContent value="forgot">
            <Card>
              <CardHeader>
                {forgotStep !== 'email' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetForgotFlow}
                    className="w-fit mb-2"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
                <CardTitle>
                  {forgotStep === 'email' && 'Reset Password'}
                  {forgotStep === 'otp' && 'Verify Code'}
                  {forgotStep === 'password' && 'New Password'}
                </CardTitle>
                <CardDescription>
                  {forgotStep === 'email' && 'Enter your email to receive a reset code'}
                  {forgotStep === 'otp' && 'Enter the 6-digit code sent to your email'}
                  {forgotStep === 'password' && 'Create your new password'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Email Step */}
                {forgotStep === 'email' && (
                  <form onSubmit={handleForgotEmailStep} className="space-y-4">
                    <div>
                      <Label htmlFor="forgot-email">Email</Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        value={forgotData.email}
                        onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })}
                        required
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Reset Code
                    </Button>
                  </form>
                )}

                {/* OTP Step */}
                {forgotStep === 'otp' && (
                  <form onSubmit={handleForgotOTPStep} className="space-y-4">
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={forgotData.otp}
                        onChange={(value) => setForgotData({ ...forgotData, otp: value })}
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
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full">
                      Verify Code
                    </Button>
                  </form>
                )}

                {/* Password Step */}
                {forgotStep === 'password' && (
                  <form onSubmit={handleForgotPasswordStep} className="space-y-4">
                    <div>
                      <Label htmlFor="forgot-new-password">New Password</Label>
                      <Input
                        id="forgot-new-password"
                        type="password"
                        value={forgotData.password}
                        onChange={(e) => setForgotData({ ...forgotData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="forgot-confirm-password">Confirm New Password</Label>
                      <Input
                        id="forgot-confirm-password"
                        type="password"
                        value={forgotData.confirmPassword}
                        onChange={(e) => setForgotData({ ...forgotData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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