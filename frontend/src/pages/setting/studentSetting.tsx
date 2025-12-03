import UserSettings from "../../components/shared/user-settings"

export default function StudentSettingsPage() {
 
  const studentData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+1 (555) 123-4567",
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
        description: "Advanced JavaScript Course",
        amount: "$94.99",
        status: "completed" as const,
      },
      {
        id: "tr_2",
        date: "Jan 10, 2023",
        description: "UI/UX Design Masterclass",
        amount: "$89.99",
        status: "completed" as const,
      },
    ],
    notificationSettings: [
      {
        id: "not_1",
        type: "Course Updates",
        description: "Receive notifications when your courses are updated",
        email: true,
        push: true,
      },
      {
        id: "not_2",
        type: "Assignment Reminders",
        description: "Get reminders about upcoming assignments",
        email: true,
        push: true,
      },
    ],
  }

  return (
    <UserSettings
      userRole="student"
      userData={studentData}
      backLink="/student/dashboard"
      backLabel="Back to Dashboard"
      onSave={(data) => console.log("Saving settings data:", data)}
    />
  )
}

