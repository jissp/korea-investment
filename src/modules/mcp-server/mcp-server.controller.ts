import { Request, Response } from 'express';
import { Observable, Subject } from 'rxjs';
import {
    Body,
    Controller,
    Get,
    HttpStatus,
    MessageEvent,
    Post,
    Req,
    Res,
    Sse,
} from '@nestjs/common';
import { JsonRpcRequest, McpServerService } from './mcp-server.service';

@Controller('mcp')
export class McpServerController {
    // SSE 연결을 관리하기 위한 Subject (실제 프로덕션에서는 세션 관리 필요)
    private eventSubject = new Subject<MessageEvent>();

    constructor(private readonly mcpService: McpServerService) {}

    /**
     * Streamable HTTP: Listening for Messages [3]
     * GET 요청은 SSE 스트림을 엽니다.
     */
    @Sse()
    @Get()
    sse(@Req() req: Request): Observable<MessageEvent> {
        const sessionId = req.headers['mcp-session-id'];
        console.log(
            `SSE Connected with Session ID: ${sessionId?.toString() ?? 'unknown'}`,
        );
        return this.eventSubject.asObservable();
    }

    /**
     * Streamable HTTP: Sending Messages [2]
     * POST 요청은 JSON-RPC 메시지를 받습니다.
     */
    @Post()
    async handleIncomingMessage(
        @Body() body: JsonRpcRequest,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        if (body.method !== 'initialize') {
            const clientSessionId = req.headers['mcp-session-id'];
            if (!clientSessionId) {
                // 규약상 Session ID가 없으면 400 Bad Request 반환 가능
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .send('Missing MCP-Session-Id header');
            }
        }

        const response = await this.mcpService.handleMessage(body);
        if (response) {
            if (response.sessionId) {
                res.setHeader('MCP-Session-Id', response.sessionId);
            }

            return res.status(HttpStatus.OK).json(response.result);
        }

        return res.status(HttpStatus.ACCEPTED).send();
    }

    // (옵션) 서버에서 클라이언트로 알림을 보낼 때 사용하는 내부 메서드
    // sendNotification(method: string, params: any) {
    //     this.eventSubject.next({
    //         data: { jsonrpc: '2.0', method, params },
    //     } as MessageEvent);
    // }
}
