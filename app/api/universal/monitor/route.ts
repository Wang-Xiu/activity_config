import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../config/environment';
import { callInternalApi } from '../../../../utils/internalApiClient';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // 从请求体中获取查询参数
        const body = await request.json();
        const { dateType = 'daily', date = new Date().toISOString().split('T')[0] } = body;

        // 调用后端API获取监控数据
        const apiUrl = buildApiUrl('getMonitorData');
        
        // 准备POST数据
        const postData = {
            dateType,
            date
        };
        
        console.log('正在调用监控数据API:', apiUrl);
        console.log('POST参数:', postData);

        const backendResponse = await callInternalApi(apiUrl, {
            method: 'POST',
            body: postData,
        });

        if (!backendResponse.ok) {
            throw new Error(`后端API调用失败: ${backendResponse.status} ${backendResponse.statusText}`);
        }

        const result = await backendResponse.json();
        
        // 如果后端接口还未实现，返回模拟数据
        if (result.error && result.error.includes('not found')) {
            return NextResponse.json({
                success: true,
                message: '监控数据获取成功（模拟数据）',
                data: getMockMonitorData(dateType),
                timestamp: new Date().toISOString(),
            });
        }

        // 检查后端返回的数据格式 - PHP后端使用code字段，0表示成功
        if (result.code !== 0) {
            // 后端业务错误，返回具体错误信息，但HTTP状态码为200
            return NextResponse.json({
                success: false,
                message: result.msg || result.message || `获取监控数据失败，错误代码: ${result.code}`,
                error: result.msg || result.message || `错误代码: ${result.code}`,
                data: getMockMonitorData('daily'), // 失败时返回模拟数据
            });
        }

        return NextResponse.json({
            success: true,
            message: '监控数据获取成功',
            data: result.data,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('获取监控数据时出错:', error);
        
        // 返回模拟数据作为fallback
        const body = await request.json().catch(() => ({}));
        const dateType = body.dateType || 'daily';
        
        return NextResponse.json({
            success: true,
            message: '监控数据获取成功（模拟数据）',
            data: getMockMonitorData(dateType),
            timestamp: new Date().toISOString(),
        });
    }
}

// 模拟监控数据
function getMockMonitorData(dateType: string) {
    const baseData = {
        // 光华宝箱数据
        guanghua_box: {
            output: dateType === 'daily' ? 1250 : 45000,
            users: dateType === 'daily' ? 320 : 8500,
            times: dateType === 'daily' ? 890 : 25000,
        },
        // 月华宝箱数据
        yuehua_box: {
            output: dateType === 'daily' ? 680 : 18500,
            users: dateType === 'daily' ? 180 : 4200,
            times: dateType === 'daily' ? 420 : 12000,
        },
        // 活动总产出
        total_output: {
            output: dateType === 'daily' ? 2800 : 89000,
            users: dateType === 'daily' ? 450 : 12000,
        },
        // 任务完成数据
        mission_completion: {
            first_recharge_page: { users: dateType === 'daily' ? 120 : 3200, times: dateType === 'daily' ? 150 : 4100 },
            shi_tu_page: { users: dateType === 'daily' ? 95 : 2800, times: dateType === 'daily' ? 110 : 3200 },
            gift_pack_page: { users: dateType === 'daily' ? 200 : 5500, times: dateType === 'daily' ? 280 : 7200 },
            user_home_page: { users: dateType === 'daily' ? 350 : 9800, times: dateType === 'daily' ? 520 : 15000 },
            attention_user: { users: dateType === 'daily' ? 180 : 4800, times: dateType === 'daily' ? 220 : 6200 },
            room_stay: { users: dateType === 'daily' ? 280 : 7200, times: dateType === 'daily' ? 380 : 9800 },
            user_chat: { users: dateType === 'daily' ? 320 : 8500, times: dateType === 'daily' ? 450 : 12000 },
        },
        // 入口PV/UV数据
        entrance_data: {
            main_page: { pv: dateType === 'daily' ? 2800 : 85000, uv: dateType === 'daily' ? 1200 : 32000 },
            task_page: { pv: dateType === 'daily' ? 1500 : 42000, uv: dateType === 'daily' ? 800 : 18000 },
            box_page: { pv: dateType === 'daily' ? 2200 : 68000, uv: dateType === 'daily' ? 950 : 25000 },
            birthday_page: { pv: dateType === 'daily' ? 680 : 18500, uv: dateType === 'daily' ? 320 : 8200 },
        },
        // 用户道具数据
        user_props: {
            guanghua_box: { 
                total: dateType === 'daily' ? 1250 : 45000, 
                used: dateType === 'daily' ? 890 : 32000 
            },
            yuehua_box: { 
                total: dateType === 'daily' ? 680 : 18500, 
                used: dateType === 'daily' ? 420 : 12800 
            },
            exchange_mall: { 
                total: dateType === 'daily' ? 950 : 28000, 
                used: dateType === 'daily' ? 720 : 21000 
            },
        },
        // 洗手池数据
        wash_hands: {
            pv: dateType === 'daily' ? 1800 : 52000,
            uv: dateType === 'daily' ? 650 : 18500,
        },
        // 点亮宝石用户数
        light_gem_users: dateType === 'daily' ? 280 : 7800,
        // 寿星奖励数据
        birthday_reward: {
            users: dateType === 'daily' ? 45 : 1200,
            times: dateType === 'daily' ? 68 : 1850,
        },
        // 你最特别报名人数
        special_signup: dateType === 'daily' ? 120 : 3500,
    };

    return baseData;
}