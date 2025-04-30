// services/auth.service.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
      // Note a mudança aqui
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
      // Corrigido
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
      throw new Error(
        result.message || `Login failed with status ${response.status}`
      );
    }

    return result;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Obter usuário atual corrigido
export const getCurrentUser = async (showError: boolean = true): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
    });

    const contentType = response.headers.get("content-type");
    let result = null;

    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      const text = await response.text();
      if (showError) console.warn("Resposta não é JSON:", text);
    }

    if (!response.ok) {
      if (showError) {
        console.error("Failed to get current user:", {
          status: response.status,
          statusText: response.statusText,
          error: result,
        });
      }
      throw new Error(result?.message || `Failed to get current user with status ${response.status}`);
    }

    return result?.user;
  } catch (error) {
    if (showError) console.error("Error getting current user:", error);
    throw error;
  }
};




export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, { // Corrigido
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


export const isAuthenticated = async (): Promise<boolean> => {
  try {
    await getCurrentUser(false); // não mostra erro no console
    return true;
  } catch {
    return false;
  }
};