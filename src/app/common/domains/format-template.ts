// 1. 변환 함수 정의
export function formatTemplate(template: string, data: object): string {
    Object.entries(data).map(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
            template = template.replaceAll(`{${key}}`, value.toString());
        }
    });

    return template;
}
