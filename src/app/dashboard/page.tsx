'use client'; // Mantenha use client no topo

import { useState, useEffect, useRef } from "react" // Importe useRef
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

// Importe o componente ConfettiEffect
import ConfettiEffect from '../components/ui/ConfettiEffect'; 

// Importe as funções de API do seu arquivo de serviço unificado
import { getProfile, logout } from "../services/auth.service" // AJUSTE o caminho se necessário
import CommunityPage from "../community/page"

// Função para calcular a completude do perfil (mantida)
const calculateProfileCompletion = (profileData: any) => {
    let completion = 0;
    let totalFields = 0;

    // Verifica campos do objeto 'user'
    if (profileData?.user?.name) totalFields++;
    if (profileData?.user?.email) totalFields++;
    if (profileData?.user?.name) completion++;
    if (profileData?.user?.email) completion++;

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
        totalFields += 7;
    }

    // Verifica campos do objeto 'interests'
    if (profileData?.interests) {
        totalFields += 4; // favoriteGames, favoriteTeams, followedPlayers, preferredPlatforms
        if (Array.isArray(profileData.interests.favoriteGames) && profileData.interests.favoriteGames.length > 0) completion++;
        if (Array.isArray(profileData.interests.favoriteTeams) && profileData.interests.favoriteTeams.length > 0) completion++;
        if (Array.isArray(profileData.interests.followedPlayers) && profileData.interests.followedPlayers.length > 0) completion++;
        if (Array.isArray(profileData.interests.preferredPlatforms) && profileData.interests.preferredPlatforms.length > 0) completion++;
    } else {
        totalFields += 4;
    }

    // Verifica campos do objeto 'activities'
      if (profileData?.activities) {
        totalFields += 4; // eventsAttended, purchasedMerchandise, subscriptions, competitionsParticipated
        if (Array.isArray(profileData.activities.eventsAttended) && profileData.activities.eventsAttended.length > 0) completion++;
        if (Array.isArray(profileData.activities.purchasedMerchandise) && profileData.activities.purchasedMerchandise.length > 0) completion++;
        if (Array.isArray(profileData.activities.subscriptions) && profileData.activities.subscriptions.length > 0) completion++;
        if (Array.isArray(profileData.activities.competitionsParticipated) && profileData.activities.competitionsParticipated.length > 0) completion++;
    } else {
        totalFields += 4;
    }

    // Verifica campos do objeto 'socialConnections'
    if (profileData?.socialConnections) {
        totalFields += 9; // twitter, instagram, facebook, discord, twitch, steamProfile, faceitProfile, hltv, vlr
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
        totalFields += 10;
    }

    if (totalFields === 0) return 0;

    return Math.min(100, (completion / totalFields) * 100);
}


