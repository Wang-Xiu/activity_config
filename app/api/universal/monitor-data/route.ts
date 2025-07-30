import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../config/environment';
import { MonitorDashboardData, MonitorDataRequest } from '../../../../types/monitor-dashboard';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // 从请求体中获取参数
        const body: MonitorDataRequest = await request.json();
        const { act_id, date_range } = body;
        
        if (!act_id) {
            return NextResponse.json({
                success: false,
                message: '活动ID不能为空',
            }, { status: 400 });
        }

        // 构建API URL
        const apiUrl = buildApiUrl('getUniversalMonitorData');
        
        // 准备POST数据
        const postData = {
            act_id: act_id,
            date_range
        };
        
        console.log('正在调用监控仪表盘API:', apiUrl);
        console.log('POST参数:', postData);

        const backendResponse = await fetch(apiUrl, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
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
                data: getMockMonitorDashboardData(act_id, date_range),
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
                data: getMockMonitorDashboardData(act_id, date_range), // 失败时返回模拟数据
            });
        }

        // 转换后端数据格式以匹配前端类型定义
        const transformedData = transformBackendData(result.data);

        return NextResponse.json({
            success: true,
            message: '监控数据获取成功',
            data: transformedData,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('获取监控仪表盘数据时出错:', error);
        
        // 返回模拟数据作为fallback
        const body = await request.json().catch(() => ({ act_id: '264' }));
        
        return NextResponse.json({
            success: true,
            message: '监控数据获取成功（模拟数据）',
            data: getMockMonitorDashboardData(body.act_id, body.date_range),
            timestamp: new Date().toISOString(),
        });
    }
}

// 转换后端数据格式以匹配前端类型定义
function transformBackendData(backendData: any): MonitorDashboardData {
    // 转换 pool_data.total_daily 从对象格式到数组格式
    const totalDailyArray = [];
    if (backendData.pool_data && backendData.pool_data.total_daily) {
        for (const [dateKey, dayData] of Object.entries(backendData.pool_data.total_daily)) {
            totalDailyArray.push({
                date: (dayData as any).date,
                total_input: (dayData as any).total_input,
                total_output: (dayData as any).total_output,
                total_ratio: (dayData as any).total_ratio
            });
        }
    }

    return {
        activity_info: backendData.activity_info || {
            act_id: backendData.act_id || '',
            name: backendData.name || `活动 #${backendData.act_id}`,
            start_date: backendData.start_date || '',
            end_date: backendData.end_date || '',
            duration_days: backendData.duration_days || 0
        },
        pv_uv_data: backendData.pv_uv_data || {
            total: { total_pv: 0, total_uv: 0 },
            daily_data: []
        },
        pool_data: {
            pools: backendData.pool_data?.pools || [],
            total_daily: totalDailyArray
        },
        summary_data: {
            period_total: {
                total_consumption: backendData.summary_data?.total_consumption || 0,
                total_production: backendData.summary_data?.total_production || 0,
                overall_ratio: backendData.summary_data?.overall_ratio || 0,
                total_participants: backendData.summary_data?.total_participants || 0,
                total_participation_times: backendData.summary_data?.total_participation_times || 0,
                avg_daily_participants: backendData.summary_data?.avg_daily_participants || 0,
                avg_daily_times: backendData.summary_data?.avg_daily_times || 0
            },
            additional_metrics: backendData.summary_data?.additional_metrics || []
        }
    };
}

