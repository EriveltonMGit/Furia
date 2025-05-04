"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Calendar,
  ShoppingBag,
  Star,
  User,
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Menu, // Mantido Menu, embora o toggle use Chevron
  LayoutDashboard, // Ícone alternativo para Dashboard
} from "lucide-react";
import React from "react";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardSidebar({
  activeTab,
  setActiveTab,
}: DashboardSidebarProps) {
  // O estado isCollapsed controla apenas a sidebar desktop
  const [isCollapsed, setIsCollapsed] = useState(true); // Inicia fechado no desktop

  const tabs = [
    {
      id: "overview",
      label: "Visão Geral",
      icon: <LayoutDashboard className="h-5 w-5" />, // Usando ícone maior para o footer
    },
    {
      id: "engagement",
      label: "Engajamento",
      icon: <Star className="h-5 w-5" />, // Usando ícone maior para o footer
    },
    {
      id: "offers",
      label: "Ofertas", // Label mais curto para mobile
      icon: <ShoppingBag className="h-5 w-5" />, // Usando ícone maior para o footer
    },
    { id: "events", label: "Eventos", icon: <Calendar className="h-5 w-5" /> }, // Usando ícone maior para o footer
    {
      id: "community",
      label: "Comunidade",
      icon: <Users className="h-5 w-5" />, // Usando ícone maior para o footer
    },
    {
      id: "chat",
      label: "Chat",
      icon: <MessageSquare className="h-5 w-5" />, // Usando ícone maior para o footer
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Barra Lateral Vertical (Apenas Desktop/Tablet - md e acima) */}
      <div
        className={`relative transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        } hidden md:block flex-shrink-0`} // Adicionado flex-shrink-0
      >
        <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col"> {/* Adicionado flex-col */}
          {/* Botão de toggle (apenas na sidebar) */}
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-gray-700" // Adicionado cores
              onClick={toggleSidebar}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" /> // Alterado para ChevronRight quando fechado
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Links da Sidebar */}
          <nav className="flex-grow space-y-1"> {/* Adicionado flex-grow e trocado div por nav */}
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`w-full justify-start transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#00FF00] hover:bg-[#00FF00] text-black"
                    : "text-gray-400 hover:text-white hover:bg-gray-700" // Ajuste de cores
                } ${isCollapsed ? "justify-center px-0" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className={`flex items-center ${isCollapsed ? 'flex-col' : ''}`}> {/* Ajuste para empilhar ícone/texto se colapsado */}
                  {/* Ícone para Sidebar */}
                   {/* Redimensiona o ícone para ficar menor na sidebar */}
                  {React.cloneElement(tab.icon, { className: isCollapsed ? 'h-5 w-5 mb-1' : 'h-4 w-4' })}
                  {!isCollapsed && (
                    <span className="ml-2">{tab.label}</span>
                  )}
                </div>
              </Button>
            ))}
          </nav>
           {/* Pode adicionar um footer específico da sidebar aqui se necessário */}
        </div>
      </div>

      {/* Barra de Navegação do Rodapé (Apenas Mobile/Tablet - abaixo de md) */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 h-16 md:hidden z-50">
        <nav className="flex justify-around items-center h-full px-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost" // Usar variant ghost e controlar o estilo com classes
              className={`flex flex-col items-center justify-center p-1 h-full w-1/6 transition-colors ${ // Ajustado padding/height/width
                activeTab === tab.id
                  ? "text-[#00FF00]" // Cor ativa
                  : "text-gray-400 hover:text-white" // Cor inativa e hover
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {/* Ícone para Rodapé Mobile */}
               {/* Usar o tamanho padrão do ícone (h-5 w-5) definido no objeto tabs */}
              {tab.icon}
              {/* Opcional: exibir label abaixo do ícone no mobile */}
               <span className="text-[10px] mt-1 font-medium truncate">{tab.label.split(' ')[0]}</span> {/* Label menor, talvez só a primeira palavra */}
            </Button>
          ))}
        </nav>
      </div>
    </>
  );
}