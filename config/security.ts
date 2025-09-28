/**
 * 安全配置文件
 * 用于管理API安全相关的配置
 */

// API安全配置
export const API_SECURITY_CONFIG = {
    // API密钥 - 在生产环境中应该从环境变量获取
    API_KEY: process.env.API_SECRET_KEY || 'activity-config-secret-key-2024',
    
    // 客户端标识
    CLIENT_SOURCE: 'activity-config-system',
    
    // 自定义User-Agent
    USER_AGENT: 'ActivityConfigSystem/1.0',
    
    // 请求签名密钥（用于更高级的安全验证）
    SIGNATURE_SECRET: process.env.SIGNATURE_SECRET || 'your-signature-secret-key',
    
    // 允许的IP地址列表（可选）
    ALLOWED_IPS: process.env.ALLOWED_IPS?.split(',') || [],
    
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
export function generateSignature(url: string, timestamp: number, method: string = 'GET'): string {
    const crypto = require('crypto');
    const data = `${method.toUpperCase()}|${url}|${timestamp}|${API_SECURITY_CONFIG.SIGNATURE_SECRET}`;
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * 获取安全请求头
 * @param url 请求URL
 * @param method HTTP方法
 * @returns 包含安全信息的请求头对象
 */
export function getSecureHeaders(url: string, method: string = 'GET'): Record<string, string> {
    const timestamp = Date.now();
    const signature = generateSignature(url, timestamp, method);
    
    return {
        'X-API-Key': API_SECURITY_CONFIG.API_KEY,
        'X-Client-Source': API_SECURITY_CONFIG.CLIENT_SOURCE,
        'X-Timestamp': timestamp.toString(),
        'X-Signature': signature,
        'User-Agent': API_SECURITY_CONFIG.USER_AGENT,
        'Content-Type': 'application/json',
    };
}

/**
 * 验证请求是否来自可信源
 * @param headers 请求头
 * @param url 请求URL
 * @param method HTTP方法
 * @returns 是否验证通过
 */
export function validateRequest(headers: Record<string, string>, url: string, method: string = 'GET'): boolean {
    const apiKey = headers['x-api-key'] || headers['X-API-Key'];
    const clientSource = headers['x-client-source'] || headers['X-Client-Source'];
    const timestamp = headers['x-timestamp'] || headers['X-Timestamp'];
    const signature = headers['x-signature'] || headers['X-Signature'];
    
    // 验证API密钥
    if (apiKey !== API_SECURITY_CONFIG.API_KEY) {
        console.warn('API密钥验证失败');
        return false;
    }
    
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
    
    // 验证签名
    const expectedSignature = generateSignature(url, requestTime, method);
    if (signature !== expectedSignature) {
        console.warn('请求签名验证失败');
        return false;
    }
    
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
    private const API_KEY = 'activity-config-secret-key-2024';
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
        $apiKey = $headers['X-API-Key'] ?? '';
        $clientSource = $headers['X-Client-Source'] ?? '';
        $timestamp = $headers['X-Timestamp'] ?? '';
        $signature = $headers['X-Signature'] ?? '';
        
        // 验证API密钥
        if ($apiKey !== self::API_KEY) {
            self::sendError('API密钥验证失败', 401);
        }
        
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
