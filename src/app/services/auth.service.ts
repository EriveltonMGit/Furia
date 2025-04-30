const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://furia-backend-8tck.onrender.com";

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
  };
  error?: string;
}

// Registrar novo usuário
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    // Verifique se a resposta é JSON antes de tentar parsear
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Resposta inesperada: ${text}`);
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Erro no registro: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Login corrigido
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

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
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Obter usuário atual corrigido
export const getCurrentUser = async (): Promise<any|null> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
    });

    // Se não estiver autenticado, devolve null silenciosamente
    if (response.status === 401) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("Resposta inesperada ao buscar usuário atual");
    }

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Falha ao obter usuário atual");
    }

    return result.user;
  } catch (error: any) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Logout corrigido
export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || 'Failed to logout');
    }
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Verificar autenticação
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};
