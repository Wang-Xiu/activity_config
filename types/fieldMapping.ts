/**
 * 字段名映射相关类型定义
 */

// 字段名映射配置类型
export interface FieldNameMapping {
    [key: string]: string;
}

// 字段名映射API响应类型
export interface FieldNameMappingResponse {
    success: boolean;
    message: string;
    data: FieldNameMapping;
    fallback?: boolean; // 是否为兜底数据
    error?: string; // 错误信息（如果有）
    timestamp?: string; // 时间戳
}

// 字段名映射Hook返回类型
export interface UseFieldNameMappingReturn {
    // 字段名映射数据
    fieldNameMapping: FieldNameMapping;
    // 获取显示字段名的函数
    getDisplayFieldName: (fieldName: string) => string;
    // 判断是否为纯英文的函数
    isPureEnglish: (str: string) => boolean;
    // 加载状态
    isLoading: boolean;
    // 错误信息
    error: string | null;
    // 是否为兜底数据
    isFallback: boolean;
    // 重新获取数据的函数
    refetch: () => Promise<void>;
}

// 字段名映射Hook配置选项
export interface UseFieldNameMappingOptions {
    // 是否启用缓存
    enableCache?: boolean;
    // 缓存过期时间（毫秒）
    cacheExpiration?: number;
    // 自动重试次数
    retryCount?: number;
    // 重试延迟（毫秒）
    retryDelay?: number;
}