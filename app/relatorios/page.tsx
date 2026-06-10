"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function RelatoriosPage() {
  const hoje = new Date().toISOString().split("T")[0];

  const [dataInicial, setDataInicial] = useState(hoje);
  const [dataFinal, setDataFinal] = useState(hoje);

  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [totalKg, setTotalKg] = useState(0);
  const [carregando, setCarregando] = useState(false);

  const [rankingCortadores, setRankingCortadores] = useState<any[]>([]);
  const [rankingPropriedades, setRankingPropriedades] = useState<any[]>([]);
  const [rankingCanaviais, setRankingCanaviais] = useState<any[]>([]);

  async function gerarRelatorio() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("lancamentos")
      .select(`
        id,
        data_referencia,
        peso,
        canavial,
        cortadores(nome),
        propriedades(nome)
      `)
      .gte("data_referencia", dataInicial)
      .lte("data_referencia", dataFinal)
      .order("data_referencia", { ascending: true });

    setCarregando(false);

    if (error) {
      alert("Erro ao gerar relatório");
      console.error(error);
      return;
    }

    setLancamentos(data || []);

    const soma =
      data?.reduce(
        (total, item) => total + Number(item.peso || 0),
        0
      ) || 0;

    setTotalKg(soma);

    const cortadoresMap: any = {};
    const propriedadesMap: any = {};
    const canaviaisMap: any = {};

    (data || []).forEach((item: any) => {
      const peso = Number(item.peso || 0);

      const cortador =
        item.cortadores?.nome || "Não informado";

      cortadoresMap[cortador] =
        (cortadoresMap[cortador] || 0) + peso;

      const propriedade =
        item.propriedades?.nome || "Não informada";

      propriedadesMap[propriedade] =
        (propriedadesMap[propriedade] || 0) + peso;

      const canavial =
        item.canavial || "Não informado";

      canaviaisMap[canavial] =
        (canaviaisMap[canavial] || 0) + peso;
    });

    setRankingCortadores(
      Object.entries(cortadoresMap)
        .map(([nome, peso]) => ({
          nome,
          peso,
        }))
        .sort((a: any, b: any) => b.peso - a.peso)
    );

    setRankingPropriedades(
      Object.entries(propriedadesMap)
        .map(([nome, peso]) => ({
          nome,
          peso,
        }))
        .sort((a: any, b: any) => b.peso - a.peso)
    );

    setRankingCanaviais(
      Object.entries(canaviaisMap)
        .map(([nome, peso]) => ({
          nome,
          peso,
        }))
        .sort((a: any, b: any) => b.peso - a.peso)
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">

        <div className="bg-white border rounded-2xl shadow-xl p-6 mb-6">

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
            onClick={gerarRelatorio}
            className="w-full bg-black text-white rounded-xl p-4 text-xl font-bold"
          >
            {carregando
              ? "GERANDO..."
              : "GERAR RELATÓRIO"}
          </button>

        </div>

        {lancamentos.length > 0 && (
          <div className="bg-white border rounded-2xl shadow-xl p-6">

            <h2 className="text-2xl font-bold mb-4">
              Resumo Geral
            </h2>

            <div className="grid gap-3 mb-8">

              <div className="border rounded-xl p-4">
                <div className="text-gray-500">
                  Total de Lançamentos
                </div>

                <div className="text-2xl font-bold">
                  {lancamentos.length}
                </div>
              </div>

              <div className="border rounded-xl p-4">
                <div className="text-gray-500">
                  Total Colhido
                </div>

                <div className="text-2xl font-bold">
                  {totalKg.toLocaleString()} kg
                </div>
              </div>

              <div className="border rounded-xl p-4">
                <div className="text-gray-500">
                  Média por Lançamento
                </div>

                <div className="text-2xl font-bold">
                  {lancamentos.length > 0
                    ? (
                        totalKg /
                        lancamentos.length
                      ).toFixed(1)
                    : 0} kg
                </div>
              </div>

            </div>

            <h2 className="text-2xl font-bold mb-4">
              Ranking de Cortadores
            </h2>

            <div className="mb-8">
              {rankingCortadores.map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex justify-between border-b py-2"
                  >
                    <strong>
                      {index + 1}º {item.nome}
                    </strong>

                    <span>
                      {Number(
                        item.peso
                      ).toLocaleString()} kg
                    </span>
                  </div>
                )
              )}
            </div>

            <h2 className="text-2xl font-bold mb-4">
              Ranking de Propriedades
            </h2>

            <div className="mb-8">
              {rankingPropriedades.map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex justify-between border-b py-2"
                  >
                    <strong>
                      {index + 1}º {item.nome}
                    </strong>

                    <span>
                      {Number(
                        item.peso
                      ).toLocaleString()} kg
                    </span>
                  </div>
                )
              )}
            </div>

            <h2 className="text-2xl font-bold mb-4">
              Ranking de Canaviais
            </h2>

            <div className="mb-8">
              {rankingCanaviais.map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex justify-between border-b py-2"
                  >
                    <strong>
                      {index + 1}º {item.nome}
                    </strong>

                    <span>
                      {Number(
                        item.peso
                      ).toLocaleString()} kg
                    </span>
                  </div>
                )
              )}
            </div>

            <h2 className="text-2xl font-bold mb-4">
              Todos os Lançamentos
            </h2>

            {lancamentos.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl p-4 mb-3"
              >
                <div>
                  <strong>Data:</strong>{" "}
                  {new Date(
                    item.data_referencia +
                      "T00:00:00"
                  ).toLocaleDateString(
                    "pt-BR"
                  )}
                </div>

                <div>
                  <strong>Cortador:</strong>{" "}
                  {item.cortadores?.nome ||
                    "-"}
                </div>

                <div>
                  <strong>Propriedade:</strong>{" "}
                  {item.propriedades?.nome ||
                    "-"}
                </div>

                <div>
                  <strong>Canavial:</strong>{" "}
                  {item.canavial || "-"}
                </div>

                <div>
                  <strong>Peso:</strong>{" "}
                  {Number(
                    item.peso
                  ).toLocaleString()} kg
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}
