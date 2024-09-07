import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { todos } = await request.json();
  console.log(todos);

  //comunicando com a api do openai GPT
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Quando responder, cumprimente o usuário, chame-o de Trellover e diga uma frase inspiradora. Limite a resposta à 300 caracteres.",
      },
      {
        role: "user",
        content: `Olá, faça um sumário das minhas tarefas de hoje. Conte quantas tarefas tem em cada categoria como tarefas 'a fazer', 'em progresso" e 'feitas'. Então, diga ao usuário para ter um dia produtivo! Sempre amigavelmente e seja criativo e inspirador. Aqui o arquivo: ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });

  const data = completion;

  return NextResponse.json({
    message: data.choices[0].message.content,
  });
}
