import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCD19h80x29mvlBJ-szCsS2cdJb-Eh1JS0",
  authDomain: "furia-e8197.firebaseapp.com",
  projectId: "furia-e8197",
  storageBucket: "furia-e8197.firebasestorage.app",
  messagingSenderId: "27053484566",
  appId: "1:27053484566:web:7c74b554964f523e1be337",
  measurementId: "G-21Q7R9R9ZT"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Inicialize o Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Inicialize o Analytics apenas no lado do cliente
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Função para login com Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha na autenticação via Google');
    }

    return await response.json();
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

// Exporte apenas o necessário
export { auth, googleProvider };