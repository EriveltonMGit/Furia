"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ImageIcon, LinkIcon, Video, FileText, Hash, X, Loader2, Globe, Users } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const { toast } = useToast()
  const [postContent, setPostContent] = useState("")
  const [postTitle, setPostTitle] = useState("")
  const [postType, setPostType] = useState("text")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [privacy, setPrivacy] = useState("public")
  const [attachments, setAttachments] = useState<{ type: string; name: string }[]>([])

  // Mock user data
  const user = {
    name: "Carlos Silva",
    avatar: "/placeholder.svg?height=40&width=40",
  }

  // Mock suggested tags
  const suggestedTags = ["CS2", "FURIA", "ESL", "Estratégia", "Valorant", "Merchandise", "Comunidade", "Evento"]

  const handleAddTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault()
      handleAddTag(tagInput)
    }
  }

  const handleAttachmentUpload = (type: string) => {
    // Simulate file upload
    const fileTypes: Record<string, string[]> = {
      image: ["imagem.jpg", "foto.png", "screenshot.jpeg"],
      video: ["video.mp4", "clip.mov"],
      file: ["documento.pdf", "planilha.xlsx"],
      link: ["https://example.com/article"],
    }

    const randomFileName = fileTypes[type][Math.floor(Math.random() * fileTypes[type].length)]

    setAttachments([...attachments, { type, name: randomFileName }])

    toast({
      title: "Arquivo anexado",
      description: `${randomFileName} foi anexado à sua publicação`,
    })
  }

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...attachments]
    newAttachments.splice(index, 1)
    setAttachments(newAttachments)
  }

  const handleSubmit = () => {
    if (!postContent.trim()) return

    setIsSubmitting(true)

    // Simulate post submission
    setTimeout(() => {
      setIsSubmitting(false)
      onOpenChange(false)

      toast({
        title: "Publicação criada",
        description: "Sua publicação foi criada com sucesso",
      })

      // Reset form
      setPostContent("")
      setPostTitle("")
      setPostType("text")
      setSelectedTags([])
      setTagInput("")
      setPrivacy("public")
      setAttachments([])
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Criar Publicação</DialogTitle>
          <DialogDescription className="text-gray-400">
            Compartilhe seus pensamentos, ideias ou perguntas com a comunidade FURIA
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs flex items-center gap-1 bg-gray-700 border-gray-600"
                onClick={() => setPrivacy(privacy === "public" ? "friends" : "public")}
              >
                {privacy === "public" ? (
                  <>
                    <Globe className="h-3 w-3" />
                    <span>Público</span>
                  </>
                ) : (
                  <>
                    <Users className="h-3 w-3" />
                    <span>Amigos</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={postType} onValueChange={setPostType} className="w-full">
          <TabsList className="grid grid-cols-4 bg-gray-700">
            <TabsTrigger value="text" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
              <FileText className="h-4 w-4 mr-2" />
              Texto
            </TabsTrigger>
            <TabsTrigger value="image" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
              <ImageIcon className="h-4 w-4 mr-2" />
              Imagem
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
              <Video className="h-4 w-4 mr-2" />
              Vídeo
            </TabsTrigger>
            <TabsTrigger value="link" className="data-[state=active]:bg-[#00FF00] data-[state=active]:text-black">
              <LinkIcon className="h-4 w-4 mr-2" />
              Link
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 space-y-4">
            {(postType === "text" || postType === "link") && (
              <Input
                placeholder="Título (opcional)"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            )}

            <Textarea
              placeholder={
                postType === "text"
                  ? "O que você está pensando?"
                  : postType === "image"
                    ? "Descreva sua imagem..."
                    : postType === "video"
                      ? "Descreva seu vídeo..."
                      : "Compartilhe um link interessante..."
              }
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="bg-gray-700 border-gray-600 min-h-[120px]"
            />

            {postType === "image" && (
              <Button
                variant="outline"
                className="w-full bg-gray-700 border-gray-600 border-dashed h-20"
                onClick={() => handleAttachmentUpload("image")}
              >
                <ImageIcon className="h-5 w-5 mr-2" />
                Clique para fazer upload de imagem
              </Button>
            )}

            {postType === "video" && (
              <Button
                variant="outline"
                className="w-full bg-gray-700 border-gray-600 border-dashed h-20"
                onClick={() => handleAttachmentUpload("video")}
              >
                <Video className="h-5 w-5 mr-2" />
                Clique para fazer upload de vídeo
              </Button>
            )}

            {postType === "link" && (
              <Input
                placeholder="Cole o link aqui"
                className="bg-gray-700 border-gray-600"
                onChange={() => handleAttachmentUpload("link")}
              />
            )}

            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Anexos:</p>
                <div className="space-y-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                      <div className="flex items-center">
                        {attachment.type === "image" && <ImageIcon className="h-4 w-4 mr-2" />}
                        {attachment.type === "video" && <Video className="h-4 w-4 mr-2" />}
                        {attachment.type === "file" && <FileText className="h-4 w-4 mr-2" />}
                        {attachment.type === "link" && <LinkIcon className="h-4 w-4 mr-2" />}
                        <span className="text-sm">{attachment.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium">Tags (até 5)</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} className="bg-[#00FF00] text-black flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="bg-gray-700 border-gray-600"
                  disabled={selectedTags.length >= 5}
                />
                <Button
                  variant="outline"
                  className="bg-gray-700 border-gray-600"
                  onClick={() => handleAddTag(tagInput)}
                  disabled={!tagInput || selectedTags.length >= 5}
                >
                  Adicionar
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {suggestedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="bg-gray-700 border-gray-600 cursor-pointer"
                    onClick={() => handleAddTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-gray-700 border-gray-600"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#00FF00] hover:bg-[#00CC00] text-black"
            disabled={!postContent.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publicando...
              </>
            ) : (
              "Publicar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
