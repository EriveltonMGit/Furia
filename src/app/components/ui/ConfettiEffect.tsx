'use client'; // Este componente usa hooks de estado e efeitos, então precisa ser client-side

import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

interface ConfettiEffectProps {
  /**
   * Quando este prop se torna true, o confete é disparado.
   * Ele só dispara uma vez por cada vez que se torna true durante o ciclo de vida do componente.
   */
  trigger: boolean;
  /**
   * Duração em milissegundos que o confete fica visível.
   * Deve corresponder ou ser ligeiramente maior que a duração da animação do confete.
   * Default é 5000ms (5 segundos).
   */
  duration?: number;
  /**
   * Número de peças de confete a serem disparadas.
   * Default é 200.
   */
  numberOfPieces?: number;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
  trigger,
  duration = 5000,
  numberOfPieces = 200
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  // Efeito para capturar as dimensões da janela e garantir responsividade
  useEffect(() => {
    // Só roda no lado do cliente (browser)
    if (typeof window !== 'undefined') {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });

      const handleResize = () => {
        setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize); // Limpa o listener ao desmontar
      };
    }
  }, []); // Este efeito roda apenas uma vez no mount inicial do componente


  // Efeito para disparar o confete quando o prop 'trigger' muda para true
  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Dispara a lógica APENAS quando 'trigger' se torna true
    // Adicionado !showConfetti para evitar re-disparo se trigger ficar true e o confete já estiver ativo
    // IMPORTANTE: A lógica de 'disparar apenas uma vez por usuário' NÃO está aqui, está no componente pai (Dashboard).
    // Este componente apenas reage ao prop 'trigger'.
    if (trigger && !showConfetti) {
      setShowConfetti(true); // Começa a mostrar o confete

      // Configura um timer para parar de mostrar o confete após a duração especificada
      timer = setTimeout(() => {
        setShowConfetti(false);
      }, duration);
    }

    // Função de limpeza: cancela o timer se o componente for desmontado ou
    // se o prop 'trigger' mudar novamente antes do timer expirar.
    return () => {
      clearTimeout(timer);
    };
    // Adicionado showConfetti como dependência para a condição !showConfetti funcionar corretamente
  }, [trigger, duration, showConfetti]);


  // Renderiza o Confetti apenas se showConfetti for true e as dimensões da janela forem válidas
  // A verificação windowDimensions.width/height > 0 evita renderizar com dimensões zero antes do useEffect inicial
  if (!showConfetti || windowDimensions.width === 0 || windowDimensions.height === 0) {
    return null; // Não renderiza nada
  }

  // O componente Confetti da biblioteca usará as dimensões da janela para cobrir 100%
  return (
    <Confetti
      width={windowDimensions.width}   // Passa a largura da janela (100% da viewport)
      height={windowDimensions.height} // Passa a altura da janela (100% da viewport)
      recycle={false} // Garante que seja uma única explosão por trigger
      numberOfPieces={numberOfPieces} // Número de peças
      tweenDuration={duration} // Duração da animação (ajustada para corresponder ao timer)
      gravity={0.1} // Ajuste a gravidade se desejar (0.1 é um bom valor padrão)
      run={showConfetti} // A prop 'run' explicitamente controla se a animação está ativa
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }} // Garante que cubra tudo e esteja no topo
    />
  );
};

export default ConfettiEffect;