import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Camera, Mail, Bell, Shield, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    display_name: '',
    bio: '',
    avatar_url: '',
    pronouns: '',
    location: '',
    website: '',
    social_instagram: '',
    social_twitter: '',
    social_facebook: '',
    social_linkedin: '',
    social_google: '',
    background_url: '',
  });
  const [notifications, setNotifications] = useState({
    email_comments: true,
    email_follows: true,
    email_votes: true,
    push_comments: true,
    push_follows: true,
    push_votes: true,
  });
  const [privacy, setPrivacy] = useState({
    profile_private: false,
    show_reading_activity: true,
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile({
          username: data.username || '',
          display_name: data.display_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          pronouns: data.pronouns || '',
          location: data.location || '',
          website: data.website || '',
          social_instagram: data.social_instagram || '',
          social_twitter: data.social_twitter || '',
          social_facebook: data.social_facebook || '',
          social_linkedin: data.social_linkedin || '',
          social_google: data.social_google || '',
          background_url: data.background_url || '',
        });
      }

      // Fetch user preferences
      const { data: prefData, error: prefError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (prefError) {
        console.error('Error fetching preferences:', prefError);
      } else if (prefData) {
        setNotifications({
          email_comments: prefData.email_comments,
          email_follows: prefData.email_follows,
          email_votes: prefData.email_votes,
          push_comments: prefData.push_comments,
          push_follows: prefData.push_follows,
          push_votes: prefData.push_votes,
        });
        setPrivacy({
          profile_private: prefData.profile_private,
          show_reading_activity: prefData.show_reading_activity,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...notifications,
          ...privacy,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      toast.success('Preferences updated successfully');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

        <div className="space-y-8">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback>
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload a new profile picture
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    placeholder="Enter your username"
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    Username cannot be changed after account creation
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={profile.display_name}
                    onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                    placeholder="Enter your display name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pronouns">Pronouns</Label>
                  <Input
                    id="pronouns"
                    value={profile.pronouns}
                    onChange={(e) => setProfile({ ...profile, pronouns: e.target.value })}
                    placeholder="e.g., she/her, he/him, they/them"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="Enter your location"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <Label>Social Media Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="social_instagram" className="text-sm">Instagram</Label>
                    <Input
                      id="social_instagram"
                      value={profile.social_instagram}
                      onChange={(e) => setProfile({ ...profile, social_instagram: e.target.value })}
                      placeholder="Instagram username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_twitter" className="text-sm">Twitter</Label>
                    <Input
                      id="social_twitter"
                      value={profile.social_twitter}
                      onChange={(e) => setProfile({ ...profile, social_twitter: e.target.value })}
                      placeholder="Twitter username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_facebook" className="text-sm">Facebook</Label>
                    <Input
                      id="social_facebook"
                      value={profile.social_facebook}
                      onChange={(e) => setProfile({ ...profile, social_facebook: e.target.value })}
                      placeholder="Facebook username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_linkedin" className="text-sm">LinkedIn</Label>
                    <Input
                      id="social_linkedin"
                      value={profile.social_linkedin}
                      onChange={(e) => setProfile({ ...profile, social_linkedin: e.target.value })}
                      placeholder="LinkedIn username"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={updateProfile} disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={user?.email || ''} disabled />
                <p className="text-sm text-muted-foreground">
                  Contact support to change your email address
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Download Your Data</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Email Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Comments</p>
                      <p className="text-sm text-muted-foreground">Get notified when someone comments on your stories</p>
                    </div>
                    <Switch
                      checked={notifications.email_comments}
                      onCheckedChange={(checked) => {
                        setNotifications({ ...notifications, email_comments: checked });
                        updatePreferences();
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Followers</p>
                      <p className="text-sm text-muted-foreground">Get notified when someone follows you</p>
                    </div>
                    <Switch
                      checked={notifications.email_follows}
                      onCheckedChange={(checked) => {
                        setNotifications({ ...notifications, email_follows: checked });
                        updatePreferences();
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Story Votes</p>
                      <p className="text-sm text-muted-foreground">Get notified when someone votes on your stories</p>
                    </div>
                    <Switch
                      checked={notifications.email_votes}
                      onCheckedChange={(checked) => {
                        setNotifications({ ...notifications, email_votes: checked });
                        updatePreferences();
                      }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Push Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Comments</p>
                      <p className="text-sm text-muted-foreground">Instant notifications for comments</p>
                    </div>
                    <Switch
                      checked={notifications.push_comments}
                      onCheckedChange={(checked) => {
                        setNotifications({ ...notifications, push_comments: checked });
                        updatePreferences();
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Followers</p>
                      <p className="text-sm text-muted-foreground">Instant notifications for new followers</p>
                    </div>
                    <Switch
                      checked={notifications.push_follows}
                      onCheckedChange={(checked) => {
                        setNotifications({ ...notifications, push_follows: checked });
                        updatePreferences();
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Story Votes</p>
                      <p className="text-sm text-muted-foreground">Instant notifications for votes</p>
                    </div>
                    <Switch
                      checked={notifications.push_votes}
                      onCheckedChange={(checked) => {
                        setNotifications({ ...notifications, push_votes: checked });
                        updatePreferences();
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Make Profile Private</p>
                  <p className="text-sm text-muted-foreground">Only followers can see your profile and stories</p>
                </div>
                <Switch
                  checked={privacy.profile_private}
                  onCheckedChange={(checked) => {
                    setPrivacy({ ...privacy, profile_private: checked });
                    updatePreferences();
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Reading Activity</p>
                  <p className="text-sm text-muted-foreground">Let others see what you're reading</p>
                </div>
                <Switch
                  checked={privacy.show_reading_activity}
                  onCheckedChange={(checked) => {
                    setPrivacy({ ...privacy, show_reading_activity: checked });
                    updatePreferences();
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button variant="outline" onClick={handleSignOut} className="w-full">
                  Sign Out
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone. This will permanently delete your account and all associated data.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}