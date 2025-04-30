"use client"

import { Checkbox } from "../../components/ui/checkbox"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Plus, X } from "lucide-react"

interface ActivitiesFormProps {
  formData: {
    eventsAttended: string[]
    purchasedMerchandise: string[]
    subscriptions: string[]
    competitionsParticipated: string[]
  }
  updateFormData: (data: Partial<ActivitiesFormProps["formData"]>) => void
}

export function ActivitiesForm({ formData, updateFormData }: ActivitiesFormProps) {
  const [newEvent, setNewEvent] = useState("")
  const [newMerchandise, setNewMerchandise] = useState("")
  const [newCompetition, setNewCompetition] = useState("")

  const events = [
    "ESL Pro League 2024",
    "BLAST Premier 2024",
    "IEM Katowice 2024",
    "Major Rio 2022",
    "CBLOL 2024",
    "Valorant Champions 2024",
  ]

  const merchandise = ["Camisa Oficial FURIA 2024", "Moletom FURIA", "Mousepad FURIA", "Boné FURIA", "Máscara FURIA"]

  const subscriptions = ["FURIA+", "Twitch Prime", "YouTube Premium", "HLTV Premium", "FACEIT Premium"]

  const competitions = [
    "Torneios Amadores CS2",
    "Campeonatos Universitários",
    "Torneios de Valorant",
    "Competições de League of Legends",
    "Torneios locais",
  ]

  const handleEventChange = (event: string, checked: boolean) => {
    if (checked) {
      updateFormData({ eventsAttended: [...formData.eventsAttended, event] })
    } else {
      updateFormData({
        eventsAttended: formData.eventsAttended.filter((e) => e !== event),
      })
    }
  }

  const handleMerchandiseChange = (item: string, checked: boolean) => {
    if (checked) {
      updateFormData({ purchasedMerchandise: [...formData.purchasedMerchandise, item] })
    } else {
      updateFormData({
        purchasedMerchandise: formData.purchasedMerchandise.filter((i) => i !== item),
      })
    }
  }

  const handleSubscriptionChange = (sub: string, checked: boolean) => {
    if (checked) {
      updateFormData({ subscriptions: [...formData.subscriptions, sub] })
    } else {
      updateFormData({
        subscriptions: formData.subscriptions.filter((s) => s !== sub),
      })
    }
  }

  const handleCompetitionChange = (comp: string, checked: boolean) => {
    if (checked) {
      updateFormData({ competitionsParticipated: [...formData.competitionsParticipated, comp] })
    } else {
      updateFormData({
        competitionsParticipated: formData.competitionsParticipated.filter((c) => c !== comp),
      })
    }
  }

  const addCustomEvent = () => {
    if (newEvent && !formData.eventsAttended.includes(newEvent)) {
      updateFormData({ eventsAttended: [...formData.eventsAttended, newEvent] })
      setNewEvent("")
    }
  }

  const addCustomMerchandise = () => {
    if (newMerchandise && !formData.purchasedMerchandise.includes(newMerchandise)) {
      updateFormData({ purchasedMerchandise: [...formData.purchasedMerchandise, newMerchandise] })
      setNewMerchandise("")
    }
  }

  const addCustomCompetition = () => {
    if (newCompetition && !formData.competitionsParticipated.includes(newCompetition)) {
      updateFormData({ competitionsParticipated: [...formData.competitionsParticipated, newCompetition] })
      setNewCompetition("")
    }
  }

  const removeEvent = (event: string) => {
    updateFormData({
      eventsAttended: formData.eventsAttended.filter((e) => e !== event),
    })
  }

  const removeMerchandise = (item: string) => {
    updateFormData({
      purchasedMerchandise: formData.purchasedMerchandise.filter((i) => i !== item),
    })
  }

  const removeCompetition = (comp: string) => {
    updateFormData({
      competitionsParticipated: formData.competitionsParticipated.filter((c) => c !== comp),
    })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Suas Atividades</h3>
      <p className="text-sm text-gray-400">Conte-nos sobre suas atividades relacionadas a esports no último ano</p>

      <div className="space-y-8">
        <div className="space-y-4">
          <h4 className="font-medium">Eventos que Você Participou</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {events.map((event) => (
              <div key={event} className="flex items-center space-x-2">
                <Checkbox
                  id={`event-${event}`}
                  checked={formData.eventsAttended.includes(event)}
                  onCheckedChange={(checked) => handleEventChange(event, checked as boolean)}
                />
                <Label htmlFor={`event-${event}`} className="text-sm">
                  {event}
                </Label>
              </div>
            ))}
          </div>

          {formData.eventsAttended.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.eventsAttended
                .filter((event) => !events.includes(event))
                .map((event) => (
                  <div key={event} className="bg-gray-700 px-3 py-1 rounded-full flex items-center">
                    <span className="text-sm">{event}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1 text-gray-400 hover:text-white"
                      onClick={() => removeEvent(event)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Input
              placeholder="Adicionar outro evento"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
            <Button onClick={addCustomEvent} variant="outline" type="button">
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Produtos que Você Comprou</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {merchandise.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={`merch-${item}`}
                  checked={formData.purchasedMerchandise.includes(item)}
                  onCheckedChange={(checked) => handleMerchandiseChange(item, checked as boolean)}
                />
                <Label htmlFor={`merch-${item}`} className="text-sm">
                  {item}
                </Label>
              </div>
            ))}
          </div>

          {formData.purchasedMerchandise.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.purchasedMerchandise
                .filter((item) => !merchandise.includes(item))
                .map((item) => (
                  <div key={item} className="bg-gray-700 px-3 py-1 rounded-full flex items-center">
                    <span className="text-sm">{item}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1 text-gray-400 hover:text-white"
                      onClick={() => removeMerchandise(item)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Input
              placeholder="Adicionar outro produto"
              value={newMerchandise}
              onChange={(e) => setNewMerchandise(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
            <Button onClick={addCustomMerchandise} variant="outline" type="button">
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Assinaturas</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {subscriptions.map((sub) => (
              <div key={sub} className="flex items-center space-x-2">
                <Checkbox
                  id={`sub-${sub}`}
                  checked={formData.subscriptions.includes(sub)}
                  onCheckedChange={(checked) => handleSubscriptionChange(sub, checked as boolean)}
                />
                <Label htmlFor={`sub-${sub}`} className="text-sm">
                  {sub}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Competições que Você Participou</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {competitions.map((comp) => (
              <div key={comp} className="flex items-center space-x-2">
                <Checkbox
                  id={`comp-${comp}`}
                  checked={formData.competitionsParticipated.includes(comp)}
                  onCheckedChange={(checked) => handleCompetitionChange(comp, checked as boolean)}
                />
                <Label htmlFor={`comp-${comp}`} className="text-sm">
                  {comp}
                </Label>
              </div>
            ))}
          </div>

          {formData.competitionsParticipated.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.competitionsParticipated
                .filter((comp) => !competitions.includes(comp))
                .map((comp) => (
                  <div key={comp} className="bg-gray-700 px-3 py-1 rounded-full flex items-center">
                    <span className="text-sm">{comp}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1 text-gray-400 hover:text-white"
                      onClick={() => removeCompetition(comp)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Input
              placeholder="Adicionar outra competição"
              value={newCompetition}
              onChange={(e) => setNewCompetition(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
            <Button onClick={addCustomCompetition} variant="outline" type="button">
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
