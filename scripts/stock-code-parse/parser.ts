import * as iconv from 'iconv-lite';
import * as fs from 'node:fs';

export class Parser {
    private readonly SUFFIX_LENGTH = 228;
    private readonly FIELD1_LENGTH = 9;
    private readonly FIELD2_LENGTH = 12;

    public async parse(filePath: string) {
        const buffer = fs.readFileSync(filePath);

        const content = this.decode(buffer);

        return content
            .trim()
            .split('\n')
            .map((line) => this.parseLine(line));
    }

    /**
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
        const content = line.slice(0, line.length - this.SUFFIX_LENGTH);

        const field1 = content.slice(0, this.FIELD1_LENGTH);
        const field2 = content.slice(
            this.FIELD1_LENGTH,
            this.FIELD1_LENGTH + this.FIELD2_LENGTH,
        );
        const field3 = content.slice(this.FIELD1_LENGTH + this.FIELD2_LENGTH);
        return [field1, field2, field3].map((v) => v.trim());
    }
}
