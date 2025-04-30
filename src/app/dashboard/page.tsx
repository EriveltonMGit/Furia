// src/app/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
// Importação correta do roteador para App Router
import { useRouter } from "next/navigation" 
import { Tabs, TabsContent } from "../components/ui/tabs"
import { ProfileOverview } from "../components/dashboard/profile-overview"
import { FanEngagement } from "../components/dashboard/fan-engagement"
import { ExclusiveOffers } from "../components/dashboard/exclusive-offers"
import { UpcomingEvents } from "../components/dashboard/upcoming-events"
import { DashboardHeader } from "../components/dashboard/dashboard-header"
import { DashboardSidebar } from "../components/dashboard/dashboard-sidebar"
import ChatPage from "../chat/page" // Verifique o caminho real deste componente
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute" // Verifique o caminho real deste componente
import CommunityPage from "../community/page" // Verifique o caminho real deste componente
// Importe as funções de API do seu arquivo de serviço
// Certifique-se que este arquivo (e as funções getProfile/logout nele) esteja corrigido conforme as orientações anteriores
import { getProfile, logout } from "../services/profile.service" // Ajuste o caminho conforme necessário (ex: '../services/profile.service' ou '../services/api.service')
import { Button } from "../components/ui/button" // Verifique o caminho real deste componente
import { toast } from "react-hot-toast" // Verifique se você tem react-hot-toast instalado

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
        // Tenta carregar o perfil. getProfile deve lançar um erro com status 401 se não autenticado.
        const profile = await getProfile()
        
        if (!profile || !profile.user) {
          // Isso captura casos onde a API pode retornar 200, mas com dados inesperados/vazios
          throw new Error("Dados do usuário incompletos recebidos")
        }

        // Se sucesso, define os dados do usuário e limpa o erro
        setUserData({
          user: {
            id: profile.user.id,
            name: profile.user.name,
            email: profile.user.email,
            role: profile.user.role,
            created_at: profile.user.created_at 
          },
          profile: profile.profile || {}, 
          profileCompletion: calculateProfileCompletion(profile),
          memberSince: profile.user.created_at ? new Date(profile.user.created_at).toLocaleDateString('pt-BR', { 
            year: 'numeric', 
            month: 'long' 
          }) : 'Data desconhecida',
          interests: profile.interests || [], 
          socialConnections: profile.socialConnections || [], 
          upcomingEvents: profile.upcomingEvents || [],
          exclusiveOffers: profile.exclusiveOffers || [],
          recentActivity: profile.recentActivity || []
        })
        setError(null) // Limpa qualquer erro anterior
      } catch (error: any) {
        console.error("Erro ao carregar perfil:", error)
        // Define a mensagem de erro para exibição na UI
        setError(error.message || "Erro ao carregar dados do usuário")
        
        // **Lógica para redirecionamento automático em caso de 401**
        if (error.status === 401) { 
          console.log("Erro 401 detectado, redirecionando para login...");
          // Chama logout no frontend para limpar o cookie localmente (se existir no browser)
          await logout(); 
          toast.error("Sessão expirada. Por favor, faça login novamente.")
          // **Redireciona usando router.push (método preferencial do Next.js)**
          // Se esta chamada falhar (devido ao erro "No router instance"), o catch abaixo do useEffect NÃO pega.
          // O fallback está na função `redirectToLogin` usada no onClick do botão.
          router.push('/login');
        } else {
          // Para outros erros, apenas exibe a mensagem (sem redirecionar automaticamente)
          toast.error(error.message || "Erro ao carregar dados.")
        }
      } finally {
        setLoading(false) // Esconde o spinner de loading
      }
    }

    fetchProfile()
  }, [router]) // Adicionado router como dependência para boa prática com useEffect

  // ... Funções auxiliares (calculateProfileCompletion, handleRetry) ...
  // Função para calcular a completude do perfil (mantida)
  const calculateProfileCompletion = (profile: any) => {
    let completion = 0;
    const totalFields = 5; 
    if (profile?.user?.name) completion += 1;
    if (profile?.user?.email) completion += 1;
    if (profile?.interests?.length > 0) completion += 1;
    if (profile?.recentActivity?.length > 0) completion += 1; 
    if (profile?.socialConnections?.length > 0) completion += 1;
    return Math.min(100, (completion / totalFields) * 100);
  }

  // Função para tentar recarregar os dados (mantida)
  const handleRetry = async () => {
    setLoading(true)
    setError(null)
    try {
      const profile = await getProfile()
      if (!profile || !profile.user) {
        throw new Error("Dados do usuário incompletos recebidos ao tentar novamente")
      }
      setUserData({
        user: { id: profile.user.id, name: profile.user.name, email: profile.user.email, role: profile.user.role, created_at: profile.user.created_at },
        profile: profile.profile || {},
        profileCompletion: calculateProfileCompletion(profile),
        memberSince: profile.user.created_at ? new Date(profile.user.created_at).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' }) : 'Data desconhecida',
        interests: profile.interests || [], socialConnections: profile.socialConnections || [], upcomingEvents: profile.upcomingEvents || [], exclusiveOffers: profile.exclusiveOffers || [], recentActivity: profile.recentActivity || []
      })
      setError(null)
      toast.success("Dados recarregados com sucesso!")
    } catch (error: any) {
      console.error("Erro ao tentar recarregar perfil:", error);
      if (error.status === 401) {
        console.log("Erro 401 detectado ao tentar novamente, redirecionando...");
        await logout();
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        router.push('/login');
      } else {
        setError(error.message || "Falha ao recarregar os dados. Tente novamente mais tarde.")
        toast.error(error.message || "Falha ao recarregar.")
      }
    } finally {
      setLoading(false)
    }
  }


  // **Função para redirecionar - usa router.push por padrão com fallback**
  // Esta função é a chave para garantir que o botão funcione mesmo com o erro "No router instance found"
  const redirectToLogin = () => {
    try {
      console.log("Attempting redirect with router.push");
      router.push('/login');
    } catch (e) {
      console.error("router.push failed for button click, using window.location:", e);
      // Fallback para redirecionamento nativo do navegador se router.push falhar
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
        <div className="flex gap-4">
          <Button 
            // **Usa a nova função redirectToLogin no onClick do botão**
            onClick={redirectToLogin} 
            className="bg-[#00FF00] text-black hover:bg-[#00CC00]"
          >
            Ir para Login
          </Button>
          {/* Mostra o botão de tentar novamente apenas se não for um erro 401 (sessão expirada já redireciona automaticamente) */}
          {/* A condição verifica se `error` existe, é uma string e NÃO inclui '401'. Ajuste a string '401' se a mensagem de erro mudar. */}
          {error && typeof error === 'string' && !error.includes('401') && ( 
          <Button 
            onClick={handleRetry} 
            variant="outline" 
            className="text-white border-white hover:bg-gray-800"
          >
            Tentar Novamente
          </Button>
          )}
        </div>
      </div>
    )
  }

  // Conteúdo normal do dashboard se não houver erro e userData existir
  return (
    <ProtectedRoute> {/* Certifique-se de que ProtectedRoute envolva apenas o conteúdo que necessita de autenticação */}
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <DashboardHeader userData={userData} setActiveTab={setActiveTab} />

        <div className="container mx-auto py-6 flex flex-col md:flex-row gap-6">
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex-1">
            {/* TabsList ficaria aqui, no DashboardSidebar ou em DashboardHeader dependendo do design */}
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