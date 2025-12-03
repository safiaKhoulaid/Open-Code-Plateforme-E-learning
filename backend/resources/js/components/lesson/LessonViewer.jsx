import React, { useState, useEffect } from 'react';
import { getLessonFileUrl, getContentType } from '../../utils/fileUtils';

/**
 * Composant pour afficher le contenu d'une leçon en fonction de son type
 *
 * @param {Object} props Les propriétés du composant
 * @param {Object} props.lesson L'objet leçon à afficher
 * @param {number} props.courseId L'ID du cours
 * @param {number} props.sectionId L'ID de la section
 */
const LessonViewer = ({ lesson, courseId, sectionId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lesson) {
      setIsLoading(false);
    }
  }, [lesson]);

  // Si les données sont en cours de chargement
  if (isLoading) {
    return <div className="lesson-loading">Chargement du contenu...</div>;
  }

  // Si une erreur s'est produite
  if (error) {
    return (
      <div className="lesson-error">
        <h3>Une erreur s'est produite</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Si aucune leçon n'est fournie
  if (!lesson) {
    return <div className="lesson-empty">Aucun contenu à afficher</div>;
  }

  // Extraire le nom du fichier depuis l'URL du contenu si disponible
  let fileName = '';
  if (lesson.content_url) {
    fileName = lesson.content_url.split('/').pop();
  }

  // Déterminer l'URL d'accès au contenu
  const fileUrl = lesson.content_access_url ||
                 (fileName ? getLessonFileUrl(courseId, sectionId, lesson.id, fileName) : '');

  // En fonction du type de contenu, afficher le bon composant
  switch (lesson.content_type) {
    case 'video':
      return (
        <div className="lesson-video-container">
          <h2>{lesson.title}</h2>
          <div className="lesson-description">{lesson.description}</div>

          <div className="video-player">
            <video
              controls
              width="100%"
              poster={lesson.thumbnail_url}
              preload="metadata"
              className="lesson-video"
            >
              <source src={fileUrl} type={getContentType(fileName) || 'video/mp4'} />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </div>

          {/* Ressources associées */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="lesson-resources">
              <h3>Ressources complémentaires</h3>
              <ul>
                {lesson.resources.map(resource => (
                  <li key={resource.id}>
                    <a
                      href={resource.file_access_url || resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );

    case 'pdf':
      return (
        <div className="lesson-pdf-container">
          <h2>{lesson.title}</h2>
          <div className="lesson-description">{lesson.description}</div>

          <div className="pdf-viewer">
            <iframe
              src={fileUrl}
              width="100%"
              height="600px"
              title={lesson.title}
              className="lesson-pdf"
            />
          </div>

          {/* Ressources associées */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="lesson-resources">
              <h3>Ressources complémentaires</h3>
              <ul>
                {lesson.resources.map(resource => (
                  <li key={resource.id}>
                    <a
                      href={resource.file_access_url || resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );

    case 'document':
      return (
        <div className="lesson-document-container">
          <h2>{lesson.title}</h2>
          <div className="lesson-description">{lesson.description}</div>

          <div className="document-viewer">
            <div className="document-download">
              <a
                href={fileUrl}
                download={fileName}
                className="download-button"
              >
                Télécharger le document
              </a>
            </div>
          </div>

          {/* Ressources associées */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="lesson-resources">
              <h3>Ressources complémentaires</h3>
              <ul>
                {lesson.resources.map(resource => (
                  <li key={resource.id}>
                    <a
                      href={resource.file_access_url || resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );

    case 'quiz':
      return (
        <div className="lesson-quiz-container">
          <h2>{lesson.title}</h2>
          <div className="lesson-description">{lesson.description}</div>

          <div className="quiz-content">
            {/* Ici, on intégrerait le composant de quiz */}
            <p>Le quiz sera bientôt disponible</p>
          </div>

          {/* Ressources associées */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="lesson-resources">
              <h3>Ressources complémentaires</h3>
              <ul>
                {lesson.resources.map(resource => (
                  <li key={resource.id}>
                    <a
                      href={resource.file_access_url || resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="lesson-default-container">
          <h2>{lesson.title}</h2>
          <div className="lesson-description">{lesson.description}</div>

          {lesson.content_url && (
            <div className="content-link">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="content-button"
              >
                Accéder au contenu
              </a>
            </div>
          )}

          {/* Ressources associées */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="lesson-resources">
              <h3>Ressources complémentaires</h3>
              <ul>
                {lesson.resources.map(resource => (
                  <li key={resource.id}>
                    <a
                      href={resource.file_access_url || resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
  }
};

export default LessonViewer;
