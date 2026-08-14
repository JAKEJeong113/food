export const metadata = {
  title: "개인정보처리방침 | 냉파AI",
};

export default function PrivacyPage() {
  return (
    <div className="px-5 pt-8 pb-16 text-sm text-gray-700 leading-relaxed">
      <h1 className="text-xl font-bold text-gray-900">개인정보처리방침</h1>
      <p className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg p-3">
        이 문서는 초안입니다. [ ] 로 표시된 부분은 서비스 운영자(사업자 또는
        개인 운영자) 정보로 채워 넣어야 실제로 사용할 수 있습니다.
      </p>

      <p className="mt-4">
        냉파AI(이하 &quot;서비스&quot;)는 이용자의 개인정보를 중요하게 생각하며,
        「개인정보 보호법」 등 관련 법령을 준수합니다. 본 방침은 서비스가 어떤
        개인정보를 어떤 목적으로 수집·이용하는지 안내합니다.
      </p>

      <Section title="1. 수집하는 개인정보 항목">
        <ul className="list-disc pl-5 space-y-1">
          <li>필수: 이메일, 비밀번호(암호화 저장), 이름, 가구(household) 이름</li>
          <li>
            서비스 이용 과정에서 생성: 업로드한 냉장고 사진(재료 인식 목적),
            냉장고 재고 정보, 조리 기록
          </li>
          <li>자동 수집: 접속 로그, 서비스 이용 기록(추후 분석 도구 도입 시)</li>
        </ul>
      </Section>

      <Section title="2. 개인정보 수집 및 이용 목적">
        <ul className="list-disc pl-5 space-y-1">
          <li>회원 식별 및 로그인 유지(세션 인증)</li>
          <li>냉장고 사진 속 식재료 인식 및 재고 관리</li>
          <li>보유 재료 기반 레시피 추천</li>
          <li>같은 가구 구성원 간 냉장고 재고 공유</li>
          <li>서비스 부정 이용 방지, 문의 응대</li>
        </ul>
      </Section>

      <Section title="3. 개인정보의 보유 및 이용 기간">
        <p>
          회원 탈퇴 시 또는 수집·이용 목적 달성 시 지체 없이 파기합니다.
          현재 서비스에는 별도의 탈퇴 기능이 아직 없으며, 삭제를 원하시면
          아래 연락처로 요청해주세요. 관계 법령에 따라 보존이 필요한 정보는
          해당 법령에서 정한 기간 동안 보관합니다.
        </p>
      </Section>

      <Section title="4. 개인정보 처리 위탁">
        <p>
          냉장고 사진 속 식재료를 인식하기 위해 업로드된 이미지를 Anthropic
          PBC(Claude Vision API)에 전송하여 분석을 위탁합니다. 위탁받는 자는
          해당 목적 범위를 벗어나 이 데이터를 이용하지 않습니다. 그 외
          제3자에게 개인정보를 제공하지 않습니다.
        </p>
      </Section>

      <Section title="5. 이용자의 권리">
        <p>
          이용자는 언제든지 자신의 개인정보 열람, 정정, 삭제, 처리정지를
          요청할 수 있습니다. 아래 연락처로 문의해주세요.
        </p>
      </Section>

      <Section title="6. 쿠키 및 세션">
        <p>
          로그인 상태 유지를 위해 세션 토큰을 쿠키(웹) 또는 앱 내부 저장소
          (안드로이드 앱)에 저장합니다. 이 토큰은 로그인 유지 외의 용도로
          사용되지 않습니다.
        </p>
      </Section>

      <Section title="7. 개인정보 보호책임자 / 문의처">
        <ul className="list-disc pl-5 space-y-1">
          <li>운영자: [운영자명을 입력하세요]</li>
          <li>연락처(이메일): [문의받을 이메일을 입력하세요]</li>
          <li>사업자등록번호: [사업자인 경우 입력, 개인 운영 시 미기재]</li>
        </ul>
      </Section>

      <Section title="8. 시행일">
        <p>본 방침은 [시행일을 입력하세요]부터 적용됩니다.</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      <div className="mt-2">{children}</div>
    </div>
  );
}
