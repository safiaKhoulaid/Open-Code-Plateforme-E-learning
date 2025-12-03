import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Edit,
  Save,
  ArrowLeft,
  Star,
  Award,
  BookOpen,
  Users,
  GraduationCap,
  MessageSquare,
  LinkIcon,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Plus,
} from "lucide-react";
import { Profile as DashboardProfile } from "@/types/dashboard";
import { ProfileResponse, UserSettings } from "@/types/profile";

type UserRole = "student" | "teacher" | "admin";
interface UserProfileProps {
  userRole: UserRole;
  userData: DashboardProfile;
  backLink?: string;
  backLabel?: string;
  onSave?: (data: Record<string, unknown>) => void;
  readOnly?: boolean;
}
interface Skill {
  name: string;
  level: number;
}

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  url?: string;
}

interface Course {
  id: number;
  title: string;
  progress: number;
  image: string;
  category: string;
  instructor?: string;
  enrolled?: string;
  rating?: number;
  reviews?: number;
}

interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  current: boolean;
}

interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  current: boolean;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}
const user = JSON.parse(localStorage.getItem("auth-storage") || "{}").state
  ?.user;
interface UserProfileProps {
  userRole: UserRole;
  userData: {
    id: number;
    user_id: number;
    instagramLink: string;
    discordLink: string;
    linkdenLink: string;
    profilePicture: string;
    biography?: string;

    skills?: Skill[];
  };
  backLink?: string;
  backLabel?: string;
  onSave?: (data: Record<string, unknown>) => void;
  readOnly?: boolean;
}

// Helper function to get the proper social media icon
const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "facebook":
      return Facebook;
    case "twitter":
      return Twitter;
    case "linkedin":
      return Linkedin;
    case "github":
      return Github;
    case "instagram":
      return Instagram;
    case "youtube":
      return Youtube;
    default:
      return LinkIcon;
  }
};

