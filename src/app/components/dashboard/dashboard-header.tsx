"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Bell, LogOut, Menu, Settings, User, Home, MessageSquare, Users, Calendar, ShoppingBag } from "lucide-react"; // Adicionado Home, MessageSquare, Users
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import { SettingsDialog } from "../../components/Settings/settings-dialog";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
// Imports para o Sheet (menu lateral)
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";

interface DashboardHeaderProps {
  userData: {
    user: {
      email: string;
      name: string;
    };
  };
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export function DashboardHeader({
  userData,
  setActiveTab,
}: DashboardHeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Estado para controlar a abertura do menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // <-- Adicionado
  const router = useRouter();
  const { logout } = useAuth();

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();

      const handleLogout = async () => {
        try {
          await logout();          // espera o cookie ser removido
          router.push("/login");
        } catch (err) {
          console.error("Erro ao sair:", err);
        }
      };

  // Função para fechar o menu mobile ao selecionar um item
  const handleMenuItemClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false); // Fecha o menu após selecionar
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-8">
            <img
              src="/img/logo.png"
              alt="FURIA Logo"
              className="h-8 w-8 mr-2 cursor-pointer"
            />
          </Link>
          <span className="text-xl font-bold hidden md:inline mr-8">
            FURIA Fan Hub {/* Mantido como no original */}
          </span>
          <nav className="hidden md:flex space-x-6">
            {/* Links/botões de navegação para desktop - Mantidos como estavam */}
            <button
              onClick={() => setActiveTab("overview")}
              className="text-white hover:text-[#00FF00]"
            >
              Dashboard {/* Mantido como no original */}
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className="text-gray-400 hover:text-white"
            >
              Eventos
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className="text-gray-400 hover:text-white"
            >
              Recompensas
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className="text-gray-400 hover:text-white"
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className="text-gray-400 hover:text-white"
            >
              Comunidade
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Info do usuário para desktop - Mantido como estava */}
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-sm text-white">{userData.user.name}</span>
            {/* <span className="text-xs text-gray-400">{userData.user.email}</span> */}
          </div>

          {/* Botão de Notificações - Mantido como estava */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-[#00FF00] rounded-full" />
          </Button>

          {/* Botão de Configurações (abre Dialog) - Mantido como estava */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* Dropdown Menu do Avatar do Usuário - Mantido como estava */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full items-center flex justify-center"
              >
                <Avatar className="h-8 w-8 border-2 border-white flex items-center justify-center">
                  <AvatarFallback>
                    {getInitials(userData.user.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 border border-gray-300" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1 ">
                  <p className="text-sm font-medium leading-none">
                    {userData.user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground ">
                    {userData.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                <Settings className="mr-2 h-4 w-4" /> Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Botão do Menu Mobile */}
          {/* Envolto por SheetTrigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            {/* Conteúdo do Menu Lateral (SheetContent) */}
            <SheetContent side="right" className="bg-gray-900 border-gray-800">
              <SheetHeader>
                {/* Título do menu lateral */}
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-4">
                {/* Info do usuário no menu mobile */}
                <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-800">
                  <Avatar className="h-10 w-10">
                    {/* Supondo que você tenha uma imagem de avatar ou usa AvatarFallback */}
                    {/* <AvatarImage src={userData.user.avatar || "/placeholder.png"} alt={userData.user.name} /> */}
                    <AvatarFallback>{getInitials(userData.user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{userData.user.name}</p>
                    <p className="text-xs text-gray-400">
                      {userData.user.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {/* Itens do menu mobile */}
                  {/* Usando botões que chamam handleMenuItemClick para mudar a aba E fechar o menu */}
                  <button
                    onClick={() => handleMenuItemClick("overview")}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 w-full text-left"
                  >
                    <Home className="h-5 w-5" />
                    Dashboard {/* Mantido como no original */}
                  </button>
                  <button
                    onClick={() => handleMenuItemClick("events")}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 w-full text-left"
                  >
                    <Calendar className="h-5 w-5" />
                    Eventos
                  </button>
                  <button
                     onClick={() => handleMenuItemClick("offers")}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 w-full text-left"
                  >
                    <ShoppingBag className="h-5 w-5" /> {/* Ícone Recompensas */}
                    Recompensas
                  </button>
                  <button
                    onClick={() => handleMenuItemClick("chat")}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 w-full text-left"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Chat
                  </button>
                   <button
                     onClick={() => handleMenuItemClick("community")}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 w-full text-left"
                  >
                    <Users className="h-5 w-5" />
                    Comunidade
                  </button>

                   {/* Itens adicionais do menu do avatar (Configurações e Sair) */}
                   <button
                     onClick={() => { setSettingsOpen(true); setIsMobileMenuOpen(false); }} // Abre settings E fecha o menu mobile
                     className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 w-full text-left"
                   >
                     <Settings className="h-5 w-5" />
                     Configurações
                   </button>
                   <button
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} // Faz logout E fecha o menu mobile
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 w-full text-left text-red-400 hover:text-red-500" // Opcional: cor diferente para sair
                   >
                     <LogOut className="h-5 w-5" />
                     Sair
                   </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* O Dialog de Configurações permanece aqui, fora do Sheet */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
}