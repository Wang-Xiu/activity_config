import { NextResponse } from 'next/server';
import { callInternalApi } from '../../../../utils/internalApiClient';
import { buildApiUrl } from '../../../../config/environment';
import { SecurityApiResponse, BannedIPsResponse, BannedIPEntry } from '../../../../types/security-logs';

export const dynamic = 'force-dynamic';

/**
 * 获取已封禁IP列表
 * POST /api/security-logs/banned-ips
 * 
 * 后端接口：
 * - 路径: ?r=activity/act-common/get-black-ip-list
 * - 方法: POST
 * - 无请求参数
 */
export async function POST(request: Request) {
    try {
        console.log('获取封禁IP列表请求');

        // 构建API URL
        const apiUrl = buildApiUrl('getBlackIpList');

        console.log('调用后端API获取封禁IP列表:', apiUrl);

        // 调用后端API - 无请求参数
        const response = await callInternalApi(apiUrl, {
            method: 'POST',
            body: {}
        });

        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('后端API响应:', result);

        // 兼容 code: 0 和 code: 200 两种成功状态
        if (result.code === 0 || result.code === 200 || result.success === true) {
            // 转换数据格式
            const bannedIPs: BannedIPEntry[] = (result.data?.list || result.data || []).map((item: any) => ({
                ip: item.ip || '',
                banned_at: item.banned_at || item.ban_time || item.created_at || new Date().toISOString(),
                reason: item.reason || item.ban_reason || '恶意攻击',
                ban_command: item.ban_command || item.command || `iptables -A INPUT -s ${item.ip} -j DROP`,
                attack_count: item.attack_count || item.count || 0,
                country: item.country || undefined,
                city: item.city || undefined
            }));

            const apiResponse: SecurityApiResponse<BannedIPsResponse> = {
                code: 200,
                msg: result.msg || '成功',
                data: {
                    banned_ips: bannedIPs,
                    total: result.data?.total || bannedIPs.length
                },
                success: true
            };

            console.log('✅ 封禁IP列表获取成功，共', bannedIPs.length, '条记录');
            return NextResponse.json(apiResponse);
        } else {
            console.error('❌ 后端API返回错误:', result);
            return NextResponse.json({
                code: result.code || 500,
                msg: result.msg || '获取封禁IP列表失败',
                data: {
                    banned_ips: [],
                    total: 0
                },
                success: false
            });
        }
    } catch (error: any) {
        console.error('获取封禁IP列表失败:', error);
        
        return NextResponse.json({
            code: 500,
            msg: error.message || '服务器内部错误',
            data: {
                banned_ips: [],
                total: 0
            },
            success: false
        }, { status: 500 });
    }
}

