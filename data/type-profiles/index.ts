import type { TypeProfile } from "./types";
import S from "./S";
import A from "./A";
import V from "./V";
import D from "./D";
import SA from "./S-A";
import SV from "./S-V";
import SD from "./S-D";
import AS from "./A-S";
import AV from "./A-V";
import AD from "./A-D";
import VS from "./V-S";
import VA from "./V-A";
import VD from "./V-D";
import DS from "./D-S";
import DA from "./D-A";
import DV from "./D-V";

export type { ProfileMatch, TypeProfile } from "./types";

// 유형 코드 → 상세 본문. 16개 유형 모두 작성되어 있고, 등록이 빠진 유형은
// data/type-details.ts 의 짧은 해설로 대체된다.
export const TYPE_PROFILES: Partial<Record<string, TypeProfile>> = {
  S,
  A,
  V,
  D,
  "S+A": SA,
  "S+V": SV,
  "S+D": SD,
  "A+S": AS,
  "A+V": AV,
  "A+D": AD,
  "V+S": VS,
  "V+A": VA,
  "V+D": VD,
  "D+S": DS,
  "D+A": DA,
  "D+V": DV,
};
