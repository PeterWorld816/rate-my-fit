// Regenerates all 16 public/mascots/*.svg files from data/attachment-types.ts's
// axis colors. Run with: npx tsx scripts/generate-mascots.ts (from project root).
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ATTACHMENT_TYPES, AXIS_META, type AttachmentAxis } from "../data/attachment-types";

type FaceParts = { eyes: string; mouth: string; blush: boolean; extra: string };

function faceFor(axis: AttachmentAxis): FaceParts {
  switch (axis) {
    case "secure":
      return {
        eyes: `
          <path d="M70,97 Q82,85 94,97" stroke="#18181b" stroke-width="6" stroke-linecap="round" fill="none"/>
          <path d="M106,97 Q118,85 130,97" stroke="#18181b" stroke-width="6" stroke-linecap="round" fill="none"/>
        `,
        mouth: `<path d="M84,122 Q100,136 116,122" stroke="#18181b" stroke-width="6" stroke-linecap="round" fill="none"/>`,
        blush: true,
        extra: "",
      };
    case "anxious":
      return {
        eyes: `
          <circle cx="78" cy="98" r="15" fill="#ffffff"/>
          <circle cx="122" cy="98" r="15" fill="#ffffff"/>
          <circle cx="81" cy="101" r="7" fill="#18181b"/>
          <circle cx="125" cy="101" r="7" fill="#18181b"/>
          <circle cx="77" cy="95" r="2.6" fill="#ffffff"/>
          <circle cx="121" cy="95" r="2.6" fill="#ffffff"/>
          <path d="M66,82 Q78,73 89,80" stroke="#18181b" stroke-width="4" stroke-linecap="round" fill="none"/>
          <path d="M111,80 Q122,73 134,82" stroke="#18181b" stroke-width="4" stroke-linecap="round" fill="none"/>
        `,
        mouth: `<ellipse cx="100" cy="129" rx="6" ry="8" fill="#18181b"/>`,
        blush: true,
        extra: `<path d="M144,62 Q150,74 143,82 Q136,74 144,62 Z" fill="#a5d8ff" opacity="0.85"/>`,
      };
    case "avoidant":
      return {
        eyes: `
          <path d="M68,97 L92,97" stroke="#18181b" stroke-width="6" stroke-linecap="round" fill="none"/>
          <path d="M108,97 L132,97" stroke="#18181b" stroke-width="6" stroke-linecap="round" fill="none"/>
        `,
        mouth: `<path d="M91,126 L109,126" stroke="#18181b" stroke-width="6" stroke-linecap="round" fill="none"/>`,
        blush: false,
        extra: "",
      };
    case "disorganized":
      return {
        eyes: `
          <path d="M80,88 C87,88 89,95 84,99 C80,102 74,99 76,94 C77,91 81,90 82,93" stroke="#18181b" stroke-width="3.4" stroke-linecap="round" fill="none"/>
          <path d="M120,88 C127,88 129,95 124,99 C120,102 114,99 116,94 C117,91 121,90 122,93" stroke="#18181b" stroke-width="3.4" stroke-linecap="round" fill="none"/>
        `,
        mouth: `<path d="M84,120 L92,129 L100,118 L108,129 L116,120" stroke="#18181b" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
        blush: true,
        extra: `
          <path d="M148,66 L158,63" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
          <path d="M152,76 L163,76" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
        `,
      };
  }
}

// Prop glyphs defined in local coordinates centered on (0,0); callers wrap
// them in a <g transform="translate(...) scale(...)"> for placement.
function propFor(axis: AttachmentAxis): string {
  switch (axis) {
    case "secure":
      return `
        <path d="M-17,2 Q-10,-5 -3,2 Q4,9 11,2" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M-17,12 Q-10,5 -3,12 Q4,19 11,12" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.7"/>
      `;
    case "anxious":
      return `
        <path d="M0,-5 C0,-10 8,-10 8,-4 C8,1 0,7 0,7 C0,7 -8,1 -8,-4 C-8,-10 0,-10 0,-5 Z" fill="#ffffff"/>
        <path d="M16,-12 L18,-7 L23,-6 L18,-4 L16,1 L14,-4 L9,-6 L14,-7 Z" fill="#ffffff" opacity="0.9"/>
      `;
    case "avoidant":
      return `<path d="M0,-12 A12,12 0 1,0 0,12 A9,9 0 1,1 0,-12 Z" fill="#ffffff" opacity="0.9"/>`;
    case "disorganized":
      return `
        <ellipse cx="0" cy="-10" rx="15" ry="5" fill="#ffffff" opacity="0.9"/>
        <ellipse cx="0" cy="-1" rx="10.5" ry="4" fill="#ffffff" opacity="0.9"/>
        <ellipse cx="0" cy="7" rx="6" ry="3" fill="#ffffff" opacity="0.9"/>
      `;
  }
}

function mascotSvg(primaryAxis: AttachmentAxis, secondaryAxis: AttachmentAxis | null): string {
  const primary = AXIS_META[primaryAxis];
  const secondary = secondaryAxis ? AXIS_META[secondaryAxis] : primary;
  const face = faceFor(primaryAxis);
  const gradId = `grad-${primaryAxis}-${secondaryAxis ?? primaryAxis}`;

  const primaryProp = `<g transform="translate(150,152)">${propFor(primaryAxis)}</g>`;
  const secondaryProp = secondaryAxis
    ? `<g transform="translate(50,58) scale(0.62)">${propFor(secondaryAxis)}</g>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="${gradId}" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${primary.colorFrom}"/>
      <stop offset="100%" stop-color="${secondary.colorTo}"/>
    </linearGradient>
  </defs>
  <ellipse cx="100" cy="182" rx="52" ry="10" fill="#18181b" opacity="0.08"/>
  <ellipse cx="100" cy="110" rx="74" ry="68" fill="url(#${gradId})"/>
  <ellipse cx="100" cy="128" rx="46" ry="34" fill="#ffffff" opacity="0.12"/>
  ${face.blush ? `<ellipse cx="66" cy="114" rx="11" ry="6.5" fill="#ff8fa3" opacity="0.45"/><ellipse cx="134" cy="114" rx="11" ry="6.5" fill="#ff8fa3" opacity="0.45"/>` : ""}
  ${face.eyes}
  ${face.mouth}
  ${face.extra}
  ${secondaryProp}
  ${primaryProp}
</svg>`;
}

const OUT_DIR = join(process.cwd(), "public", "mascots");

for (const type of ATTACHMENT_TYPES) {
  const svg = mascotSvg(type.primaryAxis, type.secondaryAxis);
  const filename = `${type.code.replace("+", "-")}.svg`;
  writeFileSync(join(OUT_DIR, filename), svg, "utf8");
  console.log("wrote", filename);
}
