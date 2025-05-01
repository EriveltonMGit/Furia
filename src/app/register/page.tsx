"use client";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, CheckCircle2, Loader2, User, Gamepad2, Trophy, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PersonalInfoForm } from "../components/registration/personal-info-form";
import { InterestsForm } from "../components/registration/interests-form";
import { ActivitiesForm } from "../components/registration/activities-form";
import { SocialConnector } from "../components/social/social-connector";
import { GamingProfilesForm } from "../components/social/gaming-profiles-form";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { toast } from "react-hot-toast";
import { register as authRegisterService, updatePersonalInfo, updateInterests, updateActivities, updateSocialConnections } from "../services/auth.service";
import { useAuth } from "../contexts/AuthContext";

interface FormData {
  name: string;
  email: string;
  password: string;
  cpf: string;
  birthDate: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  favoriteGames: string[];
  favoriteTeams: string[];
  followedPlayers: string[];
  preferredPlatforms: string[];
  eventsAttended: string[];
  purchasedMerchandise: string[];
  subscriptions: string[];
  competitionsParticipated: string[];
  socialMedia: {
    twitter: boolean;
    instagram: boolean;
    facebook: boolean;
    discord: boolean;
    twitch: boolean;
    steamProfile: string;
    faceitProfile: string;
    hltv: string;
    vlr: string;
    otherProfiles: { platform: string; url: string }[];
  };
}

interface SocialConnectProps {
  socialData: FormData["socialMedia"];
  updateSocialData: (data: Partial<FormData["socialMedia"]>) => void;
}

function SocialConnectTabContent({ socialData, updateSocialData }: SocialConnectProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    if (currentStep === 1) {
      return (
        socialData.twitter ||
        socialData.instagram ||
        socialData.facebook ||
        socialData.discord ||
        socialData.twitch
      );
    } else if (currentStep === 2) {
      return (
        socialData.steamProfile !== "" ||
        socialData.faceitProfile !== "" ||
        socialData.hltv !== "" ||
        socialData.vlr !== "" ||
        socialData.otherProfiles.length > 0
      );
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <Alert className="mb-6 bg-blue-900/30 border-blue-800">
        <Share2 className="h-4 w-4" />
        <AlertTitle>Por que conectar suas redes?</AlertTitle>
        <AlertDescription>
          Ao conectar suas redes sociais, podemos analisar seu engajamento com esports e a FURIA, oferecendo
          experiências e conteúdos personalizados para seu perfil de fã.
        </AlertDescription>
      </Alert>

      <div className="flex items-center mb-8">
        <div className={`h-1 flex-1 ${currentStep === 1 ? "bg-[#00FF00]" : "bg-gray-600"}`}></div>
        <div className={`h-1 flex-1 ${currentStep === 2 ? "bg-[#00FF00]" : "bg-gray-600"}`}></div>
      </div>

      <div className="mt-8">
        {currentStep === 1 && <SocialConnector socialData={socialData} updateSocialData={updateSocialData} />}
        {currentStep === 2 && <GamingProfilesForm socialData={socialData} updateSocialData={updateSocialData} />}
      </div>

      <div className="flex justify-between mt-8">
        {/* <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
          Voltar
        </Button>
        <Button onClick={handleNext} className="bg-[#00FF00] hover:bg-[#00FF00]" disabled={!isStepComplete()}>
          {currentStep === totalSteps ? "Próximo" : "Avançar"}
          {currentStep === totalSteps ? (
            <CheckCircle2 className="ml-2 h-4 w-4" />
          ) : (
            <ArrowRight className="ml-2 h-4 w-4" />
          )}
        </Button> */}
      </div>
    </div>
  );
}

