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
  Copy,
  Star,
  User,
} from "lucide-react";
import { toast } from "sonner";

// Tipos de dados (mantidos como estão)
type VerificationStatus = "verified" | "pending" | "unverified";

interface Event {
  id: number;
  name: string;
  date: string; // Assumimos que esta data virá em um formato parseável
  location: string;
}

interface Offer {
  id: number;
  name: string;
  expires: string; // Assumimos que esta data/string de expiração virá em um formato parseável/exibível
  code?: string;
}

interface Activity {
  id: number;
  type: "event" | "purchase" | "social";
  description: string;
  date: string; // Assumimos que esta data virá em um formato parseável
}

interface UserProfileData {
  name: string;
  email: string;
  profileCompletion: number; // Deveria ser um número (0-100)
  verificationStatus: VerificationStatus;
  fanLevel: string;
  fanPoints: number;
  memberSince: string; // Esperamos uma string formatada ou parseável (ex: ISO 8601, "YYYY-MM-DD")
  interests: string[];
  socialConnections: string[];
  upcomingEvents: Event[];
  exclusiveOffers: Offer[];
  recentActivity: Activity[];
}

interface ProfileOverviewProps {
  userData?: Partial<UserProfileData>;
  loading?: boolean;
}

// Dados padrão para quando não houver dados (mantidos como estão)
const defaultUserData: UserProfileData = {
  name: "Usuário",
  email: "usuario@exemplo.com",
  profileCompletion: 0,
  verificationStatus: "unverified",
  fanLevel: "Iniciante",
  fanPoints: 0,
  // Ajuste no default: Usar um formato de data mais consistente para o default
  // ou garantir que toLocaleDateString() no default funcione (o que já deveria)
  memberSince: new Date().toISOString(), // Usar ISO string para o default, que é facilmente parseável
  interests: [],
  socialConnections: [],
  upcomingEvents: [],
  exclusiveOffers: [],
  recentActivity: [],
};

