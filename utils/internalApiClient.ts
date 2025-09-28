/**
 * 内部API客户端
 * 专门用于调用项目内部使用的PHP后端接口
 * 这些接口需要安全验证
 */

/**
 * 内部API调用配置
 */
interface InternalApiConfig {
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
 * 调用内部API（带安全验证）
 * @param url API地址
 * @param config 请求配置
 * @returns Promise<Response>
 */
export async function callInternalApi(url: string, config: InternalApiConfig = {}): Promise<Response> {
    const {
        method = 'GET',
        headers = {},
        body,
        timeout = 30000,
    } = config;

    console.log(`🔒 开始调用内部API: ${method} ${url.substring(0, 100)}...`);

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

        console.log(`🔒 内部API签名已添加:`, {
            原始URL: url.substring(0, 100) + '...',
            签名URL长度: signedUrl.length,
            方法: method,
            头数量: Object.keys(finalHeaders).length
        });

        const response = await fetch(signedUrl, {
            method,
            headers: finalHeaders,
            body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
            signal: controller.signal,
            mode: 'cors',
            credentials: 'include',
        });

        console.log(`✅ 内部API调用完成: ${response.status} ${response.statusText}`);
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        console.error(`❌ 内部API调用失败:`, error);
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * 调用内部API并解析JSON响应
 * @param url API地址
 * @param config 请求配置
 * @returns Promise<any>
 */
export async function callInternalApiJson<T = any>(url: string, config: InternalApiConfig = {}): Promise<T> {
    const response = await callInternalApi(url, config);
    
    if (!response.ok) {
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
}

/**
 * 构建内部API URL
 * @param endpoint 接口路径（如：/index.php）
 * @param params 查询参数
 * @param baseUrl 基础URL（可选，默认从环境配置获取）
 * @returns 完整的API URL
 */
export function buildInternalApiUrl(
    endpoint: string,
    params: Record<string, string | number> = {},
    baseUrl?: string
): string {
    const apiBaseUrl = baseUrl || process.env.API_BASE_URL || 'http://testmqgitfrontend.meequ.cn';
    
    // 手动构建URL参数字符串，避免过度编码
    const paramPairs: string[] = [];
    Object.entries(params).forEach(([key, value]) => {
        // 对于特殊参数（如password包含!!!!），需要特殊处理
        if (key === 'password' && String(value) === '!!!!') {
            paramPairs.push(`${key}=!!!!`);
        } else if (key === 'r') {
            // r参数不进行编码
            paramPairs.push(`${key}=${value}`);
        } else {
            // 其他参数正常编码
            paramPairs.push(`${key}=${encodeURIComponent(String(value))}`);
        }
    });
    
    const fullUrl = `${apiBaseUrl}${endpoint}${paramPairs.length > 0 ? '?' + paramPairs.join('&') : ''}`;
    
    console.log(`构建内部API URL:`, {
        endpoint,
        params,
        构建的URL: fullUrl
    });
    
    return fullUrl;
}

/**
 * 内部API调用的常用方法
 */
export const internalApi = {
    /**
     * GET请求
     */
    get: <T = any>(url: string, headers?: Record<string, string>): Promise<T> => {
        return callInternalApiJson<T>(url, { method: 'GET', headers });
    },

    /**
     * POST请求
     */
    post: <T = any>(url: string, body?: any, headers?: Record<string, string>): Promise<T> => {
        const finalHeaders = {
            'Content-Type': 'application/json',
            ...headers,
        };
        return callInternalApiJson<T>(url, { method: 'POST', body, headers: finalHeaders });
    },

    /**
     * PUT请求
     */
    put: <T = any>(url: string, body?: any, headers?: Record<string, string>): Promise<T> => {
        const finalHeaders = {
            'Content-Type': 'application/json',
            ...headers,
        };
        return callInternalApiJson<T>(url, { method: 'PUT', body, headers: finalHeaders });
    },

    /**
     * DELETE请求
     */
    delete: <T = any>(url: string, headers?: Record<string, string>): Promise<T> => {
        return callInternalApiJson<T>(url, { method: 'DELETE', headers });
    },
};

export default internalApi;
