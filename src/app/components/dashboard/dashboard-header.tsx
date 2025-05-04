"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Bell, LogOut, Menu, Settings, User, Home, MessageSquare, Users, Calendar, ShoppingBag } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { DocumentUploader } from "../verification/document-uploader";
import { VerificationModal } from "./verificationModal";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  };

  const handleMenuItemClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-4">
            <img
              src="/img/logo.png"
              alt="FURIA Logo"
              className="h-8 w-8 mr-2 cursor-pointer"
            />
            <span className="text-xl font-bold hidden sm:inline">
              FURIA Fan Hub
            </span>
          </Link>
          
          {/* Navegação para desktop (mostrar a partir de lg) */}
          <nav className="hidden lg:flex space-x-6 ml-6">
            <button
              onClick={() => setActiveTab("overview")}
              className="text-white hover:text-[#00FF00] transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Eventos
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Recompensas
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Comunidade
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Info do usuário para desktop (mostrar a partir de lg) */}
          <div className="hidden lg:flex flex-col items-end mr-4">
            <span className="text-sm text-white">{userData.user.name}</span>
          </div>

          {/* Botões de ação - sempre visíveis exceto em mobile */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden sm:inline-flex"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-[#00FF00] rounded-full" />
          </Button>

          {/* Avatar - sempre visível */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full items-center flex justify-center"
              >
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarFallback>
                    {getInitials(userData.user.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-64 border border-gray-700 bg-gray-800" 
              align="end" 
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
  <p className="text-sm font-medium leading-none text-white truncate max-w-[180px] md:max-w-[220px] lg:max-w-none">
    {userData.user.name}
  </p>
  <p className="text-xs leading-none text-gray-400 truncate max-w-[180px] md:max-w-[220px] lg:max-w-none hidden sm:block">
    {userData.user.email}
  </p>
</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem 
                onClick={() => setSettingsOpen(true)}
                className="text-white hover:bg-gray-700 focus:bg-gray-700"
              >
                <Settings className="mr-2 h-4 w-4" /> Configurações
              </DropdownMenuItem>
              <div className="flex items-start justify-start border-none">
                <VerificationModal />
              </div>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-400 hover:bg-gray-700 focus:bg-gray-700"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu mobile (mostrar apenas abaixo de lg) */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="bg-gray-900 border-l border-gray-800 w-72"
            >
              <SheetHeader className="mb-4">
                <SheetTitle className="text-white flex items-center">
                  <img
                    src="/img/logo.png"
                    alt="FURIA Logo"
                    className="h-6 w-6 mr-2"
                  />
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(userData.user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{userData.user.name}</p>
                    <p className="text-xs text-gray-400">
                      {userData.user.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  {[
                    { id: "overview", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
                    { id: "events", label: "Eventos", icon: <Calendar className="h-5 w-5" /> },
                    { id: "offers", label: "Recompensas", icon: <ShoppingBag className="h-5 w-5" /> },
                    { id: "chat", label: "Chat", icon: <MessageSquare className="h-5 w-5" /> },
                    { id: "community", label: "Comunidade", icon: <Users className="h-5 w-5" /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.id)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 w-full text-left text-white"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-700 pt-2">
                  <button
                    onClick={() => { setSettingsOpen(true); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 w-full text-left text-white"
                  >
                    <Settings className="h-5 w-5" />
                    Configurações
                  </button>
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 w-full text-left text-red-400"
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

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
}