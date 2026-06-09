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
  const [mostrarOutros, setMostrarOutros] = useState(false);
  const [nomeOutro, setNomeOutro] = useState("");

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

  function salvarOutro() {
    if (!nomeOutro.trim()) {
      alert("Digite o nome do canavial");
      return;
    }

    localStorage.setItem(
      "propriedade",
      JSON.stringify({
        id: 0,
        nome: nomeOutro.trim(),
      })
    );

    router.push("/cortador");
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-3xl font-bold text-center text-black mb-6">
        Escolha a Propriedade
      </h1>

      <div className="grid gap-4">

        {propriedades.map((propriedade) => (
          <button
            key={propriedade.id}
            onClick={() => selecionarPropriedade(propriedade)}
            className="bg-black text-white text-2xl font-bold p-6 rounded-2xl shadow-lg"
          >
            {propriedade.nome}
          </button>
        ))}

        <button
          onClick={() => setMostrarOutros(!mostrarOutros)}
          className="bg-gray-700 text-white text-2xl font-bold p-6 rounded-2xl shadow-lg"
        >
          OUTROS
        </button>

        {mostrarOutros && (
          <div className="border rounded-2xl p-4 bg-gray-100">

            <input
              type="text"
              placeholder="Nome do canavial"
              value={nomeOutro}
              onChange={(e) => setNomeOutro(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl p-4 text-xl mb-4"
            />

            <button
              onClick={salvarOutro}
              className="w-full bg-black text-white rounded-xl p-4 text-xl font-bold"
            >
              CONTINUAR
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
