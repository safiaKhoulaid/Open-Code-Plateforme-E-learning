import React from 'react';
import { useEnrolledStudents } from '@/hooks/useEnrolledStudents';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EnrolledStudentsProps {
  courseId: string;
}

export const EnrolledStudents: React.FC<EnrolledStudentsProps> = ({ courseId }) => {
  const { students, loading, error } = useEnrolledStudents(courseId);

  if (loading) {
    return <div>Chargement des étudiants...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Étudiants inscrits</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead>Progression</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  {format(new Date(student.enrollment_date), 'PPP', { locale: fr })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={student.progress} className="w-[100px]" />
                    <span>{student.progress}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}; 