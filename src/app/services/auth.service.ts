// src/services/api.service.ts

// URL base da API (usando a variável de ambiente para produção ou localhost)
// CORRIGIDO: Deve ser apenas a base do backend (ex: https://furia-backend-8tck.onrender.com ou http://localhost:5000)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Interfaces de dados (mantidas)
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role?: string;
    created_at?: string | Date; 
  };
  error?: string;
}

// --- Funções Auxiliares ---

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
            // Se esperava JSON mas falhou, trata como resposta inesperada
            const parseError = new Error(`Resposta inesperada do servidor (${response.status}). Erro ao parsear JSON.`);
            (parseError as any).status = response.status; // Adiciona o status
            throw parseError;
        }
    }

    if (!response.ok) {
        // Se a resposta não foi OK, lança um erro com informações do backend (se JSON) ou status
        const errorMsg = isJson && result && result.message ? result.message : `Erro do servidor: Status ${response.status}`;
        const httpError = new Error(errorMsg);
        // Adiciona o status ao erro para tratamento no frontend (ex: dashboard)
        (httpError as any).status = response.status; 
        // Opcional: adicionar outros detalhes do resultado JSON ao erro
        if (isJson && result) {
             (httpError as any).details = result;
        }
        console.error(`API Error: ${response.status} - ${errorMsg}`, isJson ? result : await response.text());
        throw httpError;
    }

    // Se a resposta foi OK, retorna o resultado JSON (ou null se não for JSON e for 204 No Content)
    if (!isJson && response.status === 204) return null as T; 
    if (!isJson) {
         console.warn(`API Success with non-JSON response: ${response.status}`, await response.text());
         // Se chegou aqui e é OK mas não é JSON, pode ser um problema inesperado na API
         // Dependendo do caso, pode querer lançar um erro ou retornar algo diferente.
         // Por enquanto, vamos lançar um erro para alertar.
         const nonJsonError = new Error(`Resposta de sucesso inesperada do servidor (${response.status}). Não é JSON.`);
         (nonJsonError as any).status = response.status;
         throw nonJsonError;
    }

    return result as T;
}


// --- Funções de Autenticação ---

// Registrar novo usuário
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  // CORRIGIDO: Adiciona /api/auth/register APÓS o API_URL base
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Importante para enviar cookies
    body: JSON.stringify(data),
  });
  return handleApiResponse<AuthResponse>(response); // Usa helper
};

// Login de usuário
export const login = async (data: LoginData): Promise<AuthResponse> => {
  // CORRIGIDO: Adiciona /api/auth/login APÓS o API_URL base
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Importante para enviar cookies
    body: JSON.stringify(data),
  });
  return handleApiResponse<AuthResponse>(response); // Usa helper
};

// Obter usuário atual
export const getCurrentUser = async (): Promise<AuthResponse['user'] | null> => {
  try {
    // CORRIGIDO: Adiciona /api/auth/me APÓS o API_URL base
    const response = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });

    // Se não estiver autenticado, devolve null silenciosamente (tratado antes de parsear JSON)
    if (response.status === 401) {
      return null;
    }
    
    // Para status 200 ou outros erros > 401, usa o helper
    const result = await handleApiResponse<AuthResponse>(response);

    // Se a resposta foi OK e parseada, retorna o objeto user dentro dela
    // O backend /api/auth/me retorna { success: true, user: {...} }
    return result.user || null; // Retorna result.user ou null se user não existir inesperadamente

  } catch (error: any) {
    // Loga erros que não são 401 (401 é retornado como null acima)
    // Se o erro tem status e não é 401, ou se não tem status (erro de rede)
    if (error.status !== 401) {
        console.error("Error getting current user:", error);
    }
    return null; // Retorna null em caso de qualquer erro, indicando não autenticado
  }
};

// Logout
// CORRIGIDO: Função logout exportada e usando API_URL base correto
export const logout = async (): Promise<void> => {
  // CORRIGIDO: Adiciona /api/auth/logout APÓS o API_URL base
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include', // Importante para enviar cookies
  });
  
  // Usa o helper para tratar a resposta. Espera 200/204 para sucesso.
  try {
      await handleApiResponse<any>(response); 
  } catch (error: any) {
      console.error('Logout error catch:', error);
      throw error; // Re-lança o erro
  }
};


// Verificar autenticação (mantida)
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};


// --- Funções de Perfil ---

// Obter o perfil completo do usuário
export const getProfile = async (): Promise<any> => {
  // CORRIGIDO: Adiciona /api/profile/ (com a barra final) APÓS o API_URL base
  // Isto é CRUCIAL para o erro 404 que você estava vendo!
  const response = await fetch(`${API_URL}/api/profile/`, { 
    credentials: 'include', // Importante para enviar cookies
    headers: { 'Content-Type': 'application/json' }
  });

  // Usa helper para tratar a resposta. Espera { success: true, user: {...}, profile: {...}, interests: [...], ... }
  return handleApiResponse<any>(response); 
};


// Funções de atualização de perfil (mantidas, apenas usando o API_URL base correto)
export const updatePersonalInfo = async (data: any): Promise<any> => {
  // CORRIGIDO: Adiciona /api/profile/personal-info APÓS o API_URL base
  const response = await fetch(`${API_URL}/api/profile/personal-info`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    credentials: 'include', body: JSON.stringify(data),
  });
  return handleApiResponse<any>(response);
};

export const updateInterests = async (data: any): Promise<any> => {
  // CORRIGIDO: Adiciona /api/profile/interests APÓS o API_URL base
  const response = await fetch(`${API_URL}/api/profile/interests`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    credentials: 'include', body: JSON.stringify(data),
  });
  return handleApiResponse<any>(response);
};

export const updateActivities = async (data: any): Promise<any> => {
  // CORRIGIDO: Adiciona /api/profile/activities APÓS o API_URL base
  const response = await fetch(`${API_URL}/api/profile/activities`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    credentials: 'include', body: JSON.stringify(data),
  });
  return handleApiResponse<any>(response);
};

export const updateSocialConnections = async (data: any): Promise<any> => {
  // CORRIGIDO: Adiciona /api/profile/social-connections APÓS o API_URL base
  const response = await fetch(`${API_URL}/api/profile/social-connections`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    credentials: 'include', body: JSON.stringify(data),
  });
  return handleApiResponse<any>(response);
};

// ** Se você tem a lógica de login com Google em outro arquivo (ex: firebase.ts)
// ** e essa lógica faz o fetch para o backend, certifique-se que esse outro arquivo
// ** importa e usa o API_URL CORRETO definido aqui.

// Exemplo de como seria a função googleLoginFrontendFlow se estivesse neste arquivo
/*
import { auth, googleProvider } from './firebase-config-file'; // Exemplo de importação do Firebase Auth

export const googleLoginFrontendFlow = async (): Promise<AuthResponse> => {
    const result = await signInWithPopup(auth, googleProvider); 
    const token  = await result.user.getIdToken(); 

    const response = await fetch(`${API_URL}/api/auth/google`, { // Usa API_URL corrigido
      method:      'POST',
      headers:     { 'Content-Type': 'application/json' },
      credentials: 'include', 
      body:        JSON.stringify({ token }) 
    });

    return handleApiResponse<AuthResponse>(response);
};
*/
