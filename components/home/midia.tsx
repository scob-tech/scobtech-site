"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { VideoYouTube } from "@/lib/projetos-base";

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
