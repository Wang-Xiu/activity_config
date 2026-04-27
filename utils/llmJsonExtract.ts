/** 去掉智谱可能返回的 markdown 代码围栏，得到纯 JSON 文本 */
export function stripLlmJsonFence(text: string): string {
    const t = text.trim();
    const block = t.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (block) {
        return block[1].trim();
    }
    return t;
}
