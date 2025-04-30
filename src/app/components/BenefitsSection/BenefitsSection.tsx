import Link from "next/link";
// Note: Os SVGs inline estão aqui, você pode mantê-los ou criar um componente de ícone se forem usados em mais lugares.
// Se mantiver, não precisa importar nada adicional para os SVGs.

export default function BenefitsSection() {
  return (
    <section className="container mx-auto py-16">
      <h3 className="text-3xl font-bold text-center mb-12 font-Purista">
        Benefícios Exclusivos
      </h3>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg p-8">
          <h4 className="text-xl font-bold mb-4 font-Purista">Para Fãs Verificados</h4>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="bg-[#00FF00] rounded-full p-1 mr-3 mt-1">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Acesso antecipado a ingressos para eventos</span>
            </li>
            <li className="flex items-start">
              <div className="bg-[#00FF00] rounded-full p-1 mr-3 mt-1">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Descontos exclusivos em produtos oficiais</span>
            </li>
            <li className="flex items-start">
              <div className="bg-[#00FF00] rounded-full p-1 mr-3 mt-1">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Convites para eventos exclusivos com jogadores</span>
            </li>
          </ul>
        </div>
        <div className="bg-gray-800 rounded-lg p-8">
          <h4 className="text-xl font-bold mb-4 font-Purista">Para Super Fãs</h4>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="bg-[#00FF00] rounded-full p-1 mr-3 mt-1">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Experiências VIP em competições</span>
            </li>
            <li className="flex items-start">
              <div className="bg-[#00FF00] rounded-full p-1 mr-3 mt-1">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Participação em testes de produtos e jogos</span>
            </li>
            <li className="flex items-start">
              <div className="bg-[#00FF00] rounded-full p-1 mr-3 mt-1">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Acesso a conteúdo exclusivo e bastidores</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}