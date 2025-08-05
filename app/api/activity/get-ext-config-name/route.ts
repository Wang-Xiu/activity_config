import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../config/environment';
import { fieldNameMapping } from '../../../../config/fieldNameMapping';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // 构建API URL
        const apiUrl = buildApiUrl('getExtConfigName');

        const backendResponse = await fetch(apiUrl, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        if (!backendResponse.ok) {
            // 后端接口失败时使用本地配置作为兜底
            return NextResponse.json({
                success: true,
                message: '获取字段名配置成功（使用本地兜底配置）',
                data: fieldNameMapping,
                fallback: true, // 标记为兜底数据
            });
        }

        const result = await backendResponse.json();
        
        // 检查后端返回的数据格式 - PHP后端使用code字段，0表示成功
        if (result.code !== 0) {
            // 后端业务错误，使用本地配置作为兜底
            return NextResponse.json({
                success: true,
                message: '获取字段名配置成功（使用本地兜底配置）',
                data: fieldNameMapping,
                fallback: true,
                error: result.msg || result.message || `错误代码: ${result.code}`,
            });
        }
        
        // 返回后端映射数据
        return NextResponse.json({
            success: true,
            message: '获取字段名配置成功',
            data: result.data || fieldNameMapping,
            fallback: false, // 标记为来自后端的数据
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        // 发生异常时使用本地配置作为兜底，但不输出错误信息
        return NextResponse.json({
            success: true,
            message: '获取字段名配置成功（使用本地兜底配置）',
            data: fieldNameMapping,
            fallback: true,
            error: error instanceof Error ? error.message : '未知错误',
        });
    }
}