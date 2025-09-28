import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../config/environment';
import { callInternalApi } from '../../../../utils/internalApiClient';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // 从请求体中获取参数
        const body = await request.json();
        const { act_id } = body;
        
        if (!act_id) {
            return NextResponse.json({
                success: false,
                message: '活动ID不能为空',
            }, { status: 400 });
        }

        // 构建API URL
        const apiUrl = buildApiUrl('delRedisData');
        
        // 准备POST数据
        const postData = {
            act_id: act_id
        };
        
        console.log('正在调用删除Redis缓存API:', apiUrl);
        console.log('POST参数:', postData);

        const backendResponse = await callInternalApi(apiUrl, {
            method: 'POST',
            body: postData,
        });

        if (!backendResponse.ok) {
            throw new Error(`后端API调用失败: ${backendResponse.status} ${backendResponse.statusText}`);
        }

        const result = await backendResponse.json();
        
        // 检查后端返回的数据格式 - PHP后端使用code字段，0表示成功
        if (result.code !== 0) {
            // 后端业务错误，返回具体错误信息，但HTTP状态码为200
            return NextResponse.json({
                success: false,
                message: result.msg || result.message || `删除Redis缓存失败，错误代码: ${result.code}`,
                error: result.msg || result.message || `错误代码: ${result.code}`,
            });
        }

        return NextResponse.json({
            success: true,
            message: '已清空redis数据',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('删除Redis缓存时出错:', error);
        
        return NextResponse.json({
            success: false,
            message: '删除Redis缓存失败',
            error: error instanceof Error ? error.message : '未知错误',
        }, { status: 500 });
    }
}