import Link from "next/link";
import { getAttachmentTypeByCode, type Lang } from "@/data/attachment-types";
import { getGuideBySlug } from "@/data/guides";
import type { ProfileMatch, TypeProfile } from "@/data/type-profiles";

const CARD = {
  bg: "rgba(255,255,255,0.78)",
  border: "rgba(255,255,255,0.75)",
  shadow: "0 8px 24px rgba(24,24,27,0.08)",
};

// Shown above the Korean-only body when another UI language is selected.
const KO_ONLY_NOTICE: Record<Exclude<Lang, "ko">, string> = {
  en: "The full write-up for this type is currently available in Korean only.",
  ja: "このタイプの詳しい解説は現在、韓国語のみでご覧いただけます。",
  zh: "该类型的详细介绍目前仅提供韩语版本。",
  es: "Por ahora, la descripción completa de este tipo solo está disponible en coreano.",
};

// Full long-form type write-up (Korean). Always rendered so the body is in the
// server HTML; tagged lang="ko" so Korean line-breaking applies even when the
// UI language is different.
export default function TypeProfileSection({ profile, accent, lang }: { profile: TypeProfile; accent: string; lang: Lang }) {
  const block = (heading: string, body: React.ReactNode) => (
    <section style={{ background: CARD.bg, border: `1px solid ${CARD.border}`, borderRadius: 16, padding: "18px 16px 8px", boxShadow: CARD.shadow }}>
      <h2 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 12px", color: accent }}>{heading}</h2>
      {body}
    </section>
  );
  const list = (items: string[]) => <ul>{items.map((p, i) => <li key={i}>{p}</li>)}</ul>;
  const labeled = (label: string, text: string, highlight = false) => (
    <p style={highlight ? { background: `${accent}12`, borderRadius: 10, padding: "10px 12px" } : undefined}>
      <strong style={{ color: highlight ? accent : "#18181b" }}>{label}</strong>
      <br />
      {text}
    </p>
  );
  const matchLinks = (matches: ProfileMatch[], color: string) =>
    matches.map((m) => {
      const t = getAttachmentTypeByCode(m.code);
      if (!t) return null;
      return (
        <Link
          key={m.code}
          href={`/types/${t.code}`}
          className="tap-btn"
          style={{ display: "block", textDecoration: "none", color: "inherit", background: "#fff", border: "1px solid rgba(24,24,27,0.08)", borderRadius: 12, padding: "12px 14px", marginBottom: 10 }}
        >
          <span style={{ display: "block", fontSize: 14, fontWeight: 800, color }}>
            {t.code} · {t.ko.name} →
          </span>
          <span style={{ display: "block", fontSize: 14, lineHeight: 1.75, color: "rgba(24,24,27,0.75)", marginTop: 4 }}>{m.reason}</span>
        </Link>
      );
    });
  const guides = profile.relatedGuides.map(getGuideBySlug).filter((g) => g !== undefined);

  return (
    <div lang="ko" className="prose-page fade-up" style={{ animationDelay: "0.22s", display: "flex", flexDirection: "column", gap: 12, margin: "16px 0 0" }}>
      {lang !== "ko" && (
        <p lang={lang} style={{ margin: 0, fontSize: 13, lineHeight: 1.6, textAlign: "center", color: "rgba(24,24,27,0.65)", background: "rgba(255,255,255,0.6)", borderRadius: 12, padding: "10px 12px" }}>
          🌐 {KO_ONLY_NOTICE[lang]}
        </p>
      )}

      {block(
        "✍️ 이 유형을 한마디로",
        <>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#18181b" }}>{profile.summary}</p>
          {profile.intro.map((p, i) => <p key={i}>{p}</p>)}
        </>,
      )}

      {block(
        "🧠 이 유형의 속마음",
        <>
          {labeled("겉으로 보이는 모습", profile.innerSelf.outside)}
          {labeled("실제 속마음", profile.innerSelf.inside)}
          <p>{profile.innerSelf.note}</p>
        </>,
      )}

      {block(
        "💘 연애 단계별 패턴",
        profile.stages.map((s) => (
          <div key={s.stage}>
            <h3>{s.stage}</h3>
            {list(s.points)}
          </div>
        )),
      )}

      {block(
        "📱 카톡·연락 스타일",
        <>
          <p>{profile.texting.overview}</p>
          <h3>답장 속도</h3>
          <p>{profile.texting.replySpeed}</p>
          <h3>읽씹·안읽씹을 대하는 태도</h3>
          <p>{profile.texting.onReadIgnored}</p>
          <h3>자주 보내는 메시지</h3>
          {list(profile.texting.phrases)}
        </>,
      )}

      {block(
        "💥 갈등 상황 예시",
        profile.conflicts.map((c, i) => (
          <div key={c.title}>
            <h3>
              {i + 1}. {c.title}
            </h3>
            {labeled("상황", c.situation)}
            {labeled("이럴 때 이 유형은", c.reaction)}
            {labeled("상대가 느끼는 감정", c.partnerFeels)}
            {labeled("이렇게 해 보면 어때요?", c.better, true)}
          </div>
        )),
      )}

      {block(
        "🗣️ 이 유형이 자주 하는 말과 속마음",
        <>
          <h3>자주 하는 말</h3>
          {list(profile.sayings)}
          <h3>속으로 하는 생각</h3>
          {list(profile.thoughts)}
        </>,
      )}

      {block("🚩 연애할 때 주의할 점", list(profile.cautions))}

      {block(
        "💡 관계 팁",
        <>
          <h3>이 유형인 나를 위한 팁</h3>
          {list(profile.tips.self)}
          <h3>이 유형을 사귀고 있다면</h3>
          {list(profile.tips.partner)}
        </>,
      )}

      {block(
        "💑 궁합",
        <>
          <h3>찰떡궁합</h3>
          {matchLinks(profile.matches.best, "#0f766e")}
          <h3>상극</h3>
          {matchLinks(profile.matches.worst, "#be123c")}
        </>,
      )}

      {block(
        "🌱 성장 포인트",
        <>
          <p>{profile.growth.intro}</p>
          <ul>
            {profile.growth.practices.map((p) => (
              <li key={p.title}>
                <strong>{p.title}</strong> — {p.body}
              </li>
            ))}
          </ul>
        </>,
      )}

      {block(
        "❓ 자주 묻는 질문",
        profile.faq.map((f) => (
          <div key={f.q}>
            <h3>Q. {f.q}</h3>
            <p>{f.a}</p>
          </div>
        )),
      )}

      {guides.length > 0 &&
        block(
          "📚 함께 읽으면 좋은 가이드",
          <ul>
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={`/guide/${g.slug}`}>{g.title}</Link>
              </li>
            ))}
          </ul>,
        )}
    </div>
  );
}
