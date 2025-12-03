import UserProfile from "../../components/shared/user-profile"

export default function TeacherProfilePage() {
  // Sample teacher data
  const teacherData = {
    id: 2,
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
    website: "https://johnsmith.dev",
    bio: "Web development instructor with over 10 years of industry experience. I specialize in front-end technologies and love helping students transform their ideas into functional, beautiful web applications.",
    joinDate: "June 2020",
    title: "Web Development Instructor",
    skills: [
      { name: "JavaScript", level: 95 },
      { name: "React", level: 90 },
      { name: "Node.js", level: 85 },
      { name: "UI/UX Design", level: 80 },
    ],
    certificates: [
      {
        id: 1,
        title: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "January 2022",
        url: "#",
      },
    ],
    courses: [
      {
        id: 1,
        title: "UI/UX Design Fundamentals",
        enrolled: "458 students",
        progress: 100,
        image: "/placeholder.svg?height=160&width=320",
        category: "Design",
      },
      {
        id: 2,
        title: "Advanced JavaScript",
        enrolled: "372 students",
        progress: 100,
        image: "/placeholder.svg?height=160&width=320",
        category: "Programming",
      },
      {
        id: 3,
        title: "Web Design Fundamentals",
        enrolled: "512 students",
        progress: 100,
        image: "/placeholder.svg?height=160&width=320",
        category: "Web Development",
      },
    ],
    experience: [
      {
        id: 1,
        title: "Senior Web Developer",
        company: "TechCorp Inc.",
        location: "New York, NY",
        startDate: "2015",
        endDate: "2020",
        description: "Led a team of 5 developers in building and maintaining web applications for enterprise clients.",
        current: false,
      },
      {
        id: 2,
        title: "Web Developer",
        company: "Digital Solutions",
        location: "Boston, MA",
        startDate: "2012",
        endDate: "2015",
        description: "Developed responsive websites and web applications for clients across various industries.",
        current: false,
      },
    ],
    education: [
      {
        id: 1,
        degree: "Master's in Computer Science",
        institution: "University of Technology",
        location: "New York, NY",
        startDate: "2008",
        endDate: "2010",
        description: "Specialized in Web Technologies and Human-Computer Interaction.",
        current: false,
      },
    ],
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/johnsmith", icon: "Linkedin" },
      { platform: "GitHub", url: "https://github.com/johnsmith", icon: "Github" },
      { platform: "Twitter", url: "https://twitter.com/johnsmith", icon: "Twitter" },
    ],
    stats: {
      totalStudents: {
        value: "1,245",
        label: "Total Students",
        icon: "Users",
      },
      coursesCreated: {
        value: 12,
        label: "Courses Created",
        icon: "BookOpen",
      },
      avgRating: {
        value: "4.8",
        label: "Average Rating",
        icon: "Star",
      },
      totalRevenue: {
        value: "$24,568",
        label: "Total Revenue",
        change: "+15% from last month",
        icon: "DollarSign",
      },
    },
  }

  return (
    <UserProfile
      userRole="teacher"
      userData={teacherData}
      backLink="/teacher/dashboard"
      backLabel="Back to Dashboard"
      onSave={(data) => console.log("Saving profile data:", data)}
    />
  )
}

