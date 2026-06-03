"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Cortador = {
  id: number;
  nome: string;
  cor: string;
};

export default function CortadorPage() {
  const [cortadores, setCortadores] = useState<Cortador[]>([]);
  const router = useRouter();

  useEffect(() => {
    carregarCortadores();
  }, []);

  async function carregarCortadores() {
    const { data } = await supabase
      .from("cortadores")
      .select("*")
      .order("nome");

    if (data) {
      setCortadores(data);
    }
  }

  function corBotao(cor: string) {
    switch (cor?.toLowerCase()) {
      case "azul":
        return "bg-blue-500";
      case "vermelho":
        return "bg-red-500";
      case "verde":
        return "bg-green-500";
      case "amarelo":
        return "bg-yellow-400 text-black";
      case "laranja":
        return "bg-orange-500";
      case "preto":
        return "bg-black";
      default:
        return "bg-gray-500";
    }
  }

  function selecionarCortador(cortador: Cortador) {
    localStorage.setItem(
      "cortador",
      JSON.stringify(cortador)
    );

    router.push("/peso");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Responsável do Corte
      </h1>
<div className="mb-6">
  <button
    onClick={() => router.push("/propriedade")}
    className="bg-gray-700 text-white px-4 py-3 rounded-xl font-bold"
  >
    ← Trocar Propriedade
  </button>
</div>
      <div className="grid grid-cols-2 gap-4">
        {cortadores.map((cortador) => (
          <button
            key={cortador.id}
            onClick={() => selecionarCortador(cortador)}
            className={`${corBotao(
              cortador.cor
            )} text-white rounded-2xl p-8 text-xl font-bold shadow-lg min-h-[120px]`}
          >
            {cortador.nome}
          </button>
        ))}
      </div>
    </div>
  );
}