export default function UserProfile({
  userRole,
  userData,
  backLink = `/dashboard-${userRole}`,
  backLabel = "Back to Dashboard",
  onSave,
  readOnly = false,
}: UserProfileProps) {
  // Use the useProfile hook with the userData prop
  // const { profile: profileData, loading } = useProfile(userData);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  console.log(userData);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserSettings>({
    biography: userData?.biography || "",
    profilePicture: userData?.profilePicture || "",
    // Handle potentially missing properties
    linkdenLink: (userData as any)?.linkdenLink || "",
    instagramLink: (userData as any)?.instagramLink || "",
    discordLink: (userData as any)?.discordLink || "",
    avatar: null as File | null,
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    phone: userData?.phone || "",
    website: userData?.website || "",
    location: userData?.location || "",
    email: userData?.email || "",
  });

  // Handle file change for profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        avatar: file,
        // Create a temporary URL for preview
        profilePicture: file,
      }));
    }
  };

  // Update formData when profileData changes
  useEffect(() => {
    if (profile) {
      setFormData({
        biography: profile.biography || "",
        profilePicture: formData.profilePicture || "",
        linkdenLink: (formData as any)?.linkdenLink || "",
        instagramLink: (formData as any)?.instagramLink || "",
        discordLink: (formData as any)?.discordLink || "",
        avatar: null,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: userData?.phone || "",
        website: userData?.website || "",
        location: userData?.location || "",
        email: userData?.email || "",
      });
    }
  }, [profile]);

  const user = JSON.parse(localStorage.getItem("auth-storage") || "{}").state
    ?.user;
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (onSave) {
      // Copier toutes les données importantes depuis userData si elles ne sont pas dans le formData
      const dataToSave = {
        ...formData,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: userData?.email || formData.email || "",
        phone: formData.phone || userData?.phone || "",
        website: formData.website || userData?.website || "",
        location: formData.location || userData?.location || "",
        biography: formData.biography || userData?.biography || "",
      };
      
      console.log("Données à sauvegarder:", dataToSave);
      onSave(dataToSave);
    }
    setIsEditing(false);
  };

  // Determine which sections to show based on user role
  const showCourses = userRole === "student" || userRole === "teacher";
  const showTeaching = userRole === "teacher";
  const showExperience = userRole === "teacher" || userRole === "admin";
  const showEducation = userRole === "teacher" || userRole === "student";
  const showCertificates = userRole === "student" || userRole === "teacher";
  const showStats = true; // All roles have stats, but different ones

  return (
    <div className="min-h-screen bg-[#f7f7f8] font-sans text-[#262626]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to={backLink}
                className="mr-4 flex items-center text-[#4c4c4d] hover:text-[#262626]"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="ml-2">{backLabel}</span>
              </Link>
              <h1 className="text-xl font-bold md:text-2xl">Profile</h1>
            </div>
            {!readOnly && (
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="flex items-center rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90"
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col items-center md:flex-row md:items-start">
              <div className="relative mb-6 md:mb-0 md:mr-8">
                <img
                  src={formData.profilePicture || userData.profilePicture}
                  alt={userData.name || `${userData.firstName} ${userData.lastName}`}
                  className="h-40 w-40 rounded-full object-cover"
                />
                {isEditing && (
                  <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute bottom-2 right-2 rounded-full bg-[#ff9500] p-2 text-white hover:bg-[#ff9500]/90"
                  />
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={user.firstName}
                    onChange={handleInputChange}
                    className="mb-1 w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 text-2xl font-bold focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500] md:text-3xl"
                  />
                ) : (
                  <h2 className="text-2xl font-bold md:text-3xl">
                    {userData.name}
                  </h2>
                )}

                {isEditing ? (
                  <input
                    type="text"
                    name="title"
                    value={formData.job}
                    onChange={handleInputChange}
                    placeholder={
                      userRole === "teacher"
                        ? "Your title (e.g. Web Development Instructor)"
                        : "Your title (e.g. Software Engineer)"
                    }
                    className="mb-2 w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 text-lg text-[#4c4c4d] focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                  />
                ) : (
                  userData.title && (
                    <p className="text-lg text-[#4c4c4d]">{userData.title}</p>
                  )
                )}

                <div className="mt-2 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  {userData.location && (
                    <div className="flex items-center text-[#4c4c4d]">
                      <MapPin className="mr-1 h-4 w-4" />
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="rounded-md border border-[#f1f1f3] bg-white px-2 py-1 text-sm focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                        />
                      ) : (
                        <span>{userData.location}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center text-[#4c4c4d]">
                    <Mail className="mr-1 h-4 w-4" />
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="rounded-md border border-[#f1f1f3] bg-white px-2 py-1 text-sm focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      />
                    ) : (
                      <span>{userData.email}</span>
                    )}
                  </div>

                  {(userData.phone || isEditing) && (
                    <div className="flex items-center text-[#4c4c4d]">
                      <Phone className="mr-1 h-4 w-4" />
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="rounded-md border border-[#f1f1f3] bg-white px-2 py-1 text-sm focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                        />
                      ) : (
                        <span>{userData.phone}</span>
                      )}
                    </div>
                  )}

                  {(userData.website || isEditing) && (
                    <div className="flex items-center text-[#4c4c4d]">
                      <Globe className="mr-1 h-4 w-4" />
                      {isEditing ? (
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="rounded-md border border-[#f1f1f3] bg-white px-2 py-1 text-sm focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                        />
                      ) : (
                        <a
                          href={userData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#ff9500] hover:underline"
                        >
                          {userData.website?.replace(/(^\w+:|^)\/\//, "")}
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {userData.skills && userData.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                    {userData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-[#fff4e5] px-3 py-1 text-sm text-[#ff9500]"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {isEditing && (
                      <button className="rounded-full border border-dashed border-[#ff9500] px-3 py-1 text-sm text-[#ff9500]">
                        + Add Skill
                      </button>
                    )}
                  </div>
                )}

                {userData.stats && Object.keys(userData.stats).length > 0 && (
                  <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
                    {Object.entries(userData.stats).map(([key, stat]) => (
                      <div
                        key={key}
                        className="flex flex-col items-center rounded-lg bg-[#f7f7f8] px-4 py-2 md:items-start"
                      >
                        <span className="text-sm text-[#4c4c4d]">
                          {stat.label}
                        </span>
                        <span className="text-xl font-bold">{stat.value}</span>
                        {stat.change && (
                          <span className="text-xs text-green-500">
                            {stat.change}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="border-b border-[#f1f1f3] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("about")}
              className={`border-b-2 px-4 py-4 font-medium ${
                activeTab === "about"
                  ? "border-[#ff9500] text-[#ff9500]"
                  : "border-transparent text-[#4c4c4d] hover:text-[#262626]"
              }`}
            >
              About
            </button>

            {showCourses && (
              <button
                onClick={() => setActiveTab("courses")}
                className={`border-b-2 px-4 py-4 font-medium ${
                  activeTab === "courses"
                    ? "border-[#ff9500] text-[#ff9500]"
                    : "border-transparent text-[#4c4c4d] hover:text-[#262626]"
                }`}
              >
                {userRole === "teacher" ? "My Courses" : "Enrolled Courses"}
              </button>
            )}

            {showTeaching && (
              <button
                onClick={() => setActiveTab("teaching")}
                className={`border-b-2 px-4 py-4 font-medium ${
                  activeTab === "teaching"
                    ? "border-[#ff9500] text-[#ff9500]"
                    : "border-transparent text-[#4c4c4d] hover:text-[#262626]"
                }`}
              >
                Teaching
              </button>
            )}

            {showExperience && (
              <button
                onClick={() => setActiveTab("experience")}
                className={`border-b-2 px-4 py-4 font-medium ${
                  activeTab === "experience"
                    ? "border-[#ff9500] text-[#ff9500]"
                    : "border-transparent text-[#4c4c4d] hover:text-[#262626]"
                }`}
              >
                Experience
              </button>
            )}

            {showEducation && (
              <button
                onClick={() => setActiveTab("education")}
                className={`border-b-2 px-4 py-4 font-medium ${
                  activeTab === "education"
                    ? "border-[#ff9500] text-[#ff9500]"
                    : "border-transparent text-[#4c4c4d] hover:text-[#262626]"
                }`}
              >
                Education
              </button>
            )}

            {showCertificates && (
              <button
                onClick={() => setActiveTab("certificates")}
                className={`border-b-2 px-4 py-4 font-medium ${
                  activeTab === "certificates"
                    ? "border-[#ff9500] text-[#ff9500]"
                    : "border-transparent text-[#4c4c4d] hover:text-[#262626]"
                }`}
              >
                Certificates
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* About Tab */}
        {activeTab === "about" && (
          <div className="space-y-8">
            <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">About Me</h2>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.biography}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 text-[#4c4c4d] focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                  placeholder="Tell us about yourself..."
                ></textarea>
              ) : (
                <div className="space-y-4 text-[#4c4c4d]">
                  {userData.biography ? (
                    <p>{userData.biography}</p>
                  ) : (
                    <p className="text-[#4c4c4d] italic">
                      No bio information available.
                    </p>
                  )}
                </div>
              )}
            </div>

            {userData.socialLinks && userData.socialLinks.length > 0 && (
              <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Social Profiles</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {userData.socialLinks.map((link, index) => {
                    const IconComponent = getSocialIcon(link.platform);
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center rounded-lg border border-[#f1f1f3] p-3 hover:bg-[#f7f7f8]"
                      >
                        <IconComponent className="mr-3 h-5 w-5 text-[#ff9500]" />
                        <span className="font-medium">{link.platform}</span>
                      </a>
                    );
                  })}
                  {isEditing && (
                    <button className="flex items-center justify-center rounded-lg border border-dashed border-[#f1f1f3] p-3 text-[#4c4c4d] hover:bg-[#f7f7f8]">
                      + Add Social Profile
                    </button>
                  )}
                </div>
              </div>
            )}

            {userData.skills && userData.skills.length > 0 && (
              <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-bold">Skills & Expertise</h2>
                <div className="space-y-4">
                  {userData.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <span>{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-[#f1f1f3]">
                        <div
                          className="h-2 rounded-full bg-[#ff9500]"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && userData.courses && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {userRole === "teacher" ? "My Courses" : "Enrolled Courses"}
              </h2>
              {userRole === "teacher" && (
                <button className="rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90">
                  Create New Course
                </button>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userData.courses.map((course) => (
                <div
                  key={course.id}
                  className="overflow-hidden rounded-lg border border-[#f1f1f3] bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative h-48 bg-[#f7f7f8]">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                    {userRole === "student" && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="absolute bottom-4 left-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(course.rating || 0)
                                      ? "fill-[#ff9500] text-[#ff9500]"
                                      : "text-[#f1f1f3]"
                                  }`}
                                />
                              ))}
                            </div>
                            {course.rating && (
                              <span className="text-xs font-medium text-white">
                                {course.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-full bg-[#fff4e5] px-2 py-1 text-xs text-[#ff9500]">
                        {course.category}
                      </span>
                      {userRole === "teacher" && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                          Published
                        </span>
                      )}
                    </div>
                    <h3 className="mb-2 text-lg font-bold">{course.title}</h3>
                    {userRole === "student" && course.instructor && (
                      <p className="mb-3 text-sm text-[#4c4c4d]">
                        Instructor: {course.instructor}
                      </p>
                    )}
                    {userRole === "teacher" && (
                      <div className="mb-3 flex items-center text-sm text-[#4c4c4d]">
                        <Users className="mr-1 h-4 w-4" />
                        <span>{course.enrolled || "0"} students</span>
                      </div>
                    )}
                    {userRole === "student" &&
                      typeof course.progress === "number" && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#4c4c4d]">Progress</span>
                            <span className="font-medium">
                              {course.progress}% complete
                            </span>
                          </div>
                          <div className="mt-1 h-2 w-full rounded-full bg-[#f1f1f3]">
                            <div
                              className="h-2 rounded-full bg-[#ff9500]"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    <div className="flex justify-between">
                      <button className="rounded-md border border-[#f1f1f3] bg-white px-3 py-1.5 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                        {userRole === "teacher"
                          ? "Edit Course"
                          : "Continue Learning"}
                      </button>
                      <button className="rounded-md border border-[#f1f1f3] bg-white px-3 py-1.5 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                        {userRole === "teacher" ? "View Stats" : "View Details"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teaching Tab (for teachers) */}
        {activeTab === "teaching" && userRole === "teacher" && (
          <div className="space-y-8">
            <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold">Teaching Philosophy</h2>
              <div className="space-y-4 text-[#4c4c4d]">
                <p>
                  My teaching philosophy is centered around three core
                  principles: practical application, continuous learning, and
                  supportive community.
                </p>
                <div className="mt-4 grid gap-6 md:grid-cols-3">
                  <div className="rounded-lg bg-[#f7f7f8] p-4">
                    <h3 className="mb-2 font-medium">Practical Application</h3>
                    <p className="text-sm">
                      I believe in learning by doing. My courses include
                      real-world projects that help you apply what you've
                      learned and build a portfolio of work.
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#f7f7f8] p-4">
                    <h3 className="mb-2 font-medium">Continuous Learning</h3>
                    <p className="text-sm">
                      Technology evolves rapidly, and I'm committed to keeping
                      my courses up-to-date with the latest trends and best
                      practices.
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#f7f7f8] p-4">
                    <h3 className="mb-2 font-medium">Supportive Community</h3>
                    <p className="text-sm">
                      Learning is better together. I foster a supportive
                      community where students can ask questions, share ideas,
                      and collaborate on projects.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold">Teaching Statistics</h2>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                <div className="rounded-lg bg-[#f7f7f8] p-4 text-center">
                  <div className="mb-2 flex justify-center">
                    <Users className="h-8 w-8 text-[#ff9500]" />
                  </div>
                  <h3 className="text-2xl font-bold">1,245</h3>
                  <p className="text-sm text-[#4c4c4d]">Total Students</p>
                </div>
                <div className="rounded-lg bg-[#f7f7f8] p-4 text-center">
                  <div className="mb-2 flex justify-center">
                    <BookOpen className="h-8 w-8 text-[#ff9500]" />
                  </div>
                  <h3 className="text-2xl font-bold">12</h3>
                  <p className="text-sm text-[#4c4c4d]">Courses Created</p>
                </div>
                <div className="rounded-lg bg-[#f7f7f8] p-4 text-center">
                  <div className="mb-2 flex justify-center">
                    <Star className="h-8 w-8 text-[#ff9500]" />
                  </div>
                  <h3 className="text-2xl font-bold">4.8</h3>
                  <p className="text-sm text-[#4c4c4d]">Average Rating</p>
                </div>
                <div className="rounded-lg bg-[#f7f7f8] p-4 text-center">
                  <div className="mb-2 flex justify-center">
                    <MessageSquare className="h-8 w-8 text-[#ff9500]" />
                  </div>
                  <h3 className="text-2xl font-bold">3,450</h3>
                  <p className="text-sm text-[#4c4c4d]">Q&A Responses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === "experience" && userData.experience && (
          <div className="space-y-8">
            <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold">Work Experience</h2>
              <div className="space-y-8">
                {userData.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative border-l-2 border-[#f1f1f3] pl-6"
                  >
                    <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-[#ff9500]"></div>
                    <div className="mb-2 flex flex-col justify-between sm:flex-row sm:items-center">
                      <h3 className="font-bold">{exp.title}</h3>
                      <span className="mt-1 inline-block rounded-full bg-[#fff4e5] px-3 py-1 text-sm text-[#ff9500] sm:mt-0">
                        {exp.startDate} -{" "}
                        {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p className="mb-1 text-[#4c4c4d]">{exp.company}</p>
                    <p className="mb-1 text-sm text-[#4c4c4d]">
                      {exp.location}
                    </p>
                    <p className="text-[#4c4c4d]">{exp.description}</p>
                  </div>
                ))}
                {isEditing && (
                  <button className="flex w-full items-center justify-center rounded-lg border border-dashed border-[#f1f1f3] p-4 text-[#4c4c4d] hover:bg-[#f7f7f8]">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Add Work Experience
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Education Tab */}
        {activeTab === "education" && userData.education && (
          <div className="space-y-8">
            <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold">Education</h2>
              <div className="space-y-8">
                {userData.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="relative border-l-2 border-[#f1f1f3] pl-6"
                  >
                    <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-[#ff9500]"></div>
                    <div className="mb-2 flex flex-col justify-between sm:flex-row sm:items-center">
                      <h3 className="font-bold">{edu.degree}</h3>
                      <span className="mt-1 inline-block rounded-full bg-[#fff4e5] px-3 py-1 text-sm text-[#ff9500] sm:mt-0">
                        {edu.startDate} -{" "}
                        {edu.current ? "Present" : edu.endDate}
                      </span>
                    </div>
                    <p className="mb-1 text-[#4c4c4d]">{edu.institution}</p>
                    <p className="mb-1 text-sm text-[#4c4c4d]">
                      {edu.location}
                    </p>
                    {edu.description && (
                      <p className="text-[#4c4c4d]">{edu.description}</p>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button className="flex w-full items-center justify-center rounded-lg border border-dashed border-[#f1f1f3] p-4 text-[#4c4c4d] hover:bg-[#f7f7f8]">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Add Education
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === "certificates" && userData.certificates && (
          <div className="space-y-8">
            <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold">
                Certificates & Credentials
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userData.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="rounded-lg border border-[#f1f1f3] p-4"
                  >
                    <div className="mb-2 flex items-center">
                      <Award className="mr-2 h-5 w-5 text-[#ff9500]" />
                      <h3 className="font-medium">{cert.title}</h3>
                    </div>
                    <p className="text-sm text-[#4c4c4d]">{cert.issuer}</p>
                    <p className="mt-1 text-xs text-[#4c4c4d]">
                      Issued: {cert.date}
                    </p>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-[#ff9500] hover:underline"
                      >
                        View Certificate
                      </a>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button className="flex h-full min-h-[120px] w-full items-center justify-center rounded-lg border border-dashed border-[#f1f1f3] p-4 text-[#4c4c4d] hover:bg-[#f7f7f8]">
                    <Award className="mr-2 h-5 w-5" />
                    Add Certificate
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
