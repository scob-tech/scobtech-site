"use client";

import { computeMetrics } from "@/lib/demo-atendimento/engine";
import { formatBRL, formatDuration } from "@/lib/demo-atendimento/format";
import { useDemo } from "./demo-store";

/**
 * Indicadores derivados do estado da demo: responder, finalizar ou registrar venda
 * altera os números na hora. Não há valores sorteados.
 */
export function IndicadoresTab() {
  const { state, profile } = useDemo();
  const m = computeMetrics(state);
  const rows = profile.role === "gestor" ? m.bySeller : m.bySeller.filter((s) => s.sellerId === profile.sellerId);

  const general = [
    { label: "Primeira resposta da equipe", value: formatDuration(m.firstResponseAvgMs), note: `média de ${m.firstResponseSamples} ${m.firstResponseSamples === 1 ? "conversa" : "conversas"}` },
    { label: "Resposta durante o atendimento", value: formatDuration(m.duringAvgMs), note: `média de ${m.duringSamples} ${m.duringSamples === 1 ? "espera" : "esperas"}` },
    { label: "Conversas finalizadas", value: String(m.finalized), note: "hoje" },
    { label: "Vendas fechadas", value: String(m.salesCount), note: "registradas nas conversas" },
    { label: "Valor total de vendas", value: formatBRL(m.salesTotal), note: "registrado hoje" },
  ];

  return (
    <div className="h-full overflow-y-auto overscroll-contain bg-(--sd-paper)">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
        <h2 className="text-2xl sm:text-[1.75rem]">Indicadores do dia</h2>
        <p className="mt-1 text-sm text-(--sd-muted)">Calculados a partir das conversas e vendas desta demonstração.</p>

        <section aria-labelledby="sd-geral" className="mt-6">
          <h3 id="sd-geral" className="sd-ui-heading text-sm font-bold">
            Indicadores gerais
          </h3>
          <dl className="mt-3 grid grid-cols-2 overflow-hidden rounded-2xl border border-(--sd-line) bg-white lg:grid-cols-5">
            {general.map((g, i) => (
              <div
                key={g.label}
                className={`border-(--sd-line) p-4 sm:p-5 ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t" : ""} lg:border-t-0 ${
                  i > 0 ? "lg:border-l" : "lg:border-l-0"
                } ${i === 4 ? "col-span-2 lg:col-span-1" : ""}`}
              >
                <dt className="text-[13px] leading-snug text-(--sd-muted)">{g.label}</dt>
                <dd className="tabular mt-2 text-[1.6rem] leading-none font-semibold tracking-tight text-(--sd-graphite)">{g.value}</dd>
                <dd className="mt-1.5 text-xs text-(--sd-muted)">{g.note}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="sd-vendedor" className="mt-8">
          <h3 id="sd-vendedor" className="sd-ui-heading text-sm font-bold">
            {profile.role === "gestor" ? "Por vendedor" : "Seus indicadores"}
          </h3>

          {/* tabela no desktop */}
          <div className="mt-3 hidden overflow-hidden rounded-2xl border border-(--sd-line) bg-white sm:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-(--sd-bone) text-[13px] text-(--sd-muted)">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Vendedor
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">
                    Resposta no atendimento
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">
                    Finalizadas
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">
                    Vendas
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">
                    Valor vendido
                  </th>
                </tr>
              </thead>
              <tbody className="tabular">
                {rows.map((r) => (
                  <tr key={r.sellerId} className="border-t border-(--sd-line)">
                    <th scope="row" className="px-5 py-3.5 font-semibold">
                      {r.name}
                    </th>
                    <td className="px-5 py-3.5 text-right">
                      {formatDuration(r.duringAvgMs)}
                      <span className="block text-xs text-(--sd-muted)">{r.duringSamples} {r.duringSamples === 1 ? "espera" : "esperas"}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">{r.finalized}</td>
                    <td className="px-5 py-3.5 text-right">{r.salesCount}</td>
                    <td className="px-5 py-3.5 text-right font-semibold">{formatBRL(r.salesTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* lista no celular */}
          <ul className="mt-3 space-y-3 sm:hidden">
            {rows.map((r) => (
              <li key={r.sellerId} className="rounded-2xl border border-(--sd-line) bg-white p-4">
                <p className="font-semibold">{r.name}</p>
                <dl className="tabular mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <dt className="text-xs text-(--sd-muted)">Resposta no atendimento</dt>
                    <dd className="font-semibold">{formatDuration(r.duringAvgMs)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-(--sd-muted)">Finalizadas</dt>
                    <dd className="font-semibold">{r.finalized}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-(--sd-muted)">Vendas</dt>
                    <dd className="font-semibold">{r.salesCount}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-(--sd-muted)">Valor vendido</dt>
                    <dd className="font-semibold">{formatBRL(r.salesTotal)}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </section>

        <details className="group mt-8 rounded-2xl border border-(--sd-line) bg-(--sd-bone) p-4 sm:p-5">
          <summary className="cursor-pointer text-sm font-bold">Como os tempos são calculados</summary>
          <div className="mt-3 max-w-[70ch] space-y-3 text-sm leading-relaxed text-(--sd-muted)">
            <p>
              <strong className="text-(--sd-graphite)">Primeira resposta:</strong> intervalo entre a chegada da primeira mensagem do lead e a
              primeira resposta de uma pessoa da equipe. Mensagens automáticas do sistema não contam.
            </p>
            <p>
              <strong className="text-(--sd-graphite)">Resposta durante o atendimento:</strong> depois da primeira resposta, cada mensagem do
              cliente que exige retorno abre uma espera, encerrada pela próxima resposta da equipe. Várias mensagens seguidas do cliente contam
              como uma única espera, medida a partir da primeira. Agradecimentos de encerramento não abrem espera, e esperas ainda em aberto só
              entram na média quando forem respondidas.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
