import * as fs from 'node:fs';
import * as iconv from 'iconv-lite';

export class Parser {
    private readonly FIELD1_LENGTH = 5;
    private readonly FIELD2_LENGTH = 43;

    /**
     * 섹터코드 파일을 파싱합니다.
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
     * @param line
     * @private
     */
    private parseLine(line: string) {
        const field1 = line.slice(1, this.FIELD1_LENGTH);
        const field2 = line.slice(this.FIELD1_LENGTH, this.FIELD2_LENGTH);

        return [field1, field2].map((v) => v.trim());
    }
}
