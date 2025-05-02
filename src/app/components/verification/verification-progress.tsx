// frontend/components/verification/verification-progress.tsx
import { CheckCircle, Loader2 } from "lucide-react";

interface VerificationProgressProps {
    currentStep: number;
    totalSteps: number;
}

export function VerificationProgress({ currentStep, totalSteps }: VerificationProgressProps) {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-between w-full">
            {steps.map((step) => (
                <div key={step} className="relative flex flex-col items-center text-center">
                    <div
                        className={`
                            rounded-full border-2 h-8 w-8 flex items-center justify-center
                            ${step < currentStep ? 'bg-green-500 border-green-500 text-white' :
                            step === currentStep ? 'border-blue-500 text-blue-500' :
                            'border-gray-500 text-gray-500'}
                        `}
                    >
                        {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step === currentStep ? <Loader2 className="h-5 w-5 animate-spin" /> : step}
                    </div>
                    {step > 1 && (
                        <div
                            className={`
                                absolute top-4 -left-1/2 w-1/2 h-0.5 bg-gray-500
                                ${step <= currentStep ? 'bg-green-500' : ''}
                            `}
                        />
                    )}
                    {step < totalSteps && (
                        <div
                            className={`
                                absolute top-4 left-1/2 w-1/2 h-0.5 bg-gray-500
                                ${step < currentStep ? 'bg-green-500' : ''}
                            `}
                        />
                    )}
                    <span className="mt-2 text-sm text-gray-400">
                        {step === 1 ? 'Documentos' : 'Facial'}
                    </span>
                </div>
            ))}
        </div>
    );
}