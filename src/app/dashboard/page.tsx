"use client"

import { useState, useEffect } from "react"
// Importação correta do roteador para App Router
import { useRouter } from "next/navigation"
import { Tabs, TabsContent } from "../components/ui/tabs"
// Verifique e ajuste estes caminhos conforme a estrutura do seu projeto
import { ProfileOverview } from "../components/dashboard/profile-overview"
import { FanEngagement } from "../components/dashboard/fan-engagement"
import { ExclusiveOffers } from "../components/dashboard/exclusive-offers"
import { UpcomingEvents } from "../components/dashboard/upcoming-events"
import { DashboardHeader } from "../components/dashboard/dashboard-header"
import { DashboardSidebar } from "../components/dashboard/dashboard-sidebar"
import ChatPage from "../chat/page"
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute"
import { Button } from "../components/ui/button"
import { toast } from "react-hot-toast"

// Importe as funções de API do seu arquivo de serviço unificado (ou do arquivo auth.service/profile.service)
// AJUSTE este caminho se o seu arquivo de serviço estiver em outro local
// Assumindo que getProfile e logout estão no arquivo de serviço de autenticação/perfil
import { getProfile, logout } from "../services/auth.service" // Use o caminho correto para o seu serviço
import CommunityPage from "../community/page"

