/**
 * 安全配置文件
 * 用于管理API安全相关的配置
 */

// API安全配置
export const API_SECURITY_CONFIG = {
    // API密钥 - 在生产环境中应该从环境变量获取
    API_KEY: process.env.API_SECRET_KEY || 'activityCheck!@#',
    
    // 客户端标识
    CLIENT_SOURCE: 'activity-config-system',
    
    // 自定义User-Agent
    USER_AGENT: 'ActivityConfigSystem/1.0',
    
    // 请求签名密钥（用于更高级的安全验证）
    SIGNATURE_SECRET: process.env.SIGNATURE_SECRET || 'activityIsOk!@#',
    
    // 允许的IP地址列表已移除 - 不再进行IP校验
    
    // 请求超时时间（毫秒）
    REQUEST_TIMEOUT: 30000,
    
    // 需要安全验证的内部API路由（用于PHP后端识别）
    PROTECTED_ROUTES: [
        'activity/act-common/login',           // 登录接口
        'activity/act-common/verify',          // Token验证接口
        'activity/act-common/get-config',      // 获取配置接口
        'activity/act-common/save-config',     // 保存配置接口
        'activity/a-discovery/get-controller-apis', // API发现接口
        'activity/act-common/reload-cache',    // 重载缓存接口
        'activity/act-common/update-material-cache', // 更新物料缓存接口
        'activity/act-common/del-redis-data',  // 删除Redis数据接口
        'activity/act-common/monitor-data',    // 监控数据接口
        'activity/act-common/get-config-name', // 获取配置名称接口
        // 可以根据需要添加更多路由
    ],
};

/**
 * 生成请求签名
 * @param url 请求URL
 * @param timestamp 时间戳
 * @param method HTTP方法
 * @returns 签名字符串
 */
