"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"
import { Badge } from "../../components/ui/badge"
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  MoreHorizontal,
  ImageIcon,
  LinkIcon,
  Smile,
  Flag,
  Bookmark,
  Loader2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Textarea } from "../../components/ui/textarea"
import { useToast } from "../../hooks/use-toast"

interface DiscussionFeedProps {
  isLoading: boolean
}

export default function DiscussionFeed({ isLoading }: DiscussionFeedProps) {
  const { toast } = useToast()
  const [commentText, setCommentText] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({})
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [showCommentForm, setShowCommentForm] = useState<Record<string, boolean>>({})

  // Mock data for posts
  const posts = [
    {
      id: "1",
      author: {
        name: "Marcos Oliveira",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Super Fã",
      },
      content:
        "Que jogo incrível ontem! FURIA mostrou porque é o melhor time do Brasil. arT com aquelas entradas agressivas e KSCERATO segurando o bomb site sozinho. O que vocês acharam?",
      timestamp: "2h atrás",
      likes: 42,
      comments: 8,
      shares: 3,
      tags: ["CS2", "ESL Pro League"],
      media: {
        type: "image",
        url: "/placeholder.svg?height=300&width=600",
        alt: "FURIA vs Liquid",
      },
      commentsList: [
        {
          id: "c1",
          author: {
            name: "Ana Clara",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          content: "KSCERATO é simplesmente o melhor jogador do Brasil atualmente! Aquele clutch 1v3 foi insano.",
          timestamp: "1h atrás",
          likes: 12,
        },
        {
          id: "c2",
          author: {
            name: "Pedro Souza",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          content: "arT é muito agressivo, às vezes isso custa rounds, mas ontem estava certeiro em todas as decisões.",
          timestamp: "45min atrás",
          likes: 5,
        },
      ],
    },
    {
      id: "2",
      author: {
        name: "Juliana Mendes",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Moderadora",
      },
      content:
        "Pessoal, não esqueçam que temos o encontro de fãs no próximo sábado! Vamos nos reunir para assistir FURIA vs NAVI na BLAST Premier. Quem vai estar presente?",
      timestamp: "5h atrás",
      likes: 28,
      comments: 15,
      shares: 7,
      tags: ["Evento", "BLAST Premier"],
      commentsList: [
        {
          id: "c3",
          author: {
            name: "Lucas Mendonça",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          content: "Estarei lá! Já comprei meu ingresso.",
          timestamp: "4h atrás",
          likes: 3,
        },
      ],
    },
    {
      id: "3",
      author: {
        name: "Rafael Costa",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Fã",
      },
      content:
        "Acabei de receber minha nova camisa da FURIA! A qualidade está incrível, recomendo para todos os fãs. O tecido é muito confortável e o design ficou ainda mais bonito pessoalmente.",
      timestamp: "1d atrás",
      likes: 56,
      comments: 12,
      shares: 4,
      tags: ["Merchandise"],
      media: {
        type: "image",
        url: "/placeholder.svg?height=300&width=600",
        alt: "Nova camisa FURIA",
      },
      commentsList: [
        {
          id: "c4",
          author: {
            name: "Carla Dias",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          content: "Também comprei! Chegou super rápido e a qualidade é excelente.",
          timestamp: "23h atrás",
          likes: 8,
        },
        {
          id: "c5",
          author: {
            name: "Bruno Almeida",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          content: "Qual tamanho você pegou? Estou em dúvida entre M e G.",
          timestamp: "20h atrás",
          likes: 1,
        },
        {
          id: "c6",
          author: {
            name: "Rafael Costa",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          content: "Peguei M e ficou perfeito! Tenho 1,75m e 70kg para referência.",
          timestamp: "19h atrás",
          likes: 3,
        },
      ],
    },
  ]

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))

    toast({
      title: likedPosts[postId] ? "Curtida removida" : "Post curtido",
      description: likedPosts[postId] ? "Você removeu sua curtida desta publicação" : "Você curtiu esta publicação",
    })
  }

  const handleBookmark = (postId: string) => {
    setBookmarkedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))

    toast({
      title: bookmarkedPosts[postId] ? "Removido dos salvos" : "Salvo com sucesso",
      description: bookmarkedPosts[postId]
        ? "Publicação removida dos seus itens salvos"
        : "Publicação adicionada aos seus itens salvos",
    })
  }

  const handleShare = (postId: string) => {
    toast({
      title: "Compartilhar",
      description: "Opções de compartilhamento abertas",
    })
  }

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  const toggleCommentForm = (postId: string) => {
    setShowCommentForm((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  const handleSubmitComment = (postId: string) => {
    if (!commentText.trim()) return

    setIsSubmittingComment(true)

    // Simular envio de comentário
    setTimeout(() => {
      setIsSubmittingComment(false)
      setCommentText("")
      setShowCommentForm((prev) => ({
        ...prev,
        [postId]: false,
      }))

      toast({
        title: "Comentário enviado",
        description: "Seu comentário foi publicado com sucesso",
      })
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-40 w-full rounded-md" />
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-start justify-between pb-3">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{post.author.name}</p>
                  <Badge variant="outline" className="text-xs bg-gray-700">
                    {post.author.role}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">{post.timestamp}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                <DropdownMenuItem onClick={() => handleBookmark(post.id)} className="cursor-pointer">
                  <Bookmark className="h-4 w-4 mr-2" />
                  {bookmarkedPosts[post.id] ? "Remover dos salvos" : "Salvar publicação"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Flag className="h-4 w-4 mr-2" />
                  Denunciar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{post.content}</p>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-700 hover:bg-gray-600">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {post.media && (
              <div className="rounded-md overflow-hidden">
                <img
                  src={post.media.url || "/placeholder.svg"}
                  alt={post.media.alt}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="flex justify-between w-full pb-3">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${likedPosts[post.id] ? "text-[#00FF00]" : ""}`}
                onClick={() => handleLike(post.id)}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{likedPosts[post.id] ? post.likes + 1 : post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => toggleComments(post.id)}>
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => handleShare(post.id)}>
                <Share2 className="h-4 w-4" />
                <span>{post.shares}</span>
              </Button>
            </div>

            {expandedComments[post.id] && (
              <div className="w-full pt-3 border-t border-gray-700 space-y-4">
                {post.commentsList && post.commentsList.length > 0 ? (
                  <>
                    {post.commentsList.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-gray-700 rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <p className="font-medium text-sm">{comment.author.name}</p>
                              <span className="text-xs text-gray-400">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm mt-1">{comment.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                {comment.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                Responder
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#00FF00]"
                      onClick={() => toggleCommentForm(post.id)}
                    >
                      Adicionar comentário
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-2">
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                  </p>
                )}

                {showCommentForm[post.id] && (
                  <div className="flex gap-3 mt-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Seu avatar" />
                      <AvatarFallback>EU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Escreva um comentário..."
                        className="bg-gray-700 border-gray-600 min-h-[80px]"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Smile className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          className="bg-[#00FF00] hover:bg-[#00CC00] text-black"
                          onClick={() => handleSubmitComment(post.id)}
                          disabled={!commentText.trim() || isSubmittingComment}
                        >
                          {isSubmittingComment ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            "Comentar"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      ))}

      <div className="flex justify-center">
        <Button variant="outline" className="bg-gray-800 border-gray-700">
          Carregar mais
        </Button>
      </div>
    </div>
  )
}
