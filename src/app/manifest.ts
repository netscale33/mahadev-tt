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
    background_color: "#f8fafc",
    theme_color: "#0a2540",
    categories: ["travel", "business", "productivity"],
    lang: "en",
    dir: "ltr",
    scope: "/",
    prefer_related_applications: false,
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-192-maskable.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512-maskable.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/logo.jpg",
        sizes: "any",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
    screenshots: [],
  };
}
