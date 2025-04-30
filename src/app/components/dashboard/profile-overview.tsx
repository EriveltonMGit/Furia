import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  User,
} from "lucide-react";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
}
interface Offer {
  id: number;
  name: string;
  expires: string;
  code?: string;
}
interface Activity {
  id: number;
  type: "event" | "purchase" | "social";
  description: string;
  date: string;
}

interface ProfileOverviewProps {
  userData: {
    name: string;
    email: string;
    profileCompletion: number;
    verificationStatus: "verified" | "pending" | "unverified";
    fanLevel: string;
    fanPoints: number;
    memberSince: string;
    interests: string[];
    socialConnections: string[];
    upcomingEvents: Event[];
    exclusiveOffers: Offer[];
    recentActivity: Activity[];
  };
}

export function ProfileOverview({ userData }: ProfileOverviewProps) {
  // Garante que todos sejam arrays
  const interests = Array.isArray(userData.interests)
    ? userData.interests
    : [];
  const socialConnections = Array.isArray(userData.socialConnections)
    ? userData.socialConnections
    : [];
  const upcomingEvents = Array.isArray(userData.upcomingEvents)
    ? userData.upcomingEvents
    : [];
  const exclusiveOffers = Array.isArray(userData.exclusiveOffers)
    ? userData.exclusiveOffers
    : [];
  const recentActivity = Array.isArray(userData.recentActivity)
    ? userData.recentActivity
    : [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Visão Geral do Perfil</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status do Perfil */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Status do Perfil</CardTitle>
            <CardDescription>
              Seu progresso como fã da FURIA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Completeness */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Perfil Completo</span>
                  <span className="text-sm font-medium">
                    {userData.profileCompletion}%
                  </span>
                </div>
                <Progress
                  value={userData.profileCompletion}
                  className="h-2"
                />
              </div>

              {/* Verification */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Status de Verificação</span>
                <Badge
                  className={
                    userData.verificationStatus === "verified"
                      ? "bg-green-600"
                      : userData.verificationStatus === "pending"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }
                >
                  {userData.verificationStatus === "verified" && (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  )}
                  {userData.verificationStatus === "pending"
                    ? "Pendente"
                    : userData.verificationStatus === "unverified"
                    ? "Não Verificado"
                    : "Verificado"}
                </Badge>
              </div>

              {/* Fan Level */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Nível de Fã</span>
                <Badge className="bg-[#00FF00]">
                  <Star className="h-3 w-3 mr-1" />
                  {userData.fanLevel}
                </Badge>
              </div>

              {/* Fan Points */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Pontos de Fã</span>
                <span className="font-medium">
                  {userData.fanPoints}
                </span>
              </div>

              {/* Member Since */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Membro desde</span>
                <span className="text-sm text-gray-400">
                  {userData.memberSince}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seus Interesses */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Seus Interesses</CardTitle>
            <CardDescription>
              Jogos e times que você segue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Jogos */}
              <div>
                <h4 className="text-sm font-medium mb-2">Jogos</h4>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-gray-700"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Redes Sociais */}
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Redes Sociais Conectadas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {socialConnections.map((conn, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-gray-700"
                    >
                      {conn}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Atividade Recente */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Atividade Recente</CardTitle>
            <CardDescription>
              Suas interações recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start space-x-3"
                >
                  <div className="mt-0.5">
                    {act.type === "event" && (
                      <Calendar className="h-4 w-4 text-blue-400" />
                    )}
                    {act.type === "purchase" && (
                      <Award className="h-4 w-4 text-green-400" />
                    )}
                    {act.type === "social" && (
                      <User className="h-4 w-4 text-purple-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{act.description}</p>
                    <p className="text-xs text-gray-400">
                      {act.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Eventos e Ofertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Próximos Eventos */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Próximos Eventos</CardTitle>
            <CardDescription>
              Eventos que você pode participar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-start space-x-3"
                >
                  <div className="bg-gray-700 p-2 rounded-md">
                    <Calendar className="h-5 w-5 text-[#00FF00]" />
                  </div>
                  <div>
                    <p className="font-medium">{evt.name}</p>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{evt.date}</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {evt.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ofertas Exclusivas */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ofertas Exclusivas</CardTitle>
            <CardDescription>
              Benefícios disponíveis para você
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exclusiveOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="border border-gray-700 rounded-md p-3"
                >
                  <p className="font-medium">{offer.name}</p>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Expira em {offer.expires}</span>
                  </div>
                  {offer.code && (
                    <div className="mt-2 bg-gray-700 p-2 rounded flex justify-between items-center">
                      <code className="text-sm font-mono">
                        {offer.code}
                      </code>
                      <Badge className="bg-[#00FF00]">
                        Copiar
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
