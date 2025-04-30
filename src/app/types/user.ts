// src/types/user.ts

// Interface para a estrutura completa dos dados do perfil do usuário
// Reflete a estrutura retornada pela sua API /api/profile + dados adicionais no frontend
interface UserProfileData {
    user?: { // Objeto user da API. Pode ser opcional/nulo inicialmente ou se a API retornar assim.
      id: number;
      name: string;
      email: string;
      role: string;
      created_at: string;
    };
    profile?: { // Objeto profile da API. Pode ser opcional/nulo.
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
      verification_status?: string | null;
      fan_level?: string | null;
      fan_points?: number | null;
      created_at?: string;
      updated_at?: string;
    } | null; // O objeto profile retornado pela API pode ser null
  
    // Objetos aninhados para interesses, atividades, etc. da API
    interests?: { // Objeto interests da API. Pode ser nulo.
        favoriteGames?: string[]; // Assumindo que safeJsonParse os transforma em arrays de strings
        favoriteTeams?: string[];
        followedPlayers?: string[];
        preferredPlatforms?: string[];
    } | null;
    activities?: { // Objeto activities da API. Pode ser nulo.
        eventsAttended?: string[];
        purchasedMerchandise?: string[];
        subscriptions?: string[];
        competitionsParticipated?: string[];
    } | null;
    socialConnections?: { // Objeto socialConnections da API. Pode ser nulo.
        twitter?: string | number | null; // Baseado no seu exemplo (0)
        instagram?: string | number | null;
        facebook?: string | number | null;
        discord?: string | number | null;
        twitch?: string | number | null;
        steamProfile?: string | null;
        faceitProfile?: string | null;
        hltv?: string | null;
        vlr?: string | null;
        otherProfiles?: string[]; // Assumindo array de strings
    } | null;
  
    // Propriedades adicionais que você inclui no estado userData no frontend
    profileCompletion: number; // Inclua todas as propriedades que você passa
    memberSince: string;
    upcomingEvents: { id: number; name: string; date: string; location: string }[];
    exclusiveOffers: { id: number; name: string; expires: string; code?: string }[];
    recentActivity: { id: number; type: string; description: string; date: string }[];
  }
  
  // Exporte a interface
  export type { UserProfileData };