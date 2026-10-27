import type { MetadataRoute } from "next";
import { ATTACHMENT_TYPES } from "@/data/attachment-types";
import { GUIDES } from "@/data/guides";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/quiz",
    ...ATTACHMENT_TYPES.map((t) => `/types/${t.code}`),
    "/guide",
    ...GUIDES.map((g) => `/guide/${g.slug}`),
    "/about",
    "/privacy",
    "/contact",
  ];
  const lastModified = new Date();
  return paths.map((p) => ({ url: `${SITE_URL}${p === "/" ? "" : p}`, lastModified }));
}
