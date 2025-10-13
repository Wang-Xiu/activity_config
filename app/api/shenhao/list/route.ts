import { NextRequest, NextResponse } from 'next/server';
import { callInternalApi } from '../../../../utils/internalApiClient';
import { buildApiUrl } from '../../../../config/environment';

export const dynamic = 'force-dynamic';

/**
 * 获取神壕列表
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { 
            page = 1, 
            page_size = 10, 
            uid = '', 
            level
        } = body;
        
        console.log('获取神壕列表请求参数:', {
            page,
            page_size,
            uid,
            level
        });

        // 构建API URL - 这里先用占位符，等后端接口开发完成后替换
        const apiUrl = buildApiUrl('getShenhaoList');
        
        const response = await callInternalApi(apiUrl, {
            method: 'POST',
            body: {
                page,
                page_size,
                uid,
                level
            }
        });

        if (!response.ok) {
            throw new Error(`神壕列表接口调用失败: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        // 后端返回 code: 0 表示成功，而不是 200
        if (result.code !== 0) {
            return NextResponse.json({
                success: false,
                message: result.msg || result.message || `神壕列表接口返回错误，错误代码: ${result.code}`,
                error: result.msg || result.message || `错误代码: ${result.code}`,
                data: null,
            });
        }

        // 处理后端数据格式，确保 list 是数组
        let processedData = result.data;
        if (processedData && processedData.list) {
            // 如果 list 是单个对象，转换为数组
            if (!Array.isArray(processedData.list)) {
                processedData = {
                    ...processedData,
                    list: [processedData.list]
                };
            }
            
            // 处理字段名映射
            processedData.list = processedData.list.map((item: any) => ({
                user: item.user,
                shenhao: {
                    ...item.shenhao,
                    // 将 update_time 映射为 updated_time
                    updated_time: item.shenhao.update_time || item.shenhao.updated_time,
                    // 将 vip_expire_time 映射为 expected_expire_time
                    expected_expire_time: item.shenhao.vip_expire_time || item.shenhao.expected_expire_time,
                    // 添加缺失的字段
                    total_consume: item.shenhao.total_consume || 0,
                    total_recharge: item.shenhao.total_recharge || 0,
                }
            }));
        }
        
        console.log(`成功获取神壕列表:`, {
            total: processedData?.total || 0,
            listCount: processedData?.list?.length || 0
        });
        
        return NextResponse.json({
            success: true,
            message: '成功获取神壕列表',
            data: processedData,
        });
    } catch (error) {
        console.error('获取神壕列表时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '获取神壕列表失败',
                error: error instanceof Error ? error.message : '未知错误',
                data: null,
            },
            { status: 500 },
        );
    }
}

