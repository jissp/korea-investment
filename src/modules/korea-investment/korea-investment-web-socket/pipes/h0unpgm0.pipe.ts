import { Pipe } from '@common/types';
import { H0unpgm0Data } from '../types/h0unpgm0.types';

/**
 * 국내주식 실시간프로그램매매 (통합)
 *
 * @see https://apiportal.koreainvestment.com/apiservice-apiservice?/tryitout/H0UNPGM0
 */
export class H0unpgm0Pipe implements Pipe<string[], H0unpgm0Data> {
    public transform(value: string[]): H0unpgm0Data {
        const [
            MKSC_SHRN_ISCD,
            STCK_CNTG_HOUR,
            SELN_CNQN,
            SELN_TR_PBMN,
            SHNU_CNQN,
            SHNU_TR_PBMN,
            NTBY_CNQN,
            NTBY_TR_PBMN,
            SELN_RSQN,
            SHNU_RSQN,
            WHOL_NTBY_QTY,
        ] = value;

        return {
            MKSC_SHRN_ISCD,
            STCK_CNTG_HOUR,
            SELN_CNQN,
            SELN_TR_PBMN,
            SHNU_CNQN,
            SHNU_TR_PBMN,
            NTBY_CNQN,
            NTBY_TR_PBMN,
            SELN_RSQN,
            SHNU_RSQN,
            WHOL_NTBY_QTY,
        };
    }
}
