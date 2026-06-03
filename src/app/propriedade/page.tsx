"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Propriedade = {
  id: number;
  nome: string;
};

export default function PropriedadePage() {
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const router = useRouter();

  useEffect(() => {
    carregarPropriedades();
  }, []);

  async function carregarPropriedades() {
    const { data } = await supabase
      .from("propriedades")
      .select("*")
      .order("nome");

    if (data) {
      setPropriedades(data);
    }
  }

function selecionarPropriedade(propriedade: Propriedade) {
  localStorage.setItem(
    "propriedade",
    JSON.stringify(propriedade)
  );

  router.push("/cortador");
}

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Escolha a Propriedade
      </h1>

      <div className="grid gap-4">
        {propriedades.map((propriedade) => (
          <button
            key={propriedade.id}
            onClick={() =>
              selecionarPropriedade(propriedade)
            }
            className="bg-green-700 text-white text-2xl font-bold p-6 rounded-2xl shadow-lg"
          >
            {propriedade.nome}
          </button>
        ))}
      </div>
    </div>
  );
}