"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Switch } from "../../components/ui/switch"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Slider } from "../../components/ui/slider"
import { Badge } from "../../components/ui/badge"
import { Bell, Lock, Moon, Sun, User } from "lucide-react"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState("pt-BR")
  const [volume, setVolume] = useState([70])
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Configurações</DialogTitle>
          <DialogDescription className="text-gray-400">
            Personalize sua experiência na plataforma FURIA Fan
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="account" className="mt-4">
          <TabsList className="grid grid-cols-4 bg-gray-700">
            <TabsTrigger value="account" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" />
              Conta
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-white"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-white">
              <Sun className="h-4 w-4 mr-2" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-white">
              <Lock className="h-4 w-4 mr-2" />
              Privacidade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input id="username" defaultValue="carlos.silva" className="bg-gray-700 border-gray-600" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  defaultValue="eri@email.com"
                  type="email"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="delete-account">Excluir conta</Label>
                  <p className="text-sm text-gray-400">Remover permanentemente sua conta e todos os dados</p>
                </div>
                <Button variant="destructive">Excluir conta</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notificações</Label>
                  <p className="text-sm text-gray-400">Ativar ou desativar todas as notificações</p>
                </div>
                <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notificações por email</Label>
                  <p className="text-sm text-gray-400">Receber atualizações por email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  disabled={!notificationsEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Notificações push</Label>
                  <p className="text-sm text-gray-400">Receber notificações no navegador</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                  disabled={!notificationsEnabled}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="volume">Volume de notificações</Label>
                  <span className="text-sm">{volume}%</span>
                </div>
                <Slider
                  id="volume"
                  defaultValue={volume}
                  max={100}
                  step={1}
                  onValueChange={setVolume}
                  disabled={!notificationsEnabled}
                  className="[&>span]:bg-[#00FF00]"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Modo escuro</Label>
                  <p className="text-sm text-gray-400">Alternar entre tema claro e escuro</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-gray-400" />
                  <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                  <Moon className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cor de destaque</Label>
                <div className="flex gap-2">
                  <Button
                    className="w-8 h-8 rounded-full p-0 bg-[#00FF00]"
                    variant="ghost"
                    style={{ backgroundColor: "#FF5500" }}
                  >
                    <span className="sr-only">Laranja</span>
                  </Button>
                  <Button
                    className="w-8 h-8 rounded-full p-0 bg-[#00FF00]"
                    variant="ghost"
                    style={{ backgroundColor: "#00FF00" }}
                  >
                    <span className="sr-only">Verde</span>
                  </Button>
                  <Button
                    className="w-8 h-8 rounded-full p-0 bg-[#0088FF]"
                    variant="ghost"
                    style={{ backgroundColor: "#0088FF" }}
                  >
                    <span className="sr-only">Azul</span>
                  </Button>
                  <Button
                    className="w-8 h-8 rounded-full p-0 bg-[#FF00FF]"
                    variant="ghost"
                    style={{ backgroundColor: "#FF00FF" }}
                  >
                    <span className="sr-only">Rosa</span>
                  </Button>
                  <Button
                    className="w-8 h-8 rounded-full p-0 bg-[#FFFF00]"
                    variant="ghost"
                    style={{ backgroundColor: "#FFFF00" }}
                  >
                    <span className="sr-only">Amarelo</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tamanho da fonte</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-gray-700 border-gray-600">
                    Pequeno
                  </Button>
                  <Button variant="default" className="flex-1 bg-[#00FF00]">
                    Médio
                  </Button>
                  <Button variant="outline" className="flex-1 bg-gray-700 border-gray-600">
                    Grande
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Label htmlFor="two-factor">Autenticação de dois fatores</Label>
                    <Badge className="ml-2 bg-green-600">Recomendado</Badge>
                  </div>
                  <p className="text-sm text-gray-400">Aumentar a segurança da sua conta</p>
                </div>
                <Switch id="two-factor" checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>

              <div className="space-y-2">
                <Label>Visibilidade do perfil</Label>
                <Select defaultValue="friends">
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="public">Público</SelectItem>
                    <SelectItem value="friends">Apenas amigos</SelectItem>
                    <SelectItem value="private">Privado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Compartilhamento de dados</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="share-stats" className="text-sm">
                      Estatísticas de jogo
                    </Label>
                    <Switch id="share-stats" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="share-activity" className="text-sm">
                      Atividade na plataforma
                    </Label>
                    <Switch id="share-activity" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="share-preferences" className="text-sm">
                      Preferências e interesses
                    </Label>
                    <Switch id="share-preferences" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-gray-700 border-gray-600">
            Cancelar
          </Button>
          <Button className="bg-[#00FF00] hover:bg-[#3bb83b]">Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
