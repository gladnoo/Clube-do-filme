"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

type ShareData = {
  movieTitle: string;
  movieYear: number | null;
  poster: string | null;
  rating: number;
  highs?: string | null;
  comment?: string | null;
  quote?: string | null;
  displayName: string;
};

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  if (lines.length === maxLines && words.join(" ") !== lines.join(" ")) {
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, "") + "…";
  }
  return lines.slice(0, maxLines);
}

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function starsString(rating: number) {
  const full = Math.round(rating * 2) / 2;
  const wholeStars = Math.floor(full);
  const hasHalf = full - wholeStars === 0.5;
  return "★".repeat(wholeStars) + (hasHalf ? "✫" : "");
}

export default function ShareFichaButton({ data }: { data: ShareData }) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setGenerating(true);
    setError("");
    try {
      await document.fonts.ready;
      const displayFont =
        getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() ||
        "sans-serif";
      const monoFont =
        getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() ||
        "monospace";

      const W = 1080;
      const H = 1350;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas não suportado");

      // fundo
      ctx.fillStyle = "#14110D";
      ctx.fillRect(0, 0, W, H);

      const poster = data.poster ? await loadImage(data.poster) : null;

      if (poster) {
        // backdrop desfocado
        ctx.save();
        ctx.filter = "blur(50px) brightness(0.55)";
        const scale = Math.max(W / poster.width, H / poster.height) * 1.15;
        const iw = poster.width * scale;
        const ih = poster.height * scale;
        ctx.drawImage(poster, (W - iw) / 2, (H - ih) / 2, iw, ih);
        ctx.restore();
        ctx.fillStyle = "rgba(20,17,13,0.35)";
        ctx.fillRect(0, 0, W, H);
      }

      // eyebrow
      ctx.textAlign = "center";
      ctx.fillStyle = "#D9A441";
      ctx.font = `700 26px ${monoFont}`;
      ctx.fillText("C L U B E   D O   F I L M E", W / 2, 90);

      // pôster nítido
      let posterBottom = 190;
      if (poster) {
        const pw = 460;
        const ph = pw * 1.5;
        const px = (W - pw) / 2;
        const py = 150;
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 18;
        const radius = 18;
        ctx.beginPath();
        ctx.moveTo(px + radius, py);
        ctx.arcTo(px + pw, py, px + pw, py + ph, radius);
        ctx.arcTo(px + pw, py + ph, px, py + ph, radius);
        ctx.arcTo(px, py + ph, px, py, radius);
        ctx.arcTo(px, py, px + pw, py, radius);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(poster, px, py, pw, ph);
        ctx.restore();
        posterBottom = py + ph;
      }

      let y = posterBottom + 70;

      // título
      ctx.fillStyle = "#F6EFDE";
      ctx.font = `400 62px ${displayFont}`;
      const titleLines = wrapText(ctx, data.movieTitle.toUpperCase(), W - 160, 2);
      titleLines.forEach((line) => {
        ctx.fillText(line, W / 2, y);
        y += 62;
      });
      y += 6;

      // ano
      if (data.movieYear) {
        ctx.font = `400 26px ${monoFont}`;
        ctx.fillStyle = "rgba(246,239,222,0.5)";
        ctx.fillText(String(data.movieYear), W / 2, y);
        y += 50;
      } else {
        y += 20;
      }

      // estrelas
      ctx.font = `400 54px ${monoFont}`;
      ctx.fillStyle = "#D9A441";
      ctx.fillText(`${starsString(data.rating)}  ${data.rating.toFixed(1)}`, W / 2, y);
      y += 60;

      // frase / ponto alto
      const excerpt = data.quote || data.comment || data.highs;
      if (excerpt) {
        ctx.font = `italic 400 30px ${monoFont}`;
        ctx.fillStyle = "rgba(246,239,222,0.85)";
        const lines = wrapText(ctx, `“${excerpt}”`, W - 220, 3);
        lines.forEach((line) => {
          ctx.fillText(line, W / 2, y);
          y += 40;
        });
      }

      // rodapé
      ctx.font = `700 28px ${monoFont}`;
      ctx.fillStyle = "#F6EFDE";
      ctx.fillText(data.displayName, W / 2, H - 100);
      ctx.font = `400 22px ${monoFont}`;
      ctx.fillStyle = "rgba(246,239,222,0.4)";
      ctx.fillText("avaliou este filme no clube", W / 2, H - 66);

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png")
      );
      if (!blob) throw new Error("Falha ao gerar a imagem");

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ficha-${data.movieTitle.toLowerCase().replace(/\s+/g, "-")}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        "Não foi possível gerar a imagem (às vezes acontece com pôsteres colados manualmente, por bloqueio do próprio site de origem)."
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <button onClick={handleClick} disabled={generating} className="btn-secondary">
        <Share2 className="w-3.5 h-3.5" />
        {generating ? "Gerando..." : "Exportar ficha como imagem"}
      </button>
      {error && <p className="font-mono text-[11px] text-red-dark max-w-xs">{error}</p>}
    </div>
  );
}
