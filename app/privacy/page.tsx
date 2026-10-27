import type { Metadata } from "next";
import ProsePage from "@/components/ProsePage";
import { CONTACT_EMAIL, SITE_NAME, pageMetadata } from "@/lib/site";

const EFFECTIVE_DATE = "2026년 10월 27일";

export const metadata: Metadata = pageMetadata({
  title: "개인정보처리방침",
  description: `${SITE_NAME}의 개인정보처리방침입니다. 퀴즈 응답 처리 방식, 브라우저 저장소 사용, Google AdSense 광고 쿠키에 대해 안내합니다.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <ProsePage
      title="개인정보처리방침"
      lead={`${SITE_NAME}(이하 ‘사이트’)는 이용자의 개인정보를 소중히 여기며, 어떤 정보가 어떻게 다뤄지는지 아래와 같이 안내합니다.`}
    >
      <h2>1. 수집하는 개인정보</h2>
      <p>
        사이트는 회원가입이나 로그인 기능이 없으며, 이름·이메일·연락처 등 이용자를 식별할 수 있는 개인정보를
        직접 입력받거나 수집하지 않습니다.
      </p>

      <h2>2. 퀴즈 응답의 처리</h2>
      <p>
        연애 유형 테스트의 20개 질문에 대한 응답과 결과 계산은 모두 이용자의 브라우저 안에서 이루어집니다.
        응답 내용과 결과는 사이트 운영자의 서버로 전송되거나 저장되지 않으며, 운영자는 개별 이용자의 응답이나
        결과를 볼 수 없습니다.
      </p>

      <h2>3. 브라우저 저장소(localStorage) 사용</h2>
      <p>사이트는 편의 기능을 위해 이용자 기기의 브라우저 저장소(localStorage)에 다음 정보만 저장합니다.</p>
      <ul>
        <li>마지막 테스트 결과(유형 코드와 점수): ‘마지막 결과 보기’ 기능에 사용</li>
        <li>선택한 언어 설정: 다음 방문 시 같은 언어로 보여주기 위해 사용</li>
      </ul>
      <p>
        이 정보는 이용자의 기기에만 남고 서버로 전송되지 않습니다. 브라우저의 사이트 데이터 삭제 기능으로 언제든지
        지울 수 있으며, 새로 테스트를 시작하면 이전 결과는 자동으로 삭제됩니다. 사이트 자체는 별도의 쿠키를
        설정하지 않습니다.
      </p>

      <h2>4. 결과 공유 기능</h2>
      <p>
        결과 링크 복사, 이미지 저장, SNS 공유는 이용자가 직접 버튼을 눌렀을 때만 동작합니다. 공유 이미지는
        이용자의 브라우저에서 만들어지며 사이트 서버로 업로드되지 않습니다. X(트위터) 등 외부 서비스로 공유하는 경우
        해당 서비스의 개인정보 정책이 적용됩니다.
      </p>

      <h2>5. 광고 및 쿠키 (Google AdSense)</h2>
      <p>
        이 사이트는 Google AdSense로 광고를 게재하며, Google은 쿠키를 사용해 이용자의 이전 방문 기록을 바탕으로
        관심 기반 광고를 보여줄 수 있습니다. Google을 포함한 제3자 광고 사업자는 쿠키를 사용하여 이 사이트 및 다른
        웹사이트 방문 기록을 기반으로 광고를 제공할 수 있습니다.
      </p>
      <p>
        Google의 광고 쿠키 사용에 대한 자세한 내용은{" "}
        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
          Google 광고 정책
        </a>
        에서 확인할 수 있습니다.
      </p>

      <h2>6. 맞춤 광고를 끄는 방법</h2>
      <ul>
        <li>
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            https://adssettings.google.com
          </a>{" "}
          (Google 광고 설정)에 접속해 ‘맞춤 광고’를 끄면 Google의 관심 기반 광고를 받지 않을 수 있습니다.
        </li>
        <li>
          <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">
            www.aboutads.info/choices
          </a>
          에서 다른 제3자 광고 사업자의 맞춤 광고용 쿠키 사용도 거부할 수 있습니다.
        </li>
        <li>브라우저 설정에서 쿠키를 차단하거나 삭제할 수도 있습니다. 이 경우에도 테스트는 정상적으로 이용할 수 있습니다.</li>
      </ul>
      <p>맞춤 광고를 끄더라도 광고 자체는 표시될 수 있으며, 관심사와 무관한 일반 광고가 보여집니다.</p>

      <h2>7. 호스팅 서버의 접속 기록</h2>
      <p>
        사이트는 Netlify를 통해 제공됩니다. 웹사이트 운영 과정에서 호스팅 서비스는 보안과 서비스 안정성을 위해
        IP 주소, 브라우저 종류, 접속 시각 같은 일반적인 접속 기록을 자동으로 처리할 수 있으며, 이는 해당 서비스의
        정책에 따릅니다. 운영자는 이 기록을 이용자 식별 목적으로 사용하지 않습니다.
      </p>

      <h2>8. 아동의 개인정보</h2>
      <p>사이트는 개인정보를 수집하지 않으므로 만 14세 미만 아동의 개인정보도 수집하지 않습니다.</p>

      <h2>9. 문의처</h2>
      <p>
        개인정보와 관련한 문의는 아래 이메일로 보내주세요. 확인 후 가능한 빨리 답변드리겠습니다.
        <br />
        이메일: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>

      <h2>10. 방침의 변경</h2>
      <p>
        이 방침이 바뀌는 경우 이 페이지를 통해 변경 내용과 시행일을 알려드립니다.
      </p>
      <p>
        <strong>시행일: {EFFECTIVE_DATE}</strong>
      </p>
    </ProsePage>
  );
}
