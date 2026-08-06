import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#14110D",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "84%",
            height: "84%",
            borderRadius: "50%",
            backgroundColor: "rgba(217,164,65,0.16)",
            border: "10px solid #D9A441",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 220,
          }}
        >
          🎬
        </div>
      </div>
    ),
    { ...size }
  );
}
