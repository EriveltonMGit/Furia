"use client"

import type React from "react"

import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useState } from "react"
import { IMaskInput } from "react-imask"

interface PersonalInfoFormProps {
  formData: {
    name: string
    email: string
    password: string
    cpf: string
    birthDate: string
    address: string
    city: string
    state: string
    zipCode: string
    phone: string
  }
  updateFormData: (data: Partial<PersonalInfoFormProps["formData"]>) => void
}

export function PersonalInfoForm({ formData, updateFormData }: PersonalInfoFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: string) => {
    let error = ""

    if (value.trim() === "") {
      error = "Este campo é obrigatório"
    } else {
      switch (name) {
        case "email":
          if (!/\S+@\S+\.\S+/.test(value)) {
            error = "Email inválido"
          }
          break
        case "password":
          if (value.length < 8) {
            error = "A senha deve ter pelo menos 8 caracteres"
          }
          break
        case "cpf":
          if (value.replace(/[^\d]/g, "").length !== 11) {
            error = "CPF inválido"
          }
          break
        case "zipCode":
          if (value.replace(/[^\d]/g, "").length !== 8) {
            error = "CEP inválido"
          }
          break
        case "phone":
          if (value.replace(/[^\d]/g, "").length < 10) {
            error = "Telefone inválido"
          }
          break
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }))
    return error === ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })
    validateField(name, value)
  }

  const handleMaskedChange = (name: string, value: string) => {
    updateFormData({ [name]: value })
    validateField(name, value)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informações Pessoais</h3>
      <p className="text-sm text-gray-400">Preencha seus dados pessoais para criar seu perfil de fã</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600"
            placeholder="Seu nome completo"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600"
            placeholder="seu.email@exemplo.com"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600"
            placeholder="Crie uma senha segura"
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <IMaskInput
            id="cpf"
            name="cpf"
            mask="000.000.000-00"
            value={formData.cpf}
            onAccept={(value) => handleMaskedChange("cpf", value)}
            placeholder="000.000.000-00"
            className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.cpf && <p className="text-red-500 text-xs">{errors.cpf}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Data de Nascimento</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600"
          />
          {errors.birthDate && <p className="text-red-500 text-xs">{errors.birthDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <IMaskInput
            id="phone"
            name="phone"
            mask="(00) 00000-0000"
            value={formData.phone}
            onAccept={(value) => handleMaskedChange("phone", value)}
            placeholder="(00) 00000-0000"
            className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600"
            placeholder="Rua, número, complemento"
          />
          {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP</Label>
          <IMaskInput
            id="zipCode"
            name="zipCode"
            mask="00000-000"
            value={formData.zipCode}
            onAccept={(value) => handleMaskedChange("zipCode", value)}
            placeholder="00000-000"
            className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.zipCode && <p className="text-red-500 text-xs">{errors.zipCode}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600"
            placeholder="Sua cidade"
          />
          {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600"
            placeholder="Seu estado"
          />
          {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
        </div>
      </div>
    </div>
  )
}
