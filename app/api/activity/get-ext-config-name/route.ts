import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../config/environment';
import { fieldNameMapping } from '../../../../config/fieldNameMapping';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        console.log('正在调用字段名映射API');
        
        // 构建API URL
        const apiUrl = buildApiUrl('getExtConfigName');
        
        console.log('正在调用后端API:', apiUrl);

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
            console.warn(`后端API调用失败: ${backendResponse.status}, 使用本地兜底配置`);
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
            console.warn(`后端业务错误: ${result.msg || result.message}, 使用本地兜底配置`);
            // 后端业务错误，使用本地配置作为兜底
            return NextResponse.json({
                success: true,
                message: '获取字段名配置成功（使用本地兜底配置）',
                data: fieldNameMapping,
                fallback: true,
                error: result.msg || result.message || `错误代码: ${result.code}`,
            });
        }
        
        console.log('成功从后端获取字段名映射配置:', result.data);
        
        // 返回后端映射数据
        return NextResponse.json({
            success: true,
            message: '获取字段名配置成功',
            data: result.data || fieldNameMapping,
            fallback: false, // 标记为来自后端的数据
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('获取字段名配置时出错:', error);
        console.log('使用本地兜底配置');
        
        // 发生异常时使用本地配置作为兜底
        return NextResponse.json({
            success: true,
            message: '获取字段名配置成功（使用本地兜底配置）',
            data: fieldNameMapping,
            fallback: true,
            error: error instanceof Error ? error.message : '未知错误',
        });
    }
}