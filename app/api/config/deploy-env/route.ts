import { NextResponse } from 'next/server';
import { getEnvironmentInfo } from '../../../../config/environment';

/** 运行时读取 DEPLOY_ENV，避免 NEXT_PUBLIC_* 在构建时被写死 */
export const dynamic = 'force-dynamic';

export async function GET() {
    const info = getEnvironmentInfo();
    const isProd = info.deployEnv === 'prod';
    return NextResponse.json({
        deployEnv: info.deployEnv,
        label: isProd ? '正式环境' : '测试环境',
        apiBaseUrl: info.apiBaseUrl,
    });
}
