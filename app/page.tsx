"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DataPage() {
  const router = useRouter();

  const hoje = new Date().toISOString().split("T")[0];

  const [dataSelecionada, setDataSelecionada] = useState(hoje);

  function novoLancamento() {
    localStorage.setItem(
      "data_referencia",
      dataSelecionada
    );

    router.push("/propriedade");
  }

  function abrirRelatorios() {
    router.push("/relatorios");
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white border rounded-2xl shadow-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-black mb-2">
          Controle de Colheita
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Selecione a data da colheita
        </p>

        <input
          type="date"
          value={dataSelecionada}
          onChange={(e) =>
            setDataSelecionada(e.target.value)
          }
          className="w-full border-2 border-gray-300 rounded-2xl p-5 text-xl mb-6"
        />

        <button
          onClick={novoLancamento}
          className="w-full bg-black text-white rounded-2xl p-5 text-2xl font-bold mb-4"
        >
          NOVO LANÇAMENTO
        </button>

        <button
          onClick={abrirRelatorios}
          className="w-full bg-blue-700 text-white rounded-2xl p-5 text-2xl font-bold"
        >
          📊 RELATÓRIOS
        </button>

      </div>
    </div>
  );
}
