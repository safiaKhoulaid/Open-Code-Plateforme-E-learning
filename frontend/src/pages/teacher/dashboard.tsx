import React from 'react';
import { CourseManagement } from '@/components/course/CourseManagement';

export const TeacherDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de Bord Enseignant</h1>
      
      {/* Gestion des cours */}
      <section className="mb-8">
        <CourseManagement />
      </section>
      
      {/* Autres sections du tableau de bord */}
    </div>
  );
};

export default TeacherDashboard; 