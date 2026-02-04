import { BadRequestException } from '@nestjs/common';

const dateRegex = /(\d{4})(\d{2})(\d{2})/;
const timeRegex = /(\d{2})(\d{2})(\d{2})/;

/**
 * Date 객체를 YYYY-MM-DD 형식으로 변환합니다.
 * @param options
 */
export function toDateYmdByDate(options?: { date?: Date; separator?: string }) {
    const date = options?.date ?? new Date();
    const separator = options?.separator ?? '';

    const year = date.getFullYear();
    const month = formatTwoDigits(date.getMonth() + 1);
    const day = formatTwoDigits(date.getDate());

    return [year, month, day].join(separator);
}

/**
 * Date 객체를 HH:MM:SS 형식으로 변환합니다.
 * @param options
 */
export function toDateTimeByDate(options?: {
    date?: Date;
    separator?: string;
}) {
    const date = options?.date ?? new Date();
    const separator = options?.separator ?? '';

    const hour = formatTwoDigits(date.getHours());
    const minute = formatTwoDigits(date.getMinutes());
    const seconds = formatTwoDigits(date.getSeconds());

    return [hour, minute, seconds].join(separator);
}

/**
 * 20250101 형식을 2025-01-01 형식으로 변환합니다.
 * @param date
 */
export function toDateByKoreaInvestmentYmd(date: string): string {
    const dateMatch = date.match(dateRegex);
    if (!dateMatch) {
        throw new BadRequestException('Invalid KoreaInvestment date format');
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
        throw new BadRequestException('Invalid KoreaInvestment time format');
    }

    const [, hour, minute, second] = timeMatch;

    return `${hour}:${minute}:${second}`;
}

function formatTwoDigits(num: number): string {
    return num.toString().padStart(2, '0');
}

export function toTimeCodeByDate(
    date: Date,
): '1' | '2' | '3' | '4' | '5' | null {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const totalMinutes = hours * 60 + minutes;

    // 09:30
    if (totalMinutes < 570) {
        return null;
    }

    // 10:00
    if (totalMinutes < 600) {
        return '1';
    }

    // 10:00
    if (totalMinutes < 680) {
        return '2';
    }

    // 11:20
    if (totalMinutes < 800) {
        return '3';
    }

    // 13:20
    if (totalMinutes < 870) {
        return '4';
    }

    // 14:30 이후
    return '5';
}
