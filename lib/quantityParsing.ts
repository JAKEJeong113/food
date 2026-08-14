/**
 * 레시피 재료의 quantity_text("300g", "1/2모", "2개" 등) 맨 앞의 숫자(또는 간단한
 * 분수)만 뽑아낸다. 단위 문자열은 신경 쓰지 않는다 — 재고 차감은 정확한 단위
 * 환산보다 "대략 이만큼 줄었다"를 보여주는 것이 목적이라, 재료마스터
 * 기본단위와 레시피 표기가 완전히 일치하지 않아도(예: "단" vs "대") 그대로
 * 쓴다. "약간", "넉넉히"처럼 숫자가 없는 표현은 null을 반환하고, 이런
 * 재료(대부분 기본양념)는 차감 대상에서 제외된다.
 */
export function parseLeadingQuantity(text: string): number | null {
  const trimmed = text.trim();

  const fractionMatch = trimmed.match(/^(\d+)\s*\/\s*(\d+)/);
  if (fractionMatch) {
    const [, numerator, denominator] = fractionMatch;
    const denominatorValue = Number(denominator);
    if (denominatorValue === 0) return null;
    return Number(numerator) / denominatorValue;
  }

  const numberMatch = trimmed.match(/^(\d+(\.\d+)?)/);
  if (numberMatch) {
    return Number(numberMatch[1]);
  }

  return null;
}