// 生成模拟监控仪表盘数据
function getMockMonitorDashboardData(act_id: string, date_range?: string): MonitorDashboardData {
    // 解析日期范围或使用默认值
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const startDate = date_range ? date_range.split(',')[0] : sevenDaysAgo.toISOString().split('T')[0];
    const endDate = date_range ? date_range.split(',')[1] : today.toISOString().split('T')[0];
    
    // 生成日期数组
    const dates = generateDateRange(startDate, endDate);
    
    return {
        activity_info: {
            act_id,
            name: `通用活动 #${act_id}`,
            start_date: startDate,
            end_date: endDate,
            duration_days: dates.length
        },
        
        pv_uv_data: {
            total: {
                total_pv: 158000 + Math.floor(Math.random() * 50000),
                total_uv: 45000 + Math.floor(Math.random() * 15000)
            },
            daily_data: dates.map((date, index) => ({
                date,
                pv: 20000 + Math.floor(Math.random() * 8000),
                uv: 7000 + Math.floor(Math.random() * 3000),
                // 随机决定是否有入口分解数据
                entrance_breakdown: Math.random() > 0.3 ? {
                    main_page: { 
                        pv: 12000 + Math.floor(Math.random() * 4000), 
                        uv: 4500 + Math.floor(Math.random() * 1500) 
                    },
                    task_page: { 
                        pv: 6000 + Math.floor(Math.random() * 2000), 
                        uv: 2500 + Math.floor(Math.random() * 800) 
                    },
                    box_page: { 
                        pv: 4000 + Math.floor(Math.random() * 1500), 
                        uv: 1500 + Math.floor(Math.random() * 500) 
                    }
                } : null
            }))
        },
        
        pool_data: {
            pools: [
                {
                    pool_id: 'guanghua_box',
                    pool_name: '光华宝箱',
                    daily_data: dates.map(date => ({
                        date,
                        input: 50000 + Math.floor(Math.random() * 20000),
                        output: 45000 + Math.floor(Math.random() * 15000),
                        input_output_ratio: 0.85 + Math.random() * 0.2,
                        participants: 1200 + Math.floor(Math.random() * 500),
                        times: 3500 + Math.floor(Math.random() * 1000)
                    }))
                },
                {
                    pool_id: 'yuehua_box',
                    pool_name: '月华宝箱',
                    daily_data: dates.map(date => ({
                        date,
                        input: 30000 + Math.floor(Math.random() * 15000),
                        output: 28000 + Math.floor(Math.random() * 12000),
                        input_output_ratio: 0.88 + Math.random() * 0.15,
                        participants: 800 + Math.floor(Math.random() * 300),
                        times: 2200 + Math.floor(Math.random() * 600)
                    }))
                },
                {
                    pool_id: 'special_reward',
                    pool_name: '特殊奖励池',
                    daily_data: dates.map(date => ({
                        date,
                        input: 20000 + Math.floor(Math.random() * 10000),
                        output: 18500 + Math.floor(Math.random() * 8000),
                        input_output_ratio: 0.90 + Math.random() * 0.12,
                        participants: 600 + Math.floor(Math.random() * 200),
                        times: 1800 + Math.floor(Math.random() * 400)
                    }))
                }
            ],
            total_daily: dates.map(date => ({
                date,
                total_input: 100000 + Math.floor(Math.random() * 40000),
                total_output: 91500 + Math.floor(Math.random() * 35000),
                total_ratio: 0.87 + Math.random() * 0.15
            }))
        },
        
        summary_data: {
            period_total: {
                total_consumption: 840000 + Math.floor(Math.random() * 200000),
                total_production: 756000 + Math.floor(Math.random() * 180000),
                overall_ratio: 0.88 + Math.random() * 0.1,
                total_participants: 12500 + Math.floor(Math.random() * 3000),
                total_participation_times: 45600 + Math.floor(Math.random() * 10000),
                avg_daily_participants: Math.floor((12500 + Math.random() * 3000) / dates.length),
                avg_daily_times: Math.floor((45600 + Math.random() * 10000) / dates.length)
            },
            additional_metrics: [
                {
                    metric_name: '特殊奖励发放',
                    metric_value: 2500 + Math.floor(Math.random() * 800),
                    metric_unit: '个'
                },
                {
                    metric_name: '用户留存率',
                    metric_value: 68.5 + Math.random() * 15,
                    metric_unit: '%'
                },
                {
                    metric_name: '平均单次消耗',
                    metric_value: 18.4 + Math.random() * 8,
                    metric_unit: '元'
                },
                {
                    metric_name: '新用户占比',
                    metric_value: 25.6 + Math.random() * 10,
                    metric_unit: '%'
                }
            ]
        }
    };
}

// 生成日期范围数组
function generateDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const current = new Date(start);
    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    
    return dates;
}