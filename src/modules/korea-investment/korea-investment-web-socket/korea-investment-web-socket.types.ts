import { CustomerType } from '@modules/korea-investment/common';

export interface WebSocketHeader {
    approval_key: string;
    tr_type: string;
    custtype: CustomerType;
    content_type: 'utf-8';
}

export enum SubscribeType {
    Subscribe = '1',
    Unsubscribe = '0',
}

export interface SubscribeRequest {
    tr_id: string;
    tr_key: string;
}

export interface BaseRealityMessage {
    type: 'non-json';
    raw: string;
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
