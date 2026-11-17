import { videoInstitucional } from "@/lib/projetos";
import { PlayerYouTube } from "./midia";
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
          <PlayerYouTube video={videoInstitucional} />
        </div>
      </div>
    </section>
  );
}
