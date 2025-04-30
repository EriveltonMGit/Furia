// src/app/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
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
// Importe as funções de API do seu arquivo de serviço (corrigido)
import { getProfile, logout } from "../services/profile.service" // Ajuste o caminho conforme necessário
import { Button } from "../components/ui/button" // Verifique o caminho real deste componente
import { toast } from "react-hot-toast" // Verifique se você tem react-hot-toast instalado

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // getProfile agora lançará um erro com o status 401 se não autorizad
        const profile = await getProfile()
        
        // Sua lógica de processamento de profile aqui (parece boa)
        if (!profile || !profile.user) {
          // Isso pode acontecer se a API retornar OK, mas com dados inesperados
          throw new Error("Dados do usuário incompletos recebidos")
        }

        setUserData({
          user: {
            id: profile.user.id,
            name: profile.user.name,
            email: profile.user.email,
            role: profile.user.role,
            created_at: profile.user.created_at // Assume que o backend retorna created_at
          },
          profile: profile.profile || {}, 
          profileCompletion: calculateProfileCompletion(profile),
          // Use profile.user.created_at para memberSince
          memberSince: profile.user.created_at ? new Date(profile.user.created_at).toLocaleDateString('pt-BR', { 
            year: 'numeric', 
            month: 'long' 
          }) : 'Data desconhecida',
          // Use os dados retornados pelo backend ou defaults
          interests: profile.interests || [], // Defaults vazios ou específicos
          socialConnections: profile.socialConnections || [], 
          upcomingEvents: profile.upcomingEvents || [],
          exclusiveOffers: profile.exclusiveOffers || [],
          recentActivity: profile.recentActivity || []
        })
        setError(null)
      } catch (error: any) {
        console.error("Erro ao carregar perfil:", error)
        setError(error.message || "Erro ao carregar dados do usuário")
        
        // Verifica se é um erro 401 (Não autorizado)
        if (error.status === 401) { // Usa a propriedade 'status' que adicionamos no erro
          await logout() // Chama o logout para limpar cookies no frontend
          toast.error("Sessão expirada. Por favor, faça login novamente.")
          router.push('/login')
        } else {
          // Para outros erros, talvez apenas exiba a mensagem e não redirecione
          toast.error(error.message || "Erro ao carregar dados.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router]) // Adicionado router como dependência por boa prática

  // ... resto do componente Dashboard (calculateProfileCompletion, handleRetry, JSX)
  const calculateProfileCompletion = (profile: any) => {
    // Implemente sua lógica de cálculo de completude do perfil
    // Exemplo: verifica quais campos estão preenchidos
    let completion = 0;
    const totalFields = 5; // Exemplo: nome, email, interesses, atividades, conexões
    if (profile?.user?.name) completion += 1;
    if (profile?.user?.email) completion += 1;
    if (profile?.interests?.length > 0) completion += 1;
    if (profile?.recentActivity?.length > 0) completion += 1; // Exemplo
    if (profile?.socialConnections?.length > 0) completion += 1; // Exemplo

    return Math.min(100, (completion / totalFields) * 100);
  }

  const handleRetry = async () => {
    setLoading(true)
    setError(null)
    try {
      // A chamada aqui já usa a função getProfile corrigida
      const profile = await getProfile()
      if (!profile || !profile.user) {
        throw new Error("Dados do usuário incompletos recebidos ao tentar novamente")
      }
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
      setError(null)
      toast.success("Dados recarregados com sucesso!")
    } catch (error: any) {
      console.error("Erro ao tentar recarregar perfil:", error);
      // Verifica se é um erro 401 ao tentar recarregar
      if (error.status === 401) {
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


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-red-500 text-center">{error}</p>
        <div className="flex gap-4">
          <Button 
            onClick={() => router.push('/login')} 
            className="bg-[#00FF00] text-black hover:bg-[#00CC00]"
          >
            Ir para Login
          </Button>
          {/* Mostra o botão de tentar novamente apenas se não for um erro 401 (sessão expirada) */}
          {error && !error.includes('401') && ( // Ajuste a condição se a mensagem de erro 401 mudar
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


  return (
    <ProtectedRoute> {/* Certifique-se de que ProtectedRoute envolva apenas o conteúdo que necessita de autenticação */}
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <DashboardHeader userData={userData} setActiveTab={setActiveTab} />

        <div className="container mx-auto py-6 flex flex-col md:flex-row gap-6">
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex-1">
            {/* Use `defaultValue` ou `value` e `onValueChange` com o estado `activeTab` */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
              {/* TabsList ficaria aqui, no DashboardSidebar ou em DashboardHeader dependendo do design */}
              
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
                <CommunityPage userData={userData} /> {/* Passe userData se necessário */}
              </TabsContent>
              
              <TabsContent value="chat" className="mt-0 h-full">
                <ChatPage /> {/* Passe userData se necessário */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}