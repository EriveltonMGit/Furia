// src/services/api.service.ts ou onde suas funções de API estão

// URL base da API (usando a variável de ambiente para produção ou localhost)
// Corrigido: Deve ser apenas a base do backend, sem a parte /api/...
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
    // Adicione outros campos do usuário que espera receber, como created_at
    created_at?: string;
    // Remova password daqui, nunca envie a senha de volta
    // password?: string; 
  };
  error?: string;
}

// --- Funções de Autenticação ---

// Registrar novo usuário
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    // Corrigido: Adiciona /api/auth/register APÓS o API_URL base
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Importante para enviar cookies
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Resposta inesperada no registro:", text);
      throw new Error(`Resposta inesperada do servidor (${response.status}).`);
    }

    const result = await response.json();

    if (!response.ok) {
      console.error("Erro no registro:", result);
      throw new Error(result.message || `Erro no registro: ${response.status}`);
    }

    return result;
  } catch (error: any) {
    console.error("Registration error catch:", error);
    throw error;
  }
};

// Login de usuário
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    // Corrigido: Adiciona /api/auth/login APÓS o API_URL base
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Importante para enviar cookies
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Resposta inesperada no login:", text);
      throw new Error(`Resposta inesperada do servidor (${response.status}).`);
    }

    const result = await response.json();

    if (!response.ok) {
      console.error("Login failed:", {
        status: response.status,
        statusText: response.statusText,
        error: result,
      });
      throw new Error(result.message || `Login failed with status ${response.status}`);
    }

    return result;
  } catch (error: any) {
    console.error("Login error catch:", error);
    throw error;
  }
};

// Obter usuário atual
export const getCurrentUser = async (): Promise<any|null> => {
  try {
    // Corrigido: Adiciona /api/auth/me APÓS o API_URL base
    const response = await fetch(`${API_URL}/api/auth/me`, {
      credentials: "include", // Importante para enviar cookies
    });

    // Se não estiver autenticado, devolve null silenciosamente
    if (response.status === 401) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Resposta inesperada no getCurrentUser:", text);
      throw new Error("Resposta inesperada ao buscar usuário atual");
    }

    const result = await response.json();
    if (!response.ok) {
      console.error("Falha ao obter usuário atual:", result);
      throw new Error(result.message || "Falha ao obter usuário atual");
    }
    
    // A resposta do backend em /me retorna { success: true, user: { ... } }
    return result.user; 

  } catch (error: any) {
    // console.error("Error getting current user:", error); // Evitar logar erros 401 esperados
    // A função Protect middleware já trata e retorna 401
    return null; // Retorna null em caso de qualquer erro, indicando não autenticado
  }
};

// Logout
// Removida a definição duplicada de logout
export const logout = async (): Promise<void> => {
  try {
    // Corrigido: Adiciona /api/auth/logout APÓS o API_URL base
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Importante para enviar cookies
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      // Mesmo que a resposta não seja JSON, se o status for OK, consideramos sucesso
      if (response.ok) return; 
      const text = await response.text();
      console.error("Resposta inesperada no logout:", text);
      throw new Error(`Resposta inesperada do servidor (${response.status}).`);
    }

    const result = await response.json();

    if (!response.ok) {
      console.error('Falha no logout:', result);
      throw new Error(result.message || 'Failed to logout');
    }
  } catch (error: any) {
    console.error('Logout error catch:', error);
    throw error;
  }
};


// Verificar autenticação
// Esta função agora depende apenas de getCurrentUser
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};


// --- Funções de Perfil ---

