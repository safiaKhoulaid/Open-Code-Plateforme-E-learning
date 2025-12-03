import { useState, useEffect } from "react";
import axiosClient from "@/api/axios";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

interface TeacherProfile {
  id: number;
  user_id: number;
  firstName: string;
  lastName: string;
  // Autres champs du profil...
}

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  created_at: string;
  is_approved: boolean;
  profile: TeacherProfile;
}

export default function PendingTeachers() {
  const [pendingTeachers, setPendingTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Charger les enseignants en attente lors du chargement du composant
  useEffect(() => {
    fetchPendingTeachers();
  }, []);

  // Récupérer les enseignants en attente
  const fetchPendingTeachers = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/api/admin/pending-teachers');
      setPendingTeachers(response.data.pendingTeachers || response.data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des enseignants en attente:", err);
      setError("Impossible de charger les enseignants en attente. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  // Approuver un enseignant
  const approveTeacher = async (teacherId: number) => {
    try {
      setProcessingIds(prev => [...prev, teacherId]);
      
      await axiosClient.post(`/api/admin/approve-teacher/${teacherId}`);
      
      // Mise à jour de la liste sans rechargement complet
      setPendingTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
      
      // Notification de succès
      Swal.fire({
        title: "Enseignant approuvé",
        text: "L'enseignant a été approuvé avec succès",
        icon: "success",
        confirmButtonColor: "#ff9500",
      });
    } catch (err) {
      console.error("Erreur lors de l'approbation de l'enseignant:", err);
      
      // Notification d'erreur
      Swal.fire({
        title: "Erreur",
        text: "Une erreur est survenue lors de l'approbation de l'enseignant",
        icon: "error",
        confirmButtonColor: "#ff9500",
      });
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== teacherId));
    }
  };

  // Confirmer l'approbation
  const confirmApproval = (teacher: Teacher) => {
    Swal.fire({
      title: "Confirmer l'approbation",
      html: `Voulez-vous vraiment approuver <strong>${teacher.firstName} ${teacher.lastName}</strong> en tant qu'enseignant ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ff9500",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, approuver",
      cancelButtonText: "Annuler"
    }).then((result) => {
      if (result.isConfirmed) {
        approveTeacher(teacher.id);
      }
    });
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Afficher un message de chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff9500]" />
        <span className="ml-2 text-lg">Chargement des enseignants en attente...</span>
      </div>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <XCircle className="h-6 w-6 inline mr-2" />
        {error}
      </div>
    );
  }

  // Afficher un message si aucun enseignant en attente
  if (pendingTeachers.length === 0) {
    return (
      <div className="bg-green-50 text-green-600 p-6 rounded-lg text-center">
        <CheckCircle className="h-12 w-12 mx-auto mb-2" />
        <h3 className="text-lg font-medium">Tous les enseignants ont été approuvés</h3>
        <p className="mt-1">Il n'y a actuellement aucun enseignant en attente d'approbation.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Enseignants en attente d'approbation</h2>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom & Prénom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingTeachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell className="font-medium">
                  {teacher.firstName} {teacher.lastName}
                </TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{formatDate(teacher.created_at)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => confirmApproval(teacher)}
                    disabled={processingIds.includes(teacher.id)}
                    className="bg-[#ff9500] hover:bg-[#e68600]"
                    size="sm"
                  >
                    {processingIds.includes(teacher.id) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        En cours...
                      </>
                    ) : (
                      'Approuver'
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 