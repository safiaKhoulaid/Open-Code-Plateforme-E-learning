import UserSettings from "../../../components/shared/user-settings"

export default function StudentSettings() {
  // Sample student data
  const studentData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+1 (555) 123-4567",
    paymentMethods: [
      {
        id: "1",
        type: "Visa",
        last4: "4242",
        expiryDate: "12/24",
        isDefault: true,
      },
    ],
    transactions: [
      {
        id: "1",
        date: "2024-03-15",
        description: "Course Purchase - Complete Web Development Bootcamp",
        amount: "$49.99",
        status: "completed",
      },
    ],
    notificationSettings: [
      {
        id: "1",
        type: "course_updates",
        description: "Course Updates",
        email: true,
        push: true,
      },
      {
        id: "2",
        type: "assignments",
        description: "Assignment Reminders",
        email: true,
        push: true,
      },
      {
        id: "3",
        type: "certificates",
        description: "Certificate Availability",
        email: true,
        push: true,
      },
      {
        id: "4",
        type: "instructor_messages",
        description: "Instructor Messages",
        email: true,
        push: true,
      },
      {
        id: "5",
        type: "course_reviews",
        description: "Course Review Reminders",
        email: true,
        push: false,
      },
    ],
  }

  return (
    <UserSettings
      userRole="student"
      userData={studentData}
      backLink="/student/dashboard"
      backLabel="Retour au tableau de bord"
      onSave={(data) => console.log("Saving settings data:", data)}
    />
  )
} 