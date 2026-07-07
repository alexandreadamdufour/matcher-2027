import type { MetadataRoute } from "next";

const BASE_URL = "https://matcher-2027.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/test",
    "/resultats",
    "/methodologie",
    "/sources",
    "/confidentialite",
    "/a-propos",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.6,
  }));
}
