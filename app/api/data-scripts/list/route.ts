import { NextRequest, NextResponse } from 'next/server';
import { callInternalApi } from '../../../../utils/internalApiClient';
import { buildApiUrl } from '../../../../config/environment';

export const dynamic = 'force-dynamic';

/**
 * 获取数据脚本列表
 */
export async function POST(request: NextRequest) {
    try {
        console.log('开始获取数据脚本列表...');

        // 构建API URL
        const apiUrl = buildApiUrl('getDataScripts');
        
        console.log('请求URL:', apiUrl);
        
        const response = await callInternalApi(apiUrl, {
            method: 'POST',
            body: {}
        });

        console.log('响应状态:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('HTTP错误响应内容:', errorText.substring(0, 500));
            throw new Error(`数据脚本列表接口调用失败: ${response.status} ${response.statusText}`);
        }

        // 先获取文本内容，便于调试
        const responseText = await response.text();
        console.log('响应文本（前500字符）:', responseText.substring(0, 500));
        
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (jsonError) {
            console.error('JSON解析失败，完整响应:', responseText);
            throw new Error(`服务器返回了非JSON格式的数据: ${responseText.substring(0, 100)}`);
        }
        
        console.log('数据脚本列表响应:', result);
        
        if (result.code !== 0) {
            return NextResponse.json({
                success: false,
                message: result.msg || result.message || `数据脚本列表接口返回错误，错误代码: ${result.code}`,
                error: result.msg || result.message || `错误代码: ${result.code}`,
                data: null,
            });
        }

        // 后端直接返回数组格式
        let scriptList = [];
        if (Array.isArray(result.data)) {
            scriptList = result.data;
        }
        
        console.log(`成功获取数据脚本列表，共 ${scriptList.length} 个脚本`);
        
        return NextResponse.json({
            success: true,
            message: '成功获取数据脚本列表',
            data: scriptList,
        });
    } catch (error) {
        console.error('获取数据脚本列表时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '获取数据脚本列表失败',
                error: error instanceof Error ? error.message : '未知错误',
                data: null,
            },
            { status: 500 },
        );
    }
}

