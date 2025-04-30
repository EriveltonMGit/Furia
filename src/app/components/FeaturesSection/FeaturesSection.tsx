import Link from "next/link";
import { FileCheck, Share2, UserCheck } from "lucide-react"; // Importe os ícones necessários
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"; // Importe do local correto na sua pasta ui
import { Button } from "../ui/button"; // Importe do local correto na sua pasta ui

export default function FeaturesSection() {
  return (
    <section className="container mx-auto py-16 z-2 ">
      <h3 className="font-Purista text-3xl font-bold text-center mb-12 z-2">
        Como Funciona
      </h3>
      <div className="grid md:grid-cols-3 gap-8 z-30">
        <Card className="bg-gray-800 border-gray-700 z-2">
          <CardHeader>
            <UserCheck className="font-Purista h-12 w-12 text-[#00FF00] mb-4 " />
            <CardTitle className="font-Purista">Perfil Completo</CardTitle>
            <CardDescription className="text-gray-400 ">
              Crie seu perfil detalhado como fã de esports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              Compartilhe seus dados, interesses e histórico como fã. Quanto
              mais completo seu perfil, mais personalizada será sua
              experiência.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="text-[#00FF00]" asChild>
              <Link href="/register">Criar Perfil</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gray-800 border-gray-700 z-2">
          <CardHeader>
            <FileCheck className="h-12 w-12 text-[#00FF00] mb-4" />
            <CardTitle className="font-Purista">Verificação Segura</CardTitle>
            <CardDescription className="text-gray-400">
              Valide sua identidade com segurança
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              Faça upload de documentos e verifique sua identidade com nossa
              tecnologia de IA. Seus dados são protegidos e criptografados.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="text-[#00FF00]" asChild>
              <Link href="/verification">Saiba Mais</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gray-800 border-gray-700 z-2">
          <CardHeader>
            <Share2 className="h-12 w-12 text-[#00FF00] mb-4" />
            <CardTitle className="font-Purista">Conecte Redes Sociais</CardTitle>
            <CardDescription className="text-gray-400">
              Integre suas redes para uma experiência completa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              Conecte suas redes sociais para analisarmos seu engajamento
              com esports e a FURIA, criando experiências personalizadas.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="text-[#00FF00]" asChild>
              <Link href="/social-connect">Conectar</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}