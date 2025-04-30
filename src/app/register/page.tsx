"use client"
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ArrowLeft, CheckCircle2, Loader2, User, Gamepad2, Trophy } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PersonalInfoForm } from "../components/registration/personal-info-form"
import { InterestsForm } from "../components/registration/interests-form"
import { ActivitiesForm } from "../components/registration/activities-form"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { toast } from "react-hot-toast"
import { register } from "../services/auth.service"
import { useAuth } from "../contexts/AuthContext"

export default function Register() {
  const router = useRouter()
  const { register: authRegister } = useAuth()
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [skipped, setSkipped] = useState(false)
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", cpf: "", birthDate: "", address: "",
    city: "", state: "", zipCode: "", phone: "",
    favoriteGames: [] as string[], favoriteTeams: [] as string[],
    followedPlayers: [] as string[], preferredPlatforms: [] as string[],
    eventsAttended: [] as string[], purchasedMerchandise: [] as string[],
    subscriptions: [] as string[], competitionsParticipated: [] as string[],
  })

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const validatePersonalInfo = () => {
    const requiredFields = [
      { key: "name", label: "Nome" },
      { key: "email", label: "E-mail" },
      { key: "password", label: "Senha" },
      { key: "birthDate", label: "Data de Nascimento" },
    ]
    
    const missingFields = requiredFields
      .filter((field) => !formData[field.key as keyof typeof formData])
      .map((field) => field.label)

    if (missingFields.length > 0) {
      toast.error(`Preencha os campos obrigatórios: ${missingFields.join(", ")}`)
      return false
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Por favor, insira um email válido")
      return false
    }

    // Validação de senha
    if (formData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres")
      return false
    }

    return true
  }

  const handleTabChange = (value: string) => {
    if (activeTab === "personal" && value !== "personal") {
      if (!validatePersonalInfo()) return
    }
    setError(null)
    setActiveTab(value)
  }

  const handleSubmit = async (redirectAfter: boolean = false, delayRedirect: boolean = false) => {
    if (!validatePersonalInfo()) {
      setActiveTab("personal");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const result = await authRegister({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
  
      if (result.success) {
        toast.success(result.message || "Registro concluído com sucesso!");
  
        if (redirectAfter || skipped) {
          if (delayRedirect) {
            // Aguardar 5s antes de redirecionar
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
          router.push("/dashboard");
        } else {
          router.push("/verification");
        }
      } else {
        throw new Error(result.message || "Erro durante o registro");
      }
    } catch (err) {
      const message = err instanceof Error 
        ? err.message.includes("já cadastrado")
          ? "Este e-mail já está em uso. Tente outro."
          : err.message
        : "Ocorreu um erro durante o registro";
  
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSkip = async () => {
    if (!validatePersonalInfo()) {
      setActiveTab("personal")
      return
    }
  
    setIsLoading(true)
    setError(null)
  
    try {
      const result = await authRegister({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
  
      if (result.success) {
        toast.success("Cadastro parcial salvo. Você pode completar depois.")
  
        // Aguarda 5 segundos antes de redirecionar
        await new Promise((resolve) => setTimeout(resolve, 5000))
  
        router.push("/login")
      } else {
        throw new Error(result.message || "Erro durante o registro")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado"
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }
  
  

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
              <TabsList className="grid grid-cols-3 w-full bg-gray-900">
                {["personal", "interests", "activities"].map((tab, idx) => {
                  const icons = [<User key="user" />, <Gamepad2 key="gamepad" />, <Trophy key="trophy" />]
                  const labels = ["Informações Pessoais", "Interesses", "Atividades"]
                  return (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black flex items-center gap-2"
                    >
                      {icons[idx]}
                      <span className="hidden sm:inline">{labels[idx]}</span>
                      <span className="sm:hidden">{labels[idx].split(" ")[0]}</span>
                    </TabsTrigger>
                  )
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
            </CardContent>
          </Tabs>

          <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() =>
                  handleTabChange(
                    activeTab === "personal" ? "personal" : activeTab === "interests" ? "personal" : "interests"
                  )
                }
                disabled={activeTab === "personal" || isLoading}
                className="flex-1 sm:flex-initial"
              >
                Anterior
              </Button>

              <Button
                onClick={() =>
                  activeTab === "activities"
                    ? handleSubmit()
                    : handleTabChange(activeTab === "personal" ? "interests" : "activities")
                }
                className="bg-[#00FF00] hover:bg-[#3ec53e] text-black flex-1 sm:flex-initial"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : activeTab === "activities" ? (
                  <>
                    Finalizar
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Próximo"
                )}
              </Button>
            </div>

            {activeTab !== "activities" && (
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
  )
}