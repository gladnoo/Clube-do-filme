import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Clube do Filme",
    short_name: "Clube do Filme",
    description: "O clube do livro, mas de filme.",
    start_url: "/week",
    display: "standalone",
    background_color: "#14110D",
    theme_color: "#14110D",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
