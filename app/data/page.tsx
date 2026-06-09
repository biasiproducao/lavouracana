"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DataPage() {
  const router = useRouter();

  const hoje = new Date().toISOString().split("T")[0];

  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const usuarioStorage = localStorage.getItem("usuario");

    if (!usuarioStorage) {
      router.push("/");
      return;
    }

    setUsuario(JSON.parse(usuarioStorage));
  }, [router]);

  function continuar() {
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

        <h1 className="text-3xl font-bold text-center mb-2 text-black">
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
          className="w-full bg-black text-white rounded-2xl p-5 text-2xl font-bold"
        >
          NOVO LANÇAMENTO
        </button>

        {usuario?.perfil === "adm" && (
          <button
            onClick={abrirRelatorios}
            className="w-full mt-4 bg-blue-700 text-white rounded-2xl p-5 text-2xl font-bold"
          >
            📊 RELATÓRIOS
          </button>
        )}

      </div>
    </div>
  );
}