export function ProfileOverview({ userData = {}, loading = false }: ProfileOverviewProps) {
  // Mescla os dados recebidos com os padrões
  const mergedData: UserProfileData = { ...defaultUserData, ...userData };

  // --- Ajustes de Formatação ---

  // Formatar o percentual de completude para uma casa decimal
  const profileCompletionFormatted = mergedData.profileCompletion.toFixed(1);

  // Formatar a data de "Membro desde"
  let memberSinceFormatted = "N/A"; // Texto padrão caso a data seja inválida
  try {
      const memberSinceDate = new Date(mergedData.memberSince);
      // Verifica se a data é válida ( getTime() para NaN é o método confiável)
      if (!isNaN(memberSinceDate.getTime())) {
          // Formata a data para o padrão local (pt-BR)
          memberSinceFormatted = memberSinceDate.toLocaleDateString('pt-BR');
      } else {
          // Se new Date() retornou uma data inválida, o texto padrão "N/A" será usado
          console.warn("Data 'memberSince' inválida recebida:", mergedData.memberSince);
      }
  } catch (error) {
      console.error("Erro ao formatar data 'memberSince':", error);
      // Em caso de erro na criação da data, o texto padrão "N/A" será usado
  }


  // Função para copiar código de oferta (mantida como está)
  const handleCopyCode = (code: string) => {
      navigator.clipboard.writeText(code);
      toast.success("Código copiado para a área de transferência!");
  };

  if (loading) {
      // ... (estado de loading mantido como está)
      return (
          <div className="space-y-6">
              <h2 className="text-2xl font-bold">Carregando perfil...</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                      <Card key={i} className="bg-gray-800 border-gray-700 h-64 animate-pulse" />
                  ))}
              </div>
          </div>
      );
  }

  return (
      <div className="space-y-6">
          <h2 className="text-2xl font-bold">Visão Geral do Perfil</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status do Perfil */}
              <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Status do Perfil</CardTitle>
                      <CardDescription>Seu progresso como fã da FURIA</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          <div className="space-y-2">
                              <div className="flex justify-between">
                                  <span className="text-sm">Perfil Completo</span>
                                  <span className="text-sm font-medium">
                                      {/* Usa o percentual formatado */}
                                      {profileCompletionFormatted}%
                                  </span>
                              </div>
                              <Progress
                                  value={mergedData.profileCompletion}
                                  className="h-2"
                              />
                          </div>

                          <div className="flex items-center justify-between">
                              <span className="text-sm">Status de Verificação</span>
                              <Badge
                                  className={
                                      mergedData.verificationStatus === "verified"
                                          ? "bg-green-600"
                                          : mergedData.verificationStatus === "pending"
                                              ? "bg-yellow-600"
                                              : "bg-green-300" // Corrigi a cor do 'unverified' para green-300 como estava antes
                                  }
                              >
                                  {mergedData.verificationStatus === "verified" && (
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                  )}
                                  {mergedData.verificationStatus === "pending"
                                      ? "Pendente"
                                      : mergedData.verificationStatus === "unverified"
                                          ? "Não Verificado"
                                          : "Verificado"} {/* Adicionado o texto "Verificado" para o status 'verified' */}
                              </Badge>
                          </div>


                          <div className="flex items-center justify-between">
                              <span className="text-sm">Nível de Fã</span>
                              <Badge className="bg-[#00FF00]">
                                  <Star className="h-3 w-3 mr-1" />
                                  {mergedData.fanLevel}
                              </Badge>
                          </div>

                          <div className="flex items-center justify-between">
                              <span className="text-sm">Pontos de Fã</span>
                              <span className="font-medium">{mergedData.fanPoints}</span>
                          </div>

                          <div className="flex items-center justify-between">
                              <span className="text-sm">Membro desde</span>
                              <span className="text-sm text-gray-400">
                                  {/* Usa a data formatada */}
                                  {memberSinceFormatted}
                              </span>
                          </div>
                      </div>
                  </CardContent>
              </Card>

              {/* Seus Interesses (mantido como está) */}
              <Card className="bg-gray-800 border-gray-700">
                   {/* ... Código dos Interesses ... */}
                   <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Seus Interesses</CardTitle>
                      <CardDescription>Jogos e times que você segue</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          <div>
                              <h4 className="text-sm font-medium mb-2">Jogos</h4>
                              <div className="flex flex-wrap gap-2">
                                  {mergedData.interests.length > 0 ? (
                                      mergedData.interests.map((interest, idx) => (
                                          <Badge
                                              key={idx}
                                              variant="outline"
                                              className="bg-gray-700"
                                          >
                                              {interest}
                                          </Badge>
                                      ))
                                  ) : (
                                      <p className="text-sm text-gray-400">Nenhum interesse cadastrado</p>
                                  )}
                              </div>
                          </div>

                          <div>
                              <h4 className="text-sm font-medium mb-2">
                                  Redes Sociais Conectadas
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                  {mergedData.socialConnections.length > 0 ? (
                                      mergedData.socialConnections.map((conn, idx) => (
                                          <Badge
                                              key={idx}
                                              variant="outline"
                                              className="bg-gray-700"
                                          >
                                              {conn}
                                          </Badge>
                                      ))
                                  ) : (
                                      <p className="text-sm text-gray-400">Nenhuma conexão</p>
                                  )}
                              </div>
                          </div>
                      </div>
                  </CardContent>
              </Card>


              {/* Atividade Recente (mantido como está, mas a data pode precisar de formatação similar) */}
              <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Atividade Recente</CardTitle>
                      <CardDescription>Suas interações recentes</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          {mergedData.recentActivity.length > 0 ? (
                              mergedData.recentActivity.map((act) => {
                                   // --- Ajuste de Formatação para Datas de Atividade ---
                                   let activityDateFormatted = "N/A";
                                   try {
                                       const activityDate = new Date(act.date);
                                       if (!isNaN(activityDate.getTime())) {
                                            activityDateFormatted = activityDate.toLocaleDateString('pt-BR');
                                            // Opcional: Adicionar hora se a string de data incluir hora
                                            // if (act.date.includes(':')) {
                                            //      activityDateFormatted += ' ' + activityDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                            // }
                                       }
                                   } catch (error) {
                                       console.error("Erro ao formatar data de atividade:", act.date, error);
                                   }
                                   // --- Fim do Ajuste ---

                                  return (
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
                                              {/* Usa a data de atividade formatada */}
                                              {activityDateFormatted}
                                          </p>
                                      </div>
                                  </div>
                              );
                              })
                          ) : (
                              <p className="text-sm text-gray-400">Nenhuma atividade recente</p>
                          )}
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* Próximos Eventos e Ofertas (datas podem precisar de formatação similar) */}
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
                          {mergedData.upcomingEvents.length > 0 ? (
                              mergedData.upcomingEvents.map((evt) => {
                                   // --- Ajuste de Formatação para Datas de Eventos ---
                                   let eventDateFormatted = "N/A";
                                    try {
                                        const eventDate = new Date(evt.date);
                                         if (!isNaN(eventDate.getTime())) {
                                              // Formata a data e hora
                                              eventDateFormatted = eventDate.toLocaleDateString('pt-BR', {
                                                  day: '2-digit',
                                                  month: '2-digit',
                                                  year: 'numeric',
                                                  hour: '2-digit',
                                                  minute: '2-digit'
                                              });
                                         }
                                     } catch (error) {
                                         console.error("Erro ao formatar data de evento:", evt.date, error);
                                     }
                                   // --- Fim do Ajuste ---

                                  return (
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
                                               {/* Usa a data de evento formatada */}
                                              <span>{eventDateFormatted}</span>
                                          </div>
                                          <p className="text-sm text-gray-400">
                                              {evt.location}
                                          </p>
                                      </div>
                                  </div>
                              );
                              })
                          ) : (
                              <p className="text-sm text-gray-400">Nenhum evento próximo</p>
                          )}
                      </div>
                  </CardContent>
              </Card>

              {/* Ofertas Exclusivas (data de expiração pode precisar de formatação similar) */}
              <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Ofertas Exclusivas</CardTitle>
                      <CardDescription>
                          Benefícios disponíveis para você
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          {mergedData.exclusiveOffers.length > 0 ? (
                              mergedData.exclusiveOffers.map((offer) => {
                                  // --- Ajuste de Formatação para Datas de Oferta ---
                                   let offerExpiresFormatted = offer.expires; // Usa a string como fallback
                                    try {
                                        const offerDate = new Date(offer.expires);
                                         if (!isNaN(offerDate.getTime())) {
                                              // Formata a data para o padrão local
                                              offerExpiresFormatted = offerDate.toLocaleDateString('pt-BR');
                                              // Opcional: adicionar hora
                                              // if (offer.expires.includes(':')) {
                                              //      offerExpiresFormatted += ' ' + offerDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                              // }
                                         }
                                     } catch (error) {
                                         console.error("Erro ao formatar data de oferta:", offer.expires, error);
                                     }
                                  // --- Fim do Ajuste ---

                                  return (
                                  <div
                                      key={offer.id}
                                      className="border border-gray-700 rounded-md p-3"
                                  >
                                      <p className="font-medium">{offer.name}</p>
                                      <div className="flex items-center text-sm text-gray-400 mt-1">
                                          <Clock className="h-3 w-3 mr-1" />
                                           {/* Usa a data de expiração formatada */}
                                          <span>Expira em {offerExpiresFormatted}</span>
                                      </div>
                                      {offer.code && (
                                          <div className="mt-2 bg-gray-700 p-2 rounded flex justify-between items-center">
                                              <code className="text-sm font-mono">
                                                  {offer.code}
                                              </code>
                                              <Badge
                                                  className="bg-[#00FF00] hover:bg-[#00CC00] cursor-pointer"
                                                  onClick={() => handleCopyCode(offer.code!)}
                                              >
                                                  <Copy className="h-3 w-3 mr-1" />
                                                  Copiar
                                              </Badge>
                                          </div>
                                      )}
                                  </div>
                              );
                              })
                          ) : (
                              <p className="text-sm text-gray-400">Nenhuma oferta disponível</p>
                          )}
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
  );
}