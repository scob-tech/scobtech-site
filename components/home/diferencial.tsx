import { Ponto } from "./ponto";

/**
 * Une as antigas Authority, Comparison e BeforeScob. Texto revisado para não fazer
 * afirmações absolutas sobre preço, propriedade ou integrações de softwares prontos.
 */
const linhas = [
  {
    tema: "Processo",
    pronto: "A equipe costuma adaptar a rotina às telas que já existem.",
    scob: "As telas são desenhadas a partir da rotina da sua equipe.",
  },
  {
    tema: "Funcionalidades",
    pronto: "Pensadas para atender muitos tipos de empresa ao mesmo tempo.",
    scob: "Priorizam o que a sua operação usa no dia a dia.",
  },
  {
    tema: "Integrações",
    pronto: "Dependem das conexões que o fornecedor oferece.",
    scob: "Planejadas conforme os canais e sistemas que você já usa.",
  },
  {
    tema: "Contratação",
    pronto: "Em geral, assinatura por plano ou por usuário.",
    scob: "Definida no escopo de cada projeto, a partir do diagnóstico.",
  },
  {
    tema: "Atendimento",
    pronto: "Suporte padronizado para a base de clientes.",
    scob: "Contato direto com quem desenvolve o sistema.",
  },
  {
    tema: "Evolução",
    pronto: "Segue o planejamento de produto do fornecedor.",
    scob: "Acompanha as prioridades da sua empresa.",
  },
];

export function Diferencial() {
  return (
    <section id="diferencial" className="hm-section" aria-labelledby="hm-dif-title">
      <div className="hm-wrap hm-dif">
        <header className="hm-head hm-dif-head" data-reveal>
          <p className="hm-eyebrow">Pronto ou sob medida</p>
          <h2 id="hm-dif-title" className="hm-h2">
            Quando o processo é o diferencial, o software precisa acompanhar<Ponto />
          </h2>
          <p className="hm-lead">
            Software pronto resolve bem muitos cenários. O desenvolvimento sob medida faz sentido quando a
            operação tem regras, etapas e integrações próprias.
          </p>
        </header>

        <div className="hm-dif-table" data-reveal>
          <table>
            <caption className="hm-sr">Comparação entre software pronto e sistema sob medida da scob.</caption>
            <thead>
              <tr>
                <td />
                <th scope="col">Software pronto</th>
                <th scope="col" className="hm-dif-scob">
                  Sob medida scob.
                </th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((l) => (
                <tr key={l.tema}>
                  <th scope="row">{l.tema}</th>
                  <td data-label="Software pronto">{l.pronto}</td>
                  <td data-label="Sob medida scob." className="hm-dif-scob">
                    {l.scob}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
