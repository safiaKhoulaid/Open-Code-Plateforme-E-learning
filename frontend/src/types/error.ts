export type ApiError = {
    message: string;
    status?: number;
    errors?: Record<string, string[]>; // Pour des erreurs par champ (ex: validation Laravel)
  };
  