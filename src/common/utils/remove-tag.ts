export function removeTag(text: string) {
    return text
        .replace(/<[^>]*>?/gm, '') // 태그 제거
        .replace(/&nbsp;/g, ' ') // 특수 공백 제거
        .replace(/\s\s+/g, ' ') // 불필요한 연속 공백 정리
        .trim();
}
