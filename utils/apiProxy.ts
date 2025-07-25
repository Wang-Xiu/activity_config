import { ENV_CONFIG } from '../config/environment';

// API代理函数，构建时返回模拟数据
export async function fetchWithFallback(url: string, options?: RequestInit, fallbackData?: any) {
    // 如果是构建时，直接返回fallback数据
    if (ENV_CONFIG.isBuildTime) {
        console.log('构建时跳过API调用，返回fallback数据:', url);
        return {
            ok: true,
            json: async () => ({
                success: true,
                data: fallbackData || {},
                message: '构建时模拟数据'
            })
        };
    }

    // 运行时正常调用API
    try {
        return await fetch(url, options);
    } catch (error) {
        console.warn('API调用失败，返回fallback数据:', error);
        return {
            ok: true,
            json: async () => ({
                success: true,
                data: fallbackData || {},
                message: 'API调用失败时的fallback数据'
            })
        };
    }
}