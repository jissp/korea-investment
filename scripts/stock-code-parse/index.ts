import { StockParser } from './stock-parser';
import * as fs from 'node:fs';

interface StockCode {
    shortCode: string;
    code: string;
    name: string;
}

async function main() {
    const parser = new StockParser();

    const mstFileNames = [
        'kosdaq_code',
        'kospi_code',
        'nxt_kosdaq_code',
        'nxt_kospi_code',
    ];

    for (const fileName of mstFileNames) {
        const filePath = `${__dirname}/asserts/${fileName}.mst`;
        const codes = await parser.parse(filePath);

        const codeJson = codes.map(([shortCode, code, name]): StockCode => {
            return {
                shortCode,
                code,
                name,
            };
        });

        fs.writeFileSync(
            `src/assets/${fileName}.json`,
            JSON.stringify(codeJson, null, 2),
        );
    }
}

main().catch(console.error);
