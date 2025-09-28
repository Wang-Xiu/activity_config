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
 * 生成签名（基于api-key和时间戳）
 */
async function generateSignature(timestamp: number): Promise<string> {
    const apiKey = 'activityCheck!@#';
    const signatureSecret = 'activityIsOk!@#';
    const data = `${apiKey}|${timestamp}|${signatureSecret}`;
    
    // 检查是否在浏览器环境
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        // 浏览器环境使用 Web Crypto API
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
        // Node.js 环境使用 crypto 模块
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(data).digest('hex');
    }
}

/**
 * 添加签名参数到URL
 */
async function addSignatureToUrl(url: string): Promise<string> {
    const timestamp = Date.now();
    const signature = await generateSignature(timestamp);
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}sig=${encodeURIComponent(signature)}&ts=${timestamp}`;
}

/**
 * 调用Next.js API路由（带签名验证）
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
        // 添加签名参数到URL
        const signedUrl = await addSignatureToUrl(url);
        
        const finalHeaders = {
            'Content-Type': 'application/json',
            'User-Agent': 'ActivityConfigSystem/1.0',
            ...headers, // 自定义头可以覆盖默认头
        };

        console.log(`🔒 前端API签名已添加:`, {
            原始URL: url,
            签名URL: signedUrl,
            方法: method,
            头数量: Object.keys(finalHeaders).length
        });

        const response = await fetch(signedUrl, {
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
