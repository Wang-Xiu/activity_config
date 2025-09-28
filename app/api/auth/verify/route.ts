import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../config/environment';
import { VerifyTokenRequest, VerifyTokenResponse } from '../../../../types/auth';
import { callInternalApi } from '../../../../utils/internalApiClient';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // 从请求体中获取token
        const body: VerifyTokenRequest = await request.json();
        const { token } = body;
        
        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'Token不能为空',
                code: 400
            }, { status: 400 });
        }
        
        // 构建API URL
        const apiUrl = buildApiUrl('verifyToken');
        
        console.log('正在验证Token:', apiUrl);
        
        // 调用后端token验证接口
        const backendResponse = await callInternalApi(apiUrl, {
            method: 'POST',
            body: {
                token
            },
        });
        
        if (!backendResponse.ok) {
            throw new Error(`后端API调用失败: ${backendResponse.status} ${backendResponse.statusText}`);
        }
        
        const result: VerifyTokenResponse = await backendResponse.json();
        
        // 检查后端返回的数据格式 - PHP后端使用code字段，0表示成功
        if (result.code !== 0) {
            // Token验证失败
            return NextResponse.json({
                success: false,
                message: result.msg || 'Token验证失败',
                valid: false,
            });
        }
        
        console.log('Token验证成功:', result.data.username);
        
        // 返回成功响应
        return NextResponse.json({
            success: true,
            message: 'Token有效',
            data: {
                valid: result.data.valid,
                username: result.data.username
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Token验证时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Token验证服务暂时不可用',
                error: error instanceof Error ? error.message : '未知错误',
                valid: false,
            },
            { status: 500 },
        );
    }
}