import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../config/environment';
import { callInternalApi } from '../../../../utils/internalApiClient';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // 从请求体中获取活动ID
        const body = await request.json();
        const { activityId } = body;
        
        if (!activityId) {
            return NextResponse.json({
                success: false,
                message: '活动ID不能为空',
                data: null,
            }, { status: 400 });
        }

        // 使用配置文件构建API发现URL
        const baseApiUrl = buildApiUrl('getApiList');
        const apiUrl = `${baseApiUrl}&act_id=${activityId}`;
        
        console.log('正在调用API发现接口:', apiUrl);

        const backendResponse = await callInternalApi(apiUrl, {
            method: 'GET'
        });

        if (!backendResponse.ok) {
            throw new Error(`API发现接口调用失败: ${backendResponse.status} ${backendResponse.statusText}`);
        }

        const result = await backendResponse.json();
        
        // 检查后端返回的数据格式
        if (result.code !== 200) {
            return NextResponse.json({
                success: false,
                message: result.message || `API发现接口返回错误，错误代码: ${result.code}`,
                error: result.message || `错误代码: ${result.code}`,
                data: null,
            });
        }
        
        console.log(`成功获取活动ID ${activityId} 的API列表:`, {
            controller: result.data.controller,
            total: result.data.total,
            apiCount: result.data.apis.length
        });
        
        // 返回API列表数据
        return NextResponse.json({
            success: true,
            message: `成功获取活动ID ${activityId} 的API列表`,
            data: result.data,
            activityId: activityId,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('获取API列表时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '获取API列表失败',
                error: error instanceof Error ? error.message : '未知错误',
                data: null,
            },
            { status: 500 },
        );
    }
}
