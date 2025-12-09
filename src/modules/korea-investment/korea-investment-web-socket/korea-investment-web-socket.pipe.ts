import * as _ from 'lodash';
import { Injectable, PipeTransform } from '@nestjs/common';
import { Nullable } from '@common/types';

interface SplitFieldsResult {
    isEncrypted: boolean;
    tradeId: string;
    dataLength: number;
    dataContent: string;
}

interface TransformResult {
    tradeId: string;
    records: string[][];
}

/**
 *
 */
@Injectable()
export class KoreaInvestmentWebSocketPipe implements PipeTransform<
    string,
    TransformResult
> {
    transform(message: string): TransformResult {
        return this.parse(message);
    }

    /**
     * @param message
     * @private
     */
    private parse(message: string): TransformResult {
        const dataContent = this.splitFields(message);
        if (!dataContent) {
            throw new Error(`Invalid message format: ${message}`);
        }

        return {
            tradeId: dataContent.tradeId,
            records: this.toRecords(dataContent),
        };
    }

    /**
     * @param data
     * @private
     */
    private splitFields(data: string): Nullable<SplitFieldsResult> {
        const [rawIsEncrypted, tradeId, rawDataLength, dataContent] =
            data.split('|');

        const isEncrypted = rawIsEncrypted === '1';
        const dataLength = Number(rawDataLength);

        if (isNaN(dataLength) || dataLength <= 0 || !dataContent) {
            return null;
        }

        return {
            isEncrypted,
            tradeId,
            dataLength,
            dataContent,
        };
    }

    /**
     * @param dataContent
     * @param dataLength
     * @private
     */
    private toRecords({
        dataContent,
        dataLength,
    }: Pick<SplitFieldsResult, 'dataContent' | 'dataLength'>) {
        const splitDataContent = dataContent.split('^');
        const recordFieldCount = splitDataContent.length / dataLength;

        return _.chunk(splitDataContent, recordFieldCount);
    }
}
