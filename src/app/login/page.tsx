// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const { login, googleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) throw new Error(result.message);
      toast.success('Login realizado com sucesso!');
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || 'Erro durante o login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await googleLogin();
      if (!result.success) throw new Error(result.message);
      toast.success('Login com Google realizado com sucesso!');
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || 'Erro no login com Google');
    } finally {
      setGoogleLoading(false);
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
                {isLoading
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Entrando...</>
                  : "Entrar"}
              </Button>

              {/* separation line */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-800 px-2 text-gray-400">Ou continue com</span>
                </div>
              </div>

              {/* Google login */}
              <Button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center"
                disabled={googleLoading}
              >
                {googleLoading
                  ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  : <><FcGoogle className="mr-2 h-5 w-5"/>Entrar com Google</>}
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
