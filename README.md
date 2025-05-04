# Projeto Fúria (Em Produção/Hospedado)

## Visão Geral

O Projeto Fúria é uma plataforma web para fãs, com frontend desenvolvido utilizando **Next.js** e um conjunto robusto de bibliotecas React para a interface do usuário. O backend, construído com **Node.js** e **Express.js**, fornece a lógica e a API para a aplicação. Os dados são persistidos utilizando o **Firebase** como banco de dados. **Todo o projeto está atualmente em produção e hospedado nos seguintes endereços:**

<div align="center">
  <img src="https://drive.google.com/uc?id=1FdWjBvshhZI0F-XhCUKZniTnYbAsk6S0" width="850">
  <img src="https://drive.google.com/uc?id=1MJ-WapVZFF1XBgKs7OMZ39oBHMhkLqht" width="250">
  <img src="https://drive.google.com/uc?id=1_E5YO_GZKkwMeZEvlUwokgQhd3xbBdXH" width="200">
  <img src="https://drive.google.com/uc?id=12YoMec-8m68XYsTinkfVVC0ovwAXAAvQ" width="850">
</div>
## URLs de Acesso

-   **Frontend:** [https://furia-wheat.vercel.app/](https://furia-wheat.vercel.app/)
-   **Backend:** [https://furia-backend-8tck.onrender.com/](https://furia-backend-8tck.onrender.com/)

## Repositórios

-   **Frontend:** [https://github.com/EriveltonMGit/Furia](https://github.com/EriveltonMGit/Furia)
-   **Backend:** [https://github.com/EriveltonMGit/Furia-Backend](https://github.com/EriveltonMGit/Furia-Backend)

## Tecnologias Utilizadas

-   **Frontend:**
    -   **Next.js:** Framework React para construção de aplicações web com renderização server-side e outras funcionalidades.
    -   **React:** Biblioteca JavaScript para construção de interfaces de usuário.
    -   **@radix-ui/react-\*:** Conjunto de componentes de interface do usuário não estilizados e acessíveis.
    -   **Tailwind CSS:** Framework CSS utilitário para estilização rápida e responsiva.
    -   **tailwindcss-animate:** Plugin Tailwind CSS para adicionar animações.
    -   **framer-motion:** Biblioteca para animações e gestos em React.
    -   **lucide-react:** Biblioteca de ícones.
    -   **react-hook-form:** Biblioteca para gerenciamento de formulários em React.
    -   **zod:** Biblioteca para validação de esquemas.
    -   **axios:** Cliente HTTP para fazer requisições ao backend.
    -   **firebase:** SDK para integração com os serviços do Firebase.
    -   **@google/generative-ai:** Biblioteca para utilizar modelos de inteligência artificial generativa do Google.
    -   **Outras:** `class-variance-authority`, `clsx`, `cmdk`, `cookie`, `date-fns`, `embla-carousel-react`, `input-otp`, `next-themes`, `react-confetti`, `react-dom`, `react-hot-toast`, `react-icons`, `react-imask`, `react-resizable-panels`, `recharts`, `sonner`, `tailwind-merge`, `vaul`.

-   **Backend:**
    -   **Node.js:** Ambiente de execução JavaScript para o servidor.
    -   **Express.js:** Framework web minimalista e flexível para Node.js.
    -   **Firebase:** SDK para interação com o banco de dados e outros serviços do Firebase.
    -   **firebase-admin:** SDK para realizar operações administrativas no Firebase a partir do servidor.
    -   **jsonwebtoken:** Biblioteca para geração e verificação de tokens JWT para autenticação.
    -   **bcryptjs:** Biblioteca para hash de senhas.
    -   **body-parser:** Middleware para analisar corpos de requisição HTTP.
    -   **cors:** Middleware para habilitar Cross-Origin Resource Sharing.
    -   **morgan:** Middleware para logging de requisições HTTP.
    -   **multer:** Middleware para lidar com o upload de arquivos.
    -   **@google-cloud/aiplatform:** SDK do Google Cloud para interagir com a plataforma de IA.
    -   **@google/generative-ai:** Biblioteca para utilizar modelos de inteligência artificial generativa do Google.
    -   **Outras:** `axios`, `cookie-parser`, `dotenv`, `uuid`.

-   **Banco de Dados:** Firebase (especificar se é Realtime Database ou Firestore, com base na configuração do backend).

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina **apenas se você pretende executar o projeto localmente para desenvolvimento ou contribuição**:

-   **Node.js** (versão recomendada: >= 18) e **npm** ou **yarn**.
-   **Git** para clonar o repositório.
-   Conexão com a internet para acessar as dependências e os serviços online.

## Instruções de Instalação e Execução (Apenas para Desenvolvimento/Contribuição)

### Frontend

1.  Clone o repositório do frontend:
    ```bash
    git clone https://github.com/EriveltonMGit/Furia.git
    cd Furia
    ```
2.  Instale as dependências:
    ```bash
    npm install --legacy-peer-deps  # Ou yarn install
    ```
3.  Configure as variáveis de ambiente (se necessário). Crie um arquivo `.env.local` na raiz do projeto e adicione as configurações necessárias, como URLs de API do backend e as chaves de configuração do Firebase. Exemplo:
    ```
    NEXT_PUBLIC_BACKEND_URL=[https://furia-backend-8tck.onrender.com/](https://furia-backend-8tck.onrender.com/)
    NEXT_PUBLIC_FIREBASE_API_KEY=SUA_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=SEU_DOMINIO
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=SEU_ID_DO_PROJETO
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=SEU_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=SEU_ID_DE_ENVIO
    NEXT_PUBLIC_FIREBASE_APP_ID=SEU_ID_DO_APP
    ```
    **Importante:** Nunca commite arquivos `.env.local` com informações sensíveis para repositórios públicos.
4.  Execute o frontend em modo de desenvolvimento:
    ```bash
    npm run dev  # Ou yarn dev
    ```
    Isso iniciará o servidor de desenvolvimento do Next.js, geralmente acessível em `http://localhost:3000`.

### Backend

As instruções de instalação e execução do backend podem ser encontradas no repositório: [https://github.com/EriveltonMGit/Furia-Backend](https://github.com/EriveltonMGit/Furia-Backend). Geralmente, os passos envolvem clonar o repositório, instalar as dependências com `npm install` (ou `yarn install`), configurar as variáveis de ambiente (como as credenciais do Firebase) e executar o servidor com `npm start` ou `npm run dev`.

### Banco de Dados (Firebase)

1.  **Configuração do Firebase:**
    -   Acesse o console do Firebase ([https://console.firebase.google.com/](https://console.firebase.google.com/)).
    -   Selecione seu projeto Fúria.
    -   Verifique as configurações do seu projeto (ícone de engrenagem -> Configurações do projeto) para obter as credenciais necessárias (apiKey, authDomain, projectId, etc.). Essas informações são utilizadas no frontend e/ou backend para inicializar o SDK do Firebase.
    -   Analise as regras de segurança configuradas para o seu banco de dados (Realtime Database ou Firestore) para garantir que o acesso aos dados esteja protegido de acordo com as necessidades da aplicação.

## Documentação da API (Backend)

Para informações sobre os endpoints da API do backend, como formatos de requisição e resposta, consulte a documentação disponível no repositório do backend ou acesse a URL da API base (`https://furia-backend-8tck.onrender.com/`) para verificar se há algum endpoint de documentação (como `/api-docs`).

## Contribuição

Se você deseja contribuir para o Projeto Fúria, siga as diretrizes mencionadas anteriormente na seção de Contribuição do README principal. Certifique-se de coordenar com outros desenvolvedores para evitar conflitos e manter a consistência do projeto.

## Considerações Finais

Este README fornece informações essenciais para entender o Projeto Fúria. Para detalhes sobre a arquitetura completa, funcionalidades específicas e o backend, consulte o repositório do backend e a documentação adicional do projeto.
