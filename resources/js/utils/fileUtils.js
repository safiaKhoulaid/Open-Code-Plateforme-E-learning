/**
 * Utilitaires pour gérer les URLs de fichiers dans le frontend React
 */

// URL de base de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

/**
 * Génère une URL pour accéder à un fichier de leçon
 *
 * @param {number} courseId - ID du cours
 * @param {number} sectionId - ID de la section
 * @param {number} lessonId - ID de la leçon
 * @param {string} fileName - Nom du fichier
 * @returns {string} URL complète pour accéder au fichier
 */
export const getLessonFileUrl = (courseId, sectionId, lessonId, fileName) => {
  // Si le fileName est déjà une URL complète, la retourner directement
  if (fileName && (fileName.startsWith('http://') || fileName.startsWith('https://'))) {
    return fileName;
  }

  // Sinon, construire l'URL d'accès à l'API
  return `${API_BASE_URL}/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/files/${fileName}`;
};

/**
 * Génère une URL pour accéder à un fichier via la route générique
 *
 * @param {string} fileName - Nom du fichier
 * @returns {string} URL complète pour accéder au fichier
 */
export const getGenericFileUrl = (fileName) => {
  // Si le fileName est déjà une URL complète, la retourner directement
  if (fileName && (fileName.startsWith('http://') || fileName.startsWith('https://'))) {
    return fileName;
  }

  // Sinon, construire l'URL d'accès à l'API
  return `${API_BASE_URL}/api/files/${fileName}`;
};

/**
 * Génère une URL pour accéder directement à un fichier du stockage
 *
 * @param {string} path - Chemin relatif dans le stockage
 * @returns {string} URL complète pour accéder au fichier
 */
export const getStorageUrl = (path) => {
  // Si le path est déjà une URL complète, la retourner directement
  if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }

  // Extraire le nom du fichier si c'est un chemin complet
  const fileName = path.includes('/') ? path.split('/').pop() : path;

  // Construire l'URL d'accès direct au stockage
  return `${API_BASE_URL}/storage/${path}`;
};

/**
 * Détermine le type de contenu à partir de l'extension du fichier
 *
 * @param {string} fileName - Nom du fichier avec extension
 * @returns {string} Type MIME approximatif ou 'application/octet-stream' par défaut
 */
export const getContentType = (fileName) => {
  if (!fileName) return 'application/octet-stream';

  const extension = fileName.split('.').pop().toLowerCase();

  const mimeTypes = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'mp3': 'audio/mpeg',
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'webm': 'video/webm',
    'txt': 'text/plain',
    'html': 'text/html',
    'csv': 'text/csv',
    'json': 'application/json',
    'zip': 'application/zip',
  };

  return mimeTypes[extension] || 'application/octet-stream';
};
