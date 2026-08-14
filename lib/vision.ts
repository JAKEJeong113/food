import Anthropic from "@anthropic-ai/sdk";

export interface DetectedItem {
  name: string;
  quantity: number;
  unit: string;
  confidence: number; // 0~1
}

const MOCK_ITEMS: DetectedItem[] = [
  { name: "계란", quantity: 8, unit: "개", confidence: 0.98 },
  { name: "우유", quantity: 1, unit: "L", confidence: 0.95 },
  { name: "양파", quantity: 3, unit: "개", confidence: 0.91 },
  { name: "애호박", quantity: 1, unit: "개", confidence: 0.88 },
  { name: "두부", quantity: 1, unit: "모", confidence: 0.86 },
  { name: "김치", quantity: 1, unit: "통", confidence: 0.9 },
  { name: "대파", quantity: 1, unit: "단", confidence: 0.83 },
  { name: "햄", quantity: 1, unit: "팩", confidence: 0.8 },
];

const SYSTEM_PROMPT = `너는 냉장고 사진에서 식재료를 인식하는 비전 AI다.
사용자가 업로드한 냉장고/식재료 사진을 보고 식별 가능한 식재료 목록을 한국어로 반환한다.
- 각 항목은 name(한국어 재료명), quantity(추정 수량, 숫자), unit(개/g/모/단/팩/통 등 한국식 단위), confidence(0~1 사이 확신도)를 포함한다.
- 확신할 수 없으면 confidence를 낮게 준다.
- 조미료/양념(간장, 고추장 등)은 병 형태로 명확히 보일 때만 포함한다.
- 반드시 JSON 배열만 반환하고, 다른 설명 텍스트는 절대 포함하지 않는다.
예시: [{"name":"계란","quantity":6,"unit":"개","confidence":0.95}]`;

export async function analyzeFridgeImage(
  base64Image: string,
  mediaType: string
): Promise<{ items: DetectedItem[]; usedMock: boolean }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return { items: MOCK_ITEMS, usedMock: true };
  }

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as
                | "image/jpeg"
                | "image/png"
                | "image/webp"
                | "image/gif",
              data: base64Image,
            },
          },
          {
            type: "text",
            text: "이 사진에 있는 식재료를 모두 찾아서 JSON 배열로 알려줘.",
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return { items: [], usedMock: false };
  }

  const jsonMatch = textBlock.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    return { items: [], usedMock: false };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as DetectedItem[];
    return { items: parsed, usedMock: false };
  } catch {
    return { items: [], usedMock: false };
  }
}
