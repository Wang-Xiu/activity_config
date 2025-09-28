/**
 * 压力测试相关类型定义
 */

// API发现接口返回的单个API信息
export interface ApiInfo {
    controller: string;
    action: string;
    method_name: string;
    url_pattern: string;
    http_methods: string;
    parameters: any[];
    description: string;
    file_path: string;
    line_number: number;
}

// API发现接口返回的完整数据
export interface ApiDiscoveryResponse {
    code: number;
    message: string;
    data: {
        controller: string;
        total: number;
        apis: ApiInfo[];
    };
}

// 压力测试配置
export interface StressTestConfig {
    // 基本配置
    apiInfo: ApiInfo;
    baseUrl: string;
    
    // 测试参数
    concurrency: number;      // 并发数
    totalRequests: number;    // 总请求数
    duration?: number;        // 测试持续时间（秒）
    
    // 自定义参数
    customParameters: { [key: string]: any };
    
    // 请求配置
    method: 'GET' | 'POST';
    headers: { [key: string]: string };
    timeout: number;          // 请求超时时间（毫秒）
}

// 单个请求结果
export interface RequestResult {
    success: boolean;
    responseTime: number;     // 响应时间（毫秒）
    statusCode?: number;
    error?: string;
    responseSize?: number;    // 响应大小（字节）
}

// 压力测试结果统计
export interface StressTestResult {
    // 基本信息
    startTime: string;
    endTime: string;
    duration: number;         // 实际测试时间（毫秒）
    
    // 请求统计
    totalRequests: number;
    successRequests: number;
    failedRequests: number;
    rateLimitRequests: number;      // 限流请求数（429）
    otherFailedRequests: number;    // 其他失败请求数
    successRate: number;            // 成功率（百分比）
    
    // 性能指标（基于成功请求）
    averageResponseTime: number;    // 平均响应时间
    minResponseTime: number;        // 最小响应时间
    maxResponseTime: number;        // 最大响应时间
    standardDeviation: number;      // 响应时间标准差
    p50ResponseTime: number;        // 50%分位响应时间
    p90ResponseTime: number;        // 90%分位响应时间
    p95ResponseTime: number;        // 95%分位响应时间
    p99ResponseTime: number;        // 99%分位响应时间
    p99_9ResponseTime: number;      // 99.9%分位响应时间
    
    // 吞吐量
    requestsPerSecond: number;          // 总每秒请求数
    effectiveRequestsPerSecond: number; // 有效每秒请求数（仅成功请求）
    
    // 错误统计
    errorTypes: { [key: string]: number };
    
    // 原始数据
    results: RequestResult[];
}

// 压力测试状态
export interface StressTestStatus {
    isRunning: boolean;
    progress: number;         // 进度百分比
    currentRequests: number;  // 当前已完成请求数
    elapsedTime: number;      // 已用时间（毫秒）
    currentRPS: number;       // 当前每秒请求数
}

// Hook返回类型
export interface UseStressTestReturn {
    // 状态
    apis: ApiInfo[];
    isLoadingApis: boolean;
    apiError: string | null;
    
    // 测试状态
    testStatus: StressTestStatus;
    testResult: StressTestResult | null;
    
    // 方法
    fetchApis: (activityId: string) => Promise<void>;
    startTest: (config: StressTestConfig) => Promise<void>;
    stopTest: () => void;
    resetTest: () => void;
}
