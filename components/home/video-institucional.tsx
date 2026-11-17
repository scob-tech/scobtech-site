import { videoInstitucional } from "@/lib/projetos";
import { PlayerArquivo } from "./midia";
import { Ponto } from "./ponto";

/** Faixa escura com o vídeo institucional. Oculta enquanto o vídeo não for fornecido. */
export function VideoInstitucional() {
  if (!videoInstitucional) return null;
  return (
    <section className="hm-section hm-dark" aria-labelledby="hm-video-title">
      <div className="hm-wrap hm-video">
        <header className="hm-head" data-reveal>
          <p className="hm-eyebrow">Conheça a scob.</p>
          <h2 id="hm-video-title" className="hm-h2">
            Quem somos, como trabalhamos e o que entregamos<Ponto />
          </h2>
        </header>
        <div data-reveal>
          <PlayerArquivo video={videoInstitucional} />
          {videoInstitucional.transcricao && (
            // elemento nativo: abre e fecha pelo teclado e funciona mesmo sem JavaScript
            <details className="hm-video-transcricao">
              <summary>Ler o conteúdo do vídeo</summary>
              <div className="hm-video-transcricao-texto" lang="pt-BR">
                {videoInstitucional.transcricao.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>
    </section>
  );
}
