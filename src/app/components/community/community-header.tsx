"use client"

import { Calendar } from "../../components/ui/calendar"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import {  Menu,  Home, MessageSquare, Users } from "lucide-react"
import Link from "next/link"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../components/ui/sheet"

export default function CommunityHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Mock user data
  const user = {
    name: "Carlos Silva",
    email: "carlos.silva@email.com",
    avatar: "/img/logo.png",
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-1">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-8">
            <img src="/img/logo.png" alt="FURIA Logo" className="h-8 w-8 mr-2" />
            {/* <span className="text-xl font-bold hidden md:inline">FURIA Fan Hub</span> */}
          </Link>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-[#00FF00] mr-2"></div>
            <span className="text-sm">1.243 fãs online</span> {/* Este valor é estático */}
          </div>
       
        </div>

        <div className="flex items-center space-x-4">
         
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-900 border-gray-800">
              <SheetHeader>
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-800">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/community"
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-800 text-[#00FF00]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="h-5 w-5" />
                    Comunidade
                  </Link>
                  <Link
                    href="/events"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Calendar className="h-5 w-5 mt-6" />
                    Eventos
                  </Link>
                  <Link
                    href="/chat"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MessageSquare className="h-5 w-5" />
                    Chat
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
