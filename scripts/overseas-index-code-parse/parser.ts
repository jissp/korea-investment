import * as iconv from 'iconv-lite';
import * as fs from 'node:fs';

export interface OverseasIndexData {
    구분코드: string;
    심볼: string;
    영문명: string;
    한글명: string;
    종목업종코드: string;
    다우30편입종목여부: string;
    나스닥100편입종목여부: string;
    SP500편입종목여부: string;
    거래소코드: string;
    국가구분코드: string;
}

export class Parser {
    public async parse(filePath: string): Promise<OverseasIndexData[]> {
        const buffer = fs.readFileSync(filePath);
        const content = this.decode(buffer);

        return content
            .trim()
            .split('\n')
            .map((line) => this.parseLine(line));
    }

    /**
     * Buffer를 CP949로 디코딩
     * @param buffer
     * @private
     */
    private decode(buffer: Buffer): string {
        return iconv.decode(buffer, 'cp949');
    }

    /**
     * 각 라인을 파싱하여 OverseasIndexData 객체로 변환
     * Python 코드 로직:
     * - 'X'로 시작하는 행: [0:1], [1:11], [11:40], [40:80], 마지막 15자
     * - 일반 행: [0:1], [1:11], [11:50], [50:75], 마지막 15자
     * @param line
     * @private
     */
    private parseLine(line: string): OverseasIndexData {
        const isXType = line[0] === 'X';

        // Part 1: 기본 정보
        let 구분코드: string;
        let 심볼: string;
        let 영문명: string;
        let 한글명: string;

        if (isXType) {
            // 'X'로 시작하는 행의 경우
            const mainPart = line.slice(0, line.length - 14);
            구분코드 = mainPart.slice(0, 1);
            심볼 = mainPart.slice(1, 11);
            영문명 = mainPart.slice(11, 40).replace(/,/g, '');
            한글명 = mainPart.slice(40, 80).replace(/,/g, '');
        } else {
            // 일반 행의 경우
            const mainPart = line.slice(0, line.length - 14);
            구분코드 = mainPart.slice(0, 1);
            심볼 = mainPart.slice(1, 11);
            영문명 = mainPart.slice(11, 50).replace(/,/g, '');
            한글명 = line.slice(50, 75).replace(/,/g, '');
        }

        // Part 2: 마지막 15자 (14자 + 개행문자)
        // 종목업종코드(4) + 다우30(1) + 나스닥100(1) + S&P500(1) + 거래소코드(4) + 국가구분코드(3) = 14자
        const suffixPart = line.slice(-15).trim();

        const 종목업종코드Raw = suffixPart.slice(0, 4);
        const 다우30편입종목여부Raw = suffixPart.slice(4, 5);
        const 나스닥100편입종목여부Raw = suffixPart.slice(5, 6);
        const SP500편입종목여부Raw = suffixPart.slice(6, 7);
        const 거래소코드 = suffixPart.slice(7, 11);
        const 국가구분코드 = suffixPart.slice(11, 14);

        // 정규식으로 정리 (Python 코드와 동일)
        const 종목업종코드 = 종목업종코드Raw.replace(/[^A-Z]/g, '');
        const 다우30편입종목여부 = 다우30편입종목여부Raw.replace(/[^0-1]/g, '');
        const 나스닥100편입종목여부 = 나스닥100편입종목여부Raw.replace(
            /[^0-1]/g,
            '',
        );
        const SP500편입종목여부 = SP500편입종목여부Raw.replace(/[^0-1]/g, '');

        return {
            구분코드: 구분코드.trim(),
            심볼: 심볼.trim(),
            영문명: 영문명.trim(),
            한글명: 한글명.trim(),
            종목업종코드: 종목업종코드.trim(),
            다우30편입종목여부: 다우30편입종목여부.trim(),
            나스닥100편입종목여부: 나스닥100편입종목여부.trim(),
            SP500편입종목여부: SP500편입종목여부.trim(),
            거래소코드: 거래소코드.trim(),
            국가구분코드: 국가구분코드.trim(),
        };
    }
}
