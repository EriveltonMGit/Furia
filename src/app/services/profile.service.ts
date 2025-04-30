// URL base da API de perfil (usando a variável de ambiente para produção ou localhost)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
// Obter o perfil completo do usuário
// Obter o perfil completo do usuário
export const getProfile = async (): Promise<any> => {
    try { // Adicionado try/catch para melhor robustez na própria função de serviço
      // Corrigido: Adiciona /api/profile/ (com a barra final) APÓS o API_URL base
      const response = await fetch(`${API_URL}/api/profile/`, { 
        credentials: 'include', // Importante para enviar cookies
        headers: { 'Content-Type': 'application/json' }
      });
  
      const contentType = response.headers.get("content-type") || "";
      // Melhoria: Verifica se a resposta não é OK E se não é JSON (como uma página 404 padrão)
      if (!response.ok && !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Erro HTTP não-JSON ao carregar perfil:", response.status, text);
        // Lança um erro com o status para tratamento no frontend
        const httpError = new Error(`Erro de rede ou servidor: Status ${response.status}`);
        (httpError as any).status = response.status;
        throw httpError;
      }
  
      // Se a resposta for OK (200) ou não OK (401, 404, etc.) mas for JSON
      const result = await response.json();
  
      if (!response.ok) {
        console.error("Erro retornado pelo backend ao carregar perfil:", result);
        // Lança o erro do backend, que pode ser 401 (Não Autorizado)
        const errorMessage = result.message || `Erro ao carregar perfil: Status ${response.status}`;
        const httpError = new Error(errorMessage);
        (httpError as any).status = response.status; // Adiciona o status para tratamento no Dashboard
        throw httpError;
      }
      
      // Se chegou aqui, a resposta foi OK e parseada como JSON
      return result; // Retorna os dados do perfil (que o dashboard espera ter a chave 'user')
  
    } catch (error: any) {
      console.error('getProfile error catch:', error);
      // Se o erro já tem um status (ex: do fetch error ou erro que adicionamos status), mantém
      // Senão, é um erro inesperado (ex: problema de rede)
      if (!error.status && error.message) {
          // Pode ser um erro de rede antes de receber o status HTTP
          error.message = `Erro de comunicação: ${error.message}`;
      }
      throw error; // Re-lança o erro para ser tratado no componente que chama (dashboard)
    }
  };

  
// Atualizar informações pessoais
export const updatePersonalInfo = async (data: any): Promise<any> => {
  const response = await fetch(`${API_URL}/personal-info`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const result = await response.json();

  if (!response.ok) {
    console.error('updatePersonalInfo error payload:', result);
    throw new Error(result.message || `Erro ao atualizar informações pessoais: Status ${response.status}`);
  }

  return result;
};

// Atualizar interesses
export const updateInterests = async (data: any): Promise<any> => {
  const response = await fetch(`${API_URL}/interests`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const result = await response.json();

  if (!response.ok) {
    console.error('updateInterests error payload:', result);
    throw new Error(result.message || `Erro ao atualizar interesses: Status ${response.status}`);
  }

  return result;
};

// Atualizar atividades
export const updateActivities = async (data: any): Promise<any> => {
  const response = await fetch(`${API_URL}/activities`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const result = await response.json();

  if (!response.ok) {
    console.error('updateActivities error payload:', result);
    throw new Error(result.message || `Erro ao atualizar atividades: Status ${response.status}`);
  }

  return result;
};

// Atualizar conexões sociais
export const updateSocialConnections = async (data: any): Promise<any> => {
  const response = await fetch(`${API_URL}/social-connections`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const result = await response.json();

  if (!response.ok) {
    console.error('updateSocialConnections error payload:', result);
    throw new Error(result.message || `Erro ao atualizar conexões sociais: Status ${response.status}`);
  }

  return result;
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
