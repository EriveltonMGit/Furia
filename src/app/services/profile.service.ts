// URL base da API de perfil (usando a variável de ambiente para produção ou localhost)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/profile';

// Obter o perfil completo do usuário
export const getProfile = async (): Promise<any> => {
  const response = await fetch(`${API_URL}`, {
    credentials: 'include',
  });
  const result = await response.json();

  if (!response.ok) {
    // Log de erro detalhado
    console.error('getProfile error payload:', result);
    throw new Error(result.message || `Erro ao obter perfil: Status ${response.status}`);
  }

  // Backend retorna { success, profile: profileData }
  return result.profile;
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
