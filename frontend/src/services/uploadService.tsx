import axios from 'axios';
import { useState } from 'react';

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      console.error('Aucun fichier sélectionné');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file); // 'file' doit correspondre au nom attendu par Laravel
    formData.append('type', 'lesson'); // Données supplémentaires si nécessaire

    try {
      const response = await axios.post(
        '/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Si authentification
          }
        }
      );
      console.log('Fichier uploadé:', response.data);
    } catch (error) {
      console.error('Erreur:', error.response?.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
      <button type="submit">Upload</button>
    </form>
  );
}