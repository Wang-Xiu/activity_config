import { NextRequest, NextResponse } from 'next/server';
import { callInternalApi } from '../../../../utils/internalApiClient';
import { buildApiUrl } from '../../../../config/environment';

export const dynamic = 'force-dynamic';

/**
 * 获取安全日志统计数据
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { 
            start_date = '', 
            end_date = ''
        } = body;
        
        console.log('获取安全日志统计请求参数:', {
            start_date,
            end_date
        });

        // 构建API URL
        const apiUrl = buildApiUrl('getSecurityStatistics');
        
        const response = await callInternalApi(apiUrl, {
            method: 'POST',
            body: {
                start_date,
                end_date
            }
        });

        if (!response.ok) {
            throw new Error(`安全日志统计接口调用失败: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.code !== 0) {
            return NextResponse.json({
                success: false,
                message: result.msg || result.message || `安全日志统计接口返回错误，错误代码: ${result.code}`,
                error: result.msg || result.message || `错误代码: ${result.code}`,
                data: null,
            });
        }

        // 确保数据格式正确
        const processedData = {
            malicious_requests: result.data.malicious_requests || 0,
            unique_attack_ips: result.data.unique_attack_ips || 0,
            today_attacks: result.data.today_attacks || 0,
            high_risk_attacks: result.data.high_risk_attacks || 0,
            status_distribution: result.data.status_distribution || {},
            method_distribution: result.data.method_distribution || {},
            threat_distribution: result.data.threat_distribution || { high: 0, medium: 0, low: 0 },
            attack_trends: result.data.attack_trends || { today: 0, yesterday: 0, growth_rate: 0 }
        };
        
        console.log('成功获取安全日志统计数据:', processedData);
        
        return NextResponse.json({
            success: true,
            message: '成功获取安全日志统计数据',
            data: processedData,
        });
    } catch (error) {
        console.error('获取安全日志统计时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '获取安全日志统计失败',
                error: error instanceof Error ? error.message : '未知错误',
                data: null,
            },
            { status: 500 },
        );
    }
}