export default function Dashboard() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("overview");
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Estado para controlar o trigger do confete (agora mais ligado à lógica do localStorage)
    const [triggerConfetti, setTriggerConfetti] = useState(false);

    // Usar useRef para controlar se a verificação de confetti já foi feita
    // Evita disparar a lógica de localStorage em re-renders desnecessários do useEffect
    const hasCheckedConfetti = useRef(false);


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const responseData = await getProfile();

                if (!responseData || !responseData.success || !responseData.profile || !responseData.profile.user) {
                    console.error("API getProfile retornou dados inesperados:", responseData);
                    throw new Error("Dados do usuário não encontrados ou incompletos na resposta da API");
                }

                const profileData = responseData.profile;

                setUserData({
                    user: {
                        id: profileData.user.id,
                        name: profileData.user.name,
                        email: profileData.user.email,
                        role: profileData.user.role,
                        created_at: profileData.user.created_at
                    },
                    profile: profileData.profile || {},
                    interests: Array.isArray(profileData.interests) ? profileData.interests : [],
                    activities: profileData.activities || {},
                    socialConnections: profileData.socialConnections || {},
                    upcomingEvents: Array.isArray(profileData.upcomingEvents) ? profileData.upcomingEvents : [],
                    exclusiveOffers: Array.isArray(profileData.exclusiveOffers) ? profileData.exclusiveOffers : [],
                    recentActivity: Array.isArray(profileData.recentActivity) ? profileData.recentActivity : [],

                    profileCompletion: calculateProfileCompletion(profileData),
                    memberSince: profileData.user.created_at ? new Date(profileData.user.created_at).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long'
                    }) : 'Data desconhecida',
                });
                setError(null);

                // --- Lógica para Confete baseado em localStorage ---
                // Só executa esta lógica se estiver no cliente E ainda não verificou nesta montagem
                if (typeof window !== 'undefined' && !hasCheckedConfetti.current) {
                    const userId = profileData.user.id; // ID do usuário logado
                    const confettiKey = 'confettiShownForUser_' + userId;

                    // Verifica se o confete já foi exibido para este usuário no localStorage
                    const hasConfettiBeenShown = localStorage.getItem(confettiKey);

                    if (!hasConfettiBeenShown) {
                        // Se o confete ainda não foi exibido para este usuário:
                        setTriggerConfetti(true); // Dispara o confete
                        localStorage.setItem(confettiKey, 'true'); // Marca no localStorage que foi exibido
                    }

                    // Marca que a verificação de confetti foi feita para evitar re-disparos nesta montagem
                    hasCheckedConfetti.current = true;
                }
                // --- Fim da Lógica de Confete ---


            } catch (error: any) {
                console.error("Erro ao carregar perfil (catch):", error)
                setError(error.message || "Erro ao carregar dados do usuário")

                if (error.status === 401) {
                    console.log("Erro 401 detectado, redirecionando para login automaticamente...");
                    // Não precisa limpar o item do localStorage aqui, pois ele é por usuário.
                    // O login subsequente (se for o mesmo usuário) não disparará o confete novamente.
                    logout();
                    toast.error("Sessão expirada. Por favor, faça login novamente.")
                    router.push('/login');
                } else {
                    toast.error(error.message || "Erro ao carregar dados.")
                }
            } finally {
                 setLoading(false);
            }
        }

        // Executa o fetchProfile apenas se userData ainda não foi carregado
        // Isso garante que o useEffect não tente refetch dados que já estão lá
        // a menos que a rota mude ou haja um refresh/remontagem.
        if (!userData && loading) {
             fetchProfile();
        }

        // O retorno de limpeza padrão do useEffect. Não há timers de confete aqui.
        return () => {
           // Limpeza opcional do Dashboard useEffect, se necessário (ex: cancelar requisição)
        };

    }, [router, userData, loading]); // Depende de router, userData, loading


    const handleRetry = async () => {
        setLoading(true)
        setError(null)
        try {
            const responseData = await getProfile()

            if (!responseData || !responseData.success || !responseData.profile || !responseData.profile.user) {
                console.error("API getProfile retornou dados inesperados ao tentar novamente:", responseData);
                throw new Error("Dados do usuário não encontrados ou incompletos na resposta da API ao tentar novamente");
            }

            const profileData = responseData.profile;

            setUserData({
                user: {
                    id: profileData.user.id,
                    name: profileData.user.name,
                    email: profileData.user.email,
                    role: profileData.user.role,
                    created_at: profileData.user.created_at
                },
                profile: profileData.profile || {},
                interests: Array.isArray(profileData.interests) ? profileData.interests : [],
                activities: profileData.activities || {},
                socialConnections: profileData.socialConnections || {},
                upcomingEvents: Array.isArray(profileData.upcomingEvents) ? profileData.upcomingEvents : [],
                exclusiveOffers: Array.isArray(profileData.exclusiveOffers) ? profileData.exclusiveOffers : [],
                recentActivity: Array.isArray(profileData.recentActivity) ? profileData.recentActivity : [],
            });
            setError(null)
            toast.success("Dados recarregados com sucesso!")
            // Não disparamos confete ao tentar novamente, a lógica de localStorage já impede

        } catch (error: any) {
            console.error("Erro ao tentar recarregar perfil (catch):", error);
            if (error && typeof error === 'object' && error.status === 401) {
                console.log("Erro 401 detectado ao tentar novamente, redirecionando...");
                logout();
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

    const redirectToLogin = () => {
        try {
            console.log("Attempting redirect with router.push");
            router.push('/login');
        } catch (e) {
            console.error("router.push failed for button click, using window.location:", e);
            window.location.href = '/login';
        }
    };


    // Renderiza o ConfettiEffect no topo, ele se sobreporá ao conteúdo
    // independentemente do estado (loading, error, success)
    // O componente ConfettiEffect *somente* renderizará o confete real
    // quando o prop 'trigger' for true e sua lógica interna permitir.
    return (
        <ProtectedRoute>
             {/* Adiciona o componente ConfettiEffect aqui. Ele gerencia sua própria visibilidade */}
             {/* com base no prop 'trigger' e sua lógica interna de temporização. */}
             {/* Ele será fixo na tela e não interfere no layout abaixo. */}
             {/* O prop 'trigger' só será true na primeira carga bem-sucedida que ainda não tem a flag no localStorage */}
            <ConfettiEffect trigger={triggerConfetti} duration={6000} numberOfPieces={300} /> {/* Opcional: ajuste duração e quantidade */}


            {loading ? (
                 <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center">
                     <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                 </div>
            ) : error || !userData ? (
                 <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col items-center justify-center gap-4 p-4">
                     <p className="text-red-500 text-center">{error}</p>
                     <div className="flex flex-col gap-4">
                         <Button
                             onClick={redirectToLogin}
                             className="bg-[#00FF00] text-black hover:bg-[#00CC00]"
                         >
                             Ir para Login
                         </Button>
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
                 </div>
            ) : (
                 // Conteúdo normal do dashboard
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
             )}
        </ProtectedRoute>
    )
}