// global.d.ts
import '@react-three/fiber';

declare module 'react' {
  namespace JSX {
    // faz o merge das declarações IntrinsicElements com as de Fiber
    interface IntrinsicElements extends import('@react-three/fiber').ThreeElements {}
  }
}