export default function Register() {
  const router = useRouter();
  const { register: authContextRegister } = useAuth();
  const [activeTab, setActiveTab] = useState<"personal" | "interests" | "activities" | "social" | "gaming">("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "", email: "", password: "", cpf: "", birthDate: "", address: "",
    city: "", state: "", zipCode: "", phone: "",
    favoriteGames: [], favoriteTeams: [],
    followedPlayers: [], preferredPlatforms: [],
    eventsAttended: [], purchasedMerchandise: [],
    subscriptions: [], competitionsParticipated: [],
    socialMedia: {
      twitter: false, instagram: false, facebook: false, discord: false, twitch: false,
      steamProfile: "", faceitProfile: "", hltv: "", vlr: "", otherProfiles: [],
    },
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const updateSocialData = (data: Partial<FormData["socialMedia"]>) => {
    setFormData((prev) => ({ ...prev, socialMedia: { ...prev.socialMedia, ...data } }));
  };

  const validatePersonalInfo = (): boolean => {
    const requiredFields = [
      { key: "name", label: "Nome" },
      { key: "email", label: "E-mail" },
      { key: "password", label: "Senha" },
      { key: "birthDate", label: "Data de Nascimento" },
    ];

    const missingFields = requiredFields.filter((field) => !formData[field.key as keyof FormData]).map((field) => field.label);

    if (missingFields.length > 0) {
      toast.error(`Preencha os campos obrigatórios: ${missingFields.join(", ")}`);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Por favor, insira um email válido");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return false;
    }

    return true;
  };

  const handleTabChange = (value: string) => {
    if (activeTab === "personal" && value !== "personal") {
      if (!validatePersonalInfo()) return;
    }
    setError(null);
    setActiveTab(value as "personal" | "interests" | "activities" | "social" | "gaming");
  };

  const saveAdditionalProfileData = async () => {
    try {
      await updatePersonalInfo({ cpf: formData.cpf, birthDate: formData.birthDate, address: formData.address, city: formData.city, state: formData.state, zipCode: formData.zipCode, phone: formData.phone });
      if (formData.favoriteGames.length > 0 || formData.favoriteTeams.length > 0 || formData.followedPlayers.length > 0 || formData.preferredPlatforms.length > 0) {
        await updateInterests({ favoriteGames: formData.favoriteGames, favoriteTeams: formData.favoriteTeams, followedPlayers: formData.followedPlayers, preferredPlatforms: formData.preferredPlatforms });
      }
      if (formData.eventsAttended.length > 0 || formData.purchasedMerchandise.length > 0 || formData.subscriptions.length > 0 || formData.competitionsParticipated.length > 0) {
        await updateActivities({ eventsAttended: formData.eventsAttended, purchasedMerchandise: formData.purchasedMerchandise, subscriptions: formData.subscriptions, competitionsParticipated: formData.competitionsParticipated });
      }
      await updateSocialConnections(formData.socialMedia);
    } catch (err) {
      console.error("Erro ao salvar dados do perfil:", err);
      toast.error("Erro ao salvar dados do perfil.");
    }
  };

  const handleSubmit = async () => {
    if (!validatePersonalInfo()) {
      setActiveTab("personal");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const result = await authContextRegister({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password 
      });
      
      if (!result.success) {
        throw new Error(result.message || "Erro durante o registro básico");
      }
      
      await saveAdditionalProfileData();
      toast.success("Cadastro concluído com sucesso! Faça login para acessar sua conta.", { 
        duration: 5000 
      });
      
      // Redireciona para a tela de login após o cadastro
      setTimeout(() => {
        router.push("/login"); // Alterado de "/dashboard" para "/login"
      }, 1000);
      
    } catch (err: any) {
      const message = err instanceof Error
        ? err.message.includes("já cadastrado")
          ? "Este e-mail já está em uso. Tente outro."
          : err.message
        : "Ocorreu um erro inesperado durante o registro.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!validatePersonalInfo()) {
      setActiveTab("personal");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const result = await authContextRegister({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password 
      });
      
      if (!result.success) {
        throw new Error(result.message || "Erro durante o registro básico ao pular");
      }
      
      await saveAdditionalProfileData();
      toast.success("Cadastro básico salvo. Dados adicionais podem ser completados depois.");
      
      // Redireciona para a tela de login após pular
      setTimeout(() => {
        router.push("/login"); // Alterado de "/dashboard" para "/login"
      }, 1000);
      
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Erro inesperado ao pular registro";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto py-8">
        <Link href="/login" className="flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Login
        </Link>

        <Card className="max-w-4xl mx-auto bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl">Crie seu perfil de fã</CardTitle>
            <CardDescription className="text-gray-400">
              Compartilhe suas informações para receber experiências personalizadas da FURIA
            </CardDescription>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="px-6">
              <TabsList className="grid grid-cols-5 w-full bg-gray-900">
                {["personal", "interests", "activities", "social", "gaming"].map((tab, idx) => {
                  const icons = [<User key="user" />, <Gamepad2 key="gamepad" />, <Trophy key="trophy" />, <Share2 key="share" />, <Gamepad2 key="gaming" />];
                  const labels = ["Informações Pessoais", "Interesses", "Atividades", "Redes Sociais", "Perfis de Jogo"];
                  return (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black flex items-center gap-2 py-1"
                    >
                      {icons[idx]}
                      <span>{labels[idx]}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="personal" className="mt-0">
                <PersonalInfoForm formData={formData} updateFormData={updateFormData} />
              </TabsContent>

              <TabsContent value="interests" className="mt-0">
                <InterestsForm formData={formData} updateFormData={updateFormData} />
              </TabsContent>

              <TabsContent value="activities" className="mt-0">
                <ActivitiesForm formData={formData} updateFormData={updateFormData} />
              </TabsContent>

              <TabsContent value="social" className="mt-0">
                <SocialConnectTabContent socialData={formData.socialMedia} updateSocialData={updateSocialData} />
              </TabsContent>

              <TabsContent value="gaming" className="mt-0">
                <GamingProfilesForm socialData={formData.socialMedia} updateSocialData={updateSocialData} />
              </TabsContent>
            </CardContent>
          </Tabs>

          <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => handleTabChange(
                activeTab === "personal" ? "personal" :
                activeTab === "interests" ? "personal" :
                activeTab === "activities" ? "interests" :
                activeTab === "social" ? "activities" : "personal"
              )}
              disabled={activeTab === "personal" || isLoading}
              className="flex-1 sm:flex-initial"
            >
              Anterior
            </Button>
            <Button
              onClick={() => {
                const tabsOrder = ["personal", "interests", "activities", "social", "gaming"];
                const currentIndex = tabsOrder.indexOf(activeTab);
                if (currentIndex < tabsOrder.length - 1) {
                  handleTabChange(tabsOrder[currentIndex + 1]);
                } else {
                  handleSubmit();
                }
              }}
              className="bg-[#00FF00] hover:bg-[#3ec53e] text-black flex-1 sm:flex-initial"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : activeTab === "gaming" ? (
                <>
                  Finalizar
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Próximo"
              )}
            </Button>
          </div>
          {activeTab !== "social" && activeTab !== "gaming" && (
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={isLoading}
              className="text-[#00FF00] hover:text-[#3ec53e] hover:bg-gray-700 w-full sm:w-auto"
            >
              Pular para finalização
            </Button>
          )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}