export interface Screen {
  id: string;
  name: string;
  purpose: string;
  functionalElements: string[];
  userJourney: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface ScreenCategory {
  id: string;
  name: string;
  description: string;
  screens: Screen[];
}

export const wattpadScreens: ScreenCategory[] = [
  {
    id: 'onboarding',
    name: 'Onboarding & Authentication',
    description: 'First-time user experience and account creation',
    screens: [
      {
        id: 'splash',
        name: 'Splash Screen',
        purpose: 'App loading and brand introduction',
        functionalElements: ['App logo', 'Loading animation', 'Version info'],
        userJourney: 'First touchpoint when opening app',
        priority: 'critical'
      },
      {
        id: 'welcome',
        name: 'Welcome Screen',
        purpose: 'Introduce app value proposition',
        functionalElements: ['Hero image', 'App tagline', 'Get Started CTA', 'Skip option'],
        userJourney: 'First-time user introduction',
        priority: 'critical'
      },
      {
        id: 'tutorial-carousel',
        name: 'Tutorial Carousel',
        purpose: 'Showcase key features and benefits',
        functionalElements: ['Swipeable slides', 'Feature illustrations', 'Progress dots', 'Next/Skip buttons'],
        userJourney: 'Feature education for new users',
        priority: 'high'
      },
      {
        id: 'age-verification',
        name: 'Age Verification',
        purpose: 'Comply with content regulations',
        functionalElements: ['Age input', 'Date picker', 'Verification button', 'Privacy notice'],
        userJourney: 'Required step before content access',
        priority: 'critical'
      },
      {
        id: 'signup-email',
        name: 'Email Signup',
        purpose: 'Create account with email',
        functionalElements: ['Email input', 'Password input', 'Password strength indicator', 'Terms checkbox', 'Create Account button'],
        userJourney: 'Primary registration method',
        priority: 'critical'
      },
      {
        id: 'signup-social',
        name: 'Social Signup',
        purpose: 'Quick registration via social platforms',
        functionalElements: ['Google signup', 'Facebook signup', 'Apple signup', 'Terms acceptance'],
        userJourney: 'Alternative registration method',
        priority: 'high'
      },
      {
        id: 'login-email',
        name: 'Email Login',
        purpose: 'Return user authentication',
        functionalElements: ['Email input', 'Password input', 'Remember me checkbox', 'Forgot password link', 'Login button'],
        userJourney: 'Return user entry point',
        priority: 'critical'
      },
      {
        id: 'login-social',
        name: 'Social Login',
        purpose: 'Quick authentication via social platforms',
        functionalElements: ['Social platform buttons', 'Platform permissions', 'Error handling'],
        userJourney: 'Alternative login method',
        priority: 'high'
      },
      {
        id: 'forgot-password',
        name: 'Forgot Password',
        purpose: 'Password recovery initiation',
        functionalElements: ['Email input', 'Send reset link button', 'Back to login link'],
        userJourney: 'Password recovery flow start',
        priority: 'high'
      },
      {
        id: 'reset-password',
        name: 'Password Reset',
        purpose: 'Set new password after verification',
        functionalElements: ['New password input', 'Confirm password input', 'Password requirements', 'Reset button'],
        userJourney: 'Password recovery completion',
        priority: 'high'
      },
      {
        id: 'email-verification',
        name: 'Email Verification',
        purpose: 'Verify email address',
        functionalElements: ['Verification message', 'Resend email button', 'Email input for changes'],
        userJourney: 'Account verification step',
        priority: 'critical'
      },
      {
        id: 'phone-verification',
        name: 'Phone Verification',
        purpose: 'Additional security verification',
        functionalElements: ['Phone number input', 'Country code selector', 'SMS code input', 'Verify button'],
        userJourney: 'Enhanced security setup',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'profile-setup',
    name: 'Profile Setup & Customization',
    description: 'Initial profile creation and personalization',
    screens: [
      {
        id: 'username-setup',
        name: 'Username Creation',
        purpose: 'Set unique user identifier',
        functionalElements: ['Username input', 'Availability checker', 'Suggestions', 'Continue button'],
        userJourney: 'Required profile setup step',
        priority: 'critical'
      },
      {
        id: 'profile-photo',
        name: 'Profile Photo Setup',
        purpose: 'Add profile picture',
        functionalElements: ['Camera access', 'Gallery picker', 'Photo cropper', 'Avatar options', 'Skip option'],
        userJourney: 'Profile personalization',
        priority: 'high'
      },
      {
        id: 'genre-preferences',
        name: 'Genre Selection',
        purpose: 'Personalize content recommendations',
        functionalElements: ['Genre grid', 'Multi-select options', 'Popular genres highlight', 'Continue button'],
        userJourney: 'Content personalization setup',
        priority: 'critical'
      },
      {
        id: 'author-following',
        name: 'Follow Popular Authors',
        purpose: 'Initial content feed population',
        functionalElements: ['Author cards', 'Follow buttons', 'Author preview', 'Skip all option'],
        userJourney: 'Social graph establishment',
        priority: 'high'
      },
      {
        id: 'reading-goals',
        name: 'Reading Goals Setup',
        purpose: 'Set reading objectives',
        functionalElements: ['Goal selector', 'Custom goal input', 'Time preferences', 'Notification settings'],
        userJourney: 'Engagement optimization',
        priority: 'medium'
      },
      {
        id: 'notification-preferences',
        name: 'Notification Preferences',
        purpose: 'Configure push notification settings',
        functionalElements: ['Toggle switches', 'Notification categories', 'Time restrictions', 'Preview examples'],
        userJourney: 'Communication preferences setup',
        priority: 'high'
      },
      {
        id: 'content-maturity',
        name: 'Content Maturity Settings',
        purpose: 'Set appropriate content filters',
        functionalElements: ['Maturity levels', 'Content warnings toggle', 'Parental controls', 'Save preferences'],
        userJourney: 'Content filtering setup',
        priority: 'critical'
      },
      {
        id: 'writer-interest',
        name: 'Writing Interest Survey',
        purpose: 'Identify potential writers',
        functionalElements: ['Writing experience questions', 'Genre interests', 'Goals selection', 'Skip option'],
        userJourney: 'Writer onboarding branch',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'home-discovery',
    name: 'Home & Discovery',
    description: 'Main content discovery and recommendation screens',
    screens: [
      {
        id: 'home-feed',
        name: 'Home Feed',
        purpose: 'Primary content discovery hub',
        functionalElements: ['Story recommendations', 'Following updates', 'Trending content', 'Genre sections', 'Infinite scroll'],
        userJourney: 'Main app entry point after login',
        priority: 'critical'
      },
      {
        id: 'trending',
        name: 'Trending Stories',
        purpose: 'Showcase popular content',
        functionalElements: ['Trending lists', 'Time filters', 'Genre filters', 'Story cards', 'Ranking numbers'],
        userJourney: 'Popular content discovery',
        priority: 'high'
      },
      {
        id: 'new-releases',
        name: 'New & Noteworthy',
        purpose: 'Highlight fresh content',
        functionalElements: ['Recent stories', 'Editor picks', 'New author spotlight', 'Publication dates'],
        userJourney: 'Fresh content discovery',
        priority: 'high'
      },
      {
        id: 'personalized-recs',
        name: 'For You Recommendations',
        purpose: 'AI-powered personal recommendations',
        functionalElements: ['Personalized story cards', 'Recommendation reasoning', 'Feedback buttons', 'Refresh option'],
        userJourney: 'Personalized content discovery',
        priority: 'critical'
      },
      {
        id: 'genre-browse',
        name: 'Browse by Genre',
        purpose: 'Category-based content exploration',
        functionalElements: ['Genre grid', 'Subcategory filters', 'Popular in genre', 'Genre descriptions'],
        userJourney: 'Targeted content discovery',
        priority: 'high'
      },
      {
        id: 'continue-reading',
        name: 'Continue Reading',
        purpose: 'Resume interrupted stories',
        functionalElements: ['Progress indicators', 'Last read timestamp', 'Story thumbnails', 'Resume buttons'],
        userJourney: 'Reading continuation',
        priority: 'critical'
      },
      {
        id: 'reading-lists',
        name: 'Reading Lists Hub',
        purpose: 'Manage saved stories',
        functionalElements: ['List categories', 'Story counts', 'Quick access', 'Create new list'],
        userJourney: 'Story organization',
        priority: 'high'
      },
      {
        id: 'daily-dose',
        name: 'Daily Reading Dose',
        purpose: 'Encourage daily reading habits',
        functionalElements: ['Daily story picks', 'Reading streak', 'Goal progress', 'Quick reads section'],
        userJourney: 'Habit building and engagement',
        priority: 'medium'
      },
      {
        id: 'contests-featured',
        name: 'Featured Contests',
        purpose: 'Promote writing competitions',
        functionalElements: ['Contest banners', 'Deadline timers', 'Prize information', 'Entry requirements'],
        userJourney: 'Contest discovery and participation',
        priority: 'medium'
      },
      {
        id: 'seasonal-collections',
        name: 'Seasonal Collections',
        purpose: 'Themed content for holidays/events',
        functionalElements: ['Themed banners', 'Curated stories', 'Event information', 'Limited time badges'],
        userJourney: 'Seasonal content engagement',
        priority: 'low'
      }
    ]
  },
  {
    id: 'search-discovery',
    name: 'Search & Advanced Discovery',
    description: 'Content search and filtering capabilities',
    screens: [
      {
        id: 'search-main',
        name: 'Search Home',
        purpose: 'Primary search interface',
        functionalElements: ['Search bar', 'Recent searches', 'Trending searches', 'Quick filters', 'Voice search'],
        userJourney: 'Content search initiation',
        priority: 'critical'
      },
      {
        id: 'search-results',
        name: 'Search Results',
        purpose: 'Display search matches',
        functionalElements: ['Result list', 'Sort options', 'Filter sidebar', 'Result count', 'Search suggestions'],
        userJourney: 'Search results evaluation',
        priority: 'critical'
      },
      {
        id: 'advanced-search',
        name: 'Advanced Search',
        purpose: 'Detailed search criteria',
        functionalElements: ['Multiple filters', 'Date ranges', 'Word count filters', 'Completion status', 'Language options'],
        userJourney: 'Precise content discovery',
        priority: 'high'
      },
      {
        id: 'search-filters',
        name: 'Search Filters',
        purpose: 'Refine search results',
        functionalElements: ['Genre filters', 'Maturity filters', 'Length filters', 'Status filters', 'Rating filters'],
        userJourney: 'Result refinement',
        priority: 'high'
      },
      {
        id: 'search-history',
        name: 'Search History',
        purpose: 'Access previous searches',
        functionalElements: ['Search history list', 'Clear history', 'Favorite searches', 'Search frequency'],
        userJourney: 'Search behavior tracking',
        priority: 'medium'
      },
      {
        id: 'author-search',
        name: 'Author Search',
        purpose: 'Find specific authors',
        functionalElements: ['Author profiles', 'Author stats', 'Follow buttons', 'Work samples'],
        userJourney: 'Author discovery',
        priority: 'high'
      },
      {
        id: 'tag-explorer',
        name: 'Tag Explorer',
        purpose: 'Browse content by tags',
        functionalElements: ['Tag cloud', 'Popular tags', 'Tag categories', 'Related tags'],
        userJourney: 'Tag-based discovery',
        priority: 'medium'
      },
      {
        id: 'discovery-quiz',
        name: 'Story Discovery Quiz',
        purpose: 'Personalized story recommendations',
        functionalElements: ['Question flow', 'Preference sliders', 'Mood selectors', 'Result generation'],
        userJourney: 'Interactive content discovery',
        priority: 'low'
      },
      {
        id: 'similar-stories',
        name: 'Similar Stories',
        purpose: 'Find related content',
        functionalElements: ['Similarity metrics', 'Related story cards', 'Comparison features', 'Recommendation engine'],
        userJourney: 'Content relationship exploration',
        priority: 'medium'
      },
      {
        id: 'search-no-results',
        name: 'No Search Results',
        purpose: 'Handle empty search results',
        functionalElements: ['Alternative suggestions', 'Spelling corrections', 'Broader search options', 'Popular alternatives'],
        userJourney: 'Search failure recovery',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'reading-experience',
    name: 'Reading Experience',
    description: 'Core reading interface and features',
    screens: [
      {
        id: 'story-detail',
        name: 'Story Details',
        purpose: 'Story information and preview',
        functionalElements: ['Cover image', 'Title/author', 'Description', 'Tags', 'Stats', 'Add to list', 'Share', 'Start reading'],
        userJourney: 'Pre-reading decision point',
        priority: 'critical'
      },
      {
        id: 'chapter-list',
        name: 'Chapter List',
        purpose: 'Story navigation and progress',
        functionalElements: ['Chapter titles', 'Read status', 'Chapter lengths', 'Progress indicators', 'Jump to chapter'],
        userJourney: 'Story navigation',
        priority: 'critical'
      },
      {
        id: 'reading-interface',
        name: 'Reading Interface',
        purpose: 'Primary text reading experience',
        functionalElements: ['Text content', 'Progress bar', 'Font controls', 'Background options', 'Navigation arrows'],
        userJourney: 'Core reading experience',
        priority: 'critical'
      },
      {
        id: 'reading-settings',
        name: 'Reading Settings',
        purpose: 'Customize reading experience',
        functionalElements: ['Font size slider', 'Font family options', 'Background colors', 'Line spacing', 'Margin controls'],
        userJourney: 'Reading customization',
        priority: 'high'
      },
      {
        id: 'reading-progress',
        name: 'Reading Progress',
        purpose: 'Track reading advancement',
        functionalElements: ['Progress percentage', 'Time estimates', 'Pages read', 'Session tracking', 'Goal progress'],
        userJourney: 'Progress tracking',
        priority: 'medium'
      },
      {
        id: 'bookmark-manager',
        name: 'Bookmark Manager',
        purpose: 'Save reading positions',
        functionalElements: ['Bookmark list', 'Quick bookmarks', 'Bookmark notes', 'Jump to bookmark', 'Delete bookmarks'],
        userJourney: 'Reading position management',
        priority: 'high'
      },
      {
        id: 'highlight-notes',
        name: 'Highlights & Notes',
        purpose: 'Text annotation and notes',
        functionalElements: ['Text highlighting', 'Note creation', 'Highlight colors', 'Note editing', 'Export options'],
        userJourney: 'Reading engagement and analysis',
        priority: 'medium'
      },
      {
        id: 'offline-reading',
        name: 'Offline Reading',
        purpose: 'Read without internet connection',
        functionalElements: ['Download status', 'Storage management', 'Offline indicator', 'Sync options'],
        userJourney: 'Offline content access',
        priority: 'high'
      },
      {
        id: 'audio-player',
        name: 'Audio Reading',
        purpose: 'Text-to-speech functionality',
        functionalElements: ['Play/pause controls', 'Speed controls', 'Voice selection', 'Background play', 'Sleep timer'],
        userJourney: 'Audio reading experience',
        priority: 'medium'
      },
      {
        id: 'immersive-mode',
        name: 'Immersive Reading Mode',
        purpose: 'Distraction-free reading',
        functionalElements: ['Full-screen text', 'Auto-scroll', 'Focus mode', 'Eye comfort settings', 'Do not disturb'],
        userJourney: 'Enhanced reading focus',
        priority: 'low'
      },
      {
        id: 'reading-stats',
        name: 'Reading Statistics',
        purpose: 'Personal reading analytics',
        functionalElements: ['Words read', 'Time spent', 'Books completed', 'Reading speed', 'Streak tracking'],
        userJourney: 'Reading habit analysis',
        priority: 'medium'
      },
      {
        id: 'chapter-end',
        name: 'Chapter End Screen',
        purpose: 'Chapter completion actions',
        functionalElements: ['Next chapter button', 'Story rating', 'Share chapter', 'Comment prompt', 'Reading progress'],
        userJourney: 'Chapter transition',
        priority: 'high'
      }
    ]
  },
  {
    id: 'social-community',
    name: 'Social & Community Features',
    description: 'User interaction and community engagement',
    screens: [
      {
        id: 'comments-section',
        name: 'Comments Section',
        purpose: 'Reader engagement and discussion',
        functionalElements: ['Comment threads', 'Reply system', 'Like buttons', 'Sort options', 'Comment moderation'],
        userJourney: 'Story engagement and discussion',
        priority: 'critical'
      },
      {
        id: 'story-reviews',
        name: 'Story Reviews',
        purpose: 'Detailed story feedback',
        functionalElements: ['Star ratings', 'Written reviews', 'Review likes', 'Review sorting', 'Helpful markers'],
        userJourney: 'Story evaluation and feedback',
        priority: 'high'
      },
      {
        id: 'user-profile',
        name: 'User Profile',
        purpose: 'User information and activity hub',
        functionalElements: ['Profile photo', 'Bio', 'Stats', 'Works list', 'Reading lists', 'Followers/following'],
        userJourney: 'User identity and portfolio',
        priority: 'critical'
      },
      {
        id: 'author-profile',
        name: 'Author Profile',
        purpose: 'Author showcase and information',
        functionalElements: ['Author bio', 'Published works', 'Author stats', 'Follow button', 'Contact options'],
        userJourney: 'Author discovery and following',
        priority: 'high'
      },
      {
        id: 'followers-list',
        name: 'Followers List',
        purpose: 'Manage follower relationships',
        functionalElements: ['Follower profiles', 'Follow back buttons', 'Mutual followers', 'Block options'],
        userJourney: 'Social relationship management',
        priority: 'medium'
      },
      {
        id: 'following-list',
        name: 'Following List',
        purpose: 'Manage followed users',
        functionalElements: ['Following profiles', 'Unfollow buttons', 'Activity indicators', 'Sort options'],
        userJourney: 'Following relationship management',
        priority: 'medium'
      },
      {
        id: 'activity-feed',
        name: 'Activity Feed',
        purpose: 'Social activity updates',
        functionalElements: ['Activity timeline', 'Activity types', 'User interactions', 'Time stamps'],
        userJourney: 'Social engagement tracking',
        priority: 'high'
      },
      {
        id: 'messaging-inbox',
        name: 'Message Inbox',
        purpose: 'Private user communication',
        functionalElements: ['Message list', 'Unread indicators', 'Message preview', 'Search messages', 'Delete options'],
        userJourney: 'Private communication hub',
        priority: 'high'
      },
      {
        id: 'message-thread',
        name: 'Message Thread',
        purpose: 'Individual conversation view',
        functionalElements: ['Message history', 'Reply input', 'Media sharing', 'Message status', 'Block/report options'],
        userJourney: 'Private conversation',
        priority: 'high'
      },
      {
        id: 'clubs-directory',
        name: 'Clubs Directory',
        purpose: 'Discover and join reader clubs',
        functionalElements: ['Club list', 'Club descriptions', 'Member counts', 'Join buttons', 'Club categories'],
        userJourney: 'Community discovery',
        priority: 'medium'
      },
      {
        id: 'club-detail',
        name: 'Book Club Details',
        purpose: 'Club information and joining',
        functionalElements: ['Club info', 'Member list', 'Discussion topics', 'Events', 'Join/leave buttons'],
        userJourney: 'Club evaluation and joining',
        priority: 'medium'
      },
      {
        id: 'club-discussions',
        name: 'Club Discussions',
        purpose: 'Club member conversations',
        functionalElements: ['Discussion threads', 'Topic creation', 'Member interactions', 'Moderation tools'],
        userJourney: 'Community participation',
        priority: 'medium'
      },
      {
        id: 'forums',
        name: 'Community Forums',
        purpose: 'General community discussions',
        functionalElements: ['Forum categories', 'Thread lists', 'Post creation', 'User rankings', 'Moderation'],
        userJourney: 'Broader community engagement',
        priority: 'low'
      },
      {
        id: 'user-blocking',
        name: 'Block/Report User',
        purpose: 'Safety and content moderation',
        functionalElements: ['Block options', 'Report categories', 'Evidence submission', 'Confirmation dialogs'],
        userJourney: 'Safety and moderation',
        priority: 'high'
      }
    ]
  },
  {
    id: 'writing-tools',
    name: 'Writing Tools & Editor',
    description: 'Story creation and editing features',
    screens: [
      {
        id: 'story-creation',
        name: 'Create New Story',
        purpose: 'Initialize new story project',
        functionalElements: ['Title input', 'Genre selection', 'Description editor', 'Cover upload', 'Privacy settings'],
        userJourney: 'Story creation start',
        priority: 'critical'
      },
      {
        id: 'story-editor',
        name: 'Story Editor',
        purpose: 'Primary writing interface',
        functionalElements: ['Rich text editor', 'Formatting tools', 'Word count', 'Auto-save', 'Preview mode'],
        userJourney: 'Core writing experience',
        priority: 'critical'
      },
      {
        id: 'chapter-manager',
        name: 'Chapter Manager',
        purpose: 'Organize story structure',
        functionalElements: ['Chapter list', 'Drag reorder', 'Chapter settings', 'Add/delete chapters', 'Chapter stats'],
        userJourney: 'Story organization',
        priority: 'high'
      },
      {
        id: 'writing-prompts',
        name: 'Writing Prompts',
        purpose: 'Inspiration for writers',
        functionalElements: ['Prompt categories', 'Random prompts', 'Prompt challenges', 'Prompt responses', 'Save prompts'],
        userJourney: 'Writing inspiration',
        priority: 'medium'
      },
      {
        id: 'draft-manager',
        name: 'Draft Manager',
        purpose: 'Manage unpublished works',
        functionalElements: ['Draft list', 'Last edited dates', 'Draft previews', 'Publish options', 'Delete drafts'],
        userJourney: 'Work-in-progress management',
        priority: 'high'
      },
      {
        id: 'story-settings',
        name: 'Story Settings',
        purpose: 'Configure story properties',
        functionalElements: ['Visibility settings', 'Category selection', 'Mature content flags', 'Story tags', 'Copyright settings'],
        userJourney: 'Story configuration',
        priority: 'high'
      },
      {
        id: 'cover-designer',
        name: 'Cover Designer',
        purpose: 'Create story covers',
        functionalElements: ['Template library', 'Image editor', 'Text overlay', 'Color schemes', 'Export options'],
        userJourney: 'Visual story branding',
        priority: 'medium'
      },
      {
        id: 'collaboration-tools',
        name: 'Collaboration Tools',
        purpose: 'Multi-author story creation',
        functionalElements: ['Co-author invites', 'Permission settings', 'Version control', 'Comment system', 'Change tracking'],
        userJourney: 'Collaborative writing',
        priority: 'low'
      },
      {
        id: 'writing-analytics',
        name: 'Writing Analytics',
        purpose: 'Author performance insights',
        functionalElements: ['View statistics', 'Reader engagement', 'Growth metrics', 'Performance comparisons'],
        userJourney: 'Writing performance analysis',
        priority: 'medium'
      },
      {
        id: 'publishing-options',
        name: 'Publishing Options',
        purpose: 'Story publication settings',
        functionalElements: ['Publication schedule', 'Chapter release timing', 'Visibility controls', 'Monetization options'],
        userJourney: 'Story publication',
        priority: 'high'
      },
      {
        id: 'version-history',
        name: 'Version History',
        purpose: 'Track story changes',
        functionalElements: ['Change timeline', 'Version comparison', 'Restore options', 'Change annotations'],
        userJourney: 'Writing revision management',
        priority: 'medium'
      },
      {
        id: 'grammar-checker',
        name: 'Grammar & Style Checker',
        purpose: 'Writing quality improvement',
        functionalElements: ['Grammar suggestions', 'Style recommendations', 'Readability scores', 'Error highlighting'],
        userJourney: 'Writing quality enhancement',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'library-lists',
    name: 'Library & Reading Lists',
    description: 'Personal content organization and management',
    screens: [
      {
        id: 'my-library',
        name: 'My Library',
        purpose: 'Personal story collection hub',
        functionalElements: ['Library sections', 'Recently added', 'Reading status', 'Sort/filter options', 'Storage stats'],
        userJourney: 'Personal content management',
        priority: 'critical'
      },
      {
        id: 'reading-list-detail',
        name: 'Reading List Details',
        purpose: 'Individual list management',
        functionalElements: ['List stories', 'List settings', 'Share options', 'Reorder stories', 'Bulk actions'],
        userJourney: 'List organization',
        priority: 'high'
      },
      {
        id: 'create-reading-list',
        name: 'Create Reading List',
        purpose: 'New list creation',
        functionalElements: ['List name input', 'Description field', 'Privacy settings', 'Initial story selection'],
        userJourney: 'List creation',
        priority: 'high'
      },
      {
        id: 'favorites',
        name: 'Favorites',
        purpose: 'Favorite stories collection',
        functionalElements: ['Favorite stories', 'Quick access', 'Remove favorites', 'Sort options'],
        userJourney: 'Preferred content access',
        priority: 'high'
      },
      {
        id: 'want-to-read',
        name: 'Want to Read',
        purpose: 'Future reading queue',
        functionalElements: ['Queued stories', 'Priority indicators', 'Move to reading', 'Queue management'],
        userJourney: 'Reading planning',
        priority: 'high'
      },
      {
        id: 'currently-reading',
        name: 'Currently Reading',
        purpose: 'Active reading management',
        functionalElements: ['Active stories', 'Reading progress', 'Last read chapter', 'Continue reading'],
        userJourney: 'Active reading tracking',
        priority: 'critical'
      },
      {
        id: 'completed-stories',
        name: 'Completed Stories',
        purpose: 'Finished reading archive',
        functionalElements: ['Completed list', 'Completion dates', 'Re-read options', 'Rating history'],
        userJourney: 'Reading history',
        priority: 'medium'
      },
      {
        id: 'downloads',
        name: 'Downloaded Stories',
        purpose: 'Offline content management',
        functionalElements: ['Download list', 'Storage usage', 'Download settings', 'Remove downloads'],
        userJourney: 'Offline content management',
        priority: 'high'
      },
      {
        id: 'shared-lists',
        name: 'Shared Reading Lists',
        purpose: 'Community list sharing',
        functionalElements: ['Shared lists', 'Collaboration tools', 'Permission settings', 'List subscribers'],
        userJourney: 'Social list management',
        priority: 'medium'
      },
      {
        id: 'list-recommendations',
        name: 'List Recommendations',
        purpose: 'Suggested reading lists',
        functionalElements: ['Curated lists', 'Popular lists', 'List previews', 'Follow lists'],
        userJourney: 'List discovery',
        priority: 'medium'
      },
      {
        id: 'import-export',
        name: 'Import/Export Lists',
        purpose: 'List portability',
        functionalElements: ['Export options', 'Import formats', 'External platform sync', 'Backup options'],
        userJourney: 'Data portability',
        priority: 'low'
      }
    ]
  },
  {
    id: 'notifications',
    name: 'Notifications & Updates',
    description: 'User notification and update management',
    screens: [
      {
        id: 'notification-center',
        name: 'Notification Center',
        purpose: 'Central notification hub',
        functionalElements: ['Notification list', 'Read/unread status', 'Notification types', 'Clear all', 'Mark as read'],
        userJourney: 'Notification management',
        priority: 'critical'
      },
      {
        id: 'push-notification-settings',
        name: 'Push Notification Settings',
        purpose: 'Configure push notifications',
        functionalElements: ['Notification toggles', 'Time restrictions', 'Frequency controls', 'Sound settings'],
        userJourney: 'Notification preferences',
        priority: 'high'
      },
      {
        id: 'story-updates',
        name: 'Story Update Notifications',
        purpose: 'New chapter alerts',
        functionalElements: ['Update list', 'Story thumbnails', 'Chapter info', 'Read now buttons'],
        userJourney: 'Content update awareness',
        priority: 'critical'
      },
      {
        id: 'social-notifications',
        name: 'Social Notifications',
        purpose: 'Social interaction alerts',
        functionalElements: ['Follow notifications', 'Comment alerts', 'Like notifications', 'Message alerts'],
        userJourney: 'Social engagement awareness',
        priority: 'high'
      },
      {
        id: 'author-notifications',
        name: 'Author Notifications',
        purpose: 'Writing-related alerts',
        functionalElements: ['Reader feedback', 'Milestone alerts', 'Contest notifications', 'Publishing reminders'],
        userJourney: 'Author engagement',
        priority: 'high'
      },
      {
        id: 'contest-notifications',
        name: 'Contest Notifications',
        purpose: 'Competition updates',
        functionalElements: ['Contest announcements', 'Deadline reminders', 'Results notifications', 'Entry confirmations'],
        userJourney: 'Contest participation',
        priority: 'medium'
      },
      {
        id: 'reading-reminders',
        name: 'Reading Reminders',
        purpose: 'Encourage reading habits',
        functionalElements: ['Daily reading prompts', 'Goal reminders', 'Streak notifications', 'Custom reminders'],
        userJourney: 'Habit building',
        priority: 'medium'
      },
      {
        id: 'system-notifications',
        name: 'System Notifications',
        purpose: 'App and system updates',
        functionalElements: ['App updates', 'Feature announcements', 'Maintenance notices', 'Policy changes'],
        userJourney: 'System awareness',
        priority: 'medium'
      },
      {
        id: 'email-notifications',
        name: 'Email Notification Settings',
        purpose: 'Configure email alerts',
        functionalElements: ['Email toggles', 'Frequency settings', 'Email templates', 'Unsubscribe options'],
        userJourney: 'Email preference management',
        priority: 'medium'
      },
      {
        id: 'notification-history',
        name: 'Notification History',
        purpose: 'Past notification archive',
        functionalElements: ['Historical notifications', 'Archive search', 'Notification analytics', 'Clear history'],
        userJourney: 'Notification tracking',
        priority: 'low'
      }
    ]
  },
  {
    id: 'monetization',
    name: 'Monetization & Premium Features',
    description: 'Revenue generation and premium content',
    screens: [
      {
        id: 'premium-signup',
        name: 'Premium Subscription',
        purpose: 'Premium membership acquisition',
        functionalElements: ['Plan comparison', 'Feature highlights', 'Pricing tiers', 'Payment methods', 'Free trial'],
        userJourney: 'Premium conversion',
        priority: 'high'
      },
      {
        id: 'payment-methods',
        name: 'Payment Methods',
        purpose: 'Manage payment options',
        functionalElements: ['Card management', 'Payment history', 'Billing address', 'Auto-renewal settings'],
        userJourney: 'Payment management',
        priority: 'high'
      },
      {
        id: 'subscription-management',
        name: 'Subscription Management',
        purpose: 'Manage premium membership',
        functionalElements: ['Current plan', 'Usage statistics', 'Upgrade/downgrade', 'Cancel subscription'],
        userJourney: 'Subscription control',
        priority: 'high'
      },
      {
        id: 'coins-currency',
        name: 'Coins & Currency',
        purpose: 'In-app currency management',
        functionalElements: ['Coin balance', 'Purchase coins', 'Coin history', 'Spending tracking'],
        userJourney: 'Virtual currency management',
        priority: 'medium'
      },
      {
        id: 'paid-stories',
        name: 'Paid Stories',
        purpose: 'Premium content access',
        functionalElements: ['Paid story indicators', 'Preview chapters', 'Purchase options', 'Payment confirmation'],
        userJourney: 'Premium content consumption',
        priority: 'medium'
      },
      {
        id: 'author-monetization',
        name: 'Author Monetization',
        purpose: 'Writer revenue tools',
        functionalElements: ['Revenue dashboard', 'Payout settings', 'Earning statistics', 'Monetization options'],
        userJourney: 'Writer income management',
        priority: 'medium'
      },
      {
        id: 'ad-preferences',
        name: 'Ad Preferences',
        purpose: 'Advertising customization',
        functionalElements: ['Ad settings', 'Interest categories', 'Ad frequency', 'Opt-out options'],
        userJourney: 'Ad experience control',
        priority: 'low'
      },
      {
        id: 'premium-features',
        name: 'Premium Features',
        purpose: 'Exclusive premium functionality',
        functionalElements: ['Feature list', 'Usage limits', 'Premium badges', 'Exclusive content'],
        userJourney: 'Premium value demonstration',
        priority: 'medium'
      },
      {
        id: 'gifting',
        name: 'Gift Subscriptions',
        purpose: 'Premium gift functionality',
        functionalElements: ['Gift options', 'Recipient selection', 'Gift messages', 'Delivery scheduling'],
        userJourney: 'Premium gifting',
        priority: 'low'
      },
      {
        id: 'refunds-billing',
        name: 'Refunds & Billing Issues',
        purpose: 'Payment problem resolution',
        functionalElements: ['Refund requests', 'Billing disputes', 'Payment failure handling', 'Support contact'],
        userJourney: 'Payment issue resolution',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'contests-events',
    name: 'Contests & Community Events',
    description: 'Writing competitions and community activities',
    screens: [
      {
        id: 'contest-hub',
        name: 'Contest Hub',
        purpose: 'Central contest discovery',
        functionalElements: ['Active contests', 'Upcoming contests', 'Contest categories', 'Featured contests'],
        userJourney: 'Contest discovery',
        priority: 'medium'
      },
      {
        id: 'contest-details',
        name: 'Contest Details',
        purpose: 'Individual contest information',
        functionalElements: ['Contest rules', 'Prize information', 'Deadline timer', 'Entry requirements', 'Judge info'],
        userJourney: 'Contest evaluation',
        priority: 'medium'
      },
      {
        id: 'contest-entry',
        name: 'Contest Entry Submission',
        purpose: 'Submit contest entries',
        functionalElements: ['Entry form', 'Story selection', 'Entry requirements check', 'Submission confirmation'],
        userJourney: 'Contest participation',
        priority: 'medium'
      },
      {
        id: 'contest-voting',
        name: 'Contest Voting',
        purpose: 'Community contest judging',
        functionalElements: ['Entry list', 'Voting interface', 'Entry previews', 'Voting deadlines'],
        userJourney: 'Community judging participation',
        priority: 'low'
      },
      {
        id: 'contest-results',
        name: 'Contest Results',
        purpose: 'Contest outcome display',
        functionalElements: ['Winner announcements', 'Ranking lists', 'Award ceremonies', 'Prize distribution'],
        userJourney: 'Contest outcome awareness',
        priority: 'medium'
      },
      {
        id: 'writing-challenges',
        name: 'Writing Challenges',
        purpose: 'Community writing activities',
        functionalElements: ['Challenge prompts', 'Participation tracking', 'Challenge leaderboards', 'Completion badges'],
        userJourney: 'Writing skill development',
        priority: 'low'
      },
      {
        id: 'community-events',
        name: 'Community Events',
        purpose: 'Social community activities',
        functionalElements: ['Event calendar', 'Event details', 'RSVP functionality', 'Event reminders'],
        userJourney: 'Community participation',
        priority: 'low'
      },
      {
        id: 'award-ceremonies',
        name: 'Award Ceremonies',
        purpose: 'Contest winner celebrations',
        functionalElements: ['Ceremony streaming', 'Winner spotlights', 'Award presentations', 'Social sharing'],
        userJourney: 'Contest celebration',
        priority: 'low'
      },
      {
        id: 'contest-history',
        name: 'Contest History',
        purpose: 'Past contest archive',
        functionalElements: ['Previous contests', 'Past winners', 'Entry archives', 'Performance history'],
        userJourney: 'Contest reference',
        priority: 'low'
      },
      {
        id: 'judge-dashboard',
        name: 'Judge Dashboard',
        purpose: 'Contest judging interface',
        functionalElements: ['Entry queue', 'Scoring interface', 'Judge notes', 'Evaluation criteria'],
        userJourney: 'Contest judging',
        priority: 'low'
      }
    ]
  },
  {
    id: 'account-settings',
    name: 'Account & Settings',
    description: 'User account management and app configuration',
    screens: [
      {
        id: 'account-overview',
        name: 'Account Overview',
        purpose: 'Main account information hub',
        functionalElements: ['Profile summary', 'Account stats', 'Quick settings', 'Support links'],
        userJourney: 'Account management entry',
        priority: 'critical'
      },
      {
        id: 'profile-editing',
        name: 'Edit Profile',
        purpose: 'Update user information',
        functionalElements: ['Profile photo upload', 'Bio editor', 'Personal info fields', 'Privacy controls'],
        userJourney: 'Profile customization',
        priority: 'high'
      },
      {
        id: 'privacy-settings',
        name: 'Privacy Settings',
        purpose: 'Control information visibility',
        functionalElements: ['Visibility toggles', 'Data sharing options', 'Profile privacy', 'Activity privacy'],
        userJourney: 'Privacy management',
        priority: 'high'
      },
      {
        id: 'security-settings',
        name: 'Security Settings',
        purpose: 'Account security management',
        functionalElements: ['Password change', 'Two-factor auth', 'Login sessions', 'Security alerts'],
        userJourney: 'Account security',
        priority: 'high'
      },
      {
        id: 'data-export',
        name: 'Data Export',
        purpose: 'Export user data',
        functionalElements: ['Export options', 'Data formats', 'Download links', 'Export history'],
        userJourney: 'Data portability',
        priority: 'medium'
      },
      {
        id: 'account-deletion',
        name: 'Delete Account',
        purpose: 'Account termination process',
        functionalElements: ['Deletion warnings', 'Data retention info', 'Confirmation steps', 'Feedback collection'],
        userJourney: 'Account closure',
        priority: 'medium'
      },
      {
        id: 'language-settings',
        name: 'Language & Region',
        purpose: 'Localization preferences',
        functionalElements: ['Language selector', 'Region settings', 'Content preferences', 'Translation options'],
        userJourney: 'Localization customization',
        priority: 'medium'
      },
      {
        id: 'accessibility-settings',
        name: 'Accessibility Settings',
        purpose: 'Accessibility customization',
        functionalElements: ['Font size controls', 'Color contrast', 'Screen reader support', 'Navigation aids'],
        userJourney: 'Accessibility enhancement',
        priority: 'medium'
      },
      {
        id: 'app-preferences',
        name: 'App Preferences',
        purpose: 'General app settings',
        functionalElements: ['Theme selection', 'Default views', 'Auto-download settings', 'Cache management'],
        userJourney: 'App customization',
        priority: 'medium'
      },
      {
        id: 'linked-accounts',
        name: 'Linked Accounts',
        purpose: 'Social media connections',
        functionalElements: ['Connected accounts', 'Link/unlink options', 'Sync settings', 'Permission management'],
        userJourney: 'Social integration management',
        priority: 'low'
      }
    ]
  },
  {
    id: 'help-support',
    name: 'Help & Support',
    description: 'User assistance and troubleshooting',
    screens: [
      {
        id: 'help-center',
        name: 'Help Center',
        purpose: 'Central support hub',
        functionalElements: ['FAQ sections', 'Help categories', 'Search help', 'Popular topics'],
        userJourney: 'Support seeking entry',
        priority: 'high'
      },
      {
        id: 'faq',
        name: 'Frequently Asked Questions',
        purpose: 'Common question answers',
        functionalElements: ['Question categories', 'Search FAQ', 'Answer details', 'Related questions'],
        userJourney: 'Self-service support',
        priority: 'high'
      },
      {
        id: 'contact-support',
        name: 'Contact Support',
        purpose: 'Direct support communication',
        functionalElements: ['Contact form', 'Issue categories', 'Attachment upload', 'Response tracking'],
        userJourney: 'Direct support request',
        priority: 'high'
      },
      {
        id: 'bug-report',
        name: 'Bug Report',
        purpose: 'Technical issue reporting',
        functionalElements: ['Bug description', 'Steps to reproduce', 'Screenshot upload', 'System info'],
        userJourney: 'Technical issue reporting',
        priority: 'medium'
      },
      {
        id: 'feature-request',
        name: 'Feature Request',
        purpose: 'Suggest new features',
        functionalElements: ['Feature description', 'Use case explanation', 'Priority indication', 'Community voting'],
        userJourney: 'Product improvement contribution',
        priority: 'low'
      },
      {
        id: 'community-guidelines',
        name: 'Community Guidelines',
        purpose: 'Platform rules and policies',
        functionalElements: ['Guideline sections', 'Rule explanations', 'Violation examples', 'Reporting procedures'],
        userJourney: 'Platform rule understanding',
        priority: 'medium'
      },
      {
        id: 'terms-service',
        name: 'Terms of Service',
        purpose: 'Legal terms and conditions',
        functionalElements: ['Terms sections', 'Legal text', 'Update history', 'Acceptance tracking'],
        userJourney: 'Legal compliance',
        priority: 'medium'
      },
      {
        id: 'privacy-policy',
        name: 'Privacy Policy',
        purpose: 'Data usage transparency',
        functionalElements: ['Policy sections', 'Data usage explanations', 'Rights information', 'Contact details'],
        userJourney: 'Privacy understanding',
        priority: 'medium'
      },
      {
        id: 'tutorial-center',
        name: 'Tutorial Center',
        purpose: 'Feature education and guidance',
        functionalElements: ['Tutorial categories', 'Step-by-step guides', 'Video tutorials', 'Interactive demos'],
        userJourney: 'Feature learning',
        priority: 'medium'
      },
      {
        id: 'feedback-surveys',
        name: 'Feedback & Surveys',
        purpose: 'User experience feedback',
        functionalElements: ['Survey forms', 'Rating scales', 'Open feedback', 'Survey rewards'],
        userJourney: 'Experience feedback provision',
        priority: 'low'
      }
    ]
  },
  {
    id: 'admin-moderation',
    name: 'Admin & Moderation',
    description: 'Platform administration and content moderation',
    screens: [
      {
        id: 'admin-dashboard',
        name: 'Admin Dashboard',
        purpose: 'Administrative overview and controls',
        functionalElements: ['System metrics', 'User statistics', 'Content overview', 'Alert notifications'],
        userJourney: 'Administrative oversight',
        priority: 'high'
      },
      {
        id: 'user-management',
        name: 'User Management',
        purpose: 'User account administration',
        functionalElements: ['User search', 'Account details', 'Suspension controls', 'Activity monitoring'],
        userJourney: 'User administration',
        priority: 'high'
      },
      {
        id: 'content-moderation',
        name: 'Content Moderation',
        purpose: 'Review and moderate content',
        functionalElements: ['Content queue', 'Moderation tools', 'Violation categories', 'Action history'],
        userJourney: 'Content quality control',
        priority: 'critical'
      },
      {
        id: 'report-management',
        name: 'Report Management',
        purpose: 'Handle user reports',
        functionalElements: ['Report queue', 'Report details', 'Investigation tools', 'Resolution actions'],
        userJourney: 'Community safety management',
        priority: 'critical'
      },
      {
        id: 'content-analytics',
        name: 'Content Analytics',
        purpose: 'Platform content insights',
        functionalElements: ['Content metrics', 'Trend analysis', 'Performance reports', 'Quality indicators'],
        userJourney: 'Content strategy insights',
        priority: 'medium'
      },
      {
        id: 'contest-management',
        name: 'Contest Management',
        purpose: 'Administer writing contests',
        functionalElements: ['Contest creation', 'Judge assignment', 'Entry management', 'Winner selection'],
        userJourney: 'Contest administration',
        priority: 'medium'
      },
      {
        id: 'featured-content',
        name: 'Featured Content Management',
        purpose: 'Curate prominent content',
        functionalElements: ['Feature selection', 'Scheduling tools', 'Placement management', 'Performance tracking'],
        userJourney: 'Content curation',
        priority: 'medium'
      },
      {
        id: 'system-settings',
        name: 'System Settings',
        purpose: 'Platform configuration',
        functionalElements: ['System parameters', 'Feature toggles', 'Maintenance mode', 'Configuration backup'],
        userJourney: 'System administration',
        priority: 'high'
      },
      {
        id: 'audit-logs',
        name: 'Audit Logs',
        purpose: 'System activity tracking',
        functionalElements: ['Activity logs', 'Log filtering', 'Security events', 'Export options'],
        userJourney: 'System monitoring',
        priority: 'medium'
      },
      {
        id: 'announcement-system',
        name: 'Announcement System',
        purpose: 'Platform-wide communication',
        functionalElements: ['Announcement creation', 'Audience targeting', 'Scheduling', 'Delivery tracking'],
        userJourney: 'Community communication',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'advanced-features',
    name: 'Advanced Features',
    description: 'Specialized and premium functionality',
    screens: [
      {
        id: 'ai-writing-assistant',
        name: 'AI Writing Assistant',
        purpose: 'AI-powered writing help',
        functionalElements: ['Writing suggestions', 'Grammar correction', 'Style improvement', 'Content generation'],
        userJourney: 'Enhanced writing experience',
        priority: 'low'
      },
      {
        id: 'story-translation',
        name: 'Story Translation',
        purpose: 'Multi-language content access',
        functionalElements: ['Translation tools', 'Language selection', 'Quality indicators', 'Translator credits'],
        userJourney: 'Cross-language content consumption',
        priority: 'low'
      },
      {
        id: 'advanced-analytics',
        name: 'Advanced Analytics',
        purpose: 'Detailed performance insights',
        functionalElements: ['Detailed metrics', 'Custom reports', 'Data visualization', 'Export functionality'],
        userJourney: 'Deep performance analysis',
        priority: 'low'
      },
      {
        id: 'api-integrations',
        name: 'API Integrations',
        purpose: 'Third-party service connections',
        functionalElements: ['API management', 'Integration settings', 'Data sync options', 'Authentication tokens'],
        userJourney: 'External service integration',
        priority: 'low'
      },
      {
        id: 'content-scheduling',
        name: 'Content Scheduling',
        purpose: 'Automated content publishing',
        functionalElements: ['Publishing calendar', 'Schedule management', 'Auto-publish settings', 'Preview options'],
        userJourney: 'Content publishing automation',
        priority: 'low'
      },
      {
        id: 'collaborative-editing',
        name: 'Real-time Collaborative Editing',
        purpose: 'Multi-user simultaneous editing',
        functionalElements: ['Live collaboration', 'User cursors', 'Change tracking', 'Conflict resolution'],
        userJourney: 'Team writing projects',
        priority: 'low'
      },
      {
        id: 'story-branches',
        name: 'Interactive Story Branches',
        purpose: 'Choose-your-own-adventure stories',
        functionalElements: ['Branch creation', 'Decision points', 'Story mapping', 'Reader choice tracking'],
        userJourney: 'Interactive storytelling',
        priority: 'low'
      },
      {
        id: 'multimedia-stories',
        name: 'Multimedia Stories',
        purpose: 'Rich media story content',
        functionalElements: ['Media embedding', 'Audio integration', 'Image galleries', 'Video content'],
        userJourney: 'Enhanced storytelling',
        priority: 'low'
      },
      {
        id: 'story-marketplace',
        name: 'Story Marketplace',
        purpose: 'Commercial story trading',
        functionalElements: ['Story listings', 'Price management', 'Sales tracking', 'Revenue sharing'],
        userJourney: 'Story commercialization',
        priority: 'low'
      },
      {
        id: 'beta-features',
        name: 'Beta Features',
        purpose: 'Experimental functionality testing',
        functionalElements: ['Feature toggles', 'Beta enrollment', 'Feedback collection', 'Usage tracking'],
        userJourney: 'Early feature access',
        priority: 'low'
      }
    ]
  }
];

export const getTotalScreenCount = (): number => {
  return wattpadScreens.reduce((total, category) => total + category.screens.length, 0);
};

export const getScreensByPriority = (priority: Screen['priority']): Screen[] => {
  return wattpadScreens.flatMap(category => 
    category.screens.filter(screen => screen.priority === priority)
  );
};

export const getCategoryProgress = (categoryId: string, completedScreens: Set<string>): number => {
  const category = wattpadScreens.find(cat => cat.id === categoryId);
  if (!category) return 0;
  
  const completedCount = category.screens.filter(screen => 
    completedScreens.has(screen.id)
  ).length;
  
  return Math.round((completedCount / category.screens.length) * 100);
};