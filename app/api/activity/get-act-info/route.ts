import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../config/environment';
import { callInternalApi } from '../../../../utils/internalApiClient';
import type { ActInfoBackendResponse } from '../../../../types/act-material';

export const dynamic = 'force-dynamic';

/**
 * 与 get-act-user-type 一致：PHP act-common 多数从 POST 读参，且 URL 需带 sig/ts（callInternalApi 已处理）
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const actId = typeof body.act_id === 'string' ? body.act_id.trim() : '';

        if (!actId) {
            return NextResponse.json({ success: false, message: '缺少 act_id' }, { status: 400 });
        }

        const baseApiUrl = buildApiUrl('getActInfo');
        const apiUrl = `${baseApiUrl}&act_id=${encodeURIComponent(actId)}`;

        const backendResponse = await callInternalApi(apiUrl, {
            method: 'POST',
            body: { act_id: actId },
        });

        if (!backendResponse.ok) {
            let detail = '';
            try {
                detail = (await backendResponse.text()).slice(0, 500);
            } catch {
                /* ignore */
            }
            console.error('get-act-info backend', backendResponse.status, detail);
            throw new Error(`后端API调用失败: ${backendResponse.status} ${backendResponse.statusText}`);
        }

        const result = (await backendResponse.json()) as ActInfoBackendResponse;

        if (result.code !== 0) {
            return NextResponse.json({
                success: false,
                message: result.msg || '获取活动信息失败',
                code: result.code,
            });
        }

        return NextResponse.json({
            success: true,
            message: result.msg || 'success',
            data: result.data,
        });
    } catch (error) {
        console.error('get-act-info', error);
        return NextResponse.json(
            {
                success: false,
                message: '获取活动信息失败',
                error: error instanceof Error ? error.message : '未知错误',
            },
            { status: 500 },
        );
    }
}
