import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name } = body

    // TODO: Implementar lógica de registro
    // - Validar dados
    // - Salvar no banco de dados
    // - Enviar email de confirmação
    
    console.log("Register request:", { email, name })

    return NextResponse.json(
      { message: "Registro recebido com sucesso" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in register route:", error)
    return NextResponse.json(
      { error: "Erro ao processar registro" },
      { status: 500 }
    )
  }
}

