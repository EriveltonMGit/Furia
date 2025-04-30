export function VerificationProgress({
  currentStep,
  totalSteps,
}: {
  currentStep: number
  totalSteps: number
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Progresso</span>
        <span className="text-sm font-medium">
          {currentStep}/{totalSteps}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-[#00FF00] h-2.5 rounded-full"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-400">Upload de Documentos</span>
        <span className="text-xs text-gray-400">Verificação Facial</span>
      </div>
    </div>
  )
}
