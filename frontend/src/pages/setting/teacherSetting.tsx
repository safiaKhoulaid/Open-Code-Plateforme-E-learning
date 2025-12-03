import UserSettings from "../../components/shared/user-settings"


export default function TeacherSettingsPage() {
  // Sample teacher data
  const teacherData: {
    name: string
    email: string
    avatar: string
    phone: string
    paymentMethods: {
      id: string
      type: string
      last4: string
      expiryDate: string
      isDefault: boolean
    }[]
    transactions: {
      id: string
      date: string
      description: string
      amount: string
      status: "completed" | "pending" | "refunded"
    }[]
    notificationSettings: {
      id: string
      type: string
      description: string
      email: boolean
      push: boolean
    }[]
  } = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+1 (555) 987-6543",
    paymentMethods: [
      {
        id: "pm_1",
        type: "Visa",
        last4: "4242",
        expiryDate: "12/2025",
        isDefault: true,
      },
    ],
    transactions: [
      {
        id: "tr_1",
        date: "Mar 15, 2023",
        description: "Platform Fee",
        amount: "$29.99",
        status: "completed",
      },
      {
        id: "tr_2",
        date: "Feb 15, 2023",
        description: "Platform Fee",
        amount: "$29.99",
        status: "completed",
      },
    ],
    notificationSettings: [
      {
        id: "not_1",
        type: "Student Enrollments",
        description: "Receive notifications when new students enroll in your courses",
        email: true,
        push: true,
      },
      {
        id: "not_2",
        type: "Course Reviews",
        description: "Receive notifications when students leave reviews on your courses",
        email: true,
        push: true,
      },
    ],
  }

  return (
    <UserSettings
      userRole="teacher"
      userData={teacherData}
      backLink="/teacher/dashboard"
      backLabel="Back to Dashboard"
      onSave={(data) => console.log("Saving settings data:", data)}
    />
  )
}

