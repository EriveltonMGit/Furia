// src/contexts/VerificationContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface VerificationState {
  idDocument: File | null;
  selfie: File | null;
  addressProof: File | null;
  faceVerified: boolean;
}

interface VerificationContextType {
  verificationData: VerificationState;
  updateVerificationData: (data: Partial<VerificationState>) => void;
  resetVerification: () => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [verificationData, setVerificationData] = useState<VerificationState>({
    idDocument: null,
    selfie: null,
    addressProof: null,
    faceVerified: false,
  });

  const updateVerificationData = (data: Partial<VerificationState>) => {
    setVerificationData(prev => ({ ...prev, ...data }));
  };

  const resetVerification = () => {
    setVerificationData({
      idDocument: null,
      selfie: null,
      addressProof: null,
      faceVerified: false,
    });
  };

  return (
    <VerificationContext.Provider value={{ verificationData, updateVerificationData, resetVerification }}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error("useVerification must be used within a VerificationProvider");
  }
  return context;
}