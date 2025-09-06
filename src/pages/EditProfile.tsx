import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';

interface ProfileData {
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  background_url: string;
  pronouns: string;
  location: string;
  website: string;
  social_google: string;
  social_facebook: string;
  social_twitter: string;
  social_instagram: string;
  social_linkedin: string;
}

export default function EditProfile() {
  const { username } = useParams<{ username: string }>();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    display_name: '',
    bio: '',
    avatar_url: '',
    background_url: '',
    pronouns: '',
    location: '',
    website: '',
    social_google: '',
    social_facebook: '',
    social_twitter: '',
    social_instagram: '',
    social_linkedin: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState<string>('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    console.log('EditProfile useEffect - user:', user);
    console.log('EditProfile useEffect - username:', username);
    console.log('EditProfile useEffect - authLoading:', authLoading);
    
    // Wait for auth to finish loading
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }
    
    if (!user) {
      console.log('No user found after auth loaded, redirecting to auth');
      navigate('/auth');
      return;
    }

    if (username) {
      fetchProfile();
    } else {
      console.log('No username in URL, redirecting to home');
      navigate('/');
    }
  }, [user, username, authLoading, navigate]);

  // Check username availability with debouncing
  useEffect(() => {
    if (!profileData.username || profileData.username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const { data: isAvailable } = await supabase.rpc('check_username_availability', {
          username_input: profileData.username
        });
        setUsernameAvailable(isAvailable);
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [profileData.username]);

  const fetchProfile = async () => {
    if (!user || !username) return;

    try {
      setLoading(true);
      
      // Fetch the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error);
        toast({
          title: "Error",
          description: "Failed to load profile.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      if (!data) {
        console.log('Profile not found for username:', username);
        toast({
          title: "Error",
          description: "Profile not found.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      // Check if this is the user's own profile
      console.log('Profile data user_id:', data.user_id);
      console.log('Current user id:', user.id);
      
      if (data.user_id !== user.id) {
        console.log('Access denied - user IDs do not match');
        toast({
          title: "Access denied",
          description: "You can only edit your own profile.",
          variant: "destructive"
        });
        navigate(`/profile/${username}`);
        return;
      }
      
      console.log('Access granted - proceeding to load profile data');

      setProfileData({
        username: data.username,
        display_name: data.display_name,
        bio: data.bio || '',
        avatar_url: data.avatar_url || '',
        background_url: data.background_url || '',
        pronouns: data.pronouns || '',
        location: data.location || '',
        website: data.website || '',
        social_google: data.social_google || '',
        social_facebook: data.social_facebook || '',
        social_twitter: data.social_twitter || '',
        social_instagram: data.social_instagram || '',
        social_linkedin: data.social_linkedin || ''
      });

      setPreviewUrl(data.avatar_url || '');
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please choose an image under 5MB.",
          variant: "destructive"
        });
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for background
        toast({
          title: "File too large",
          description: "Please choose an image under 10MB.",
          variant: "destructive"
        });
        return;
      }

      setBackgroundFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, avatarFile, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  const uploadBackground = async (): Promise<string | null> => {
    if (!backgroundFile || !user) return null;

    try {
      const fileExt = backgroundFile.name.split('.').pop();
      const fileName = `${user.id}/background.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, backgroundFile, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading background:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload background image. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleSave = async () => {
    if (!user) return;

    // Validate username
    if (profileData.username !== username) {
      const { data: isUsernameValid } = await supabase.rpc('validate_username', {
        username_input: profileData.username
      });
      
      if (!isUsernameValid) {
        toast({
          title: "Invalid username",
          description: "Username must be 3-30 characters with only letters, numbers, and underscores.",
          variant: "destructive"
        });
        return;
      }

      if (!usernameAvailable) {
        toast({
          title: "Username taken",
          description: "This username is already taken. Please choose another.",
          variant: "destructive"
        });
        return;
      }
    }

    setSaving(true);
    try {
      let avatarUrl = profileData.avatar_url;
      let backgroundUrl = profileData.background_url;

      // Upload new avatar if one was selected
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      // Upload new background if one was selected
      if (backgroundFile) {
        const uploadedUrl = await uploadBackground();
        if (uploadedUrl) {
          backgroundUrl = uploadedUrl;
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          display_name: profileData.display_name,
          bio: profileData.bio,
          avatar_url: avatarUrl,
          background_url: backgroundUrl,
          pronouns: profileData.pronouns,
          location: profileData.location,
          website: profileData.website,
          social_google: profileData.social_google,
          social_facebook: profileData.social_facebook,
          social_twitter: profileData.social_twitter,
          social_instagram: profileData.social_instagram,
          social_linkedin: profileData.social_linkedin
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });

      navigate(`/profile/${profileData.username}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="text-muted-foreground">
            Update your profile information and settings.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Background Picture */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Profile & Background</Label>
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg overflow-hidden">
                  {(backgroundPreviewUrl || profileData.background_url) && (
                    <img 
                      src={backgroundPreviewUrl || profileData.background_url} 
                      alt="Background" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute bottom-2 right-2">
                  <Label htmlFor="background-upload" className="cursor-pointer">
                    <Button variant="secondary" size="sm" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Background
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="background-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Profile Picture */}
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={previewUrl || profileData.avatar_url} />
                <AvatarFallback className="text-lg">
                  {profileData.display_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="avatar-upload" className="block text-sm font-medium mb-2">
                  Profile Picture
                </Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Change Picture
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  {avatarFile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAvatarFile(null);
                        setPreviewUrl(profileData.avatar_url);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, GIF. Max size 5MB.
                </p>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">About</Label>
              
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                    }))}
                    placeholder="Enter username"
                    maxLength={30}
                    className={`pr-8 ${
                      usernameAvailable === false ? 'border-destructive' : 
                      usernameAvailable === true ? 'border-green-500' : ''
                    }`}
                  />
                  {checkingUsername && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    3-30 characters. Letters, numbers, and underscores only.
                  </p>
                  {usernameAvailable === false && (
                    <p className="text-xs text-destructive">Username taken</p>
                  )}
                  {usernameAvailable === true && (
                    <p className="text-xs text-green-600">Available</p>
                  )}
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="display_name">Full Name</Label>
                <Input
                  id="display_name"
                  value={profileData.display_name}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    display_name: e.target.value
                  }))}
                  placeholder="Your display name"
                  maxLength={50}
                />
              </div>

              {/* Pronouns */}
              <div className="space-y-2">
                <Label htmlFor="pronouns">Pronouns</Label>
                <Input
                  id="pronouns"
                  value={profileData.pronouns}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    pronouns: e.target.value
                  }))}
                  placeholder="e.g., He/Him, She/Her, They/Them"
                  maxLength={20}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    location: e.target.value
                  }))}
                  placeholder="Your location"
                  maxLength={50}
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    website: e.target.value
                  }))}
                  placeholder="https://your-website.com"
                  maxLength={100}
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    bio: e.target.value
                  }))}
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {profileData.bio.length}/500 characters
                </p>
              </div>
            </div>

            {/* Social Networks */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Social Networks</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="social_google">Google</Label>
                  <Input
                    id="social_google"
                    value={profileData.social_google}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      social_google: e.target.value
                    }))}
                    placeholder="Google profile URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_facebook">Facebook</Label>
                  <Input
                    id="social_facebook"
                    value={profileData.social_facebook}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      social_facebook: e.target.value
                    }))}
                    placeholder="Facebook profile URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_twitter">Twitter/X</Label>
                  <Input
                    id="social_twitter"
                    value={profileData.social_twitter}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      social_twitter: e.target.value
                    }))}
                    placeholder="Twitter profile URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_instagram">Instagram</Label>
                  <Input
                    id="social_instagram"
                    value={profileData.social_instagram}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      social_instagram: e.target.value
                    }))}
                    placeholder="Instagram profile URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_linkedin">LinkedIn</Label>
                  <Input
                    id="social_linkedin"
                    value={profileData.social_linkedin}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      social_linkedin: e.target.value
                    }))}
                    placeholder="LinkedIn profile URL"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => navigate(`/profile/${username}`)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving || (profileData.username !== username && !usernameAvailable)}
              >
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}