import UserProfile from "@/components/shared/user-profile"
import { useProfile } from "@/hooks/useProfile"
import { useEffect, useState } from "react"
import { ProfileResponse } from "@/types/profile"

export default function StudentProfile({ dashboardDataProfile }) {
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile()
  const [studentData, setStudentData] = useState<ProfileResponse | null>(null)
  const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;

  useEffect(() => {
    // Récupérer les données du profil de l'utilisateur
    const getProfile = async () => {
      await fetchProfile();
    };
    
    if (!profile) {
      getProfile();
    }
    
    if (profile) {
      setStudentData({
        id: profile.id,
        user_id: profile.user_id,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        name: `${user?.firstName || ''} ${user?.lastName || ''}`,
        email: user?.email || '',
        profilPicture: profile.settings?.avatar || "/placeholder.svg?height=200&width=200",
        profilePicture: profile.settings?.avatar || "/placeholder.svg?height=200&width=200",
        biography: profile.biography || '',
        linkdebLink: profile.linkdebLink || '',
        instagramLink: profile.instagramLink || '',
        discordLink: profile.discordLink || '',
        phone: profile.phone || '',
        website: profile.website || '',
        location: profile.location || '',
        job: null,
        skills: profile.skills || null,
        certifications: null,
        experiences: null,
        education: null,
        created_at: profile.created_at || '',
        updated_at: profile.updated_at || ''
      });
    } else if (dashboardDataProfile) {
      // Use dashboard data as fallback
      setStudentData(dashboardDataProfile)
    }
  }, [profile, dashboardDataProfile])

  const handleSave = async (data) => {
    try {
      // Récupération des informations utilisateur
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
      
      // Construction des données complètes
      const updatedData = {
        ...data,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        // S'assurer que la biographie et autres champs ne sont pas perdus
        biography: data.biography || studentData?.biography || '',
        phone: data.phone || studentData?.phone || '',
        website: data.website || studentData?.website || '',
        location: data.location || studentData?.location || '',
        linkdenLink: data.linkdenLink || studentData?.linkdebLink || '',
        instagramLink: data.instagramLink || studentData?.instagramLink || '',
        discordLink: data.discordLink || studentData?.discordLink || ''
      };
      
      console.log("Données envoyées pour mise à jour:", updatedData);
      
      await updateProfile(updatedData);
      console.log("Profil mis à jour avec succès");
      
      // Rafraîchir les données
      await fetchProfile();
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
    }
  }

  if (loading || !studentData) {
    return <div className="p-4">Chargement du profil...</div>;
  }

  return (
    <UserProfile
      userRole="student"
      userData={studentData}
      backLink="/student/dashboard"
      backLabel="Retour au tableau de bord"
      onSave={handleSave}
    />
  )
} 

