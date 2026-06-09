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
  const [mostrarOutro, setMostrarOutro] = useState(false);
  const [nomeCanavial, setNomeCanavial] = useState("");

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

    localStorage.setItem(
      "canavial",
      propriedade.nome
    );

    router.push("/cortador");
  }

  function salvarOutro() {
    if (!nomeCanavial.trim()) {
      alert("Digite o nome do canavial");
      return;
    }

    localStorage.setItem(
      "canavial",
      nomeCanavial.trim()
    );

    localStorage.setItem(
      "propriedade",
      JSON.stringify({
        id: 0,
        nome: "OUTROS"
      })
    );

    router.push("/cortador");
  }

  return (
    <div className="min-h-screen bg-white p-4">

      <h1 className="text-3xl font-bold text-center mb-6">
        Escolha o Canavial
      </h1>

      <div className="grid gap-4">

        {propriedades.map((propriedade) => (
          <button
            key={propriedade.id}
            onClick={() =>
              selecionarPropriedade(propriedade)
            }
            className="bg-black text-white text-2xl font-bold p-6 rounded-2xl shadow-lg"
          >
            {propriedade.nome}
          </button>
        ))}

        <button
          onClick={() =>
            setMostrarOutro(!mostrarOutro)
          }
          className="bg-blue-700 text-white text-2xl font-bold p-6 rounded-2xl shadow-lg"
        >
          OUTROS
        </button>

        {mostrarOutro && (
          <div className="bg-gray-100 rounded-2xl p-4">

            <input
              type="text"
              placeholder="Nome do Canavial"
              value={nomeCanavial}
              onChange={(e) =>
                setNomeCanavial(e.target.value)
              }
              className="w-full border rounded-xl p-4 mb-4"
            />

            <button
              onClick={salvarOutro}
              className="w-full bg-green-700 text-white p-4 rounded-xl font-bold"
            >
              SALVAR
            </button>

          </div>
        )}

      </div>

    </div>
  );
}
