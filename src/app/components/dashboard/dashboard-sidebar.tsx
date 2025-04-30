"use client"; // Mantém a diretiva

import { Button } from "../../components/ui/button";
import {
  Calendar,
  ShoppingBag,
  Star,
  User,
  Users, // Importado para o ícone da Comunidade
  MessageSquare, // Importado para o ícone do Chat
} from "lucide-react";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardSidebar({
  activeTab,
  setActiveTab,
}: DashboardSidebarProps) {
  const tabs = [
    {
      id: "overview",
      label: "Visão Geral",
      icon: <User className="h-4 w-4 mr-2" />,
    },
    {
      id: "engagement",
      label: "Engajamento",
      icon: <Star className="h-4 w-4 mr-2" />,
    },
    {
      id: "offers",
      label: "Ofertas Exclusivas",
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
    },
    { id: "events", label: "Eventos", icon: <Calendar className="h-4 w-4 mr-2" /> },
    // Novos objetos para Comunidade e Chat adicionados aqui
    {
      id: "community",
      label: "Comunidade",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      id: "chat",
      label: "Chat",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <div className="w-full md:w-64 mb-6 md:mb-0">
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="space-y-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === tab.id ? "bg-[#00FF00] hover:bg-[#00FF00]" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}