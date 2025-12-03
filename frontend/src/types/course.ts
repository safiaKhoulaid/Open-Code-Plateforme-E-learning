export interface Tag {
  id?: string;
  name: string;
}

export interface Category {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  title: string;
  description?: string;
  categoryId?: string;
}

export interface Attachment {
  id?: string;
  name: string;
  url: string;
  size: string;
  type: string;
}

export interface Lesson {
  id: string;
  section_id : number;
  title: string;
  description?: string;
  content_type: "video" | "article" | "quiz" | "assignment" | "pdf";
  content_url?: string | File;
  duration: string;
  order: number;
  videoUrl?: string;
  pdf_url?: string;
  attachments?: Resource[];
  quiz?: Quiz;
  assignment?: Assignment;
  preview?: boolean;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface Instructor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
}
export interface Resource{
  id : number ;
  lesson_id : number ;
  title : string ;
  type : string;
  file_url : File ;
  file_size : number ;
  is_downloadable : boolean ;



}
export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category_id: string;
  subcategory: string;
  level: string;
  language: string;
  price: number;
  salePrice?: number;
  image_url: string;
  instructor_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  sections: Section[];
  tags: string[];
  what_you_will_learn: string[];
  requirements: string[];
  instructor: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string;
    bio: string;
  };
  discount: number;
  average_rating: number;
  total_reviews: number;
  total_students: number;
  resources : Resource[];
}

export interface tag {
  name: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  passing_score: number;
  time_limit?: number; // en minutes
}

export interface Question {
  id: string;
  text: string;
  type: "multiple_choice" | "true_false" | "short_answer";
  options?: string[];
  correct_answer: string;
  points: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  due_date?: string;
  points: number;
  submission_type: "text" | "file" | "both";
  allowed_file_types?: string[];
  max_file_size?: number; // en MB
}

export interface ApiCourse {
  id: number;
  title: string;
  subtitle: string | null;
  description: string;
  category_id: number | null;
  subcategory: string | null;
  level: string;
  language: string;
  price: string;
  image_url: string | null;
  instructor_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  sections: Section[];
  tags: Tag[];
  what_you_will_learn: string[] | null;
  requirements: string[] | null;
  instructor: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    email_verified_at: string | null;
    avatar_url: string | null;
    bio: string | null;
  };
  discount: string;
  average_rating: string;
  total_reviews: number;
  total_students: number;
  duration: string | null;
  video_url: string | null;
  has_certificate: boolean;
  published_date: string | null;
  last_updated: string | null;
  slug: string | null;
  resources : [Resource];
}


