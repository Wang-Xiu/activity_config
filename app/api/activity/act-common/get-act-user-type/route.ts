import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../../config/environment';
import { callInternalApi } from '../../../../../utils/internalApiClient';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // 从请求体中获取参数
        const body = await request.json();
        const { act_id } = body;
        
        if (!act_id) {
            return NextResponse.json({
                success: false,
                message: '活动ID不能为空',
            }, { status: 400 });
        }

        // 构建API URL，将 act_id 添加到 URL 参数中
        const baseApiUrl = buildApiUrl('getActUserType');
        const apiUrl = `${baseApiUrl}&act_id=${act_id}`;
        
        // 准备POST数据
        const postData = {
            act_id: act_id,
        };

        const backendResponse = await callInternalApi(apiUrl, {
            method: 'POST',
            body: postData,
        });

        if (!backendResponse.ok) {
            let errorText = '';
            try {
                errorText = await backendResponse.text();
            } catch (e) {
                // 忽略读取错误
            }
            throw new Error(`后端API调用失败: ${backendResponse.status} ${backendResponse.statusText}`);
        }

        const responseText = await backendResponse.text();
        
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            return NextResponse.json({
                success: false,
                message: '后端返回的数据格式不正确（不是有效的JSON）',
                error: `JSON解析失败: ${parseError instanceof Error ? parseError.message : '未知错误'}`,
            }, { status: 500 });
        }
        
        // 检查后端返回的数据格式 - PHP后端使用code字段，0表示成功
        if (result.code !== undefined && result.code !== 0) {
            return NextResponse.json({
                success: false,
                message: result.msg || result.message || `获取用户群体数据失败，错误代码: ${result.code}`,
                error: result.msg || result.message || `错误代码: ${result.code}`,
            });
        }

        // 提取数据 - 可能的结构: result.data.data, result.data, 或 result
        let extractedData = null;
        if (result.data?.data) {
            extractedData = result.data.data;
        } else if (result.data) {
            extractedData = result.data;
        } else if (result.code === 0 || result.code === undefined) {
            extractedData = result;
        }
        
        // 验证数据格式
        if (extractedData === null || extractedData === undefined) {
            return NextResponse.json({
                success: false,
                message: '后端返回的数据为空',
                error: '数据为空',
            }, { status: 500 });
        }
        
        if (typeof extractedData === 'object' && !Array.isArray(extractedData) && Object.keys(extractedData).length === 0) {
            return NextResponse.json({
                success: false,
                message: '后端返回的数据为空对象',
                error: '数据格式错误',
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: '用户群体数据获取成功',
            data: extractedData,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('获取活动用户群体数据时出错:', error);
        
        return NextResponse.json({
            success: false,
            message: '获取用户群体数据失败: ' + (error instanceof Error ? error.message : '未知错误'),
            error: error instanceof Error ? error.message : '未知错误',
        }, { status: 500 });
    }
}

