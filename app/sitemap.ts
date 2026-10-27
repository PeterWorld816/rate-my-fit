import type { MetadataRoute } from "next";
import { ATTACHMENT_TYPES } from "@/data/attachment-types";
import { GUIDES } from "@/data/guides";
import { SITE_URL } from "@/lib/site";

// Last real content change for the non-guide pages. Bump the matching date by
// hand when a page's content changes; guides use their own updatedAt.
const UPDATED_AT = {
  home: "2026-10-27",
  quiz: "2026-10-27",
  types: "2026-10-27",
  about: "2026-10-27",
  privacy: "2026-10-27",
  terms: "2026-10-27",
  contact: "2026-10-27",
};

const latestGuideUpdate = GUIDES.map((g) => g.updatedAt).sort().at(-1) ?? UPDATED_AT.home;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: [string, string][] = [
    ["/", UPDATED_AT.home],
    ["/quiz", UPDATED_AT.quiz],
    ...ATTACHMENT_TYPES.map((t): [string, string] => [`/types/${t.code}`, UPDATED_AT.types]),
    ["/guide", latestGuideUpdate],
    ...GUIDES.map((g): [string, string] => [`/guide/${g.slug}`, g.updatedAt]),
    ["/about", UPDATED_AT.about],
    ["/privacy", UPDATED_AT.privacy],
    ["/terms", UPDATED_AT.terms],
    ["/contact", UPDATED_AT.contact],
  ];
  return entries.map(([p, date]) => ({ url: `${SITE_URL}${p === "/" ? "" : p}`, lastModified: date }));
}