// Obter o perfil completo do usuário
export const getProfile = async (): Promise<any> => {
  try {
    // Corrigido: Adiciona /api/profile APÓS o API_URL base
    // Note: O backend espera GET para /api/profile (sem sub-caminho adicional)
    const response = await fetch(`${API_URL}/api/profile`, { 
      credentials: 'include', // Importante para enviar cookies
      headers: { 'Content-Type': 'application/json' }
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Resposta inesperada no getProfile:", text);
      throw new Error(`Resposta inesperada do servidor (${response.status}).`);
    }

    if (!response.ok) {
      const error = await response.json();
      console.error("Erro ao carregar perfil:", error);
      // Lança o erro do backend, que pode ser 401 se não estiver autenticado
      const errorMessage = error.message || `Erro ao carregar perfil: Status ${response.status}`;
      const httpError = new Error(errorMessage);
      (httpError as any).status = response.status; // Adiciona o status para tratamento no Dashboard
      throw httpError;
    }

    return await response.json();
  } catch (error: any) {
    console.error('getProfile error catch:', error);
    throw error; // Re-lança o erro para ser tratado no componente que chama
  }
};


// Atualizar informações pessoais
export const updatePersonalInfo = async (data: any): Promise<any> => {
  try {
    // Corrigido: Adiciona /api/profile/personal-info APÓS o API_URL base
    const response = await fetch(`${API_URL}/api/profile/personal-info`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Importante para enviar cookies
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      if (response.ok) return response.json(); // Tenta parsear mesmo se Content-Type estiver estranho, se sucesso
      const text = await response.text();
      console.error("Resposta inesperada no updatePersonalInfo:", text);
      throw new Error(`Resposta inesperada do servidor (${response.status}).`);
    }

    const result = await response.json();

    if (!response.ok) {
      console.error('updatePersonalInfo error payload:', result);
      throw new Error(result.message || `Erro ao atualizar informações pessoais: Status ${response.status}`);
    }

    return result;
  } catch (error: any) {
    console.error('updatePersonalInfo error catch:', error);
    throw error;
  }
};

// Atualizar interesses
export const updateInterests = async (data: any): Promise<any> => {
  try {
    // Corrigido: Adiciona /api/profile/interests APÓS o API_URL base
    const response = await fetch(`${API_URL}/api/profile/interests`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Importante para enviar cookies
      body: JSON.stringify(data),
    });
    
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      if (response.ok) return response.json();
      const text = await response.text();
      console.error("Resposta inesperada no updateInterests:", text);
      throw new Error(`Resposta inesperada do servidor (${response.status}).`);
    }

    const result = await response.json();

    if (!response.ok) {
      console.error('updateInterests error payload:', result);
      throw new Error(result.message || `Erro ao atualizar interesses: Status ${response.status}`);
    }

    return result;
  } catch (error: any) {
    console.error('updateInterests error catch:', error);
    throw error;
  }
};

// Atualizar atividades
export const updateActivities = async (data: any): Promise<any> => {
  try {
    // Corrigido: Adiciona /api/profile/activities APÓS o API_URL base
    const response = await fetch(`${API_URL}/api/profile/activities`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Importante para enviar cookies
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      if (response.ok) return response.json();
      const text = await response.text();
      console.error("Resposta inesperada no updateActivities:", text);
      throw new Error(`Resposta inesperada do servidor (${response.status}).`);
    }

    const result = await response.json();

    if (!response.ok) {
      console.error('updateActivities error payload:', result);
      throw new Error(result.message || `Erro ao atualizar atividades: Status ${response.status}`);
    }

    return result;
  } catch (error: any) {
    console.error('updateActivities error catch:', error);
    throw error;
  }
};

// Atualizar conexões sociais
export const updateSocialConnections = async (data: any): Promise<any> => {
  try {
    // Corrigido: Adiciona /api/profile/social-connections APÓS o API_URL base
    const response = await fetch(`${API_URL}/api/profile/social-connections`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Importante para enviar cookies
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      if (response.ok) return response.json();
      const text = await response.text();
      console.error("Resposta inesperada no updateSocialConnections:", text);
      throw new Error(`Resposta inesperada do servidor (${response.status}).`);
    }

    const result = await response.json();

    if (!response.ok) {
      console.error('updateSocialConnections error payload:', result);
      throw new Error(result.message || `Erro ao atualizar conexões sociais: Status ${response.status}`);
    }

    return result;
  } catch (error: any) {
    console.error('updateSocialConnections error catch:', error);
    throw error;
  }
};