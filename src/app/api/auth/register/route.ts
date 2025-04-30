import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // In a real app, this would validate the data and save to a database
    console.log("Registration data received:", data)

    // Simulate successful registration
    return NextResponse.json({
      success: true,
      message: "Usuário registrado com sucesso",
      userId: "user_" + Math.random().toString(36).substr(2, 9),
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Erro ao registrar usuário" }, { status: 500 })
  }
}
