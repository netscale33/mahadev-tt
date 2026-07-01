import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mahadev Holidays - Travel Itinerary Builder",
    short_name: "Mahadev Holidays",
    description:
      "Luxury Travel Package & Itinerary Document Generator - Premium Edition",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#0a2540",
    theme_color: "#0a2540",
    categories: ["travel", "business", "productivity"],
    lang: "en",
    dir: "ltr",
    scope: "/",
    prefer_related_applications: false,
    icons: [
      {
        src: "/logo-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [],
  };
}
