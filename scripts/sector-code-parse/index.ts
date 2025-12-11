import * as fs from 'node:fs';
import { Parser } from './parser';

interface StockCode {
    shortCode: string;
    code: string;
    name: string;
}

async function main() {
    const parser = new Parser();

    const mstFileNames = [
        'idxcode',
    ];

    for (const fileName of mstFileNames) {
        const filePath = `${__dirname}/asserts/${fileName}.mst`;

        console.log(filePath);
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
