"use client";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Login realizado com sucesso!');
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ocorreu um erro durante o login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100vh] absolute w-screen overflow-hidden bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center p-4">
      <Button
        onClick={() => router.push('/')}
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 text-white hover:bg-gray-700"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="container max-w-md mx-auto py-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription className="text-gray-400">
              Entre na sua conta para acessar o FURIA Fan Platform
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link href="/forgot-password" className="text-sm text-[#00FF00] hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-[#00FF00] hover:bg-[#3ec53e] text-black"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : "Entrar"}
              </Button>

              <p className="text-center text-sm text-gray-400">
                Não tem uma conta?{" "}
                <Link href="/register" className="text-[#00FF00] hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}