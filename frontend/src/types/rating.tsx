export interface Rating {
  id: number;
  courseId: number;
  userId: number;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

export interface RatingFormData {
  course_id: number;
  stars: number;
  comment: string;
}
