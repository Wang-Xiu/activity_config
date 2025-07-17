import { NextRequest, NextResponse } from 'next/server';
import { MainConfig } from '../../../../types/config';
import { validateConfig, sanitizeConfig } from '../../../../utils/configValidator';
import { buildApiUrl } from '../../../../config/environment';

export async function POST(request: NextRequest) {
    try {
        const rawConfig = await request.json();

        // 验证配置数据
        const validation = validateConfig(rawConfig);
        if (!validation.isValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: '配置数据验证失败',
                    errors: validation.errors,
                },
                { status: 400 },
            );
        }

        // 清理和格式化配置数据
        const config: MainConfig = sanitizeConfig(rawConfig);

        // 调用后端API保存配置
        const apiUrl = buildApiUrl('saveConfig');
        const backendResponse = await fetch(apiUrl, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(config),
        });

        if (!backendResponse.ok) {
            throw new Error(`后端API调用失败: ${backendResponse.status} ${backendResponse.statusText}`);
        }

        const result = await backendResponse.json();

        if (!result.success) {
            throw new Error(result.message || '后端返回错误');
        }

        return NextResponse.json({
            success: true,
            message: '配置保存成功',
            timestamp: new Date().toISOString(),
            configSize: JSON.stringify(config).length,
        });
    } catch (error) {
        console.error('保存配置时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '保存配置失败',
                error: error instanceof Error ? error.message : '未知错误',
            },
            { status: 500 },
        );
    }
}