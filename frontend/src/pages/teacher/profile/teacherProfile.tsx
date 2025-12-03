import UserProfile from "../../../components/shared/user-profile"
import { useProfile } from "../../../hooks/useProfile"
import { useEffect, useState, useCallback } from "react"

interface TeacherDataType {
  id: string | number;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  location: string;
  website: string;
  bio: string;
  joinDate: string;
  title: string;
  skills: any[];
  certificates: any[];
  courses: any[];
  experience: any[];
  education: any[];
  socialLinks: any[];
  stats: {
    coursesCreated: {
      value: number;
      label: string;
      icon: string;
    };
    studentsTaught: {
      value: string;
      label: string;
      icon: string;
    };
    averageRating: {
      value: string;
      label: string;
      icon: string;
    };
  };
}

export default function TeacherProfile() {
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile()
  const [teacherData, setTeacherData] = useState<TeacherDataType | null>(null)
  const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
  
  // Utiliser useEffect une seule fois pour charger les données initiales
  useEffect(() => {
    fetchProfile()
    // Ne pas inclure fetchProfile dans les dépendances pour éviter les appels multiples
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cet useEffect ne s'exécutera que lorsque profile change
  useEffect(() => {
    if (profile) {
      setTeacherData({
        id: profile.id || 0,
        name: user?.firstName || "",
        email: user?.email || "",
        avatar: profile.settings?.avatar || "/placeholder.svg?height=200&width=200",
        phone: profile.settings?.phone || "",
        location: profile.settings?.location || "",
        website: profile.settings?.website || "",
        bio: profile.settings?.bio || "",
        joinDate: profile.user?.created_at ? new Date(profile.user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : "",
        title: profile.settings?.title || "Enseignant",
        skills: profile.settings?.skills || [],
        certificates: profile.settings?.certificates || [],
        courses: profile.settings?.courses || [],
        experience: profile.settings?.experience || [],
        education: profile.settings?.education || [],
        socialLinks: profile.settings?.social_links || [],
        stats: profile.settings?.stats || {
          coursesCreated: {
            value: 0,
            label: "Cours créés",
            icon: "BookOpen",
          },
          studentsTaught: {
            value: "0",
            label: "Étudiants enseignés",
            icon: "Users",
          },
          averageRating: {
            value: "0",
            label: "Note moyenne",
            icon: "Star",
          },
        },
      })
    }
  }, [profile, user])

  const handleSave = async (data: any) => {
    try {
      await updateProfile(data)
      console.log("Profil mis à jour avec succès")
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
    }
  }

  if (loading) {
    return <div>Chargement du profil...</div>
  }

  if (error) {
    return <div>Erreur: {error}</div>
  }

  if (!teacherData) {
    return <div>Aucune donnée de profil disponible</div>
  }

  return (
    <UserProfile
      userRole="teacher"
      userData={teacherData}
      backLink="/teacher/dashboard"
      backLabel="Retour au tableau de bord"
      onSave={handleSave}
    />
  )
}
