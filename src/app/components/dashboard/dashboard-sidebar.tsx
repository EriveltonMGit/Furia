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
  Menu,
} from "lucide-react";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardSidebar({
  activeTab,
  setActiveTab,
}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true); // Alterado para true para iniciar fechado

  const tabs = [
    {
      id: "overview",
      label: "Visão Geral",
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "engagement",
      label: "Engajamento",
      icon: <Star className="h-4 w-4" />,
    },
    {
      id: "offers",
      label: "Ofertas Exclusivas",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    { id: "events", label: "Eventos", icon: <Calendar className="h-4 w-4" /> },
    {
      id: "community",
      label: "Comunidade",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "chat",
      label: "Chat",
      icon: <MessageSquare className="h-4 w-4" />,
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      } hidden md:block`}
    >
      <div className="bg-gray-800 rounded-lg p-4 h-full">
        {/* Botão de toggle */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleSidebar}
          >
            {isCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="space-y-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === tab.id
                  ? "bg-[#00FF00] hover:bg-[#00FF00] text-black"
                  : "hover:bg-gray-700"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="flex items-center">
                {tab.icon}
                {!isCollapsed && (
                  <span className="ml-2">{tab.label}</span>
                )}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}