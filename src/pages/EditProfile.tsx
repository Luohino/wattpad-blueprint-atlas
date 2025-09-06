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
    avatar_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

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
        avatar_url: data.avatar_url || ''
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

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      let avatarUrl = profileData.avatar_url;

      // Upload new avatar if one was selected
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profileData.display_name,
          bio: profileData.bio,
          avatar_url: avatarUrl
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
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={previewUrl} />
                <AvatarFallback>
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
                        Choose File
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

            {/* Username (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profileData.username}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Username cannot be changed after account creation.
              </p>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
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

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/profile/${profileData.username}`)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
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