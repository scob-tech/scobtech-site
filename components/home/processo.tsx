import { avatarScob } from "@/lib/projetos";
import { Ponto } from "./ponto";

const etapas = [
  {
    titulo: "Diagnóstico",
    texto: "Uma conversa para entender a dor, o fluxo real e onde o trabalho trava hoje. Sem custo e sem compromisso.",
  },
  {
    titulo: "Mapeamento",
    texto: "Desenhamos o processo como ele é e como deveria ser: o que automatizar, o que simplificar e o que medir.",
  },
  {
    titulo: "Desenvolvimento",
    texto: "O sistema é construído com você acompanhando de perto e ajustando no caminho, direto com quem desenvolve.",
  },
  {
    titulo: "Entrega e evolução",
    texto: "Você recebe o sistema em uso no dia a dia, e ele continua evoluindo junto com a empresa.",
  },
];

export function Processo() {
  return (
    <section id="processo" className="hm-section hm-section-surface" aria-labelledby="hm-proc-title">
      <div className="hm-wrap">
        <div className="hm-proc-head">
          <header className="hm-head" data-reveal>
            <p className="hm-eyebrow">Como trabalhamos</p>
            <h2 id="hm-proc-title" className="hm-h2">
              Do primeiro papo ao sistema rodando<Ponto />
            </h2>
            <p className="hm-lead">Um processo claro, com você participando de cada decisão.</p>
          </header>
          {/* espaço do avatar da scob.: só aparece quando o arquivo for fornecido */}
          {avatarScob && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="hm-proc-avatar"
              src={avatarScob.src}
              alt={avatarScob.alt}
              width={avatarScob.width}
              height={avatarScob.height}
              loading="lazy"
              decoding="async"
            />
          )}
        </div>

        <ol className="hm-proc">
          {etapas.map((e, i) => (
            <li key={e.titulo} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="hm-proc-num" aria-hidden>
                0{i + 1}
              </span>
              <h3>{e.titulo}</h3>
              <p>{e.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
