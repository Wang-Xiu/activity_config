import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../config/environment';
import { callInternalApi } from '../../../../utils/internalApiClient';
import { stripLlmJsonFence } from '../../../../utils/llmJsonExtract';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const actId = typeof body.act_id === 'string' ? body.act_id.trim() : '';
        const materialRaw = typeof body.material === 'string' ? body.material : '';
        const operator =
            typeof body.operator === 'string' ? body.operator.trim() : '';

        if (!actId) {
            return NextResponse.json({ success: false, message: '活动ID不能为空' }, { status: 400 });
        }
        if (!materialRaw.trim()) {
            return NextResponse.json({ success: false, message: '物料内容不能为空' }, { status: 400 });
        }
        if (!operator) {
            return NextResponse.json(
                { success: false, message: '缺少操作者 operator（请传当前登录用户昵称）' },
                { status: 400 },
            );
        }

        const materialJson = stripLlmJsonFence(materialRaw);
        let materialList: unknown;
        try {
            materialList = JSON.parse(materialJson);
        } catch {
            return NextResponse.json(
                { success: false, message: '物料内容不是合法 JSON，请先修正生成结果' },
                { status: 400 },
            );
        }

        const apiUrl = buildApiUrl('saveMaterial');
        /** PHP act-common/save-material */
        const postData = {
            act_id: actId,
            material_list: materialList,
            operator,
        };

        const backendResponse = await callInternalApi(apiUrl, {
            method: 'POST',
            body: postData,
        });

        if (!backendResponse.ok) {
            throw new Error(`后端API调用失败: ${backendResponse.status} ${backendResponse.statusText}`);
        }

        const result = await backendResponse.json();

        if (result.code !== 0) {
            return NextResponse.json({
                success: false,
                message: result.msg || result.message || '保存物料失败',
                code: result.code,
            });
        }

        return NextResponse.json({
            success: true,
            message: result.msg || '保存成功',
            data: result.data,
        });
    } catch (error) {
        console.error('save-material', error);
        return NextResponse.json(
            {
                success: false,
                message: '保存物料失败',
                error: error instanceof Error ? error.message : '未知错误',
            },
            { status: 500 },
        );
    }
}
