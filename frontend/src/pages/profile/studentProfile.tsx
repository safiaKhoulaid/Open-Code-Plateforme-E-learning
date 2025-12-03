import UserProfile from "../../components/shared/user-profile"

export default function StudentProfilePage() {
  // Sample student data
  const studentData = {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "https://alexjohnson.dev",
    bio: "I'm a passionate learner focused on web development and design. Currently working through several courses to enhance my skills in React, Node.js, and UI/UX design.",
    joinDate: "January 2022",
    title: "Software Developer",
    skills: [
      { name: "JavaScript", level: 85 },
      { name: "React", level: 75 },
      { name: "HTML/CSS", level: 90 },
      { name: "Node.js", level: 65 },
    ],
    certificates: [
      {
        id: 1,
        title: "Advanced JavaScript",
        issuer: "Andrei Neagoie",
        date: "March 15, 2023",
        url: "#",
      },
      {
        id: 2,
        title: "UI/UX Design Fundamentals",
        issuer: "Daniel Walter Scott",
        date: "January 10, 2023",
        url: "#",
      },
    ],
    courses: [
      {
        id: 1,
        title: "Complete Web Development Bootcamp",
        instructor: "Dr. Angela Yu",
        progress: 65,
        image: "/placeholder.svg?height=160&width=320",
        category: "Web Development",
        rating: 4.8,
        reviews: 142,
      },
      {
        id: 2,
        title: "Advanced JavaScript Concepts",
        instructor: "Andrei Neagoie",
        progress: 100,
        image: "/placeholder.svg?height=160&width=320",
        category: "Programming",
        rating: 4.9,
        reviews: 95,
      },
      {
        id: 3,
        title: "UI/UX Design Masterclass",
        instructor: "Daniel Walter Scott",
        progress: 85,
        image: "/placeholder.svg?height=160&width=320",
        category: "Design",
        rating: 4.8,
        reviews: 156,
      },
    ],
    education: [
      {
        id: 1,
        degree: "Bachelor of Science in Computer Science",
        institution: "University of California",
        location: "Berkeley, CA",
        startDate: "2016",
        endDate: "2020",
        description: "Focused on software engineering and web technologies",
        current: false,
      },
    ],
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/alexjohnson", icon: "Linkedin" },
      { platform: "GitHub", url: "https://github.com/alexjohnson", icon: "Github" },
      { platform: "Twitter", url: "https://twitter.com/alexjohnson", icon: "Twitter" },
    ],
    stats: {
      coursesCompleted: {
        value: 5,
        label: "Courses Completed",
        icon: "BookOpen",
      },
      certificatesEarned: {
        value: 2,
        label: "Certificates Earned",
        icon: "Award",
      },
      hoursLearned: {
        value: "120+",
        label: "Hours of Learning",
        icon: "Clock",
      },
    },
  }

  return (
    <UserProfile
      userRole="student"
      userData={studentData}
      backLink="/student/dashboard"
      backLabel="Back to Dashboard"
      onSave={(data) => console.log("Saving profile data:", data)}
    />
  )
}

