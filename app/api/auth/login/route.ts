import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../config/environment';
import { LoginRequest, LoginResponse } from '../../../../types/auth';
import { callInternalApi } from '../../../../utils/internalApiClient';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // 从请求体中获取登录信息
        const body: LoginRequest = await request.json();
        const { username, password } = body;
        
        if (!username || !password) {
            return NextResponse.json({
                success: false,
                message: '用户名和密码不能为空',
                code: 400
            }, { status: 400 });
        }
        
        // 构建API URL
        const apiUrl = buildApiUrl('login');
        
        console.log('正在调用登录API:', apiUrl);
        console.log('登录用户:', username);
        
        // 调用后端登录接口
        const backendResponse = await callInternalApi(apiUrl, {
            method: 'POST',
            body: {
                username,
                password
            },
        });
        
        if (!backendResponse.ok) {
            throw new Error(`后端API调用失败: ${backendResponse.status} ${backendResponse.statusText}`);
        }
        
        const result: LoginResponse = await backendResponse.json();
        
        // 检查后端返回的数据格式 - PHP后端使用code字段，0表示成功
        if (result.code !== 0) {
            // 登录失败，返回具体错误信息
            return NextResponse.json({
                success: false,
                message: result.msg || '登录失败',
                error: result.msg || `错误代码: ${result.code}`,
            });
        }
        
        console.log('登录成功:', result.data.username);
        
        // 返回成功响应
        return NextResponse.json({
            success: true,
            message: '登录成功',
            data: {
                token: result.data.token,
                expires_at: result.data.expires_at,
                user: {
                    username: result.data.username,
                    login_time: new Date().toISOString()
                }
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('登录时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '登录服务暂时不可用，请稍后重试',
                error: error instanceof Error ? error.message : '未知错误',
            },
            { status: 500 },
        );
    }
}