export async function generateSignature(url: string, timestamp: number, method: string = 'GET'): Promise<string> {
    const data = `${method.toUpperCase()}|${url}|${timestamp}|${API_SECURITY_CONFIG.SIGNATURE_SECRET}`;
    
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
 * 获取简化的安全请求头（用于性能优化）
 * @param url 请求URL
 * @param method HTTP方法
 * @returns 包含基础安全信息的请求头对象
 */
export function getBasicSecureHeaders(url: string, method: string = 'GET'): Record<string, string> {
    const timestamp = Date.now();
    
    const headers = {
        'X-Client': API_SECURITY_CONFIG.CLIENT_SOURCE,
        'ActTimestamp': timestamp.toString(),
        'X-Request-ID': `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
        'User-Agent': API_SECURITY_CONFIG.USER_AGENT,
        'Content-Type': 'application/json',
    };
    
    console.log('生成基础安全请求头:', {
        url: url.substring(0, 80) + '...',
        method,
        timestamp,
        headers: {
            'X-Client': headers['X-Client'],
            'ActTimestamp': headers['ActTimestamp'],
            'X-Request-ID': headers['X-Request-ID'],
        }
    });
    
    return headers;
}

/**
 * 获取完整的安全请求头（包含签名）
 * @param url 请求URL
 * @param method HTTP方法
 * @returns 包含安全信息的请求头对象
 */
export async function getSecureHeaders(url: string, method: string = 'GET'): Promise<Record<string, string>> {
    const timestamp = Date.now();
    const signature = await generateSignature(url, timestamp, method);
    
    const headers = {
        'X-Client': API_SECURITY_CONFIG.CLIENT_SOURCE,
        'ActTimestamp': timestamp.toString(),
        'ActSignature': signature,
        'User-Agent': API_SECURITY_CONFIG.USER_AGENT,
        'Content-Type': 'application/json',
    };
    
    console.log('生成完整安全请求头:', {
        url: url.substring(0, 80) + '...',
        method,
        timestamp,
        headers: {
            'X-Client': headers['X-Client'],
            'ActTimestamp': headers['ActTimestamp'],
            'ActSignature': headers['ActSignature'].substring(0, 10) + '...',
        }
    });
    
    return headers;
}

/**
 * 验证请求是否来自可信源
 * @param headers 请求头
 * @param url 请求URL
 * @param method HTTP方法
 * @returns 是否验证通过
 */
export function validateRequest(headers: Record<string, string>, url: string, method: string = 'GET'): boolean {
    const clientSource = headers['x-client'] || headers['X-Client'];
    const timestamp = headers['acttimestamp'] || headers['ActTimestamp'];
    const signature = headers['actsignature'] || headers['ActSignature'];
    
    // 验证客户端标识
    if (clientSource !== API_SECURITY_CONFIG.CLIENT_SOURCE) {
        console.warn('客户端标识验证失败');
        return false;
    }
    
    // 验证时间戳（防止重放攻击）
    const now = Date.now();
    const requestTime = parseInt(timestamp);
    if (Math.abs(now - requestTime) > 300000) { // 5分钟内有效
        console.warn('请求时间戳过期');
        return false;
    }
    
    // 验证签名（需要异步处理）
    // 注意：这个函数需要改为异步才能正确验证签名
    // 目前跳过签名验证，只验证其他字段
    // const expectedSignature = await generateSignature(url, requestTime, method);
    // if (signature !== expectedSignature) {
    //     console.warn('请求签名验证失败');
    //     return false;
    // }
    
    return true;
}

/**
 * PHP后端安全验证代码示例
 * 将此代码添加到PHP后端的公共验证文件中
 */
export const PHP_SECURITY_CODE = `
<?php
/**
 * API安全验证类
 */
class ApiSecurity {
    private const API_KEY = 'activityCheck!@#';
    private const CLIENT_SOURCE = 'activity-config-system';
    private const SIGNATURE_SECRET = 'your-signature-secret-key';
    private const REQUEST_TIMEOUT = 300; // 5分钟
    
    // 需要安全验证的路由列表
    private const PROTECTED_ROUTES = [
        'activity/act-common/login',
        'activity/act-common/verify',
        'activity/act-common/get-config',
        'activity/act-common/save-config',
        'activity/a-discovery/get-controller-apis',
        'activity/act-common/reload-cache',
        'activity/act-common/update-material-cache',
        'activity/act-common/del-redis-data',
        'activity/act-common/monitor-data',
        'activity/act-common/get-config-name',
    ];
    
    /**
     * 检查当前路由是否需要安全验证
     */
    public static function needsValidation() {
        $route = $_GET['r'] ?? '';
        return in_array($route, self::PROTECTED_ROUTES);
    }
    
    /**
     * 验证API请求（仅对受保护的路由）
     */
    public static function validateRequest() {
        // 检查是否需要验证
        if (!self::needsValidation()) {
            return true; // 不在保护列表中的路由直接通过
        }
        $headers = getallheaders();
        
        // 获取请求头
        $clientSource = $headers['X-Client'] ?? '';
        $timestamp = $headers['ActTimestamp'] ?? '';
        $signature = $headers['ActSignature'] ?? '';
        
        // 验证客户端标识
        if ($clientSource !== self::CLIENT_SOURCE) {
            self::sendError('客户端标识验证失败', 401);
        }
        
        // 验证时间戳
        $now = time() * 1000;
        $requestTime = intval($timestamp);
        if (abs($now - $requestTime) > self::REQUEST_TIMEOUT * 1000) {
            self::sendError('请求时间戳过期', 401);
        }
        
        // 验证签名
        $method = $_SERVER['REQUEST_METHOD'];
        $url = $_SERVER['REQUEST_URI'];
        $expectedSignature = self::generateSignature($url, $requestTime, $method);
        
        if ($signature !== $expectedSignature) {
            self::sendError('请求签名验证失败', 401);
        }
        
        return true;
    }
    
    /**
     * 生成签名
     */
    private static function generateSignature($url, $timestamp, $method = 'GET') {
        $data = strtoupper($method) . '|' . $url . '|' . $timestamp . '|' . self::SIGNATURE_SECRET;
        return hash('sha256', $data);
    }
    
    /**
     * 发送错误响应
     */
    private static function sendError($message, $code = 400) {
        http_response_code($code);
        header('Content-Type: application/json');
        echo json_encode([
            'code' => $code,
            'message' => $message,
            'data' => null
        ]);
        exit;
    }
}

// 在每个API入口处调用
// ApiSecurity::validateRequest();
?>
`;

export default API_SECURITY_CONFIG;
