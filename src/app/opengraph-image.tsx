import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Clube do Filme";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#14110D",
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(217,164,65,0.16), transparent 60%)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: "rgba(217,164,65,0.15)",
            border: "2px solid rgba(217,164,65,0.4)",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 60,
            marginBottom: 28,
          }}
        >
          🎬
        </div>
        <div
          style={{
            display: "flex",
            color: "#D9A441",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          Sessão das 20h
        </div>
        <div
          style={{
            display: "flex",
            color: "#F6EFDE",
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          CLUBE DO FILME
        </div>
        <div
          style={{
            display: "flex",
            color: "rgba(246,239,222,0.55)",
            fontSize: 28,
            marginTop: 22,
          }}
        >
          O clube do livro, mas de filme
        </div>
      </div>
    ),
    { ...size }
  );
}
