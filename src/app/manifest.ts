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
        src: "/logo.jpg",
        sizes: "1024x1024",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
    screenshots: [],
  };
}
