import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as AdmZip from 'adm-zip';

const DOWNLOAD_FILES = [
    {
        fileName: 'idxcode.mst.zip',
        url: 'https://new.real.download.dws.co.kr/common/master/idxcode.mst.zip',
    },
    {
        fileName: 'kospi_code.mst.zip',
        url: 'https://new.real.download.dws.co.kr/common/master/kospi_code.mst.zip',
    },
    {
        fileName: 'kosdaq_code.mst.zip',
        url: 'https://new.real.download.dws.co.kr/common/master/kosdaq_code.mst.zip',
    },
    {
        fileName: 'nasmst.cod.zip',
        url: 'https://new.real.download.dws.co.kr/common/master/nasmst.cod.zip',
    },
    {
        fileName: 'nysmst.cod.zip',
        url: 'https://new.real.download.dws.co.kr/common/master/nysmst.cod.zip',
    },
    {
        fileName: 'amsmst.cod.zip',
        url: 'https://new.real.download.dws.co.kr/common/master/amsmst.cod.zip',
    },
];

class StockDownloader {
    private readonly tempDir = path.join(__dirname, '../temp');

    constructor() {}

    /**
     * 파일을 저장합니다.
     * @param url
     * @param fileName
     */
    public async download(url: string, fileName: string) {
        const zipPath = this.getZipPath(fileName);

        const response = await axios.get(url, {
            responseType: 'arraybuffer',
        });

        fs.writeFileSync(zipPath, response.data);
        console.log(`Saved ${fileName} to ${zipPath}`);
    }

    /**
     * 파일을 압축 해제합니다.
     * @param fileName
     */
    public unzip(fileName: string) {
        const zip = new AdmZip(this.getZipPath(fileName));
        zip.extractAllTo(this.tempDir, true);
        console.log(`Unzipped ${fileName}`);
    }

    /**
     * 파일 경로를 반환합니다.
     * @param fileName
     * @private
     */
    private getZipPath(fileName: string) {
        return path.join(this.tempDir, fileName);
    }
}

async function main() {
    const stockDownloader = new StockDownloader();

    for (const { fileName, url } of DOWNLOAD_FILES) {
        await stockDownloader.download(url, fileName);

        stockDownloader.unzip(fileName);
    }
}

main().catch(console.error);
