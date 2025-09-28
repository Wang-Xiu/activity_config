# API安全配置指南

## 概述

本文档说明如何配置PHP后端接口的安全验证，确保只有通过Activity Config系统的请求才能访问**内部管理接口**。

**重要说明**：
- ✅ **内部管理接口**（如登录、配置管理等）需要安全验证
- ❌ **压力测试目标接口**（被测试的业务接口）不需要安全验证

## 安全策略

### 1. 多重验证机制

- **API密钥验证**：验证请求是否携带正确的API密钥
- **客户端标识**：验证请求来源是否为可信客户端
- **时间戳验证**：防止重放攻击，请求必须在5分钟内有效
- **数字签名**：使用SHA256算法对请求进行签名验证
- **自定义User-Agent**：识别合法的客户端请求

### 2. 请求头验证

每个请求都会携带以下安全头：

```
X-API-Key: activity-config-secret-key-2024
X-Client-Source: activity-config-system
X-Timestamp: 1640995200000
X-Signature: sha256_hash_of_request
User-Agent: ActivityConfigSystem/1.0
```

## PHP后端实施步骤

### 步骤1：创建安全验证类

在PHP后端创建文件 `includes/ApiSecurity.php`：

```php
<?php
/**
 * API安全验证类
 */
class ApiSecurity {
    private const API_KEY = 'activity-config-secret-key-2024';
    private const CLIENT_SOURCE = 'activity-config-system';
    private const SIGNATURE_SECRET = 'your-signature-secret-key';
    private const REQUEST_TIMEOUT = 300; // 5分钟
    
    /**
     * 验证API请求
     */
    public static function validateRequest() {
        $headers = getallheaders();
        
        // 获取请求头（兼容不同的HTTP服务器）
        $apiKey = self::getHeader($headers, 'X-API-Key');
        $clientSource = self::getHeader($headers, 'X-Client-Source');
        $timestamp = self::getHeader($headers, 'X-Timestamp');
        $signature = self::getHeader($headers, 'X-Signature');
        
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
     * 获取请求头（兼容性处理）
     */
    private static function getHeader($headers, $name) {
        // 尝试不同的格式
        $variations = [
            $name,
            strtolower($name),
            strtoupper($name),
            str_replace('-', '_', strtoupper($name))
        ];
        
        foreach ($variations as $variation) {
            if (isset($headers[$variation])) {
                return $headers[$variation];
            }
        }
        
        return '';
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
    
    /**
     * IP白名单验证（可选）
     */
    public static function validateIP($allowedIPs = []) {
        if (empty($allowedIPs)) {
            return true;
        }
        
        $clientIP = self::getClientIP();
        if (!in_array($clientIP, $allowedIPs)) {
            self::sendError('IP地址不在白名单中', 403);
        }
        
        return true;
    }
    
    /**
     * 获取客户端IP
     */
    private static function getClientIP() {
        $ipKeys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
        
        foreach ($ipKeys as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                        return $ip;
                    }
                }
            }
        }
        
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
}
?>
```

### 步骤2：在API入口处添加验证

在PHP应用的统一入口文件（如 `index.php`）中添加：

```php
<?php
// 引入安全验证类
require_once 'includes/ApiSecurity.php';

// 自动验证API请求（仅对受保护的路由生效）
ApiSecurity::validateRequest();

// 可选：IP白名单验证
// ApiSecurity::validateIP(['192.168.1.100', '10.0.0.50']);

// 您的路由和业务逻辑代码...
?>
```

**受保护的路由列表**：
- `activity/act-common/login` - 登录接口
- `activity/act-common/verify` - Token验证接口
- `activity/act-common/get-config` - 获取配置接口
- `activity/act-common/save-config` - 保存配置接口
- `activity/a-discovery/get-controller-apis` - API发现接口
- `activity/act-common/reload-cache` - 重载缓存接口
- `activity/act-common/update-material-cache` - 更新物料缓存接口
- `activity/act-common/del-redis-data` - 删除Redis数据接口
- `activity/act-common/monitor-data` - 监控数据接口
- `activity/act-common/get-config-name` - 获取配置名称接口

**其他路由**（如业务接口）将不会被验证，可以正常进行压力测试。

### 步骤3：配置Web服务器

#### Apache (.htaccess)

```apache
# 禁止直接访问敏感文件
<Files "*.php">
    # 只允许通过特定的User-Agent访问
    RewriteEngine On
    RewriteCond %{HTTP_USER_AGENT} !^ActivityConfigSystem/1\.0$
    RewriteRule ^.*$ - [F,L]
</Files>

# 防止暴力破解
<Limit GET POST>
    # 限制请求频率
    # 需要mod_evasive模块
</Limit>
```

#### Nginx

```nginx
location ~ \.php$ {
    # 检查User-Agent
    if ($http_user_agent !~ "^ActivityConfigSystem/1\.0$") {
        return 403;
    }
    
    # 限制请求频率
    limit_req zone=api burst=10 nodelay;
    
    # 正常的PHP处理
    fastcgi_pass php-fpm;
    include fastcgi_params;
}
```

## 环境变量配置

在前端系统中设置环境变量（`.env.local`）：

```env
# API安全配置
API_SECRET_KEY=activity-config-secret-key-2024
SIGNATURE_SECRET=your-signature-secret-key

# 可选：IP白名单
ALLOWED_IPS=192.168.1.100,10.0.0.50
```

## 安全级别

### 基础安全（推荐）
- API密钥验证
- 客户端标识验证
- 自定义User-Agent

### 中级安全
- 基础安全 +
- 时间戳验证
- 数字签名验证

### 高级安全
- 中级安全 +
- IP白名单
- 请求频率限制
- SSL/TLS强制加密

## 测试验证

1. **正常请求测试**：通过Activity Config系统发送请求，应该成功
2. **直接访问测试**：直接访问PHP接口URL，应该被拒绝
3. **错误密钥测试**：使用错误的API密钥，应该返回401错误
4. **过期请求测试**：使用过期的时间戳，应该被拒绝

## 监控和日志

建议在PHP后端添加安全日志记录：

```php
// 记录安全事件
error_log(date('Y-m-d H:i:s') . " - Security: " . $message . " - IP: " . $clientIP . "\n", 3, "/var/log/api_security.log");
```

## 注意事项

1. **密钥管理**：定期更换API密钥和签名密钥
2. **HTTPS**：生产环境必须使用HTTPS
3. **日志监控**：监控异常访问尝试
4. **备份验证**：保留一个备用的验证机制
5. **性能影响**：签名验证会增加少量性能开销

## 故障排除

### 常见问题

1. **时间同步**：确保前后端服务器时间同步
2. **HTTP头大小写**：不同服务器对HTTP头大小写处理不同
3. **URL编码**：确保URL编码一致性
4. **代理服务器**：代理可能会修改请求头

### 调试模式

在开发环境中可以添加调试信息：

```php
// 调试模式（仅开发环境）
if (defined('DEBUG') && DEBUG === true) {
    error_log("Debug - Headers: " . json_encode($headers));
    error_log("Debug - Expected signature: " . $expectedSignature);
    error_log("Debug - Received signature: " . $signature);
}
```

## 更新日志

- 2024-01-01: 初始版本，支持基础API密钥验证
- 2024-01-02: 添加数字签名验证和时间戳验证
- 2024-01-03: 增加IP白名单和Web服务器配置示例
