"use client";

import { useState } from "react";

export default function RelatoriosPage() {
  const hoje = new Date().toISOString().split("T")[0];

  const [dataInicial, setDataInicial] = useState(hoje);
  const [dataFinal, setDataFinal] = useState(hoje);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto bg-white border rounded-2xl shadow-xl p-6">

        <h1 className="text-3xl font-bold text-center mb-6">
          Relatórios
        </h1>

        <div className="mb-4">
          <label className="font-bold">
            Data Inicial
          </label>

          <input
            type="date"
            value={dataInicial}
            onChange={(e) =>
              setDataInicial(e.target.value)
            }
            className="w-full border rounded-xl p-4 mt-2"
          />
        </div>

        <div className="mb-6">
          <label className="font-bold">
            Data Final
          </label>

          <input
            type="date"
            value={dataFinal}
            onChange={(e) =>
              setDataFinal(e.target.value)
            }
            className="w-full border rounded-xl p-4 mt-2"
          />
        </div>

        <button
          className="w-full bg-black text-white rounded-xl p-4 text-xl font-bold"
        >
          GERAR RELATÓRIO
        </button>

      </div>
    </div>
  );
}