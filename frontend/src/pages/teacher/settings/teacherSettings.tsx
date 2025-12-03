import UserSettings from "../../../components/shared/user-settings"

export default function TeacherSettings() {
  // Sample teacher data
  const teacherData = {
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+1 (555) 987-6543",
    paymentMethods: [
      {
        id: "1",
        type: "Bank Account",
        last4: "1234",
        expiryDate: "N/A",
        isDefault: true,
      },
    ],
    transactions: [
      {
        id: "1",
        date: "2024-03-15",
        description: "Course Revenue - Complete Web Development Bootcamp",
        amount: "$499.99",
        status: "completed",
      },
    ],
    notificationSettings: [
      {
        id: "1",
        type: "student_enrollments",
        description: "New Student Enrollments",
        email: true,
        push: true,
      },
      {
        id: "2",
        type: "course_completions",
        description: "Course Completions",
        email: true,
        push: true,
      },
      {
        id: "3",
        type: "student_messages",
        description: "Student Messages",
        email: true,
        push: true,
      },
      {
        id: "4",
        type: "course_reviews",
        description: "Course Reviews",
        email: true,
        push: true,
      },
      {
        id: "5",
        type: "revenue_updates",
        description: "Revenue Updates",
        email: true,
        push: false,
      },
    ],
  }

  return (
    <UserSettings
      userRole="teacher"
      userData={teacherData}
      backLink="/teacher/dashboard"
      backLabel="Retour au tableau de bord"
      onSave={(data) => console.log("Saving settings data:", data)}
    />
  )
} 