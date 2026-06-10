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

  async function gerarRelatorio() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("lancamentos")
      .select(`
  *,
  cortadores(nome),
  propriedades(nome)
`)
      .gte("data_referencia", dataInicial)
      .lte("data_referencia", dataFinal)
      .order("data_referencia");

    setCarregando(false);

    if (error) {
      alert("Erro ao gerar relatório");
      console.error(error);
      return;
    }
console.log(data);
    setLancamentos(data || []);

    const soma =
      data?.reduce(
        (total, item) => total + Number(item.peso),
        0
      ) || 0;

    setTotalKg(soma);
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto">

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
              Resumo
            </h2>

            <div className="mb-2">
              Total de lançamentos:
              <strong> {lancamentos.length}</strong>
            </div>

            <div className="mb-6">
              Total colhido:
              <strong> {totalKg.toLocaleString()} kg</strong>
            </div>

            <h2 className="text-2xl font-bold mb-4">
              Lançamentos
            </h2>

            {lancamentos.map((item) => (
              <div
                key={item.id}
                className="border-b py-3"
              >
                <div>
                  Data:
                  {" "}
                  {new Date(
                    item.data_referencia + "T00:00:00"
                  ).toLocaleDateString("pt-BR")}
                </div>

                <div>
                  Peso:
                  {" "}
                  <strong>
                    {Number(item.peso).toLocaleString()} kg
                  </strong>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}
