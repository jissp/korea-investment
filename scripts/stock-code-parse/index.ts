import * as fs from 'node:fs';
import * as path from 'node:path';
import { Parser } from './parser';

interface StockCode {
    shortCode: string;
    code: string;
    name: string;
}

async function main() {
    const parser = new Parser();

    const mstFileNames = ['kosdaq_code', 'kospi_code'];

    for (const fileName of mstFileNames) {
        const filePath = path.join(__dirname, '../temp', `${fileName}.mst`);
        const codes = await parser.parse(filePath);

        const codeJson = codes.map(([shortCode, code, name]): StockCode => {
            return {
                shortCode,
                code,
                name,
            };
        });

        const outputPath = path.join(
            __dirname,
            '..',
            '..',
            'src',
            'assets',
            `${fileName}.json`,
        );

        fs.writeFileSync(outputPath, JSON.stringify(codeJson, null, 2));
    }
}

main().catch(console.error);
