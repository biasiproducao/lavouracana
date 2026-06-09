"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function PesoPage() {
  const [peso, setPeso] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const [usuario, setUsuario] = useState<any>(null);
  const [propriedade, setPropriedade] = useState<any>(null);
  const [cortador, setCortador] = useState<any>(null);
  const [dataReferencia, setDataReferencia] = useState("");

  const [ultimosPesos, setUltimosPesos] = useState<any[]>([]);

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

    const cortadorObj = JSON.parse(cortadorStorage);

    setUsuario(JSON.parse(usuarioStorage));
    setPropriedade(JSON.parse(propriedadeStorage));
    setCortador(cortadorObj);
    setDataReferencia(dataStorage);

    carregarUltimosPesos(cortadorObj.id);
  }, [router]);

  async function carregarUltimosPesos(cortadorId: number) {
    const { data } = await supabase
  .from("lancamentos")
  .select(`
    peso,
    cortadores (
      nome
    )
  `)
  .eq("cortador_id", cortadorId)
  .order("created_at", { ascending: false })
  .limit(2);

    if (data) {
      setUltimosPesos(data);
    }
  }

  async function salvar() {
    if (!peso || Number(peso) <= 0) {
      setMensagem("Informe um peso válido");
      return;
    }

    if (
      !usuario ||
      !propriedade ||
      !cortador ||
      !dataReferencia
    ) {
      setMensagem("Dados incompletos");
      return;
    }

    setMensagem("");
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
      setMensagem("Erro ao salvar");
      return;
    }

    setMensagem("✓ Lançamento salvo com sucesso");

    setPeso("");

    setTimeout(() => {
      router.push("/cortador");
    }, 700);
  }

  return (
    <div className="min-h-screen bg-white p-4 flex items-center justify-center">
      <div className="bg-white border rounded-2xl shadow-xl p-6 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-black mb-6">
          Lançar Peso
        </h1>

        <div className="mb-4 text-center">
          <div className="text-gray-500">
            Data
          </div>

          <div className="text-xl font-bold text-black">
            {new Date(
              dataReferencia + "T00:00:00"
            ).toLocaleDateString("pt-BR")}
          </div>
        </div>

        <div className="mb-4 text-center">
          <div className="text-gray-500">
            Propriedade
          </div>

          <div className="text-2xl font-bold text-black">
            {propriedade?.nome}
          </div>
        </div>

        <div className="mb-4 text-center">
          <div className="text-gray-500">
            Responsável
          </div>

          <div className="text-3xl font-bold text-black">
            {cortador?.nome}
          </div>
        </div>

        <div className="mb-6 border rounded-xl p-3 bg-gray-50">
          <div className="text-center font-bold mb-2">
            Últimos Lançamentos
          </div>

          {ultimosPesos.length === 0 && (
            <div className="text-center text-gray-500">
              Nenhum lançamento
            </div>
          )}

          {ultimosPesos.map((item, index) => (
            <div
              key={index}
              className="text-center text-xl font-bold"
            >
              {item.peso} kg
            </div>
          ))}
        </div>

        <input
          type="number"
          inputMode="decimal"
          placeholder="Peso em kg"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-2xl p-6 text-center text-4xl mb-4"
        />

        <button
          onClick={salvar}
          disabled={salvando}
          className="w-full bg-black text-white text-2xl font-bold rounded-2xl p-5"
        >
          {salvando ? "SALVANDO..." : "SALVAR"}
        </button>

        {mensagem && (
          <div className="mt-4 text-center font-bold text-green-600">
            {mensagem}
          </div>
        )}

      </div>
    </div>
  );
}
