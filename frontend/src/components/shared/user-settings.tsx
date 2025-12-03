import type React from "react"
import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Bell,
  CreditCard,
  Edit,
  Globe,
  Lock,
  LogOut,
  Mail,
  Phone,
  Save,
  User,
  Shield,
  Eye,
  EyeOff,
  FileText,
  BookOpen,
} from "lucide-react"
import { Link } from "react-router-dom"
import { profileService } from "../../services/profileService"
import type { UserSettings as UserSettingsType, NotificationSettings, PaymentMethod, ProfileResponse } from "../../types/profile"

type UserRole = "student" | "teacher" | "admin"

interface Transaction {
  id: string
  date: string
  amount: number
  status: string
  description: string
}

interface NotificationSetting {
  id: string
  type: string
  description: string
  email: boolean
  push: boolean
  sms?: boolean
}

interface UserSettingsProps {
  userRole: UserRole
  userData: {
    name: string
    email: string
    avatar: string
    phone?: string
    paymentMethods?: PaymentMethod[]
    transactions?: Transaction[]
    notificationSettings?: NotificationSetting[]
  }
  backLink?: string
  backLabel?: string
  onSave?: (data: any) => void
}

export default function UserSettings({
  userRole,
  userData,
  backLink = "/dashboard",
  backLabel = "Back to Dashboard",
  onSave,
}: UserSettingsProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userSettings, setUserSettings] = useState<UserSettingsType | null>(null)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [activeTab, setActiveTab] = useState("profile")
  const [showAdminSettings, setShowAdminSettings] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const profileData = await profileService.getProfile()
        setUserSettings(profileData.user_settings)
        setNotificationSettings(profileData.notification_settings)
        setPaymentMethods(profileData.payment_methods)
        setShowAdminSettings(profileData.role === "admin")
        setError(null)
      } catch (err: unknown) {
        console.error("Erreur lors de la récupération des données du profil:", err)
        setError("Impossible de charger les données du profil. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleSaveProfile = async () => {
    if (!userSettings) return

    try {
      setIsSaving(true)
      setSaveSuccess(false)
      const updatedProfile = await profileService.updateProfile(userSettings)
      setUserSettings(updatedProfile.user_settings)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: unknown) {
      console.error("Erreur lors de la mise à jour du profil:", err)
      setError("Impossible de mettre à jour le profil. Veuillez réessayer plus tard.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNotificationSettings = async () => {
    if (!notificationSettings) return

    try {
      setIsSaving(true)
      setSaveSuccess(false)
      const updatedProfile = await profileService.updateNotificationSettings(notificationSettings)
      setNotificationSettings(updatedProfile.notification_settings)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: unknown) {
      console.error("Erreur lors de la mise à jour des paramètres de notification:", err)
      setError("Impossible de mettre à jour les paramètres de notification. Veuillez réessayer plus tard.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePaymentMethods = async () => {
    try {
      setIsSaving(true)
      setSaveSuccess(false)
      const updatedProfile = await profileService.updatePaymentMethods(paymentMethods)
      setPaymentMethods(updatedProfile.payment_methods)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: unknown) {
      console.error("Erreur lors de la mise à jour des méthodes de paiement:", err)
      setError("Impossible de mettre à jour les méthodes de paiement. Veuillez réessayer plus tard.")
    } finally {
      setIsSaving(false)
    }
  }

  // Determine which sections to show based on user role
  const showBilling = userRole === "student" || userRole === "teacher"
  const showCourseSettings = userRole === "student"
  const showTeachingSettings = userRole === "teacher"
  const isAdmin = userRole === "admin"

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#ff9500] border-t-transparent"></div>
          <p className="text-[#4c4c4d]">Chargement des paramètres...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-[#ff9500] px-4 py-2 text-white hover:bg-[#ff9500]/90"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] font-sans text-[#262626]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to={backLink} className="mr-4 flex items-center text-[#4c4c4d] hover:text-[#262626]">
                <ArrowLeft className="h-5 w-5" />
                <span className="ml-2">{backLabel}</span>
              </Link>
              <h1 className="text-xl font-bold md:text-2xl">Account Settings</h1>
            </div>
            {activeTab === "profile" && (
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </button>
            )}
            {activeTab === "notifications" && (
              <button
                onClick={handleSaveNotificationSettings}
                disabled={isSaving}
                className="flex items-center rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </button>
            )}
            {activeTab === "payment" && (
              <button
                onClick={handleSavePaymentMethods}
                disabled={isSaving}
                className="flex items-center rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </button>
            )}
            {saveSuccess && (
              <div className="fixed bottom-4 right-4 rounded-md bg-green-500 px-4 py-2 text-white">
                Modifications enregistrées avec succès
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="rounded-lg border border-[#f1f1f3] bg-white shadow-sm">
              <div className="border-b border-[#f1f1f3] p-4">
                <div className="flex items-center">
                  <img
                    src={userData.avatar || "/placeholder.svg?height=48&width=48"}
                    alt={userData.name}
                    className="mr-3 h-12 w-12 rounded-full"
                  />
                  <div>
                    <h2 className="font-medium">{userData.name}</h2>
                    <p className="text-sm text-[#4c4c4d]">{userData.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex w-full items-center rounded-md px-4 py-2 text-left ${
                    activeTab === "profile" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                  }`}
                >
                  <User className="mr-3 h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex w-full items-center rounded-md px-4 py-2 text-left ${
                    activeTab === "security" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                  }`}
                >
                  <Lock className="mr-3 h-5 w-5" />
                  <span>Security</span>
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`flex w-full items-center rounded-md px-4 py-2 text-left ${
                    activeTab === "notifications" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                  }`}
                >
                  <Bell className="mr-3 h-5 w-5" />
                  <span>Notifications</span>
                </button>
                {showBilling && (
                  <button
                    onClick={() => setActiveTab("billing")}
                    className={`flex w-full items-center rounded-md px-4 py-2 text-left ${
                      activeTab === "billing" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                    }`}
                  >
                    <CreditCard className="mr-3 h-5 w-5" />
                    <span>Billing</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveTab("language")}
                  className={`flex w-full items-center rounded-md px-4 py-2 text-left ${
                    activeTab === "language" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                  }`}
                >
                  <Globe className="mr-3 h-5 w-5" />
                  <span>Language & Region</span>
                </button>
                {showCourseSettings && (
                  <button
                    onClick={() => setActiveTab("learning")}
                    className={`flex w-full items-center rounded-md px-4 py-2 text-left ${
                      activeTab === "learning" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                    }`}
                  >
                    <BookOpen className="mr-3 h-5 w-5" />
                    <span>Learning Preferences</span>
                  </button>
                )}
                {showTeachingSettings && (
                  <button
                    onClick={() => setActiveTab("teaching")}
                    className={`flex w-full items-center rounded-md px-4 py-2 text-left ${
                      activeTab === "teaching" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                    }`}
                  >
                    <BookOpen className="mr-3 h-5 w-5" />
                    <span>Teaching Settings</span>
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => setActiveTab("admin")}
                    className={`flex w-full items-center rounded-md px-4 py-2 text-left ${
                      activeTab === "admin" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                    }`}
                  >
                    <Shield className="mr-3 h-5 w-5" />
                    <span>Admin Settings</span>
                  </button>
                )}
              </div>
              <div className="border-t border-[#f1f1f3] p-2">
                <button className="flex w-full items-center rounded-md px-4 py-2 text-left text-red-500 hover:bg-red-50">
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Account Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Personal Information</h2>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label htmlFor="first-name" className="mb-1 block text-sm font-medium">
                          First Name
                        </label>
                        <input
                          id="first-name"
                          name="firstName"
                          type="text"
                          value={userSettings?.first_name || ""}
                          onChange={(e) => setUserSettings((prev) => ({ ...prev, first_name: e.target.value }))}
                          disabled={isSaving}
                          className={`w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500] ${
                            isSaving && "bg-[#f7f7f8] text-[#4c4c4d]"
                          }`}
                        />
                      </div>
                      <div>
                        <label htmlFor="last-name" className="mb-1 block text-sm font-medium">
                          Last Name
                        </label>
                        <input
                          id="last-name"
                          name="lastName"
                          type="text"
                          value={userSettings?.last_name || ""}
                          onChange={(e) => setUserSettings((prev) => ({ ...prev, last_name: e.target.value }))}
                          disabled={isSaving}
                          className={`w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500] ${
                            isSaving && "bg-[#f7f7f8] text-[#4c4c4d]"
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1 block text-sm font-medium">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4c4c4d]" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={userSettings?.email || ""}
                          onChange={(e) => setUserSettings((prev) => ({ ...prev, email: e.target.value }))}
                          disabled={isSaving}
                          className={`w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 pl-10 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500] ${
                            isSaving && "bg-[#f7f7f8] text-[#4c4c4d]"
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4c4c4d]" />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={userSettings?.phone || ""}
                          onChange={(e) => setUserSettings((prev) => ({ ...prev, phone: e.target.value }))}
                          disabled={isSaving}
                          className={`w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 pl-10 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500] ${
                            isSaving && "bg-[#f7f7f8] text-[#4c4c4d]"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-red-100 bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold text-red-600">Danger Zone</h2>
                  <div className="space-y-4">
                    <div className="rounded-md border border-red-100 bg-red-50 p-4">
                      <h3 className="font-medium text-red-600">Delete Account</h3>
                      <p className="mt-1 text-sm text-red-500">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="mt-4 rounded-md border border-red-500 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Change Password</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="mb-1 block text-sm font-medium">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          id="current-password"
                          name="currentPassword"
                          type="password"
                          value={userSettings?.current_password || ""}
                          onChange={(e) => setUserSettings((prev) => ({ ...prev, current_password: e.target.value }))}
                          placeholder="Enter your current password"
                          className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 pr-10 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="new-password" className="mb-1 block text-sm font-medium">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="new-password"
                          name="newPassword"
                          type="password"
                          value={userSettings?.new_password || ""}
                          onChange={(e) => setUserSettings((prev) => ({ ...prev, new_password: e.target.value }))}
                          placeholder="Enter your new password"
                          className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 pr-10 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirm-password"
                          name="confirmPassword"
                          type="password"
                          value={userSettings?.confirm_password || ""}
                          onChange={(e) => setUserSettings((prev) => ({ ...prev, confirm_password: e.target.value }))}
                          placeholder="Confirm your new password"
                          className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 pr-10 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                        />
                      </div>
                    </div>
                    <div>
                      <button className="rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Two-Factor Authentication</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-[#4c4c4d]">
                          Add an extra layer of security to your account by enabling two-factor authentication.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" />
                          <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                    <div className="rounded-md bg-[#f7f7f8] p-4">
                      <p className="text-sm text-[#4c4c4d]">
                        Two-factor authentication is currently disabled. Enable it to add an extra layer of security to
                        your account.
                      </p>
                      <button className="mt-2 rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Login Sessions</h2>
                  <div className="space-y-4">
                    <div className="rounded-md border border-[#f1f1f3] p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Current Session</h3>
                          <p className="text-sm text-[#4c4c4d]">San Francisco, CA • Chrome on macOS</p>
                          <p className="text-xs text-[#4c4c4d]">Started: Today, 10:30 AM</p>
                        </div>
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="rounded-md border border-[#f1f1f3] p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Previous Session</h3>
                          <p className="text-sm text-[#4c4c4d]">New York, NY • Firefox on Windows</p>
                          <p className="text-xs text-[#4c4c4d]">Last active: Yesterday, 3:15 PM</p>
                        </div>
                        <button className="rounded-md border border-[#f1f1f3] px-3 py-1.5 text-xs font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                          Revoke
                        </button>
                      </div>
                    </div>
                    <button className="w-full rounded-md border border-[#f1f1f3] bg-white px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50">
                      Revoke All Other Sessions
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Email Notifications</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Course Updates</h3>
                        <p className="text-sm text-[#4c4c4d]">
                          Receive notifications when your courses are updated or new content is added.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" defaultChecked />
                          <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                    {userRole === "student" && (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Assignment Reminders</h3>
                            <p className="text-sm text-[#4c4c4d]">
                              Receive reminders about upcoming assignments and deadlines.
                            </p>
                          </div>
                          <div className="flex items-center">
                            <label className="relative inline-flex cursor-pointer items-center">
                              <input type="checkbox" className="peer sr-only" defaultChecked />
                              <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Instructor Announcements</h3>
                            <p className="text-sm text-[#4c4c4d]">
                              Receive notifications when instructors make announcements in your courses.
                            </p>
                          </div>
                          <div className="flex items-center">
                            <label className="relative inline-flex cursor-pointer items-center">
                              <input type="checkbox" className="peer sr-only" defaultChecked />
                              <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                    {userRole === "teacher" && (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Student Enrollments</h3>
                            <p className="text-sm text-[#4c4c4d]">
                              Receive notifications when new students enroll in your courses.
                            </p>
                          </div>
                          <div className="flex items-center">
                            <label className="relative inline-flex cursor-pointer items-center">
                              <input type="checkbox" className="peer sr-only" defaultChecked />
                              <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Course Reviews</h3>
                            <p className="text-sm text-[#4c4c4d]">
                              Receive notifications when students leave reviews on your courses.
                            </p>
                          </div>
                          <div className="flex items-center">
                            <label className="relative inline-flex cursor-pointer items-center">
                              <input type="checkbox" className="peer sr-only" defaultChecked />
                              <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Q&A Responses</h3>
                        <p className="text-sm text-[#4c4c4d]">
                          Receive notifications when someone responds to your questions or comments.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" defaultChecked />
                          <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Marketing Emails</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Platform Updates</h3>
                        <p className="text-sm text-[#4c4c4d]">
                          Receive emails about new features, updates, and improvements to the platform.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" defaultChecked />
                          <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Promotional Emails</h3>
                        <p className="text-sm text-[#4c4c4d]">
                          Receive emails about promotions, discounts, and special offers.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" />
                          <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Newsletter</h3>
                        <p className="text-sm text-[#4c4c4d]">
                          Receive our monthly newsletter with tips, tutorials, and industry news.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" defaultChecked />
                          <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email-frequency" className="mb-1 block text-sm font-medium">
                        Email Frequency
                      </label>
                      <select
                        id="email-frequency"
                        className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      >
                        <option>Immediately</option>
                        <option>Daily Digest</option>
                        <option>Weekly Digest</option>
                      </select>
                    </div>
                    <button className="rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90">
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && showBilling && (
              <div className="space-y-6">
                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Payment Methods</h2>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                        <div key={method.id} className="rounded-md border border-[#f1f1f3] p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="mr-3 h-10 w-16 rounded border border-[#f1f1f3] bg-[#f7f7f8] p-2">
                                <CreditCard className="h-full w-full text-[#4c4c4d]" />
                              </div>
                              <div>
                                <h3 className="font-medium">
                                  {method.type} ending in {method.last4}
                                </h3>
                                <p className="text-sm text-[#4c4c4d]">Expires {method.expiryDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {method.isDefault && (
                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                                  Default
                                </span>
                              )}
                              <button className="rounded-md border border-[#f1f1f3] px-3 py-1.5 text-xs font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                    ))}
                    <button className="rounded-md border border-[#f1f1f3] bg-white px-4 py-2 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                      Add Payment Method
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Billing History</h2>
                  <div className="space-y-4">
                    {userData.transactions && userData.transactions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] border-collapse">
                          <thead>
                            <tr className="border-b border-[#f1f1f3]">
                              <th className="py-3 text-left text-sm font-medium text-[#4c4c4d]">Date</th>
                              <th className="py-3 text-left text-sm font-medium text-[#4c4c4d]">Description</th>
                              <th className="py-3 text-left text-sm font-medium text-[#4c4c4d]">Amount</th>
                              <th className="py-3 text-left text-sm font-medium text-[#4c4c4d]">Status</th>
                              <th className="py-3 text-left text-sm font-medium text-[#4c4c4d]">Invoice</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userData.transactions.map((transaction) => (
                              <tr key={transaction.id} className="border-b border-[#f1f1f3]">
                                <td className="py-4 text-sm">{transaction.date}</td>
                                <td className="py-4 text-sm">{transaction.description}</td>
                                <td className="py-4 text-sm">{transaction.amount}</td>
                                <td className="py-4 text-sm">
                                  <span
                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                      transaction.status === "completed"
                                        ? "bg-green-100 text-green-600"
                                        : transaction.status === "pending"
                                          ? "bg-yellow-100 text-yellow-600"
                                          : "bg-red-100 text-red-600"
                                    }`}
                                  >
                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                  </span>
                                </td>
                                <td className="py-4 text-sm">
                                  <button className="text-[#ff9500] hover:underline">Download</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="rounded-md border border-dashed border-[#f1f1f3] p-6 text-center">
                        <CreditCard className="mx-auto mb-2 h-8 w-8 text-[#4c4c4d]" />
                        <h3 className="mb-1 font-medium">No Transactions</h3>
                        <p className="mb-4 text-sm text-[#4c4c4d]">You haven't made any purchases yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Language & Region Tab */}
            {activeTab === "language" && (
              <div className="space-y-6">
                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Language & Region</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="language" className="mb-1 block text-sm font-medium">
                        Language
                      </label>
                      <select
                        id="language"
                        className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      >
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Japanese</option>
                        <option>Chinese (Simplified)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="timezone" className="mb-1 block text-sm font-medium">
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      >
                        <option>(GMT-08:00) Pacific Time</option>
                        <option>(GMT-07:00) Mountain Time</option>
                        <option>(GMT-06:00) Central Time</option>
                        <option>(GMT-05:00) Eastern Time</option>
                        <option>(GMT+00:00) UTC</option>
                        <option>(GMT+01:00) Central European Time</option>
                        <option>(GMT+08:00) China Standard Time</option>
                        <option>(GMT+09:00) Japan Standard Time</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="date-format" className="mb-1 block text-sm font-medium">
                        Date Format
                      </label>
                      <select
                        id="date-format"
                        className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      >
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY/MM/DD</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="time-format" className="mb-1 block text-sm font-medium">
                        Time Format
                      </label>
                      <select
                        id="time-format"
                        className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      >
                        <option>12-hour (AM/PM)</option>
                        <option>24-hour</option>
                      </select>
                    </div>
                    <button className="rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90">
                      Save Preferences
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Currency</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currency" className="mb-1 block text-sm font-medium">
                        Currency
                      </label>
                      <select
                        id="currency"
                        className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      >
                        <option>USD - US Dollar</option>
                        <option>EUR - Euro</option>
                        <option>GBP - British Pound</option>
                        <option>JPY - Japanese Yen</option>
                        <option>CAD - Canadian Dollar</option>
                        <option>AUD - Australian Dollar</option>
                      </select>
                    </div>
                    <button className="rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90">
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Learning Preferences Tab (for students) */}
            {activeTab === "learning" && showCourseSettings && (
              <div className="space-y-6">
                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Learning Preferences</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="learning-speed" className="mb-1 block text-sm font-medium">
                        Video Playback Speed
                      </label>
                      <select
                        id="learning-speed"
                        className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      >
                        <option>0.5x</option>
                        <option>0.75x</option>
                        <option selected>1.0x</option>
                        <option>1.25x</option>
                        <option>1.5x</option>
                        <option>1.75x</option>
                        <option>2.0x</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Autoplay Videos</h3>
                        <p className="text-sm text-[#4c4c4d]">Automatically play the next video in a course.</p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" defaultChecked />
                          <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Download for Offline Viewing</h3>
                        <p className="text-sm text-[#4c4c4d]">Allow downloading course content for offline viewing.</p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" defaultChecked />
                          <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Subtitles/Captions</h3>
                        <p className="text-sm text-[#4c4c4d]">
                          Show subtitles or captions in course videos when available.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" defaultChecked />
                          <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                    <button className="rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90">
                      Save Preferences
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Course Display</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="course-display" className="mb-1 block text-sm font-medium">
                        Default Course View
                      </label>
                      <select
                        id="course-display"
                        className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      >
                        <option>Grid View</option>
                        <option>List View</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="course-sort" className="mb-1 block text-sm font-medium">
                        Default Course Sorting
                      </label>
                      <select
                        id="course-sort"
                        className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      >
                        <option>Recently Accessed</option>
                        <option>Title (A-Z)</option>
                        <option>Title (Z-A)</option>
                        <option>Progress (High to Low)</option>
                        <option>Progress (Low to High)</option>
                      </select>
                    </div>
                    <button className="rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90">
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Teaching Settings Tab (for teachers) */}
            {activeTab === "teaching" && showTeachingSettings && (
              <div className="space-y-6">
                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Teaching Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Auto-Approve Student Reviews</h3>
                        <p className="text-sm text-[#4c4c4d]">
                          Automatically approve student reviews for your courses.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" defaultChecked />
                          <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Auto-Respond to Q&A</h3>
                        <p className="text-sm text-[#4c4c4d]">
                          Send automatic responses to common questions in your courses.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" />
                          <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Co-Instructor Permissions</h3>
                        <p className="text-sm text-[#4c4c4d]">
                          Allow co-instructors to edit course content and respond to students.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" defaultChecked />
                          <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                    <button className="rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90">
                      Save Preferences
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Payout Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="payout-method" className="mb-1 block text-sm font-medium">
                        Payout Method
                      </label>
                      <select
                        id="payout-method"
                        className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      >
                        <option>PayPal</option>
                        <option>Direct Deposit</option>
                        <option>Wire Transfer</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="payout-email" className="mb-1 block text-sm font-medium">
                        PayPal Email
                      </label>
                      <input
                        id="payout-email"
                        type="email"
                        placeholder="Enter your PayPal email"
                        className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      />
                    </div>
                    <div>
                      <label htmlFor="payout-threshold" className="mb-1 block text-sm font-medium">
                        Payout Threshold
                      </label>
                      <select
                        id="payout-threshold"
                        className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      >
                        <option>$25</option>
                        <option>$50</option>
                        <option>$100</option>
                        <option>$250</option>
                        <option>$500</option>
                      </select>
                    </div>
                    <button className="rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90">
                      Save Payout Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Settings Tab (for admins) */}
            {activeTab === "admin" && isAdmin && (
              <div className="space-y-6">
                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Admin Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Auto-Approve New Courses</h3>
                        <p className="text-sm text-[#4c4c4d]">
                          Automatically approve new courses submitted by trusted instructors.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" />
                          <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Content Moderation</h3>
                        <p className="text-sm text-[#4c4c4d]">
                          Enable AI-powered content moderation for course reviews and Q&A.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" defaultChecked />
                          <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">System Notifications</h3>
                        <p className="text-sm text-[#4c4c4d]">
                          Receive notifications about system performance and issues.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" defaultChecked />
                          <div className="peer h-6 w-11 rounded-full bg-[#f1f1f3] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ff9500] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                        </label>
                      </div>
                    </div>
                    <button className="rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90">
                      Save Admin Preferences
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 text-xl font-bold">Platform Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="maintenance-mode" className="mb-1 block text-sm font-medium">
                        Maintenance Mode
                      </label>
                      <select
                        id="maintenance-mode"
                        className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      >
                        <option>Disabled</option>
                        <option>Enabled (Admin Access Only)</option>
                        <option>Enabled (With Maintenance Page)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="user-registration" className="mb-1 block text-sm font-medium">
                        User Registration
                      </label>
                      <select
                        id="user-registration"
                        className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      >
                        <option>Open to All</option>
                        <option>Invitation Only</option>
                        <option>Closed</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="instructor-applications" className="mb-1 block text-sm font-medium">
                        Instructor Applications
                      </label>
                      <select
                        id="instructor-applications"
                        className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                      >
                        <option>Open</option>
                        <option>Restricted</option>
                        <option>Closed</option>
                      </select>
                    </div>
                    <button className="rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90">
                      Save Platform Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

