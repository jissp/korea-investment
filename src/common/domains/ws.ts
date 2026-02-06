import * as ws from 'ws';
import { Server } from 'socket.io';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { Nullable } from '@common/types';

export function disconnect(socket: Nullable<ws>) {
    if (!socket) {
        return;
    }

    try {
        socket.removeAllListeners();
        socket.close();
    } catch (error) {
        // 로깅 또는 재시도 로직
        console.error('Failed to disconnect WebSocket:', error);
    }
}

export function isConnected(socket: Nullable<ws>): socket is ws {
    return !isNil(socket) && socket.readyState === WebSocket.OPEN;
}

export function isEmptyConnectedSocket(server: Server) {
    return (server.sockets.sockets?.size ?? 0) === 0;
}
