import { cn } from "../lib/utils"

export default function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-1 px-2 py-1", className)}>
      <div className="animate-bounce h-2 w-2 rounded-full bg-[#00FF00] delay-0"></div>
      <div className="animate-bounce h-2 w-2 rounded-full bg-[#00FF00] delay-150"></div>
      <div className="animate-bounce h-2 w-2 rounded-full bg-[#00FF00] delay-300"></div>
    </div>
  )
}
