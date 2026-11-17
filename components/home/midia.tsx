"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import type { VideoArquivo, VideoYouTube } from "@/lib/projetos-base";

/**
 * Vídeo hospedado no site, carregado sob demanda: até o clique, só a capa é baixada e o
 * elemento <video> nem existe. O clique na capa cria o player com controles nativos e inicia
 * a reprodução (é uma ação da pessoa, não autoplay). Se o navegador recusar o play, os
 * controles ficam visíveis para iniciar manualmente.
 */
export function PlayerArquivo({ video, className }: { video: VideoArquivo; className?: string }) {
  const [ativo, setAtivo] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ativo || !ref.current) return;
    ref.current.focus({ preventScroll: true });
    ref.current.play().catch(() => {});
  }, [ativo]);

  const rotulo = `Reproduzir vídeo: ${video.titulo}${video.duracao ? ` (${video.duracao})` : ""}`;

  return (
    <div className={`hm-player ${className ?? ""}`}>
      {ativo ? (
        <video
          ref={ref}
          src={video.src}
          poster={video.capa}
          width={video.largura}
          height={video.altura}
          controls
          playsInline
          preload="auto"
          aria-label={video.titulo}
        />
      ) : (
        <button
          type="button"
          className="hm-player-facade"
          data-capa-com-botao={video.capaComBotao ? "" : undefined}
          onClick={() => setAtivo(true)}
          aria-label={rotulo}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={video.capa} alt="" width={video.largura} height={video.altura} loading="lazy" decoding="async" />
          {!video.capaComBotao && (
            <span className="hm-player-btn" aria-hidden>
              <Play />
            </span>
          )}
        </button>
      )}
    </div>
  );
}

/**
 * Player do YouTube carregado sob demanda: até o clique, só a capa é baixada.
 * O iframe (youtube-nocookie) é criado no clique, já com autoplay.
 */
export function PlayerYouTube({ video, className }: { video: VideoYouTube; className?: string }) {
  const [ativo, setAtivo] = useState(false);
  const capa = video.capa ?? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;

  return (
    <div className={`hm-player ${className ?? ""}`}>
      {ativo ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={video.titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="hm-player-facade"
          onClick={() => setAtivo(true)}
          aria-label={`Reproduzir vídeo: ${video.titulo}${video.duracao ? ` (${video.duracao})` : ""}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={capa} alt="" loading="lazy" decoding="async" />
          <span className="hm-player-btn" aria-hidden>
            <Play />
          </span>
          <span className="hm-player-meta" aria-hidden>
            <span>{video.titulo}</span>
            {video.duracao && <span>{video.duracao}</span>}
          </span>
        </button>
      )}
    </div>
  );
}
