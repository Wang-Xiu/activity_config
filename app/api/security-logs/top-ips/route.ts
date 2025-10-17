import { NextRequest, NextResponse } from 'next/server';
import { callInternalApi } from '../../../../utils/internalApiClient';
import { buildApiUrl } from '../../../../config/environment';

export const dynamic = 'force-dynamic';

/**
 * 获取Top攻击IP列表
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { 
            start_date = '', 
            end_date = '',
            limit = 10
        } = body;
        
        console.log('获取Top攻击IP请求参数:', {
            start_date,
            end_date,
            limit
        });

        // 构建API URL
        const apiUrl = buildApiUrl('getTopAttackIPs');
        
        const response = await callInternalApi(apiUrl, {
            method: 'POST',
            body: {
                start_date,
                end_date,
                limit
            }
        });

        if (!response.ok) {
            throw new Error(`Top攻击IP接口调用失败: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        console.log('Top攻击IP后端原始响应:', JSON.stringify(result, null, 2));
        
        if (result.code !== 0) {
            return NextResponse.json({
                success: false,
                message: result.msg || result.message || `Top攻击IP接口返回错误，错误代码: ${result.code}`,
                error: result.msg || result.message || `错误代码: ${result.code}`,
                data: null,
            });
        }

        // 更灵活地处理后端数据格式
        let topIpsArray = [];
        
        if (result.data) {
            // 尝试不同的数据结构
            if (Array.isArray(result.data.top_ips)) {
                topIpsArray = result.data.top_ips;
            } else if (Array.isArray(result.data.list)) {
                topIpsArray = result.data.list;
            } else if (Array.isArray(result.data)) {
                topIpsArray = result.data;
            } else {
                console.log('未识别的数据结构:', result.data);
            }
        }
        
        console.log('解析出的IP数组:', topIpsArray);

        // 确保数据格式正确
        const processedData = topIpsArray.map((item: any) => ({
            ip: item.ip,
            count: Number(item.count) || 0,
            country: item.country || '',
            city: item.city || '',
            threat_level: item.threat_level || 'low',
            first_seen: item.first_seen,
            last_seen: item.last_seen
        }));
        
        console.log(`成功获取Top攻击IP数据，共 ${processedData.length} 个IP`);
        
        return NextResponse.json({
            success: true,
            message: '成功获取Top攻击IP数据',
            data: processedData, // 直接返回数组，而不是包装在对象中
        });
    } catch (error) {
        console.error('获取Top攻击IP时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '获取Top攻击IP失败',
                error: error instanceof Error ? error.message : '未知错误',
                data: null,
            },
            { status: 500 },
        );
    }
}
