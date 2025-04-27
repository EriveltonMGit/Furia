import { Button } from "./components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import Link from "next/link"
import { ArrowRight, FileCheck, Share2, UserCheck } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Header */}
      <header className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/placeholder.svg?height=40&width=40" alt="FURIA Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold">FURIA Know Your Fan</h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Cadastrar</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">Conheça e Seja Reconhecido</h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
          Compartilhe seu perfil como fã de esports e receba experiências e serviços exclusivos da FURIA, personalizados
          para você.
        </p>
        <Button size="lg" className="bg-[#FF5500] hover:bg-[#FF7700] text-white" asChild>
          <Link href="/register">
            Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* Features */}
      <section className="container mx-auto py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Como Funciona</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <UserCheck className="h-12 w-12 text-[#FF5500] mb-4" />
              <CardTitle>Perfil Completo</CardTitle>
              <CardDescription className="text-gray-400">Crie seu perfil detalhado como fã de esports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Compartilhe seus dados, interesses e histórico como fã. Quanto mais completo seu perfil, mais
                personalizada será sua experiência.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-[#FF5500]" asChild>
                <Link href="/register">Criar Perfil</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <FileCheck className="h-12 w-12 text-[#FF5500] mb-4" />
              <CardTitle>Verificação Segura</CardTitle>
              <CardDescription className="text-gray-400">Valide sua identidade com segurança</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Faça upload de documentos e verifique sua identidade com nossa tecnologia de IA. Seus dados são
                protegidos e criptografados.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-[#FF5500]" asChild>
                <Link href="/verification">Saiba Mais</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Share2 className="h-12 w-12 text-[#FF5500] mb-4" />
              <CardTitle>Conecte Redes Sociais</CardTitle>
              <CardDescription className="text-gray-400">
                Integre suas redes para uma experiência completa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Conecte suas redes sociais para analisarmos seu engajamento com esports e a FURIA, criando experiências
                personalizadas.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-[#FF5500]" asChild>
                <Link href="/social-connect">Conectar</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Benefícios Exclusivos</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-8">
            <h4 className="text-xl font-bold mb-4">Para Fãs Verificados</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-[#FF5500] rounded-full p-1 mr-3 mt-1">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Acesso antecipado a ingressos para eventos</span>
              </li>
              <li className="flex items-start">
                <div className="bg-[#FF5500] rounded-full p-1 mr-3 mt-1">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Descontos exclusivos em produtos oficiais</span>
              </li>
              <li className="flex items-start">
                <div className="bg-[#FF5500] rounded-full p-1 mr-3 mt-1">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Convites para eventos exclusivos com jogadores</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-800 rounded-lg p-8">
            <h4 className="text-xl font-bold mb-4">Para Super Fãs</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-[#FF5500] rounded-full p-1 mr-3 mt-1">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Experiências VIP em competições</span>
              </li>
              <li className="flex items-start">
                <div className="bg-[#FF5500] rounded-full p-1 mr-3 mt-1">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Participação em testes de produtos e jogos</span>
              </li>
              <li className="flex items-start">
                <div className="bg-[#FF5500] rounded-full p-1 mr-3 mt-1">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Acesso a conteúdo exclusivo e bastidores</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto py-16 text-center">
        <div className="bg-gradient-to-r from-[#FF5500] to-[#FF7700] rounded-xl p-12">
          <h3 className="text-3xl font-bold mb-4">Pronto para se Conectar?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se à comunidade de fãs da FURIA e tenha acesso a experiências exclusivas personalizadas para você.
          </p>
          <Button size="lg" className="bg-white text-[#FF5500] hover:bg-gray-100" asChild>
            <Link href="/register">Criar Meu Perfil</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <img src="/placeholder.svg?height=32&width=32" alt="FURIA Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">FURIA</span>
            </div>
            <div className="flex gap-8">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacidade
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Termos
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contato
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500">
            &copy; {new Date().getFullYear()} FURIA Esports. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </main>
  )
}
