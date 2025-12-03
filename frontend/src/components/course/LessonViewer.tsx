import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Lesson } from '../../types/course';

// Fake data pour tester le composant
const fakeLessons: Lesson[] = [
  {
    id: "1",
    section_id: 1,
    title: "Introduction à React",
    description: "Dans cette leçon, nous allons découvrir les bases de React et son écosystème.",
    content_type: "video",
    content_url: new File([], "video1.mp4"),
    duration: "15:30",
    order: 1,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "2",
    section_id: 1,
    title: "Les Composants React",
    description: "Apprenez à créer et utiliser des composants React",
    content_type: "pdf",
    content_url: new File([], "pdf1.pdf"),
    duration: "20:00",
    order: 2
  },
  {
    id: "3",
    section_id: 1,
    title: "Les Hooks React",
    description: "Maîtrisez les hooks de React",
    content_type: "article",
    content_url: new File([], "article1.txt"),
    duration: "25:15",
    order: 3
  }
];

interface LessonViewerProps {
  lesson: Lesson;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

// Composant de test pour afficher les fake data
export const LessonViewerTest: React.FC = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const currentLesson = fakeLessons[currentLessonIndex];

  console.log('Données factices:', fakeLessons);
  console.log('Leçon actuelle:', currentLesson);

  const handleNext = () => {
    if (currentLessonIndex < fakeLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleClose = () => {
    console.log('Fermeture de la leçon');
  };

  if (!currentLesson) {
    return (
      <div className="p-4">
        <p className="text-red-500">Erreur: Aucune leçon disponible</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Test des données factices</h2>
      <LessonViewer
        lesson={currentLesson}
        onClose={handleClose}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={currentLessonIndex < fakeLessons.length - 1}
        hasPrevious={currentLessonIndex > 0}
      />
    </div>
  );
};

const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  onClose,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
}) => {
  if (!lesson) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-lg text-gray-600">Aucune leçon sélectionnée</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">{lesson.title}</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {lesson.videoUrl ? (
          <div className="aspect-video w-full max-w-4xl mx-auto mb-6">
            <iframe
              src={lesson.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md mb-6">
            <p className="text-gray-500">Aucune vidéo disponible</p>
          </div>
        )}

        {lesson.description && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-700">{lesson.description}</p>
          </div>
        )}

        {lesson.content_url && (
          <div>
            <h3 className="text-lg font-medium mb-2">Contenu</h3>
            <div className="prose max-w-none">
              <p>{lesson.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={`flex items-center px-4 py-2 rounded-md ${
            hasPrevious
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Précédent
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`flex items-center px-4 py-2 rounded-md ${
            hasNext
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Suivant
          <ChevronRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default LessonViewer; 