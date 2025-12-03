export interface Course {
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
  description: string;
  bookmarked: boolean;
  isArchived: boolean;
  estimatedTimeLeft: string;
  lastSection: string;
  lastLesson: string;
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  course: string;
  skills: string[];
}

export interface Notification {
  id: number;
  title: string;
  course: string;
  time: string;
  icon: string;
  read: boolean;
}

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  activeStudents: number;
  completionRate: number;
  averageRating: number;
}

export interface RecentActivity {
  id: number;
  type: 'enrollment' | 'completion' | 'review';
  studentName: string;
  courseName: string;
  timestamp: string;
  details?: string;
}

export interface PopularCourse {
  id: number;
  title: string;
  enrollments: number;
  revenue: number;
  rating: number;
  imageUrl: string;
}

export interface Wishlist {
  id: number;
  user_id: number;
  course_id: number;
  has_notifications: boolean;
  added_at: string;
  created_at: string;
  updated_at: string;
  course: {
    id: number;
    title: string;
    subtitle: string | null;
    description: string;
    slug: string | null;
    instructor_id: number;
    level: string;
    language: string;
    image_url: string | null;
    video_url: string | null;
    price: string;
    discount: string | null;
    published_date: string | null;
    last_updated: string | null;
    status: string;
    requirements: any | null;
    what_you_will_learn: any | null;
    target_audience: any | null;
    average_rating: string;
    total_reviews: number;
    total_students: number;
    has_certificate: boolean;
    created_at: string;
    updated_at: string;
    category_id: number | null;
  };
}

export interface DashboardData {
  stats: DashboardStats;
  courses: Course[];
  certificates: Certificate[];
  notifications: Notification[];
  categories: Array<{
    id: string;
    name: string;
  }>;
  recentActivities: RecentActivity[];
  popularCourses: PopularCourse[];
  revenueChart: {
    labels: string[];
    data: number[];
  };
  enrollmentChart: {
    labels: string[];
    data: number[];
  };
  wishlists?: Wishlist[];
} 
