import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../../config/environment';
import { callInternalApi } from '../../../../../utils/internalApiClient';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // 从查询参数获取 act_id
        const { searchParams } = new URL(request.url);
        const act_id = searchParams.get('act_id');
        
        if (!act_id) {
            return NextResponse.json({
                success: false,
                message: '活动ID不能为空',
            }, { status: 400 });
        }

        // 构建API URL，将 act_id 添加到 URL 参数中
        const baseApiUrl = buildApiUrl('checkActUserSpend');
        const apiUrl = `${baseApiUrl}&act_id=${act_id}`;

        const backendResponse = await callInternalApi(apiUrl, {
            method: 'GET',
        });

        if (!backendResponse.ok) {
            throw new Error(`后端API调用失败: ${backendResponse.status} ${backendResponse.statusText}`);
        }

        const responseText = await backendResponse.text();
        
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            return NextResponse.json({
                success: false,
                message: '后端返回的数据格式不正确（不是有效的JSON）',
                error: `JSON解析失败: ${parseError instanceof Error ? parseError.message : '未知错误'}`,
            }, { status: 500 });
        }
        
        // 检查后端返回的数据格式 - PHP后端使用code字段，0表示成功
        if (result.code !== undefined && result.code !== 0) {
            return NextResponse.json({
                success: false,
                message: result.msg || result.message || `获取用户充值和积分数据失败，错误代码: ${result.code}`,
                error: result.msg || result.message || `错误代码: ${result.code}`,
            });
        }

        // 提取数据 - 数据结构: result.data.data
        let extractedData: any[] = [];
        if (result.data?.data && Array.isArray(result.data.data)) {
            extractedData = result.data.data;
        } else if (result.data && Array.isArray(result.data)) {
            extractedData = result.data;
        } else if (Array.isArray(result)) {
            extractedData = result;
        }
        
        return NextResponse.json({
            success: true,
            message: '用户充值和积分数据获取成功',
            data: extractedData,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('获取用户充值和积分数据时出错:', error);
        
        return NextResponse.json({
            success: false,
            message: '获取用户充值和积分数据失败: ' + (error instanceof Error ? error.message : '未知错误'),
            error: error instanceof Error ? error.message : '未知错误',
        }, { status: 500 });
    }
}

