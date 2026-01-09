const dateRegex = /(\d{4})(\d{2})(\d{2})/;
const timeRegex = /(\d{2})(\d{2})(\d{2})/;

export function toDateYmdByDate(date: Date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * 20250101 형식을 2025-01-01 형식으로 변환합니다.
 * @param date
 */
export function toDateByKoreaInvestmentYmd(date: string): string {
    const dateMatch = date.match(dateRegex);
    if (!dateMatch) {
        throw new Error('Invalid KoreaInvestment date format');
    }

    const [, year, month, day] = dateMatch;

    return `${year}-${month}-${day}`;
}

/**
 * 230000 형식을 23:00:00 형식으로 변환합니다.
 * @param time
 */
export function toDateByKoreaInvestmentTime(time: string): string {
    const timeMatch = time.match(timeRegex);
    if (!timeMatch) {
        throw new Error('Invalid KoreaInvestment time format');
    }

    const [, hour, minute, second] = timeMatch;

    return `${hour}:${minute}:${second}`;
}
