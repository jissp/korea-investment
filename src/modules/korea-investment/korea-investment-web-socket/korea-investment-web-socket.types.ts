import { CustomerType } from '@modules/korea-investment/common';

export enum SubscribeType {
    Subscribe = '1',
    Unsubscribe = '2',
}

export interface WebSocketHeader {
    approval_key: string;
    tr_type: string;
    custtype: CustomerType;
    content_type: 'utf-8';
}

export interface SubscribeRequest {
    tr_id: string;
    tr_key: string;
}

export interface BaseResponse {
    rt_cd: string;
    msg_cd: string;
    msg1: string;
    output: {
        iv: string;
        key: string;
    };
}

export interface BasePingPongMessage {
    header: string;
    body?: BaseResponse;
    timestamp: string;
}

/**
 * @example
 * {
 *   tradeId: 'H0STASP0',
 *   records: [
 *     ['005930', '72500', '100', ...],
 *     ['005930', '72400', '200', ...]
 *   ]
 * }
 */
export interface TransformResult {
    tradeId: string;
    records: string[][];
}
