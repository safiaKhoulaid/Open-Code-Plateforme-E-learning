import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Play, Lock, CheckCircle } from 'lucide-react';
import { Section, Lesson } from '../../types/course';

interface CourseSectionsProps {
  sections: Section[];
  onLessonClick?: (lesson: Lesson) => void;
}

const CourseSections: React.FC<CourseSectionsProps> = ({ sections, onLessonClick }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (onLessonClick) {
      onLessonClick(lesson);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Contenu du cours</h3>
      
      {sections.length === 0 ? (
        <p className="text-gray-500">Aucune section disponible pour ce cours.</p>
      ) : (
        <div className="border border-gray-200 rounded-md overflow-hidden">
          {sections.map((section) => (
            <div key={section.id} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  {expandedSections[section.id] ? (
                    <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                  )}
                  <span className="font-medium">{section.title}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {section.lessons.length} leçons
                </span>
              </button>
              
              {expandedSections[section.id] && (
                <div className="bg-white">
                  {section.lessons.map((lesson) => (
                    <div 
                      key={lesson.id}
                      className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <div className="flex items-center">
                        {lesson.is_completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        ) : lesson.is_free ? (
                          <Play className="h-5 w-5 text-blue-500 mr-3" />
                        ) : (
                          <Lock className="h-5 w-5 text-gray-400 mr-3" />
                        )}
                        <div>
                          <span className="font-medium">{lesson.title}</span>
                          {lesson.duration && (
                            <span className="text-sm text-gray-500 ml-2">{lesson.duration}</span>
                          )}
                        </div>
                      </div>
                      {lesson.is_free && !lesson.is_completed && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Gratuit
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseSections; 