export default function Dashboard() {
  // Obtém a instância do roteador
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("overview")
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Tenta carregar o perfil. getProfile deve lançar um erro com status (como 401 ou 404).
        const responseData = await getProfile() // Renomeado para responseData para clareza

        // CORRIGIDO: Verifica se a resposta foi bem-sucedida e se contém a estrutura esperada
        if (!responseData || !responseData.success || !responseData.profile || !responseData.profile.user) {
          console.error("API getProfile retornou dados inesperados:", responseData);
          // Lança um erro com uma mensagem clara
          throw new Error("Dados do usuário não encontrados ou incompletos na resposta da API");
        }

        // Acessa os dados aninhados corretamente
        const profileData = responseData.profile; // O objeto 'profile' que contém user, profile, interests, etc.

        // Se sucesso, define os dados do usuário e limpa o erro
        setUserData({
          // CORRIGIDO: Acessa as propriedades aninhadas dentro de profileData
          user: {
            id: profileData.user.id,
            name: profileData.user.name,
            email: profileData.user.email,
            role: profileData.user.role,
            created_at: profileData.user.created_at
          },
          profile: profileData.profile || {}, // Usa os dados do perfil ou objeto vazio
          // CORRIGIDO: Garante que estas propriedades sejam arrays, mesmo que venham nulas/indefinidas
          interests: Array.isArray(profileData.interests) ? profileData.interests : [],
          activities: Array.isArray(profileData.activities) ? profileData.activities : {}, // activities é um objeto no backend
          socialConnections: Array.isArray(profileData.socialConnections) ? profileData.socialConnections : {}, // socialConnections é um objeto no backend
          upcomingEvents: Array.isArray(profileData.upcomingEvents) ? profileData.upcomingEvents : [], // Assumindo que upcomingEvents é um array
          exclusiveOffers: Array.isArray(profileData.exclusiveOffers) ? profileData.exclusiveOffers : [], // Assumindo que exclusiveOffers é um array
          recentActivity: Array.isArray(profileData.recentActivity) ? profileData.recentActivity : [], // Assumindo que recentActivity é um array


          // Outras propriedades que você pode querer adicionar/calcular
          profileCompletion: calculateProfileCompletion(profileData), // Adapte esta função se a estrutura de dados mudar
          memberSince: profileData.user.created_at ? new Date(profileData.user.created_at).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long'
          }) : 'Data desconhecida',
          // Adicione aqui outras propriedades que vêm na resposta da API, se houver
          // Ex: upcomingEvents: profileData.upcomingEvents || [],
          // Ex: exclusiveOffers: profileData.exclusiveOffers || [],
          // Ex: recentActivity: profileData.recentActivity || []
        })
        setError(null) // Limpa qualquer erro anterior
      } catch (error: any) {
        console.error("Erro ao carregar perfil (catch):", error)
        // Define a mensagem de erro para exibição na UI (usa error.message ou genérica)
        setError(error.message || "Erro ao carregar dados do usuário")

        // **Lógica para redirecionamento automático em caso de 401**
        // Agora verifica error.status === 401 (assumindo que o helper em api.service adiciona .status)
        if (error.status === 401) {
          console.log("Erro 401 detectado, redirecionando para login automaticamente...");
          // Chama logout no frontend para limpar o cookie localmente (se existir no browser)
          await logout();
          toast.error("Sessão expirada. Por favor, faça login novamente.")
          // Redireciona usando router.push (método preferencial do Next.js)
          router.push('/login');
        } else {
          // Para outros erros (404, 500, dados incompletos, etc.), exibe a mensagem e deixa o usuário tentar novamente ou ir para login
          toast.error(error.message || "Erro ao carregar dados.")
        }
      } finally {
        setLoading(false) // Esconde o spinner de loading
      }
    }

    fetchProfile()
  }, [router]) // router é dependência

  // Função para calcular a completude do perfil
  // CORRIGIDO: Adapta para a estrutura profileData (que contém user, profile, interests, etc.)
  const calculateProfileCompletion = (profileData: any) => {
    let completion = 0;
    let totalFields = 0;

    // Verifica campos do objeto 'user'
    if (profileData?.user?.name) totalFields++;
    if (profileData?.user?.email) totalFields++;
    if (profileData?.user?.name) completion++; // Exemplo: considera o nome como um campo preenchido
    if (profileData?.user?.email) completion++; // Exemplo: considera o email como um campo preenchido

    // Verifica campos do objeto 'profile' (informações pessoais)
    if (profileData?.profile) {
        totalFields += 7; // cpf, birth_date, address, city, state, zip_code, phone
        if (profileData.profile.cpf) completion++;
        if (profileData.profile.birth_date) completion++;
        if (profileData.profile.address) completion++;
        if (profileData.profile.city) completion++;
        if (profileData.profile.state) completion++;
        if (profileData.profile.zip_code) completion++;
        if (profileData.profile.phone) completion++;
    } else {
        totalFields += 7; // Se o objeto profile nem existe, todos os campos estão faltando
    }


    // Verifica campos do objeto 'interests'
    if (profileData?.interests) { // Verifica se o objeto interests existe
        totalFields += 4; // favoriteGames, favoriteTeams, followedPlayers, preferredPlatforms
        // Verifica se os arrays existem e têm conteúdo
        if (Array.isArray(profileData.interests.favoriteGames) && profileData.interests.favoriteGames.length > 0) completion++;
        if (Array.isArray(profileData.interests.favoriteTeams) && profileData.interests.favoriteTeams.length > 0) completion++;
        if (Array.isArray(profileData.interests.followedPlayers) && profileData.interests.followedPlayers.length > 0) completion++;
        if (Array.isArray(profileData.interests.preferredPlatforms) && profileData.interests.preferredPlatforms.length > 0) completion++;
    } else {
        totalFields += 4; // Se o objeto interests nem existe, todos os campos estão faltando
    }

    // Verifica campos do objeto 'activities' (ajuste conforme sua estrutura real)
     if (profileData?.activities) { // Verifica se o objeto activities existe
        totalFields += 4; // eventsAttended, purchasedMerchandise, subscriptions, competitionsParticipated
        // Verifica se os arrays existem e têm conteúdo
        if (Array.isArray(profileData.activities.eventsAttended) && profileData.activities.eventsAttended.length > 0) completion++;
        if (Array.isArray(profileData.activities.purchasedMerchandise) && profileData.activities.purchasedMerchandise.length > 0) completion++;
        if (Array.isArray(profileData.activities.subscriptions) && profileData.activities.subscriptions.length > 0) completion++;
        if (Array.isArray(profileData.activities.competitionsParticipated) && profileData.activities.competitionsParticipated.length > 0) completion++;
    } else {
        totalFields += 4; // Se o objeto activities nem existe, todos os campos estão faltando
    }

    // Verifica campos do objeto 'socialConnections'
    if (profileData?.socialConnections) { // Verifica se o objeto socialConnections existe
        totalFields += 9; // twitter, instagram, facebook, discord, twitch, steamProfile, faceitProfile, hltv, vlr
        // Verifica se as strings existem e não são vazias, ou se booleanos são true
        if (profileData.socialConnections.twitter && typeof profileData.socialConnections.twitter === 'string' && profileData.socialConnections.twitter !== '') completion++;
        if (profileData.socialConnections.instagram && typeof profileData.socialConnections.instagram === 'string' && profileData.socialConnections.instagram !== '') completion++;
        if (profileData.socialConnections.facebook && typeof profileData.socialConnections.facebook === 'string' && profileData.socialConnections.facebook !== '') completion++;
        if (profileData.socialConnections.discord && typeof profileData.socialConnections.discord === 'string' && profileData.socialConnections.discord !== '') completion++;
        if (profileData.socialConnections.twitch && typeof profileData.socialConnections.twitch === 'string' && profileData.socialConnections.twitch !== '') completion++;
        if (profileData.socialConnections.steamProfile && typeof profileData.socialConnections.steamProfile === 'string' && profileData.socialConnections.steamProfile !== '') completion++;
        if (profileData.socialConnections.faceitProfile && typeof profileData.socialConnections.faceitProfile === 'string' && profileData.socialConnections.faceitProfile !== '') completion++;
        if (profileData.socialConnections.hltv && typeof profileData.socialConnections.hltv === 'string' && profileData.socialConnections.hltv !== '') completion++;
        if (profileData.socialConnections.vlr && typeof profileData.socialConnections.vlr === 'string' && profileData.socialConnections.vlr !== '') completion++;
        // Verifica otherProfiles
        if (Array.isArray(profileData.socialConnections.otherProfiles) && profileData.socialConnections.otherProfiles.length > 0) completion++;
         totalFields++; // Conta otherProfiles como um campo
    } else {
        totalFields += 10; // Se o objeto socialConnections nem existe, todos os campos estão faltando (9 strings/booleans + 1 array)
    }


    // Evita divisão por zero se não houver campos definidos
    if (totalFields === 0) return 0;

    return Math.min(100, (completion / totalFields) * 100);
  }


  // Função para tentar recarregar os dados (mantida, usando getProfile corrigido)
  const handleRetry = async () => {
    setLoading(true)
    setError(null)
    try {
      const responseData = await getProfile() // Chama a API novamente

      // CORRIGIDO: Verifica a estrutura da resposta ao tentar novamente
      if (!responseData || !responseData.success || !responseData.profile || !responseData.profile.user) {
        console.error("API getProfile retornou dados inesperados ao tentar novamente:", responseData);
        throw new Error("Dados do usuário não encontrados ou incompletos na resposta da API ao tentar novamente");
      }

      const profileData = responseData.profile; // O objeto 'profile'

      setUserData({
        // CORRIGIDO: Acessa as propriedades aninhadas dentro de profileData
        user: {
          id: profileData.user.id,
          name: profileData.user.name,
          email: profileData.user.email,
          role: profileData.user.role,
          created_at: profileData.user.created_at
        },
        profile: profileData.profile || {},
        // CORRIGIDO: Garante que estas propriedades sejam arrays, mesmo que venham nulas/indefinidas
        interests: Array.isArray(profileData.interests) ? profileData.interests : [],
        activities: Array.isArray(profileData.activities) ? profileData.activities : {}, // activities é um objeto no backend
        socialConnections: Array.isArray(profileData.socialConnections) ? profileData.socialConnections : {}, // socialConnections é um objeto no backend
        upcomingEvents: Array.isArray(profileData.upcomingEvents) ? profileData.upcomingEvents : [], // Assumindo que upcomingEvents é um array
        exclusiveOffers: Array.isArray(profileData.exclusiveOffers) ? profileData.exclusiveOffers : [], // Assumindo que exclusiveOffers é um array
        recentActivity: Array.isArray(profileData.recentActivity) ? profileData.recentActivity : [], // Assumindo que recentActivity é um array
      })
      setError(null)
      toast.success("Dados recarregados com sucesso!")
    } catch (error: any) {
      console.error("Erro ao tentar recarregar perfil (catch):", error);
      // Verifica se o erro tem status antes de acessar error.status
      if (error && typeof error === 'object' && error.status === 401) {
        console.log("Erro 401 detectado ao tentar novamente, redirecionando...");
        await logout();
        toast.error("Sessão expirada. Por favor, faça login novamente.")
        router.push('/login');
      } else {
        setError(error.message || "Falha ao recarregar os dados. Tente novamente mais tarde.")
        toast.error(error.message || "Falha ao recarregar.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Função para redirecionar - usa router.push por padrão com fallback para window.location.href
  const redirectToLogin = () => {
    try {
      console.log("Attempting redirect with router.push");
      router.push('/login');
    } catch (e) {
      console.error("router.push failed for button click, using window.location:", e);
      window.location.href = '/login';
    }
  };


  // Renderiza o spinner de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Renderiza a tela de erro se houver erro ou userData for null/undefined
  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-red-500 text-center">{error}</p>
        {/* Botões empilhados verticalmente */}
        <div className="flex flex-col gap-4">
          <Button
            onClick={redirectToLogin} // Usa a função com fallback
            className="bg-[#00FF00] text-black hover:bg-[#00CC00]"
          >
            Ir para Login
          </Button>
          {/* Mostra o botão de tentar novamente apenas se não for um erro 401 (sessão expirada já redireciona automaticamente) */}
          {/* Verifica error.status para ser mais preciso */}
          {error && (error as any).status !== 401 && (
            <Button
              onClick={handleRetry}
              variant="outline"
              className="text-white border-white hover:bg-gray-800"
            >
              Tentar Novamente
            </Button>
          )}
        </div>
        {/* Nota: TailwindCSS com flex-col + gap-4 funciona bem para espaçamento vertical */}
      </div>
    )
  }

  // Conteúdo normal do dashboard se não houver erro e userData existir
  return (
    // ProtectedRoute deve envolver o conteúdo que requer autenticação
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        {/* Passa userData completo para os componentes filhos */}
        <DashboardHeader userData={userData} setActiveTab={setActiveTab} />

        <div className="container mx-auto py-6 flex flex-col md:flex-row gap-6">
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex-1">
            {/* TabsList ficaria aqui */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
              <TabsContent value="overview" className="mt-0">
                <ProfileOverview userData={userData} />
              </TabsContent>
              <TabsContent value="engagement" className="mt-0">
                <FanEngagement userData={userData} />
              </TabsContent>
              <TabsContent value="offers" className="mt-0">
                <ExclusiveOffers userData={userData} />
              </TabsContent>
              <TabsContent value="events" className="mt-0">
                <UpcomingEvents userData={userData} />
              </TabsContent>
              <TabsContent value="community" className="mt-0 h-full">
                <CommunityPage userData={userData} />
              </TabsContent>
              <TabsContent value="chat" className="mt-0 h-full">
                <ChatPage />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
