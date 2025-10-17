// 安全日志相关类型定义

// 威胁等级
export type ThreatLevel = 'high' | 'medium' | 'low';

// 威胁类型
export type ThreatType = 
  | 'sensitive_file_access'    // 敏感文件访问
  | 'admin_panel_access'       // 管理面板访问
  | 'injection_attack'         // 注入攻击
  | 'brute_force'             // 暴力破解
  | 'suspicious_crawling'      // 可疑爬取
  | 'abnormal_method'         // 异常请求方法
  | 'other';                  // 其他

// 安全日志条目
export interface SecurityLogEntry {
    id: number;
    log_time: string;           // 日志时间
    ip: string;                 // IP地址
    method: string;             // 请求方法
    path: string;               // 请求路径
    status: number;             // HTTP状态码
    other: string;              // 其他信息（原始日志）
    created_at: string;         // 创建时间
    threat_level: ThreatLevel;  // 威胁等级
    threat_type: ThreatType;    // 威胁类型
    country?: string;           // 国家
    city?: string;              // 城市
}

// 安全统计数据
export interface SecurityStatistics {
    malicious_requests: number;     // 恶意请求总数
    unique_attack_ips: number;      // 攻击IP数量
    today_attacks: number;          // 今日攻击
    high_risk_attacks: number;      // 高危攻击
    status_distribution: {          // 状态码分布
        [key: string]: number;
    };
    method_distribution: {          // 请求方法分布
        [key: string]: number;
    };
    threat_distribution: {          // 威胁等级分布
        high: number;
        medium: number;
        low: number;
    };
    attack_trends: {                // 攻击趋势
        today: number;
        yesterday: number;
        growth_rate: number;        // 增长率百分比
    };
}

// 时间趋势数据点
export interface TrendDataPoint {
    time: string;                   // 时间点
    total_count: number;            // 总数
    high_risk_count: number;        // 高危数量
    medium_risk_count: number;      // 中危数量
    low_risk_count: number;         // 低危数量
}

// 时间趋势数据
export interface TrendData {
    timeline: TrendDataPoint[];
}

// Top攻击IP
export interface TopAttackIP {
    ip: string;                     // IP地址
    count: number;                  // 攻击次数
    country?: string;               // 国家
    city?: string;                  // 城市
    threat_level: ThreatLevel;      // 威胁等级
    first_seen: string;             // 首次发现时间
    last_seen: string;              // 最后发现时间
}

// 安全日志列表参数
export interface SecurityLogListParams {
    page?: number;
    page_size?: number;
    start_date?: string;            // 开始日期 YYYY-MM-DD
    end_date?: string;              // 结束日期 YYYY-MM-DD
    ip?: string;                    // IP地址搜索
    method?: string;                // 请求方法筛选
    status?: string;                // 状态码筛选
    threat_level?: ThreatLevel;     // 威胁等级筛选
    path_keyword?: string;          // 路径关键词搜索
    sort_field?: string;            // 排序字段
    sort_order?: 'asc' | 'desc';    // 排序方向
}

// 统计查询参数
export interface SecurityStatisticsParams {
    start_date?: string;            // 开始日期
    end_date?: string;              // 结束日期
}

// 趋势查询参数
export interface SecurityTrendParams {
    start_date?: string;            // 开始日期
    end_date?: string;              // 结束日期
    interval?: 'hour' | 'day';      // 时间间隔
}

// Top IP查询参数
export interface TopIPsParams {
    start_date?: string;            // 开始日期
    end_date?: string;              // 结束日期
    limit?: number;                 // 返回数量限制
}

// API响应基础结构
export interface SecurityApiResponse<T> {
    code: number;
    msg: string;
    data: T;
}

// 日志列表响应
export interface SecurityLogListResponse {
    total: number;
    page: number;
    page_size: number;
    list: SecurityLogEntry[];
}

// Top IP列表响应
export interface TopIPsResponse {
    top_ips: TopAttackIP[];
}

// 威胁等级选项
export const THREAT_LEVEL_OPTIONS = [
    { value: 'high', label: '高危', color: 'text-red-600 bg-red-50' },
    { value: 'medium', label: '中危', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'low', label: '低危', color: 'text-green-600 bg-green-50' },
] as const;

// 威胁类型选项
export const THREAT_TYPE_OPTIONS = [
    { value: 'sensitive_file_access', label: '敏感文件访问' },
    { value: 'admin_panel_access', label: '管理面板访问' },
    { value: 'injection_attack', label: '注入攻击' },
    { value: 'brute_force', label: '暴力破解' },
    { value: 'suspicious_crawling', label: '可疑爬取' },
    { value: 'abnormal_method', label: '异常请求方法' },
    { value: 'other', label: '其他' },
] as const;

// HTTP方法选项
export const HTTP_METHOD_OPTIONS = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' },
    { value: 'PATCH', label: 'PATCH' },
    { value: 'HEAD', label: 'HEAD' },
] as const;

// 常见状态码选项
export const STATUS_CODE_OPTIONS = [
    { value: '200', label: '200 - 成功' },
    { value: '401', label: '401 - 未授权' },
    { value: '403', label: '403 - 禁止访问' },
    { value: '404', label: '404 - 未找到' },
    { value: '500', label: '500 - 服务器错误' },
] as const;
