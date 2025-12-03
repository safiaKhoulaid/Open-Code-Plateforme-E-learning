import { User } from './user';

export interface Skill {
  name: string;
  level: number;
}

export interface ProfileResponse {
  id: number;
  user_id: number;
  firstName: string;
  lastName: string;
  profilPicture: string | null;
  profilePicture?: string | null;
  biography: string | null;
  linkdebLink: string | null;
  instagramLink: string | null;
  discordLink: string | null;
  skills: Skill[] | null;
  phone: string | null;
  website: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  name: string | null;
  job: string | null;
  certifications: any[] | null;
  experiences: any[] | null;
  education: any[] | null;
}

export interface UserSettings {
  firstName?: string;
  lastName?: string;
  biography?: string;
  linkdenLink?: string;
  instagramLink?: string;
  discordLink?: string;
  avatar?: File | null;
  profilePicture?: string;
  phone?: string;
  website?: string;
  location?: string;
  email?: string;
  job?: string;
} 