// src/services/profile.service.ts

// URL base da API de perfil
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ✅ Interface UserProfileData ajustada para corresponder à sua estrutura
export interface UserProfileData {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    faceVerified?: boolean;
    verificationDate?: string;
  };
  profile?: {
    id?: number;
    user_id?: number;
    cpf?: string | null;
    birth_date?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    zip_code?: string | null;
    phone?: string | null;
    profile_image?: string | null;
    verification_status?: "pending" | "verified" | "rejected" | null;
    fan_level?: string | null;
    fan_points?: number | null;
    created_at?: string;
    updated_at?: string;
  } | null;
  interests?: {
    favoriteGames?: string[];
    favoriteTeams?: string[];
    followedPlayers?: string[];
    preferredPlatforms?: string[];
  } | null;
  activities?: {
    eventsAttended?: string[];
    purchasedMerchandise?: string[];
    subscriptions?: string[];
    competitionsParticipated?: string[];
  } | null;
  socialConnections?: {
    twitter?: string | number | null;
    instagram?: string | number | null;
    facebook?: string | number | null;
    discord?: string | number | null;
    twitch?: string | number | null;
    steamProfile?: string | null;
    faceitProfile?: string | null;
    hltv?: string | null;
    vlr?: string | null;
    otherProfiles?: string[];
  } | null;
  profileCompletion: number;
  memberSince: string;
  upcomingEvents: { id: number; name: string; date: string; location: string }[];
  exclusiveOffers: { id: number; name: string; expires: string; code?: string }[];
  recentActivity: { id: number; type: string; description: string; date: string }[];
}

// Obter o perfil completo do usuário
// ✅ Ajuste a função getProfile para retornar Promise<UserProfileData | null>
export const getProfile = async (): Promise<UserProfileData | null> => {
  const response = await fetch(`${API_URL}/api/profile/`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });

  try {
    if (response.status === 401) {
      return null;
    }

    const result = await handleApiResponse<UserProfileData>(response);
    return result || null;

  } catch (error: any) {
    if (error.status !== 401) {
      console.error("Error getting profile:", error);
    }
    return null;
  }
};

// Função helper para parsear resposta JSON e tratar erros HTTP
async function handleApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let result = null;
  if (isJson) {
    try {
      result = await response.json();
    } catch (e) {
      console.error("Erro ao parsear JSON da resposta:", e);
      const parseError = new Error(`Resposta inesperada do servidor (${response.status}). Erro ao parsear JSON.`);
      (parseError as any).status = response.status;
      throw parseError;
    }
  }

  if (!response.ok) {
    const errorMsg = isJson && result && result.message ? result.message : `Erro do servidor: Status ${response.status}`;
    const httpError = new Error(errorMsg);
    (httpError as any).status = response.status;
    if (isJson && result) {
      (httpError as any).details = result;
    }
    console.error(`API Error: ${response.status} - ${errorMsg}`, isJson ? result : await response.text());
    throw httpError;
  }

  if (!isJson && response.status === 204) return null as T;
  if (!isJson) {
    console.warn(`API Success with non-JSON response: ${response.status}`, await response.text());
    const nonJsonError = new Error(`Resposta de sucesso inesperada do servidor (${response.status}). Não é JSON.`);
    (nonJsonError as any).status = response.status;
    throw nonJsonError;
  }

  return result as T;
}

// Funções de atualização de perfil (mantidas, apenas garantindo o uso de API_URL)
export const updatePersonalInfo = async (data: any): Promise<any> => {
  const response = await fetch(`${API_URL}/api/profile/personal-info`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleApiResponse<any>(response);
};

export const updateInterests = async (data: any): Promise<any> => {
  const response = await fetch(`${API_URL}/api/profile/interests`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleApiResponse<any>(response);
};

export const updateActivities = async (data: any): Promise<any> => {
  const response = await fetch(`${API_URL}/api/profile/activities`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleApiResponse<any>(response);
};

export const updateSocialConnections = async (data: any): Promise<any> => {
  const response = await fetch(`${API_URL}/api/profile/social-connections`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleApiResponse<any>(response);
};