import { create } from "zustand";
import { z } from "zod";
import axiosClient from "@/api/axios";
import { useAuthStore } from "./useAuthStore";
import { Course } from "@/types/course";

// Définition du schéma de validation pour un cours dans la liste de souhaits
const wishlistItemSchema = z.object({
  courseId: z.string(),
  userId: z.number(),
  addedDate: z.date().default(() => new Date()),
  hasNotifications: z.boolean().default(true),
});

// Type d'un élément de la liste de souhaits
export type WishlistItem = z.infer<typeof wishlistItemSchema>;

// Interface pour le store de la liste de souhaits
interface WishlistState {
  wishlistedCourses: string[]; // Liste des IDs de cours dans la liste de souhaits
  wishlistItems: Course[]; // Liste complète des cours dans la liste de souhaits
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWishlistedCourses: () => Promise<void>;
  isWishlisted: (courseId: string) => boolean;
  toggleWishlist: (courseId: string) => Promise<void>;
  removeFromWishlist: (courseId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  toggleNotification: (courseId: string) => Promise<void>;
}

// Création du store Zustand
export const useWishlistStore = create<WishlistState>((set, get) => ({
  // État initial
  wishlistedCourses: [],
  wishlistItems: [],
  isLoading: false,
  error: null,

  // Actions
  fetchWishlistedCourses: async () => {
    const { user } = useAuthStore.getState();

    // Si l'utilisateur n'est pas connecté, on ne fait rien
    if (!user) {
      set({ wishlistedCourses: [], wishlistItems: [], error: null });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // Requête API pour récupérer les cours de la liste de souhaits
      const response = await axiosClient.get("/api/wishlist");
      console.log("wishlist", response.data);

      // Extraire les IDs des cours de la réponse
      let wishlistedCourses = [];

      // Vérifier la structure de la réponse et extraire les IDs des cours
      if (
        response.data &&
        response.data.wishlist &&
        Array.isArray(response.data.wishlist)
      ) {
        // Structure attendue: { wishlist: [{ course_id: ... }, ...] }
        wishlistedCourses = response.data.wishlist.map((item) =>
          item.course_id.toString()
        );
      } else if (response.data && Array.isArray(response.data)) {
        // Structure alternative: [{ course_id: ... }, ...]
        wishlistedCourses = response.data.map((item) =>
          item.course_id ? item.course_id.toString() : item.toString()
        );
      } else if (response.data && typeof response.data === "object") {
        // Structure alternative: { courses: [...], ... } ou autre
        const possibleArrays = Object.values(response.data).filter((val) =>
          Array.isArray(val)
        );
        if (possibleArrays.length > 0) {
          // Prendre le premier tableau trouvé
          const firstArray = possibleArrays[0];
          wishlistedCourses = firstArray
            .map((item) =>
              typeof item === "object"
                ? item.course_id
                  ? item.course_id.toString()
                  : item.id
                  ? item.id.toString()
                  : ""
                : item.toString()
            )
            .filter((id) => id !== "");
        }
      }

      console.log("Extracted wishlistedCourses:", wishlistedCourses);

      // Si nous avons des IDs de cours, récupérer les détails complets des cours
      let wishlistItems = [];
      if (wishlistedCourses.length > 0) {
        try {
          // Récupérer les détails des cours en utilisant les IDs
          // Option 1: Utiliser un endpoint qui accepte plusieurs IDs
          const coursesResponse = await axiosClient.get(
            "/api/courses/details",
            {
              params: { ids: wishlistedCourses.join(",") },
            }
          );

          if (
            coursesResponse.data &&
            Array.isArray(coursesResponse.data.courses)
          ) {
            wishlistItems = coursesResponse.data.courses;
          } else if (
            coursesResponse.data &&
            coursesResponse.data.data &&
            Array.isArray(coursesResponse.data.data)
          ) {
            wishlistItems = coursesResponse.data.data;
          } else {
            console.log(
              "Format de réponse inattendu pour les détails des cours:",
              coursesResponse.data
            );

            // Option 2: Récupérer tous les cours et filtrer
            const allCoursesResponse = await axiosClient.get("wishlist");
            if (
              allCoursesResponse.data &&
              allCoursesResponse.data.courses &&
              allCoursesResponse.data.courses.data
            ) {
              const allCourses = allCoursesResponse.data.courses.data;
              wishlistItems = allCourses.filter((course) =>
                wishlistedCourses.includes(course.id.toString())
              );
            }
          }
        } catch (courseError) {
          console.error(
            "Erreur lors de la récupération des détails des cours:",
            courseError
          );
          // En cas d'erreur, on continue avec les IDs seulement
        }
      }

      console.log("Fetched wishlistItems:", wishlistItems);

      set({
        wishlistedCourses,
        wishlistItems,
        isLoading: false,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la liste de souhaits:",
        error
      );
      set({
        error:
          "Impossible de récupérer votre liste de souhaits. Veuillez réessayer.",
        isLoading: false,
      });
    }
  },

  isWishlisted: (courseId: string) => {
    return get().wishlistedCourses.includes(courseId);
  },

  toggleWishlist: async (courseId: string) => {
    const { user } = useAuthStore.getState();

    // Si l'utilisateur n'est pas connecté, on ne fait rien
    if (!user) {
      set({
        error: "Vous devez être connecté pour gérer votre liste de souhaits.",
      });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // Utiliser l'endpoint toggle pour ajouter ou retirer le cours de la liste
      const response = await axiosClient.post("/api/wishlist/toggle", {
        course_id: courseId,
        user_id: user.id,
      });

      // Mettre à jour l'état en fonction de la réponse
      if (response.data.in_wishlist) {
        // Le cours a été ajouté à la liste
        // Récupérer les détails du cours si on ne les a pas déjà
        let courseDetails = null;
        try {
          const courseResponse = await axiosClient.get(
            `/api/courses/${courseId}`
          );
          if (courseResponse.data && courseResponse.data.course) {
            courseDetails = courseResponse.data.course;
          } else if (courseResponse.data) {
            courseDetails = courseResponse.data;
          }
        } catch (courseError) {
          console.error(
            "Erreur lors de la récupération des détails du cours:",
            courseError
          );
        }

        set((state) => {
          // Mettre à jour la liste des IDs
          const newWishlistedCourses = [...state.wishlistedCourses, courseId];

          // Mettre à jour la liste des cours complets si on a les détails
          let newWishlistItems = [...state.wishlistItems];
          if (courseDetails) {
            newWishlistItems.push(courseDetails);
          }

          return {
            wishlistedCourses: newWishlistedCourses,
            wishlistItems: newWishlistItems,
            isLoading: false,
          };
        });
      } else {
        // Le cours a été retiré de la liste
        set((state) => ({
          wishlistedCourses: state.wishlistedCourses.filter(
            (id) => id !== courseId
          ),
          wishlistItems: state.wishlistItems.filter(
            (item) => item.id.toString() !== courseId
          ),
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error(
        "Erreur lors de la modification de la liste de souhaits:",
        error
      );
      set({
        error:
          "Impossible de modifier votre liste de souhaits. Veuillez réessayer.",
        isLoading: false,
      });
    }
  },

  removeFromWishlist: async (courseId: string) => {
    const { user } = useAuthStore.getState();

    // Si l'utilisateur n'est pas connecté, on ne fait rien
    if (!user) {
      set({
        error: "Vous devez être connecté pour gérer votre liste de souhaits.",
      });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // Trouver l'ID de l'élément de la liste de souhaits pour ce cours
      const checkResponse = await axiosClient.get(
        `/api/wishlist/check/${courseId}`
      );

      if (checkResponse.data.in_wishlist) {
        // Récupérer l'élément de la liste de souhaits pour obtenir son ID
        const wishlistResponse = await axiosClient.get("/api/wishlist");
        let wishlistItem = null;

        // Chercher l'élément correspondant au cours dans la réponse
        if (
          wishlistResponse.data &&
          wishlistResponse.data.wishlist &&
          Array.isArray(wishlistResponse.data.wishlist)
        ) {
          wishlistItem = wishlistResponse.data.wishlist.find(
            (item) => item.course_id.toString() === courseId
          );
        } else if (
          wishlistResponse.data &&
          Array.isArray(wishlistResponse.data)
        ) {
          wishlistItem = wishlistResponse.data.find(
            (item) =>
              (item.course_id && item.course_id.toString() === courseId) ||
              (item.id && item.id.toString() === courseId)
          );
        }

        if (wishlistItem && wishlistItem.id) {
          // Utiliser l'endpoint DELETE avec l'ID de l'élément de la liste
          await axiosClient.delete(`/api/wishlist/${wishlistItem.id}`);
        } else {
          // Fallback: utiliser l'endpoint toggle si on ne trouve pas l'ID
          await axiosClient.post("/api/wishlist/toggle", {
            course_id: courseId,
            user_id:user.id,
          });
        }
      }

      set((state) => ({
        wishlistedCourses: state.wishlistedCourses.filter(
          (id) => id !== courseId
        ),
        wishlistItems: state.wishlistItems.filter(
          (item) => item.id.toString() !== courseId
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du cours de la liste de souhaits:",
        error
      );
      set({
        error:
          "Impossible de supprimer ce cours de votre liste de souhaits. Veuillez réessayer.",
        isLoading: false,
      });
    }
  },

  clearWishlist: async () => {
    const { user } = useAuthStore.getState();

    // Si l'utilisateur n'est pas connecté, on ne fait rien
    if (!user) {
      set({
        error: "Vous devez être connecté pour gérer votre liste de souhaits.",
      });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // Supprimer tous les éléments de la liste de souhaits
      await axiosClient.delete("/api/wishlist");

      set({
        wishlistedCourses: [],
        wishlistItems: [],
        isLoading: false,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la liste de souhaits:",
        error
      );
      set({
        error:
          "Impossible de vider votre liste de souhaits. Veuillez réessayer.",
        isLoading: false,
      });
    }
  },

  toggleNotification: async (courseId: string) => {
    const { user } = useAuthStore.getState();

    // Si l'utilisateur n'est pas connecté, on ne fait rien
    if (!user) {
      set({ error: "Vous devez être connecté pour gérer les notifications." });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // Trouver l'ID de l'élément de la liste de souhaits pour ce cours
      // Note: Dans une implémentation complète, vous stockeriez les IDs des éléments de la liste
      // Pour cet exemple, nous utilisons une approche simplifiée

      // Récupérer tous les éléments de la liste de souhaits
      const response = await axiosClient.get("/api/wishlist");
      console.log("wishlist", response.data);
      console.log("toggleNotification wishlist data:", response.data);

      // Trouver l'élément correspondant au cours
      let wishlistItem = null;

      // Vérifier la structure de la réponse et trouver l'élément correspondant
      if (
        response.data &&
        response.data.wishlist &&
        Array.isArray(response.data.wishlist)
      ) {
        // Structure attendue: { wishlist: [{ course_id: ... }, ...] }
        wishlistItem = response.data.wishlist.find(
          (item) => item.course_id.toString() === courseId
        );
      } else if (response.data && Array.isArray(response.data)) {
        // Structure alternative: [{ course_id: ... }, ...]
        wishlistItem = response.data.find(
          (item) =>
            (item.course_id && item.course_id.toString() === courseId) ||
            (item.id && item.id.toString() === courseId)
        );
      } else if (response.data && typeof response.data === "object") {
        // Structure alternative: { courses: [...], ... } ou autre
        const possibleArrays = Object.values(response.data).filter((val) =>
          Array.isArray(val)
        );
        for (const arr of possibleArrays) {
          const found = arr.find(
            (item) =>
              (item.course_id && item.course_id.toString() === courseId) ||
              (item.id && item.id.toString() === courseId)
          );
          if (found) {
            wishlistItem = found;
            break;
          }
        }
      }

      console.log("Found wishlistItem:", wishlistItem);

      if (wishlistItem) {
        // Vérifier si l'élément a un ID
        if (wishlistItem.id) {
          // Basculer les notifications pour cet élément
          await axiosClient.patch(
            `/api/wishlist/${wishlistItem.id}/notifications`
          );
        } else if (wishlistItem._id) {
          // Utiliser _id si id n'est pas disponible
          await axiosClient.patch(
            `/api/wishlist/${wishlistItem._id}/notifications`
          );
        } else {
          // Fallback: utiliser l'API toggle avec un paramètre de notification
          console.log("No id found for wishlistItem, using fallback approach");
          await axiosClient.post("/api/wishlist/toggle", {
            course_id: courseId,
            user_id:user.id,
            toggle_notifications: true,
          });
        }

        // Mettre à jour l'état local pour refléter le changement de notification
        // Puisque nous ne connaissons pas la nouvelle valeur de hasNotifications,
        // nous allons simplement rafraîchir la liste complète
        await get().fetchWishlistedCourses();
      }

      set({ isLoading: false });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des notifications:", error);
      set({
        error:
          "Impossible de mettre à jour les notifications. Veuillez réessayer.",
        isLoading: false,
      });
    }
  },
}));
