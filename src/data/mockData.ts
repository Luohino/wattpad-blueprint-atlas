import { Story, User, Chapter } from '@/types/story';
import bookCover1 from '@/assets/book-cover-1.jpg';
import bookCover2 from '@/assets/book-cover-2.jpg';
import bookCover3 from '@/assets/book-cover-3.jpg';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'storyqueen',
    displayName: 'Sarah Michelle',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
    bio: 'Romance novelist • 2M reads • Living my best fictional life ✨',
    followers: 125000,
    following: 1200,
    verified: true
  },
  {
    id: '2',
    username: 'darktales',
    displayName: 'Alex Shadow',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
    bio: 'Mystery & Thriller writer 🔪 New chapter every Friday',
    followers: 89000,
    following: 567,
    verified: true
  },
  {
    id: '3',
    username: 'fantasywriter99',
    displayName: 'Emma Goldstone',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
    bio: 'Fantasy enthusiast | Dragon mom | Coffee addict ☕️',
    followers: 45000,
    following: 890
  }
];

export const mockChapters: Chapter[] = [
  {
    id: '1',
    title: 'The Beginning',
    content: `The rain hammered against the library windows as Maya clutched her worn copy of "Pride and Prejudice" closer to her chest. She had no idea that this ordinary Tuesday evening would change everything.

The old building creaked around her, its Victorian bones settling into the night. Most students had long since abandoned their studies for the warmth of their dorms, but Maya found solace in the quiet corners of the literature section.

"Excuse me, is this seat taken?"

The voice made her jump. She looked up to find a tall figure with dark hair and intense green eyes, holding a stack of books that looked decidedly more advanced than her undergraduate texts.

"No, it's free," she managed, her voice barely above a whisper.

He settled into the chair across from her, and Maya couldn't help but notice the way his fingers moved across the pages as he read - confident, purposeful, like someone who knew exactly what they were looking for.

"Interesting choice," he said, nodding toward her book. "Though I prefer the darker romances myself."

Maya felt heat rise to her cheeks. "It's for class," she said defensively.

"Of course it is." His smile was enigmatic. "I'm Ethan, by the way. Ethan Blake."

"Maya," she replied, wondering why that name sounded familiar.

It wasn't until later that she would discover Ethan Blake was the mysterious graduate student everyone talked about in hushed tones - the one with a past as dark as the novels he studied.`,
    chapterNumber: 1,
    publishedAt: new Date('2024-01-15'),
    wordCount: 287,
    readTime: 2
  },
  {
    id: '2',
    title: 'Unexpected Encounters',
    content: `Maya couldn't concentrate on her Victorian Literature essay. Every few minutes, her eyes would drift to the empty chair where Ethan had sat just hours before. He'd left behind a faint scent of cedar and something else she couldn't quite place - something dangerous.

"You're distracted," her roommate Lily observed, popping her head over Maya's laptop screen. "Let me guess - cute guy?"

"It's not like that," Maya protested, but even she could hear the lie in her voice.

Lily raised an eyebrow. "Right. So why have you been staring at that same paragraph for twenty minutes?"

Before Maya could answer, her phone buzzed with a notification from the university's messaging system. Her heart skipped as she saw the sender's name: E. Blake.

"Found this in the library. Thought you might need it back."

Attached was a photo of her favorite pen - a vintage fountain pen her grandmother had given her. In her flustered state after meeting Ethan, she must have left it behind.

"Meet me at the clock tower at 8 PM?" the message continued.

Maya stared at the screen, her pulse quickening. There was something about the way he'd phrased it - not a question, but not quite a command either. As if he already knew she'd say yes.

"Oh, you're in trouble," Lily sang, reading over her shoulder. "That's Ethan Blake. He's practically a legend around here."

"What do you mean?"

"Mysterious past, brilliant mind, and according to the rumors, he's got some seriously dark secrets. The kind that make good girls like you completely lose their minds."

Maya's fingers hovered over her phone. Every rational part of her brain told her to politely decline. But something stronger, something she'd never felt before, made her type back: "I'll be there."`,
    chapterNumber: 2,
    publishedAt: new Date('2024-01-16'),
    wordCount: 324,
    readTime: 3
  }
];

export const mockStories: Story[] = [
  {
    id: '1',
    title: 'After We Collided',
    description: 'A passionate college romance that turns Maya\'s perfectly planned life upside down when she meets the mysterious Ethan Blake.',
    cover: bookCover1,
    author: mockUsers[0],
    genres: ['Romance', 'New Adult', 'Contemporary'],
    tags: ['College', 'Enemies to Lovers', 'Dark Romance', 'Bad Boy'],
    chapters: mockChapters,
    stats: {
      reads: 2400000,
      votes: 156000,
      comments: 89000,
      shares: 12000,
      rank: 1
    },
    status: 'ongoing',
    maturityRating: 'mature',
    language: 'English',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '2',
    title: 'The Silent Observer',
    description: 'When detective Jessica Parker is assigned to a case involving mysterious disappearances, she discovers that someone has been watching her every move.',
    cover: bookCover2,
    author: mockUsers[1],
    genres: ['Mystery', 'Thriller', 'Suspense'],
    tags: ['Detective', 'Psychological Thriller', 'Crime', 'Suspense'],
    chapters: [],
    stats: {
      reads: 1800000,
      votes: 98000,
      comments: 45000,
      shares: 8000,
      rank: 3
    },
    status: 'ongoing',
    maturityRating: 'teen',
    language: 'English',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '3',
    title: 'Realm of the Dragon Queen',
    description: 'In a world where dragons rule the skies, seventeen-year-old Aria discovers she\'s the last of an ancient bloodline with the power to communicate with the great beasts.',
    cover: bookCover3,
    author: mockUsers[2],
    genres: ['Fantasy', 'Young Adult', 'Adventure'],
    tags: ['Dragons', 'Magic', 'Coming of Age', 'Epic Fantasy'],
    chapters: [],
    stats: {
      reads: 950000,
      votes: 76000,
      comments: 34000,
      shares: 5500,
      rank: 7
    },
    status: 'completed',
    maturityRating: 'teen',
    language: 'English',
    createdAt: new Date('2023-11-20'),
    updatedAt: new Date('2024-01-10')
  }
];

export const popularGenres = [
  'Romance',
  'Fantasy',
  'Teen Fiction',
  'Mystery/Thriller',
  'Werewolf',
  'Vampire',
  'Fanfiction',
  'Science Fiction',
  'Horror',
  'Historical Fiction',
  'Humor',
  'Poetry'
];

export const trendingTags = [
  'BadBoy',
  'Love',
  'Romance',
  'TeenFiction',
  'Werewolf',
  'Vampire',
  'HighSchool',
  'Drama',
  'Fantasy',
  'Mystery'
];