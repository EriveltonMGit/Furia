"use client"

import { useState, useEffect } from "react"
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
import { getProfile } from "../services/profile.service"
import router from "next/router"
import { Button } from "../components/ui/button"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile()
        setUserData({
          user: {
            id: profile.user.id,
            name: profile.user.name,
            email: profile.user.email,
            role: profile.user.role,
            created_at: profile.user.created_at
          },
          profile: {
            // cpf: profile.profile.cpf,
            // birth_date: profile.profile.birth_date,
            // address: profile.profile.address,
            // city: profile.profile.city,
            // state: profile.profile.state,
            // zip_code: profile.profile.zip_code,
            // phone: profile.profile.phone,
            // verification_status: profile.profile.verification_status,
            // fan_level: profile.profile.fan_level,
            // fan_points: profile.profile.fan_points
          },
          // Dados adicionais para as outras seções
          profileCompletion: 85,
          memberSince: new Date(profile.user.created_at).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' }),
          interests: ["CS:GO", "Valorant", "League of Legends"],
          socialConnections: ["Twitter", "Instagram", "Discord"],
          upcomingEvents: [
            { id: 1, name: "FURIA vs Liquid - ESL Pro League", date: "15/05/2025", location: "São Paulo, Brasil" },
            { id: 2, name: "Meet & Greet com Jogadores FURIA", date: "22/05/2025", location: "Online" },
          ],
          exclusiveOffers: [
            { id: 1, name: "Desconto de 20% na nova camisa", expires: "30/05/2025", code: "FURIA20" },
            { id: 2, name: "Acesso antecipado ao novo merchandise", expires: "15/06/2025" },
          ],
          recentActivity: [
            { id: 1, type: "event", description: "Participou do evento FURIA Fan Day", date: "10/04/2025" },
            { id: 2, type: "purchase", description: "Comprou ingresso para ESL Pro League", date: "05/04/2025" },
            { id: 3, type: "social", description: "Compartilhou conteúdo da FURIA no Twitter", date: "01/04/2025" },
          ]
        })
      } catch (error) {
        console.error("Erro ao carregar perfil:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>

      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center">
        <p>Erro ao carregar os dados do usuário</p>
         {/* Adicionado o botão */}
                 <Button onClick={() => router.push('/login')} className="bg-[#00FF00] text-black hover:bg-[#00CC00]">
          Ir para Login
        </Button>
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