import * as fs from 'node:fs';
import * as path from 'node:path';
import { Parser } from './parser';

interface ThemeCode {
    themeCode: string;
    themeName: string;
    stockCode: string;
}

function main() {
    const parser = new Parser();
    const tempDir = path.join(__dirname, '../temp');

    try {
        // 파일 파싱
        const filePath = path.join(tempDir, 'theme_code.mst');
        const themeCodes = parser.parse(filePath);

        const codeJson = themeCodes.map(
            ([themeCode, themeName, stockCode]): ThemeCode => {
                return {
                    themeCode,
                    themeName,
                    stockCode,
                };
            },
        );

        // JSON 저장
        const outputPath = path.join(
            __dirname,
            '..',
            '..',
            'src',
            'assets',
            'theme_code.json',
        );

        fs.writeFileSync(outputPath, JSON.stringify(codeJson, null, 2));
        console.log(`Successfully saved theme codes to ${outputPath}`);
    } catch (error) {
        console.error('Error processing theme codes:', error);
        throw error;
    }
}

main();
