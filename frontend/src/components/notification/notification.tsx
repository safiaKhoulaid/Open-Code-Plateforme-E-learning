import { useState, useEffect, useRef } from "react"
import { Bell, BookOpen, MessageSquare, FileText, Award, Star, Users, Settings, Check } from "lucide-react"

type Notification = {
  id: string
  title: string
  message: string
  time: string
  type: "course" | "message" | "assignment" | "certificate" | "review" | "enrollment" | "system"
  read: boolean
  courseId?: string
  courseName?: string
  actionUrl?: string
}

export default function NotificationsComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const panelRef = useRef<HTMLDivElement>(null)

  // Simulated fetch of notifications
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchNotifications = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock data
      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "Nouvelle leçon disponible",
          message: "Une nouvelle leçon a été ajoutée au cours 'Développement Web Complet'",
          time: "Il y a 10 minutes",
          type: "course",
          read: false,
          courseId: "web-dev-101",
          courseName: "Développement Web Complet",
          actionUrl: "/courses/web-dev-101",
        },
        {
          id: "2",
          title: "Rappel de devoir",
          message: "Le devoir 'Projet JavaScript Final' est à rendre dans 2 jours",
          time: "Il y a 1 heure",
          type: "assignment",
          read: false,
          courseId: "js-advanced",
          courseName: "JavaScript Avancé",
          actionUrl: "/assignments/js-final",
        },
        {
          id: "3",
          title: "Message de l'instructeur",
          message: "Daniel Walter Scott a répondu à votre question dans le cours 'UI/UX Design Masterclass'",
          time: "Il y a 3 heures",
          type: "message",
          read: true,
          courseId: "uiux-master",
          courseName: "UI/UX Design Masterclass",
          actionUrl: "/messages/uiux-master",
        },
        {
          id: "4",
          title: "Certificat disponible",
          message: "Félicitations ! Votre certificat pour 'iOS 17 & Swift 5' est prêt à être téléchargé",
          time: "Hier",
          type: "certificate",
          read: true,
          courseId: "ios-swift",
          courseName: "iOS 17 & Swift 5",
          actionUrl: "/certificates/ios-swift",
        },
        {
          id: "5",
          title: "Nouvelle évaluation",
          message: "Vous avez reçu une nouvelle évaluation pour votre devoir 'Wireframes UI'",
          time: "Il y a 2 jours",
          type: "assignment",
          read: true,
          courseId: "uiux-master",
          courseName: "UI/UX Design Masterclass",
          actionUrl: "/assignments/uiux-wireframes",
        },
      ]

      setNotifications(mockNotifications)
      setLoading(false)
    }

    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // Get icon based on notification type
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "course":
        return <BookOpen className="h-full w-full p-2 text-[#ff9500]" />
      case "message":
        return <MessageSquare className="h-full w-full p-2 text-[#ff9500]" />
      case "assignment":
        return <FileText className="h-full w-full p-2 text-[#ff9500]" />
      case "certificate":
        return <Award className="h-full w-full p-2 text-[#ff9500]" />
      case "review":
        return <Star className="h-full w-full p-2 text-[#ff9500]" />
      case "enrollment":
        return <Users className="h-full w-full p-2 text-[#ff9500]" />
      default:
        return <Bell className="h-full w-full p-2 text-[#ff9500]" />
    }
  }

  // Filter notifications based on active tab
  const filteredNotifications =
    activeTab === "all" ? notifications : notifications.filter((notification) => !notification.read)

  // Count unread notifications
  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-[#4c4c4d] hover:bg-[#f1f1f3] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff9500] text-[10px] text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[80vh] rounded-lg border border-[#f1f1f3] bg-white shadow-lg overflow-hidden z-50"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#f1f1f3] bg-white p-3">
            <div>
              <h2 className="text-base font-bold">Notifications</h2>
              {unreadCount > 0 && <p className="text-xs text-[#4c4c4d]">{unreadCount} non lues</p>}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="flex items-center text-xs text-[#ff9500] hover:underline">
                  <Check className="mr-1 h-3 w-3" />
                  Tout lire
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#f1f1f3]">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-2 text-xs font-medium ${
                activeTab === "all" ? "border-b-2 border-[#ff9500] text-[#ff9500]" : "text-[#4c4c4d]"
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`flex-1 py-2 text-xs font-medium ${
                activeTab === "unread" ? "border-b-2 border-[#ff9500] text-[#ff9500]" : "text-[#4c4c4d]"
              }`}
            >
              Non lues
            </button>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-6">
                <div className="h-6 w-6 animate-spin rounded-full border-3 border-[#f1f1f3] border-t-[#ff9500]"></div>
                <p className="mt-3 text-xs text-[#4c4c4d]">Chargement...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff4e5]">
                  <Bell className="h-6 w-6 text-[#ff9500]" />
                </div>
                <h3 className="mt-3 text-sm font-medium">Aucune notification</h3>
                <p className="mt-1 text-center text-xs text-[#4c4c4d]">
                  {activeTab === "all"
                    ? "Vous n'avez pas encore de notifications"
                    : "Vous n'avez pas de notifications non lues"}
                </p>
              </div>
            ) : (
              <div>
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-b border-[#f1f1f3] p-3 hover:bg-[#f7f7f8] transition-colors cursor-pointer ${
                      !notification.read ? "bg-[#fff4e5]/10" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="h-9 w-9 flex-shrink-0 rounded-full bg-[#fff4e5]">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-medium line-clamp-1">{notification.title}</h3>
                          {!notification.read && (
                            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#ff9500]"></span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-[#4c4c4d] line-clamp-2">{notification.message}</p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-[10px] text-[#4c4c4d]">{notification.time}</span>
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              className="text-[10px] font-medium text-[#ff9500] hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Voir détails
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-[#f1f1f3] bg-white p-3">
            <div className="flex items-center justify-between">
              <a href="/notifications" className="text-xs text-[#ff9500] hover:underline">
                Voir toutes
              </a>
              <a
                href="/settings/notifications"
                className="flex items-center text-xs text-[#4c4c4d] hover:text-[#ff9500]"
              >
                <Settings className="mr-1 h-3 w-3" />
                Paramètres
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
