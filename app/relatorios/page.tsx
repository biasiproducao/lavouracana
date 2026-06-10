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
    const canaviaisMap: any = {};

    (data || []).forEach((item: any) => {
      const peso = Number(item.peso || 0);

      const cortador =
        item.cortadores?.nome || "Não informado";

      cortadoresMap[cortador] =
        (cortadoresMap[cortador] || 0) + peso;

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

    setRankingCanaviais(
      Object.entries(canaviaisMap)
        .map(([nome, peso]) => ({
          nome,
          peso,
        }))
        .sort((a: any, b: any) => b.peso - a.peso)
    );
  }
  async function excluirLancamento(id: number) {
  const confirmar = window.confirm(
    "Deseja realmente excluir este lançamento?"
  );

  if (!confirmar) return;

  const { error } = await supabase
    .from("lancamentos")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Erro ao excluir lançamento");
    return;
  }

  gerarRelatorio();

  alert("Lançamento excluído com sucesso");
}

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">

          <h1 className="text-4xl font-extrabold text-center mb-2">
            Relatórios
          </h1>

          <p className="text-center text-gray-500 mb-6">
            Produção de Cana
          </p>

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
            className="w-full bg-black text-white rounded-2xl p-4 text-xl font-bold"
          >
            {carregando
              ? "GERANDO..."
              : "GERAR RELATÓRIO"}
          </button>

        </div>

        {lancamentos.length > 0 && (
          <>

            <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">

              <h2 className="text-2xl font-bold mb-4">
                Resumo Geral
              </h2>

              <div className="grid gap-4">

                <div className="bg-gray-50 border rounded-2xl p-5 shadow">
                  <div className="text-gray-500">
                    Total de Lançamentos
                  </div>

                  <div className="text-4xl font-extrabold">
                    {lancamentos.length}
                  </div>
                </div>

                <div className="bg-gray-50 border rounded-2xl p-5 shadow">
                  <div className="text-gray-500">
                    Total Colhido
                  </div>

                  <div className="text-4xl font-extrabold">
                    {totalKg.toLocaleString()} kg
                  </div>
                </div>

                <div className="bg-gray-50 border rounded-2xl p-5 shadow">
                  <div className="text-gray-500">
                    Média por Lançamento
                  </div>

                  <div className="text-4xl font-extrabold">
                    {lancamentos.length > 0
                      ? (
                          totalKg /
                          lancamentos.length
                        ).toFixed(1)
                      : 0} kg
                  </div>
                </div>

              </div>

            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">

              <h2 className="text-2xl font-bold mb-4">
                Ranking de Cortadores
              </h2>

              {rankingCortadores.map(
                (item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-2xl p-4 mb-2 flex justify-between items-center"
                  >
                    <div className="font-bold text-lg">
                      #{index + 1} - {item.nome}
                    </div>

                    <div className="text-xl font-bold">
                      {Number(
                        item.peso
                      ).toLocaleString()} kg
                    </div>
                  </div>
                )
              )}

            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">

              <h2 className="text-2xl font-bold mb-4">
                Ranking de Canaviais
              </h2>

              {rankingCanaviais.map(
                (item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-2xl p-4 mb-2 flex justify-between items-center"
                  >
                    <div className="font-bold text-lg">
                      #{index + 1} - {item.nome}
                    </div>

                    <div className="text-xl font-bold">
                      {Number(
                        item.peso
                      ).toLocaleString()} kg
                    </div>
                  </div>
                )
              )}

            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6">

              <h2 className="text-2xl font-bold mb-4">
                Todos os Lançamentos
              </h2>

              {lancamentos.map((item) => (
  <div
    key={item.id}
    className="relative bg-white border-2 rounded-2xl p-4 mb-4 shadow-sm"
  >

    <button
      onClick={() => excluirLancamento(item.id)}
      className="absolute top-2 right-2 text-red-600"
      title="Excluir lançamento"
    >
      🗑️
    </button>
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
                    {item.cortadores?.nome || "-"}
                  </div>

                  <div>
                    <strong>Canavial:</strong>{" "}
                    {item.canavial || "-"}
                  </div>

                  <div className="mt-3 text-center text-3xl font-extrabold">
                    {Number(
                      item.peso
                    ).toLocaleString()} kg
                  </div>
                </div>
              ))}

            </div>

          </>
        )}

      </div>
    </div>
  );
}
