import { NextRequest, NextResponse } from 'next/server';
import { callInternalApi } from '../../../../utils/internalApiClient';
import { buildApiUrl } from '../../../../config/environment';

export const dynamic = 'force-dynamic';

/**
 * 创建神壕
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { 
            uid,
            level,
            created_by // 当前登录用户名
        } = body;
        
        // 验证必填字段
        if (!uid || !level || !created_by) {
            return NextResponse.json({
                success: false,
                message: '缺少必填字段：用户ID、神壕等级和创建者',
                data: null,
            }, { status: 400 });
        }
        
        console.log('创建神壕请求参数:', {
            uid,
            level,
            created_by
        });

        // 构建API URL - 这里先用占位符，等后端接口开发完成后替换
        const apiUrl = buildApiUrl('createShenhao');
        
        const response = await callInternalApi(apiUrl, {
            method: 'POST',
            body: {
                uid,
                level,
                created_by
            }
        });

        if (!response.ok) {
            throw new Error(`创建神壕接口调用失败: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.code !== 0) {
            return NextResponse.json({
                success: false,
                message: result.msg || result.message || `创建神壕接口返回错误，错误代码: ${result.code}`,
                error: result.msg || result.message || `错误代码: ${result.code}`,
                data: null,
            });
        }
        
        console.log(`成功创建神壕:`, {
            uid,
            level
        });
        
        return NextResponse.json({
            success: true,
            message: '成功创建神壕',
            data: result.data,
        });
    } catch (error) {
        console.error('创建神壕时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '创建神壕失败',
                error: error instanceof Error ? error.message : '未知错误',
                data: null,
            },
            { status: 500 },
        );
    }
}

