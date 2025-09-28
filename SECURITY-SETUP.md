# API安全配置指南

## 概述

本文档说明如何配置PHP后端接口的安全验证，确保只有通过Activity Config系统的请求才能访问**内部管理接口**。

**重要说明**：
- ✅ **内部管理接口**（如登录、配置管理等）需要安全验证
- ❌ **压力测试目标接口**（被测试的业务接口）不需要安全验证

## 安全策略

### 1. 简化的签名验证机制

- **时间戳验证**：防止重放攻击，请求必须在5分钟内有效
- **数字签名**：使用SHA256算法对请求进行签名验证
- **路由白名单**：只对指定的内部管理接口进行验证

**简化优势**：
- 避免Nginx请求头过滤问题
- 无需复杂的服务器配置
- 调试简单，参数可见
- 性能更好，验证逻辑简单

### 2. URL参数签名验证

每个受保护的API请求都会在URL中包含签名参数：

```
https://example.com/index.php?r=activity/act-common/get-config&actId=123&sig=abc123...&ts=1640995200000
```

**参数说明**：
- `sig`: 请求签名（SHA256哈希）
- `ts`: 时间戳（毫秒）

**优势**：
- 完全避开Nginx请求头过滤问题
- 无需修改服务器配置
- 调试方便，参数在URL中可见

## PHP后端实施步骤

### 步骤1：创建安全验证类

在PHP后端创建文件 `includes/ApiSecurity.php`：

```php
<?php
/**
 * API安全验证类
 */
class ApiSecurity {
    private const API_KEY = 'activityCheck!@#';
    private const CLIENT_SOURCE = 'activity-config-system';
    private const SIGNATURE_SECRET = 'activityIsOk!@#';
    private const REQUEST_TIMEOUT = 300; // 5分钟
    
    // 需要安全验证的路由列表
    private const PROTECTED_ROUTES = [
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
    ];
    
    /**
     * 验证API请求（仅校验URL参数中的签名）
     */
    public static function validateRequest() {
        // 检查是否需要验证
        if (!self::needsValidation()) {
            return true; // 不在保护列表中的路由直接通过
        }
        
        // 从URL参数获取签名和时间戳
        $signature = $_GET['sig'] ?? '';
        $timestamp = $_GET['ts'] ?? '';
        
        if (empty($signature) || empty($timestamp)) {
            self::sendError('缺少签名参数', 401);
        }
        
        // 验证时间戳（防止重放攻击）
        $now = time() * 1000;
        $requestTime = intval($timestamp);
        if (abs($now - $requestTime) > self::REQUEST_TIMEOUT * 1000) {
            self::sendError('请求时间戳过期', 401);
        }
        
        // 验证签名（基于api-key和时间戳）
        $expectedSignature = self::generateSignature($requestTime);
        
        if ($signature !== $expectedSignature) {
            self::sendError('请求签名验证失败', 401);
        }
        
        return true;
    }
    
    /**
     * 检查当前路由是否需要安全验证
     */
    public static function needsValidation() {
        $route = $_GET['r'] ?? '';
        return in_array($route, self::PROTECTED_ROUTES);
    }
    
    // 已移除getOriginalUrl方法，改为使用api-key生成签名
    
    /**
     * 兼容性获取所有请求头（已弃用，改用URL参数验证）
     */
    private static function getAllHeaders() {
        // 如果getallheaders函数存在，直接使用
        if (function_exists('getallheaders')) {
            return getallheaders();
        }
        
        // 手动从$_SERVER中提取请求头
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (strpos($key, 'HTTP_') === 0) {
                $headerName = str_replace('_', '-', substr($key, 5));
                $headers[$headerName] = $value;
                // 同时保存原始格式和小写格式
                $headers[strtolower($headerName)] = $value;
                $headers[strtoupper($headerName)] = $value;
            }
        }
        
        // 特殊处理Content-Type和Content-Length
        if (isset($_SERVER['CONTENT_TYPE'])) {
            $headers['Content-Type'] = $_SERVER['CONTENT_TYPE'];
            $headers['content-type'] = $_SERVER['CONTENT_TYPE'];
            $headers['CONTENT-TYPE'] = $_SERVER['CONTENT_TYPE'];
        }
        if (isset($_SERVER['CONTENT_LENGTH'])) {
            $headers['Content-Length'] = $_SERVER['CONTENT_LENGTH'];
            $headers['content-length'] = $_SERVER['CONTENT_LENGTH'];
            $headers['CONTENT-LENGTH'] = $_SERVER['CONTENT_LENGTH'];
        }
        
        return $headers;
    }
    
    // 已移除请求头相关的方法，改为使用URL参数验证
    
    /**
     * 生成签名（基于api-key和时间戳）
     */
    private static function generateSignature($timestamp) {
        $data = self::API_KEY . '|' . $timestamp . '|' . self::SIGNATURE_SECRET;
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
     * 调试方法：打印URL参数和签名验证信息（仅用于调试）
     */
    public static function debugSignature() {
        echo "=== DEBUG: URL参数签名验证 ===\n";
        echo "当前路由: " . ($_GET['r'] ?? 'N/A') . "\n";
        echo "需要验证: " . (self::needsValidation() ? 'YES' : 'NO') . "\n";
        echo "签名参数: " . ($_GET['sig'] ?? 'N/A') . "\n";
        echo "时间戳参数: " . ($_GET['ts'] ?? 'N/A') . "\n";
        
        if (!empty($_GET['sig']) && !empty($_GET['ts'])) {
            $timestamp = intval($_GET['ts']);
            
            echo "\n=== DEBUG: 签名验证详情 ===\n";
            echo "API Key: " . self::API_KEY . "\n";
            echo "签名密钥: " . self::SIGNATURE_SECRET . "\n";
            echo "时间戳: $timestamp\n";
            
            $expectedSignature = self::generateSignature($timestamp);
            echo "期望签名: $expectedSignature\n";
            echo "实际签名: " . $_GET['sig'] . "\n";
            echo "签名匹配: " . ($_GET['sig'] === $expectedSignature ? 'YES' : 'NO') . "\n";
            
            // 签名生成数据
            $data = self::API_KEY . '|' . $timestamp . '|' . self::SIGNATURE_SECRET;
            echo "签名数据: $data\n";
            
            // 时间戳检查
            $now = time() * 1000;
            $timeDiff = abs($now - $timestamp);
            echo "时间差异: {$timeDiff}ms (允许: " . (self::REQUEST_TIMEOUT * 1000) . "ms)\n";
            echo "时间戳有效: " . ($timeDiff <= self::REQUEST_TIMEOUT * 1000 ? 'YES' : 'NO') . "\n";
        }
        
        exit; // 调试完成后退出
    }
    
    // IP校验功能已移除 - 不再进行IP地址验证
}
?>
```

