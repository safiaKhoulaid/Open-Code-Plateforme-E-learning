import { Course } from './course';

export interface CartItem {
  course: Course;
  id: number;
  title: string;
  price: number;
  image?: string;
  course_id: number;
} 