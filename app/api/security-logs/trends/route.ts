import { NextRequest, NextResponse } from 'next/server';
import { callInternalApi } from '../../../../utils/internalApiClient';
import { buildApiUrl } from '../../../../config/environment';

export const dynamic = 'force-dynamic';

/**
 * 获取安全日志趋势数据
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { 
            start_date = '', 
            end_date = '',
            interval = 'hour'
        } = body;
        
        console.log('获取安全日志趋势请求参数:', {
            start_date,
            end_date,
            interval
        });

        // 构建API URL
        const apiUrl = buildApiUrl('getSecurityTrends');
        
        const response = await callInternalApi(apiUrl, {
            method: 'POST',
            body: {
                start_date,
                end_date,
                interval
            }
        });

        if (!response.ok) {
            throw new Error(`安全日志趋势接口调用失败: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        console.log('趋势数据后端原始响应:', JSON.stringify(result, null, 2));
        
        if (result.code !== 0) {
            return NextResponse.json({
                success: false,
                message: result.msg || result.message || `安全日志趋势接口返回错误，错误代码: ${result.code}`,
                error: result.msg || result.message || `错误代码: ${result.code}`,
                data: null,
            });
        }

        // 更灵活地处理后端数据格式
        let trendsArray = [];
        
        if (result.data) {
            // 尝试不同的数据结构
            if (Array.isArray(result.data.timeline)) {
                trendsArray = result.data.timeline;
            } else if (Array.isArray(result.data.trends)) {
                trendsArray = result.data.trends;
            } else if (Array.isArray(result.data.list)) {
                trendsArray = result.data.list;
            } else if (Array.isArray(result.data)) {
                trendsArray = result.data;
            } else {
                console.log('未识别的趋势数据结构:', result.data);
            }
        }
        
        console.log('解析出的趋势数组:', trendsArray);

        // 确保数据格式正确
        const processedData = trendsArray.map((item: any) => ({
            time: item.time,
            total_count: Number(item.total_count) || 0,
            high_risk_count: Number(item.high_risk_count) || 0,
            medium_risk_count: Number(item.medium_risk_count) || 0,
            low_risk_count: Number(item.low_risk_count) || 0
        }));
        
        console.log(`成功获取安全日志趋势数据，共 ${processedData.length} 个时间点`);
        
        return NextResponse.json({
            success: true,
            message: '成功获取安全日志趋势数据',
            data: processedData, // 直接返回数组，而不是包装在对象中
        });
    } catch (error) {
        console.error('获取安全日志趋势时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '获取安全日志趋势失败',
                error: error instanceof Error ? error.message : '未知错误',
                data: null,
            },
            { status: 500 },
        );
    }
}
