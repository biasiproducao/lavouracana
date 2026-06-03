"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function PesoPage() {
  const [peso, setPeso] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [usuario, setUsuario] = useState<any>(null);
  const [propriedade, setPropriedade] = useState<any>(null);
  const [cortador, setCortador] = useState<any>(null);
  const [dataReferencia, setDataReferencia] = useState("");

  const router = useRouter();

  useEffect(() => {
    const usuarioStorage = localStorage.getItem("usuario");
    const propriedadeStorage = localStorage.getItem("propriedade");
    const cortadorStorage = localStorage.getItem("cortador");
    const dataStorage = localStorage.getItem("data_referencia");

    if (
      !usuarioStorage ||
      !propriedadeStorage ||
      !cortadorStorage ||
      !dataStorage
    ) {
      router.push("/");
      return;
    }

    setUsuario(JSON.parse(usuarioStorage));
    setPropriedade(JSON.parse(propriedadeStorage));
    setCortador(JSON.parse(cortadorStorage));
    setDataReferencia(dataStorage);
  }, [router]);

  async function salvar() {
    if (!peso || Number(peso) <= 0) {
      alert("Informe um peso válido");
      return;
    }

    if (
      !usuario ||
      !propriedade ||
      !cortador ||
      !dataReferencia
    ) {
      alert("Dados incompletos");
      return;
    }

    setSalvando(true);

    const { error } = await supabase
      .from("lancamentos")
      .insert([
        {
          data_referencia: dataReferencia,
          usuario_id: usuario.id,
          propriedade_id: propriedade.id,
          cortador_id: cortador.id,
          peso: Number(peso),
        },
      ]);

    setSalvando(false);

    if (error) {
      console.error(error);
      alert("Erro ao salvar");
      return;
    }

    alert("Lançamento salvo com sucesso!");

    setPeso("");

    router.push("/cortador");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Lançar Peso
        </h1>

        <div className="mb-4 text-center">
          <div className="text-gray-500">
            Data
          </div>

          <div className="text-xl font-bold">
  {new Date(dataReferencia + "T00:00:00").toLocaleDateString("pt-BR")}
</div>
        </div>

        <div className="mb-4 text-center">
          <div className="text-gray-500">
            Propriedade
          </div>

          <div className="text-2xl font-bold">
            {propriedade?.nome}
          </div>
        </div>

        <div className="mb-6 text-center">
          <div className="text-gray-500">
            Responsável
          </div>

          <div className="text-3xl font-bold">
            {cortador?.nome}
          </div>
        </div>

        <input
          type="number"
          inputMode="decimal"
          placeholder="Peso em kg"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-2xl p-6 text-center text-4xl mb-6"
        />

        <button
          onClick={salvar}
          disabled={salvando}
          className="w-full bg-green-700 text-white text-2xl font-bold rounded-2xl p-5"
        >
          {salvando ? "SALVANDO..." : "SALVAR"}
        </button>

      </div>
    </div>
  );
}