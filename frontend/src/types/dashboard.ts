export interface DashboardCourse {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  image: string;
  lastViewed: string;
  rating: number;
  reviews: number;
  totalLessons: number;
  completedLessons: number;
  category: string;
  level: string;
  duration?: string;
  lastLesson: string;
}

export interface DashboardData {
  courses: DashboardCourse[];
  certificates: Certificate[];
  profile: Profile;
}

export interface Profile {
  id: number;
  user_id: string;
  profilePicture: File;
  biography: string;
  skills: string[];phone : string;
  job : string;
  education : [];
  name : string

 
  
}

export interface Certificate {
  id: number;
  course_id: number;
  student_id: number;
  issued_at: string;
  status: string;
} 