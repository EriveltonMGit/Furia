"use client";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface PersonalInfoFormProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function PersonalInfoForm({ formData, updateFormData }: PersonalInfoFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email || ''}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password || ''}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate">Data de Nascimento</Label>
        <Input
          id="birthDate"
          name="birthDate"
          type="date"
          value={formData.birthDate || ''}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
}