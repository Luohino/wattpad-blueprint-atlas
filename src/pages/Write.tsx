import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlusCircle, X, Save, Eye, BookOpen, FileText, Upload, Image } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Write() {
  const { user, loading } = useAuth();
  const [genres, setGenres] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Story form state
  const [storyData, setStoryData] = useState({
    title: '',
    description: '',
    status: 'ongoing',
    maturityRating: 'everyone',
    language: 'en',
    published: false
  });
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  
  // Chapter form state
  const [chapterData, setChapterData] = useState({
    title: '',
    content: '',
    published: false
  });
  const [chapterImageFile, setChapterImageFile] = useState<File | null>(null);
  const [chapterImagePreview, setChapterImagePreview] = useState<string>('');

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setGenres(data || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="animate-pulse p-6">
          <div className="h-6 bg-muted rounded mb-4 w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleGenreToggle = (genreId: string) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File too large. Please choose an image under 5MB.');
        return;
      }
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChapterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File too large. Please choose an image under 5MB.');
        return;
      }
      setChapterImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setChapterImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadCoverImage = async (): Promise<string | null> => {
    if (!coverFile || !user) return null;

    try {
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `${user.id}/story-covers/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('story-covers')
        .upload(fileName, coverFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('story-covers')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading cover:', error);
      toast.error('Failed to upload cover image');
      return null;
    }
  };

  const uploadChapterImage = async (): Promise<string | null> => {
    if (!chapterImageFile || !user) return null;

    try {
      const fileExt = chapterImageFile.name.split('.').pop();
      const fileName = `${user.id}/chapter-images/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('chapter-images')
        .upload(fileName, chapterImageFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('chapter-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading chapter image:', error);
      toast.error('Failed to upload chapter image');
      return null;
    }
  };

  const saveStory = async (publishStatus: boolean) => {
    if (!storyData.title.trim()) {
      toast.error('Story title is required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload cover image if one was selected
      let coverUrl = null;
      if (coverFile) {
        coverUrl = await uploadCoverImage();
      }

      // Create story
      const { data: story, error: storyError } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          title: storyData.title,
          description: storyData.description,
          cover_url: coverUrl,
          status: storyData.status,
          maturity_rating: storyData.maturityRating,
          language: storyData.language,
          published: publishStatus
        })
        .select()
        .single();

      if (storyError) throw storyError;

      // Add genres
      if (selectedGenres.length > 0) {
        const genreInserts = selectedGenres.map(genreId => ({
          story_id: story.id,
          genre_id: genreId
        }));

        await supabase
          .from('story_genres')
          .insert(genreInserts);
      }

      // Add tags
      if (tags.length > 0) {
        const tagInserts = tags.map(tag => ({
          story_id: story.id,
          tag: tag
        }));

        await supabase
          .from('story_tags')
          .insert(tagInserts);
      }

      // Create first chapter if content exists
      if (chapterData.title.trim() && chapterData.content.trim()) {
        const wordCount = chapterData.content.trim().split(/\s+/).length;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));

        // Upload chapter image if one was selected
        let chapterImageUrl = null;
        if (chapterImageFile) {
          chapterImageUrl = await uploadChapterImage();
        }

        await supabase
          .from('chapters')
          .insert({
            story_id: story.id,
            title: chapterData.title,
            content: chapterData.content,
            chapter_number: 1,
            word_count: wordCount,
            read_time: readTime,
            published: publishStatus,
            published_at: publishStatus ? new Date().toISOString() : null
          });
      }

      toast.success(publishStatus ? 'Story published!' : 'Story saved as draft');
      
      // Reset form
      setStoryData({
        title: '',
        description: '',
        status: 'ongoing',
        maturityRating: 'everyone',
        language: 'en',
        published: false
      });
      setChapterData({
        title: '',
        content: '',
        published: false
      });
      setSelectedGenres([]);
      setTags([]);
      setCoverFile(null);
      setCoverPreview('');
      setChapterImageFile(null);
      setChapterImagePreview('');
      
    } catch (error) {
      console.error('Error saving story:', error);
      toast.error('Failed to save story');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Write Your Story</h1>
        </div>

        <Tabs defaultValue="story" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="story">Story Details</TabsTrigger>
            <TabsTrigger value="chapter">First Chapter</TabsTrigger>
          </TabsList>

          <TabsContent value="story" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Story Information</CardTitle>
                <CardDescription>
                  Set up the basic details for your new story
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={storyData.title}
                    onChange={(e) => setStoryData({ ...storyData, title: e.target.value })}
                    placeholder="Enter your story title"
                    className="mt-1"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={storyData.description}
                    onChange={(e) => setStoryData({ ...storyData, description: e.target.value })}
                    placeholder="Write a compelling description of your story..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                {/* Status & Maturity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select 
                      value={storyData.status} 
                      onValueChange={(value) => setStoryData({ ...storyData, status: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Maturity Rating</Label>
                    <Select 
                      value={storyData.maturityRating} 
                      onValueChange={(value) => setStoryData({ ...storyData, maturityRating: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="teen">Teen</SelectItem>
                        <SelectItem value="mature">Mature</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Genres */}
                <div>
                  <Label>Genres</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {genres.map((genre) => (
                      <Button
                        key={genre.id}
                        variant={selectedGenres.includes(genre.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleGenreToggle(genre.id)}
                        className="justify-start"
                      >
                        {genre.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <Label>Story Cover</Label>
                  <div className="mt-2 space-y-4">
                    {coverPreview ? (
                      <div className="relative w-32 h-48 mx-auto">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-full h-full object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2"
                          onClick={() => {
                            setCoverFile(null);
                            setCoverPreview('');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-32 h-48 mx-auto border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Image className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                          <p className="text-sm text-muted-foreground">No cover</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-center">
                      <Label htmlFor="cover-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Cover
                          </span>
                        </Button>
                      </Label>
                      <Input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      JPG, PNG, GIF. Max size 5MB. Recommended: 400x600px
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <div className="mt-1">
                    <Input
                      id="tags"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Add tags and press Enter"
                    />
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="gap-1">
                            #{tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chapter" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>First Chapter</CardTitle>
                <CardDescription>
                  Start writing the first chapter of your story
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="chapter-title">Chapter Title</Label>
                  <Input
                    id="chapter-title"
                    value={chapterData.title}
                    onChange={(e) => setChapterData({ ...chapterData, title: e.target.value })}
                    placeholder="Chapter 1: ..."
                    className="mt-1"
                  />
                </div>

                {/* Chapter Image */}
                <div>
                  <Label>Chapter Image (Optional)</Label>
                  <div className="mt-2 space-y-4">
                    {chapterImagePreview ? (
                      <div className="relative w-full max-w-md mx-auto">
                        <img
                          src={chapterImagePreview}
                          alt="Chapter image preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2"
                          onClick={() => {
                            setChapterImageFile(null);
                            setChapterImagePreview('');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full max-w-md mx-auto h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Image className="h-6 w-6 mx-auto text-muted-foreground/50 mb-1" />
                          <p className="text-sm text-muted-foreground">No chapter image</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-center">
                      <Label htmlFor="chapter-image-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </span>
                        </Button>
                      </Label>
                      <Input
                        id="chapter-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleChapterImageChange}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      JPG, PNG, GIF. Max size 5MB.
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="chapter-content">Content</Label>
                  <Textarea
                    id="chapter-content"
                    value={chapterData.content}
                    onChange={(e) => setChapterData({ ...chapterData, content: e.target.value })}
                    placeholder="Start writing your story here..."
                    rows={20}
                    className="mt-1 font-mono"
                  />
                  {chapterData.content && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Word count: {chapterData.content.trim().split(/\s+/).length}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Alert className="flex-1 mr-6">
            <BookOpen className="h-4 w-4" />
            <AlertDescription>
              You can save as draft and publish later, or publish immediately to share with readers.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => saveStory(false)}
              disabled={isSubmitting || !storyData.title.trim()}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            
            <Button
              onClick={() => saveStory(true)}
              disabled={isSubmitting || !storyData.title.trim()}
            >
              <Eye className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}