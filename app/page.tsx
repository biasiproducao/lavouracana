"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [codigo, setCodigo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const router = useRouter();

  async function entrar() {
    setMensagem("");

    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("codigo_acesso", codigo.trim());

    console.log("DATA:", data);
console.log("ERROR:", error);

    if (error) {
      setMensagem("Erro ao consultar banco");
      return;
    }

    if (!data || data.length === 0) {
      setMensagem("Código inválido");
      return;
    }

    const usuario = data[0];

    localStorage.setItem(
      "usuario",
      JSON.stringify(usuario)
    );

    router.push("/data");
  }

  return (
    <div className="min-h-screen bg-green-700 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Controle de Colheita
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Digite seu código de acesso
        </p>

        <input
          type="password"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código"
          className="w-full border-2 border-gray-300 rounded-xl p-4 text-center text-2xl mb-6"
        />

        <button
          onClick={entrar}
          className="w-full bg-green-700 text-white rounded-xl p-4 text-xl font-bold"
        >
          ENTRAR
        </button>

        {mensagem && (
          <div className="mt-4 text-center font-bold text-red-600">
            {mensagem}
          </div>
        )}
      </div>
    </div>
  );
}
