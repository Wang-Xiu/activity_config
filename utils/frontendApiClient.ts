/**
 * 前端API客户端
 * 专门用于浏览器到Next.js API路由的请求
 * 自动添加安全头，让浏览器开发者工具中可以看到这些头
 */

export interface FrontendApiConfig {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
}

/**
 * 生成前端安全头（浏览器到Next.js API）
 */
function getFrontendSecurityHeaders(): Record<string, string> {
    const timestamp = Date.now().toString();
    return {
        'X-API-Key': 'activity-config-secret-key-2024',
        'X-Client-Source': 'activity-config-system',
        'X-Timestamp': timestamp,
        'X-Request-ID': `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
        'User-Agent': 'ActivityConfigSystem/1.0',
        'Content-Type': 'application/json',
    };
}

/**
 * 调用Next.js API路由（带安全头）
 * @param url API路径（如 '/api/universal/config'）
 * @param config 请求配置
 * @returns Promise<Response>
 */
export async function callNextjsApi(url: string, config: FrontendApiConfig = {}): Promise<Response> {
    const {
        method = 'GET',
        headers = {},
        body,
        timeout = 30000,
    } = config;

    console.log(`🔒 前端API请求: ${method} ${url}`);

    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        // 生成安全头
        const securityHeaders = getFrontendSecurityHeaders();
        
        const finalHeaders = {
            ...securityHeaders,
            ...headers, // 自定义头可以覆盖安全头中的某些字段
        };

        console.log(`🔒 前端安全头已添加:`, {
            'X-API-Key': finalHeaders['X-API-Key'].substring(0, 20) + '...',
            'X-Client-Source': finalHeaders['X-Client-Source'],
            'X-Timestamp': finalHeaders['X-Timestamp'],
            'X-Request-ID': finalHeaders['X-Request-ID'],
            '总头数量': Object.keys(finalHeaders).length,
            url: url
        });

        const response = await fetch(url, {
            method,
            headers: finalHeaders,
            body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
            signal: controller.signal,
            credentials: 'same-origin', // Next.js API路由使用same-origin
        });

        console.log(`✅ 前端API请求完成: ${response.status} ${response.statusText}`);
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        console.error(`❌ 前端API请求失败:`, error);
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * 便捷的POST请求方法
 */
export async function postToNextjsApi(url: string, data: any, config: Omit<FrontendApiConfig, 'method' | 'body'> = {}): Promise<Response> {
    return callNextjsApi(url, {
        method: 'POST',
        body: data,
        ...config,
    });
}

/**
 * 便捷的GET请求方法
 */
export async function getFromNextjsApi(url: string): Promise<Response> {
    return callNextjsApi(url, {
        method: 'GET',
    });
}
