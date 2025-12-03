import * as iconv from 'iconv-lite';
import * as fs from 'node:fs';

export class Parser {
    private readonly SUFFIX_LENGTH = 228;
    private readonly FIELD1_LENGTH = 5;
    private readonly FIELD2_LENGTH = 43;

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
        // const content = line.slice(0, line.length - this.SUFFIX_LENGTH);
        //
        const field1 = line.slice(1, this.FIELD1_LENGTH);
        const field2 = line.slice(
            this.FIELD1_LENGTH,
            this.FIELD2_LENGTH,
        );
        return [field1, field2].map((v) => v.trim());
    }
}
