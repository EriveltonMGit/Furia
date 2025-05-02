// src/services/profile.service.ts

// URL base da API de perfil (usando a variável de ambiente para produção ou localhost)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; // <-- Use a URL base correta, sem /api/profile no final

// ✅ Defina e exporte a interface UserProfileData que corresponde à resposta da sua API
export interface UserProfileData {
  profileCompletion: any;
  upcomingEvents: any;
  user: { // Corresponde a response.profile.user
    id: string;
    name: string;
    email: string;
    role?: string;
    // Tipos de data ajustados para permitir objetos Firebase ou strings ISO
    created_at?: { _seconds: number; _nanoseconds: number } | string | Date;
    updated_at?: { _seconds: number; _nanoseconds: number } | string | Date;
  };
  profile: { // Corresponde a response.profile.profile
    cpf?: string; // Optional, pode não vir sempre
    birth_date?: string; // Pode precisar de formatação no frontend
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone?: string;
    updated_at?: { _seconds: number; _nanoseconds: number } | string | Date;
    user_id: string;
    created_at?: { _seconds: number; _nanoseconds: number } | string | Date;
    verification_status: "verified" | "pending" | "unverified"; // Usando o alias de tipo existente ou literais
    fan_level: string;
    fan_points: number;
    profileCompletion?: number; // Adicionado com base no uso anterior no componente
  };
  interests: { // Corresponde a response.profile.interests
    favoriteGames: string[];
    favoriteTeams: string[];
    followedPlayers: string[];
    preferredPlatforms: string[];
  };
  activities: { // Corresponde a response.profile.activities
    eventsAttended: string[];
    purchasedMerchandise: string[];
    subscriptions: string[];
    competitionsParticipated: string[];
  };
  socialConnections: { // Corresponde a response.profile.socialConnections
    twitter: boolean;
    instagram: boolean;
    facebook: boolean;
    discord: boolean;
    twitch: boolean;
    steamProfile: string; // String para o perfil, não booleano
    faceitProfile: string;
    hltv: string;
    vlr: string;
    otherProfiles: { platform: string; url: string }[]; // Ajustado se for uma lista de objetos
  };
  // Nota: a propriedade 'success: true' da API não faz parte da estrutura de dados do perfil em si.
  // A função getProfile deve retornar APENAS o objeto 'profile'.
}


// Obter o perfil completo do usuário
// ✅ Atualize a função getProfile para retornar Promise<UserProfileData | null>
export const getProfile = async (): Promise<UserProfileData | null> => {
  // ✅ Ajuste a URL para usar o API_URL base e o endpoint correto
  const response = await fetch(`${API_URL}/api/profile/`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });

  // Usa um helper básico para tratar a resposta JSON e erros
  async function handleProfileApiResponse<T>(res: Response): Promise<T> {
    const result = await res.json();
    if (!res.ok) {
      const errorMsg = result.message || `Erro do servidor: Status ${res.status}`;
      const httpError = new Error(errorMsg);
      (httpError as any).status = res.status;
      throw httpError;
    }
    return result;
  }

  try {
    // Se não estiver autenticado, devolve null silenciosamente (tratado antes de parsear JSON)
    if (response.status === 401) {
      return null;
    }

    // Para status 200 ou outros erros > 401, usa o helper
    const result = await handleProfileApiResponse<any>(response);

    // ✅ Acessa a propriedade 'profile' dentro da resposta da API que tem a estrutura UserProfileData
    if (result && result.success && result.profile) {
      return result.profile as UserProfileData;
    }

    // Se a resposta foi OK mas não tem a estrutura esperada
    console.warn("getProfile retornou sucesso, mas sem dados de perfil esperados:", result);
    return null;

  } catch (error: any) {
    // Loga erros que não são 401
    if (error.status !== 401) {
        console.error("Error getting profile:", error);
    }
    return null; // Retorna null em caso de qualquer erro, indicando não autenticado ou erro na busca
  }
};


// Atualizar informações pessoais (mantido, apenas ajustado URL base)
export const updatePersonalInfo = async (data: any): Promise<any> => {
  // ✅ Ajuste a URL
  const response = await fetch(`${API_URL}/api/profile/personal-info`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  // Use handleProfileApiResponse para consistência no tratamento de erros
  return handleProfileApiResponse<any>(response);
};

// Atualizar interesses (mantido, apenas ajustado URL base)
export const updateInterests = async (data: any): Promise<any> => {
  // ✅ Ajuste a URL
  const response = await fetch(`${API_URL}/api/profile/interests`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  // Use handleProfileApiResponse para consistência
  return handleProfileApiResponse<any>(response);
};

// Atualizar atividades (mantido, apenas ajustado URL base)
export const updateActivities = async (data: any): Promise<any> => {
  // ✅ Ajuste a URL
  const response = await fetch(`${API_URL}/api/profile/activities`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  // Use handleProfileApiResponse para consistência
  return handleProfileApiResponse<any>(response);
};

// Atualizar conexões sociais (mantido, apenas ajustado URL base)
export const updateSocialConnections = async (data: any): Promise<any> => {
  // ✅ Ajuste a URL
  const response = await fetch(`${API_URL}/api/profile/social-connections`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  // Use handleProfileApiResponse para consistência
  return handleProfileApiResponse<any>(response);
};

function handleProfileApiResponse<T>(response: Response): any {
  throw new Error("Function not implemented.");
}
