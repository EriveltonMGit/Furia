
interface UserProfileData {
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
  
    // Objetos aninhados para interesses, atividades, etc. da API
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
  
    // Propriedades adicionais que você inclui no estado userData no frontend
    profileCompletion: number; 
    memberSince: string;
    upcomingEvents: { id: number; name: string; date: string; location: string }[];
    exclusiveOffers: { id: number; name: string; expires: string; code?: string }[];
    recentActivity: { id: number; type: string; description: string; date: string }[];
  }
  
  // Exporte a interface
  export type { UserProfileData };

  // Tipos para a verificação
export interface VerificationResult {
  success: boolean;
  faceVerified: boolean;
  confidence?: number;
  reasons?: string[];
  message?: string;
}