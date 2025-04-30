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
import ChatPage from "../chat/page"
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute"
import CommunityPage from "../community/page"
import { getProfile, logout } from "../services/profile.service"
import { Button } from "../components/ui/button"
import { toast } from "react-hot-toast"

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile()
        
        if (!profile || !profile.user) {
          throw new Error("Dados do usuário não encontrados")
        }

        setUserData({
          user: {
            id: profile.user.id,
            name: profile.user.name,
            email: profile.user.email,
            role: profile.user.role,
            created_at: profile.user.created_at
          },
          profile: profile.profile || {}, // Usa os dados do perfil ou objeto vazio
          profileCompletion: calculateProfileCompletion(profile),
          memberSince: new Date(profile.user.created_at).toLocaleDateString('pt-BR', { 
            year: 'numeric', 
            month: 'long' 
          }),
          interests: profile.interests || ["CS:GO", "Valorant", "League of Legends"],
          socialConnections: profile.socialConnections || ["Twitter", "Instagram", "Discord"],
          upcomingEvents: profile.upcomingEvents || [
            { id: 1, name: "FURIA vs Liquid - ESL Pro League", date: "15/05/2025", location: "São Paulo, Brasil" },
            { id: 2, name: "Meet & Greet com Jogadores FURIA", date: "22/05/2025", location: "Online" },
          ],
          exclusiveOffers: profile.exclusiveOffers || [
            { id: 1, name: "Desconto de 20% na nova camisa", expires: "30/05/2025", code: "FURIA20" },
            { id: 2, name: "Acesso antecipado ao novo merchandise", expires: "15/06/2025" },
          ],
          recentActivity: profile.recentActivity || [
            { id: 1, type: "event", description: "Participou do evento FURIA Fan Day", date: "10/04/2025" },
            { id: 2, type: "purchase", description: "Comprou ingresso para ESL Pro League", date: "05/04/2025" },
            { id: 3, type: "social", description: "Compartilhou conteúdo da FURIA no Twitter", date: "01/04/2025" },
          ]
        })
        setError(null)
      } catch (error: any) {
        console.error("Erro ao carregar perfil:", error)
        setError(error.message || "Erro ao carregar dados do usuário")
        
        // Se for erro 401 (não autorizado), faz logout
        if (error.message.includes('401')) {
          await logout()
          toast.error("Sessão expirada. Por favor, faça login novamente.")
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const calculateProfileCompletion = (profile: any) => {
    // Implemente sua lógica de cálculo de completude do perfil
    return 85 // Exemplo fixo - ajuste conforme necessário
  }

  const handleRetry = async () => {
    setLoading(true)
    setError(null)
    try {
      const profile = await getProfile()
      setUserData({
        ...userData,
        ...profile
      })
    } catch (error) {
      setError("Falha ao recarregar os dados. Tente novamente mais tarde.")
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
          <Button 
            onClick={handleRetry} 
            variant="outline" 
            className="text-white border-white hover:bg-gray-800"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <DashboardHeader userData={userData} setActiveTab={setActiveTab} />

        <div className="container mx-auto py-6 flex flex-col md:flex-row gap-6">
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex-1">
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