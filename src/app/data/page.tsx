"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DataPage() {
  const router = useRouter();

  const hoje = new Date().toISOString().split("T")[0];

  const [dataSelecionada, setDataSelecionada] = useState(hoje);

  function continuar() {
    localStorage.setItem(
      "data_referencia",
      dataSelecionada
    );

    router.push("/propriedade");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Selecione a Data
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Escolha a data da colheita
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
          onClick={continuar}
          className="w-full bg-green-700 text-white rounded-2xl p-5 text-2xl font-bold"
        >
          CONTINUAR
        </button>

      </div>
    </div>
  );
}