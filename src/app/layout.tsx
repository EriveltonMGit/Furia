import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./contexts/AuthContext"
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from "react-hot-toast"
import { ChatProvider } from "./components/chatFloat/chat-provider"
import FloatingChatButton from "./components/chatFloat/floating-chat-button"
import { VerificationProvider } from "./contexts/VerificationContext"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FURIA",
  description: "Conheça melhor os fãs da FURIA Esports",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <VerificationProvider>
            <ChatProvider>
           

              <Toaster position="top-right" />
              
              {children}
             
              <FloatingChatButton />
            </ChatProvider>
            </VerificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