### 步骤2：在API入口处添加验证

**重要提示**：上面的 `ApiSecurity` 类已经包含了 `getallheaders()` 函数的兼容性处理，可以在各种PHP环境中正常工作，包括：
- Apache + mod_php
- Nginx + PHP-FPM  
- CLI模式
- 其他Web服务器

在PHP应用的统一入口文件（如 `index.php`）中添加：

```php
<?php
// 引入安全验证类
require_once 'includes/ApiSecurity.php';

// 调试签名验证问题时，可以临时启用以下代码
// ApiSecurity::debugSignature(); // 取消注释来调试签名验证

// 自动验证API请求（仅对受保护的路由生效）
ApiSecurity::validateRequest();

// IP白名单验证功能已移除

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
SIGNATURE_SECRET=activityIsOk!@#

# IP白名单功能已移除
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

## 常见问题故障排除

### 1. `getallheaders()` 函数未定义错误

**错误信息**：`Call to undefined function getallheaders()`

**原因**：某些PHP环境（如CLI模式、部分Web服务器配置）不支持 `getallheaders()` 函数。

**解决方案**：使用上面提供的 `ApiSecurity` 类，它包含了兼容性处理：

```php
// 兼容性获取所有请求头
private static function getAllHeaders() {
    if (function_exists('getallheaders')) {
        return getallheaders();
    }
    
    // 从$_SERVER中手动提取请求头
    $headers = [];
    foreach ($_SERVER as $key => $value) {
        if (strpos($key, 'HTTP_') === 0) {
            $headerName = str_replace('_', '-', substr($key, 5));
            $headers[$headerName] = $value;
        }
    }
    return $headers;
}
```

### 2. 请求头大小写问题

**问题**：不同的Web服务器可能以不同的大小写格式传递请求头。

**解决方案**：`getHeader()` 方法已经处理了多种格式：
- 原始格式：`X-Client`
- 小写格式：`x-client`  
- 大写格式：`X-CLIENT`
- 下划线格式：`X_CLIENT`

### 3. URL参数签名验证的优势

**问题解决**：完全避开了Nginx请求头过滤问题，无需任何服务器配置修改。

**实现方式**：
- 前端：自动在URL中添加 `sig` 和 `ts` 参数
- 后端：从 `$_GET` 中读取签名参数进行验证
- 调试：参数在URL中可见，便于排查问题

### 4. 签名验证失败

**问题**：签名验证总是失败。

**检查项**：
1. 确认前后端使用相同的API Key：`activityCheck!@#`
2. 确认前后端使用相同的签名密钥：`activityIsOk!@#`
3. 确认时间戳格式一致（都使用毫秒）
4. 确认使用相同的哈希算法（SHA256）
5. 使用 `ApiSecurity::debugSignature()` 查看详细的签名对比信息

**新的签名格式**：
- 前端：`SHA256(apiKey + '|' + timestamp + '|' + signatureSecret)`
- 后端：`hash('sha256', API_KEY . '|' . timestamp . '|' . SIGNATURE_SECRET)`

**常见原因**：
- API Key不一致
- 签名密钥不一致
- 时间戳格式不一致

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
- 2024-01-03: 移除IP白名单功能，简化安全配置
