import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/api/axios";

interface Course {
  id: number;
  title: string;
  status: string;
  price: number;
  created_at: string;
}

export const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Charger les cours
  const fetchCourses = async () => {
    try {
      const response = await axiosClient.get('/api/teacher/courses');
      setCourses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des cours:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les cours. Veuillez réessayer.",
      });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Changer le statut d'un cours
  const handleStatusChange = async (courseId: number, newStatus: string) => {
    try {
      await axiosClient.put(`/api/courses/${courseId}/status`, {
        status: newStatus
      });
      
      // Mettre à jour la liste des cours
      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, status: newStatus } : course
      ));

      toast({
        title: "Succès",
        description: "Le statut du cours a été mis à jour.",
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le statut du cours.",
      });
    }
  };

  // Supprimer un cours
  const handleDelete = async (courseId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      return;
    }

    try {
      await axiosClient.delete(`/api/courses/${courseId}`);
      
      // Mettre à jour la liste des cours
      setCourses(courses.filter(course => course.id !== courseId));

      toast({
        title: "Succès",
        description: "Le cours a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le cours.",
      });
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Gestion des Cours</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.title}</TableCell>
              <TableCell>
                <Select
                  defaultValue={course.status}
                  onValueChange={(value) => handleStatusChange(course.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{course.price} €</TableCell>
              <TableCell>
                {new Date(course.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(course.id)}
                >
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 