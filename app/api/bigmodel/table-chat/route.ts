import { NextRequest, NextResponse } from 'next/server';
import {
    BIGMODEL_SYSTEM_PROMPT,
    buildBigModelUserContent,
    validateBigModelTableHeaders,
} from '../../../../utils/bigModelTable';

export const dynamic = 'force-dynamic';

const ZHIPU_CHAT_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

type TableChatBody = {
    tableText?: string;
    userInstruction?: string | null;
    model?: string | null;
    temperature?: number | null;
};

export async function POST(request: NextRequest) {
    const startedAt = Date.now();
    try {
        const apiKey = process.env.BIGMODEL_API_KEY?.trim();
        if (!apiKey) {
            return NextResponse.json(
                { success: false, message: '服务未配置智谱 API Key（BIGMODEL_API_KEY）' },
                { status: 503 },
            );
        }

        const body = (await request.json()) as TableChatBody;
        const tableText = typeof body.tableText === 'string' ? body.tableText : '';

        const validationError = validateBigModelTableHeaders(tableText);
        if (validationError) {
            return NextResponse.json(
                { success: false, code: validationError.code, message: validationError.message },
                { status: 400 },
            );
        }

        const userContent = buildBigModelUserContent(tableText, body.userInstruction);
        const modelFromBody =
            typeof body.model === 'string' && body.model.trim() !== '' ? body.model.trim() : null;
        const model =
            modelFromBody ?? (process.env.BIGMODEL_DEFAULT_MODEL?.trim() || 'GLM-4.7-Flash');
        const temperature =
            typeof body.temperature === 'number' && Number.isFinite(body.temperature)
                ? body.temperature
                : 1.0;

        const messages = [
            { role: 'system' as const, content: BIGMODEL_SYSTEM_PROMPT },
            { role: 'user' as const, content: userContent },
        ];

        let response: Response;
        try {
            response = await fetch(ZHIPU_CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    messages,
                    temperature,
                    stream: false,
                }),
            });
        } catch (e) {
            console.error('bigModelTableChat fetch error', e);
            return NextResponse.json({ success: false, message: '智谱请求失败' }, { status: 502 });
        }

        const raw = await response.text();
        let parsed: unknown;
        try {
            parsed = JSON.parse(raw);
        } catch {
            console.error('bigModelTableChat invalid JSON', raw.slice(0, 500));
            return NextResponse.json({ success: false, message: '智谱接口返回异常' }, { status: 502 });
        }

        if (!response.ok) {
            const errMsg =
                typeof parsed === 'object' &&
                parsed !== null &&
                'error' in parsed &&
                typeof (parsed as { error?: { message?: string } }).error?.message === 'string'
                    ? (parsed as { error: { message: string } }).error.message
                    : `HTTP ${response.status}`;
            console.error('bigModelTableChat API error', errMsg, raw.slice(0, 500));
            return NextResponse.json(
                { success: false, message: '智谱接口返回异常', detail: errMsg },
                { status: 502 },
            );
        }

        const data = parsed as {
            id?: string;
            model?: string;
            choices?: Array<{
                finish_reason?: string | null;
                message?: { content?: string | null };
            }>;
            usage?: Record<string, unknown>;
        };

        if (!data.choices || data.choices.length === 0) {
            return NextResponse.json({ success: false, message: '智谱未返回有效内容' }, { status: 502 });
        }

        const choice = data.choices[0];
        const reply = choice.message?.content ?? '';

        return NextResponse.json({
            success: true,
            data: {
                reply,
                id: data.id ?? '',
                model: data.model ?? model,
                usage: data.usage ?? {},
                finish_reason: choice.finish_reason ?? null,
                processingTimeMs: Date.now() - startedAt,
            },
        });
    } catch (error) {
        console.error('bigModelTableChat', error);
        return NextResponse.json(
            {
                success: false,
                message: '处理请求失败',
                error: error instanceof Error ? error.message : '未知错误',
            },
            { status: 500 },
        );
    }
}
