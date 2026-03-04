export function estimateTextWidth(text: string, fontSize = 14): number {
  const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const other = text.length - cjk
  const units = cjk * 1.05 + other * 0.62
  return units * fontSize
}
