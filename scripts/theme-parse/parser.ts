import * as fs from 'node:fs';
import * as iconv from 'iconv-lite';

export class Parser {
    private readonly THEME_CODE_LENGTH = 3;
    private readonly STOCK_CODE_LENGTH = 10;

    /**
     * 테마코드 파일을 파싱합니다.
     * @param filePath
     */
    public parse(filePath: string) {
        const buffer = fs.readFileSync(filePath);

        const content = this.decode(buffer);

        return content
            .trim()
            .split('\n')
            .map((line) => this.parseLine(line));
    }

    /**
     * Buffer를 CP949로 디코딩합니다.
     * @param buffer
     * @private
     */
    private decode(buffer: Buffer) {
        return iconv.decode(buffer, 'cp949');
    }

    /**
     * 테마코드 라인을 파싱합니다.
     * 구조: 테마코드(0:3) + 테마명(3:-10) + 종목코드(-10:)
     * @param line
     * @private
     */
    private parseLine(line: string) {
        const themeCode = line.slice(0, this.THEME_CODE_LENGTH).trim();
        const stockCode = line.slice(-this.STOCK_CODE_LENGTH).trim();
        const themeName = line.slice(
            this.THEME_CODE_LENGTH,
            line.length - this.STOCK_CODE_LENGTH,
        ).trim();

        return [themeCode, themeName, stockCode];
    }
}
