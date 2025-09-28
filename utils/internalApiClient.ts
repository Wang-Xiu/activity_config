/**
 * 内部API客户端
 * 专门用于调用项目内部使用的PHP后端接口
 * 这些接口需要安全验证
 */

import { getSecureHeaders } from '../config/security';

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
        timeout = 30000
    } = config;

    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        // 合并安全头和自定义头
        const secureHeaders = getSecureHeaders(url, method);
        const finalHeaders = {
            ...secureHeaders,
            ...headers, // 自定义头可以覆盖安全头中的某些字段
        };

        console.log(`调用内部API: ${method} ${url}`);

        const response = await fetch(url, {
            method,
            headers: finalHeaders,
            body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
            signal: controller.signal,
            mode: 'cors',
            credentials: 'include',
        });

        clearTimeout(timeoutId);
        return response;
    } catch (error) {
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
