export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  followers: number;
  following: number;
  verified?: boolean;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  cover?: string;
  author: User;
  genres: string[];
  tags: string[];
  chapters: Chapter[];
  stats: StoryStats;
  status: 'ongoing' | 'completed' | 'on-hold';
  maturityRating: 'everyone' | 'teen' | 'mature';
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  chapterNumber: number;
  publishedAt: Date;
  wordCount: number;
  readTime: number; // in minutes
}

export interface StoryStats {
  reads: number;
  votes: number;
  comments: number;
  shares: number;
  rank?: number;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  createdAt: Date;
  likes: number;
  replies?: Comment[];
}

export interface ReadingList {
  id: string;
  name: string;
  description?: string;
  stories: Story[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReadingProgress {
  storyId: string;
  chapterIndex: number;
  position: number; // scroll position or paragraph
  lastReadAt: Date;
}