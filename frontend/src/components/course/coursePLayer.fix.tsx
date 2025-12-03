import React, { useRef } from 'react';
import axiosClient from '../../services/axiosClient';
import { useAuth } from '../../contexts/AuthContext';
import { Download } from 'lucide-react';

const CoursePlayer = () => {
  const { token } = useAuth();
  const videoRef = useRef(null);

  const handleLessonDetails = async (id, sectionId, currentLessonId) => {
    try {
      const response = await axiosClient.get(
        `/api/courses/${id}/sections/${sectionId}/lessons/${currentLessonId}/watch`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Important pour les cookies CSRF avec Sanctum
        }
      );

      const data = response.data;
      console.log("data", data);

      // Handle lesson details
    } catch (error) {
      console.error("Error fetching lesson details:", error);
    }
  };

  const handleVideo = (id, sectionId, currentLessonId) => {
    // Implementation of handleVideo function
  };

  const handlePDF = (id, sectionId, currentLessonId) => {
    // Implementation of handlePDF function
  };

  const handleResource = (resource) => {
    // Implementation of handleResource function
  };

  return (
    <div>
      {/* Rest of the component code */}
    </div>
  );
};

export default CoursePlayer; 