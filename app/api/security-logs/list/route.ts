import { NextRequest, NextResponse } from 'next/server';
import { callInternalApi } from '../../../../utils/internalApiClient';
import { buildApiUrl } from '../../../../config/environment';

export const dynamic = 'force-dynamic';

/**
 * 获取安全日志列表
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { 
            page = 1, 
            page_size = 20, 
            start_date = '', 
            end_date = '',
            ip = '',
            method = '',
            status = '',
            threat_level = '',
            path_keyword = '',
            sort_field = 'log_time',
            sort_order = 'desc'
        } = body;
        
        console.log('获取安全日志列表请求参数:', {
            page,
            page_size,
            start_date,
            end_date,
            ip,
            method,
            status,
            threat_level,
            path_keyword,
            sort_field,
            sort_order
        });

        // 构建API URL
        const apiUrl = buildApiUrl('getSecurityLogs');
        
        const response = await callInternalApi(apiUrl, {
            method: 'POST',
            body: {
                page,
                page_size,
                start_date,
                end_date,
                ip,
                method,
                status,
                threat_level,
                path_keyword,
                sort_field,
                sort_order
            }
        });

        if (!response.ok) {
            throw new Error(`安全日志列表接口调用失败: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.code !== 0) {
            return NextResponse.json({
                success: false,
                message: result.msg || result.message || `安全日志列表接口返回错误，错误代码: ${result.code}`,
                error: result.msg || result.message || `错误代码: ${result.code}`,
                data: null,
            });
        }

        let processedData = result.data;
        if (processedData && processedData.list) {
            // 确保list是数组
            if (!Array.isArray(processedData.list)) {
                processedData = {
                    ...processedData,
                    list: [processedData.list]
                };
            }
            
            // 处理数据格式，确保字段完整
            processedData.list = processedData.list.map((item: any) => ({
                id: item.id,
                log_time: item.log_time,
                ip: item.ip,
                method: item.method,
                path: item.path,
                status: item.status,
                other: item.other || '',
                created_at: item.created_at,
                threat_level: item.threat_level || 'low',
                threat_type: item.threat_type || 'other',
                country: item.country || '',
                city: item.city || ''
            }));
        }
        
        console.log(`成功获取安全日志列表，共 ${processedData?.list?.length || 0} 条记录`);
        
        return NextResponse.json({
            success: true,
            message: '成功获取安全日志列表',
            data: processedData,
        });
    } catch (error) {
        console.error('获取安全日志列表时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '获取安全日志列表失败',
                error: error instanceof Error ? error.message : '未知错误',
                data: null,
            },
            { status: 500 },
        );
    }
}
