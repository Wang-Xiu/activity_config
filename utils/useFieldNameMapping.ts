import { useState, useEffect, useCallback, useRef } from 'react';
import { 
    FieldNameMapping, 
    FieldNameMappingResponse, 
    UseFieldNameMappingReturn, 
    UseFieldNameMappingOptions 
} from '../types/fieldMapping';
import { fieldNameMapping as fallbackMapping } from '../config/fieldNameMapping';

// 缓存相关常量
const CACHE_KEY = 'fieldNameMapping';
const DEFAULT_CACHE_EXPIRATION = 30 * 60 * 1000; // 30分钟
const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1秒

/**
 * 字段名映射Hook
 * 从后端动态获取字段名映射配置，支持缓存和兜底机制
 */
export default function useFieldNameMapping(options: UseFieldNameMappingOptions = {}): UseFieldNameMappingReturn {
    const {
        enableCache = false, // 默认禁用缓存，确保获取最新数据
        cacheExpiration = DEFAULT_CACHE_EXPIRATION,
        retryCount = DEFAULT_RETRY_COUNT,
        retryDelay = DEFAULT_RETRY_DELAY,
    } = options;

    // 状态管理
    const [fieldNameMapping, setFieldNameMapping] = useState<FieldNameMapping>(fallbackMapping);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFallback, setIsFallback] = useState(true);
    
    // 防止重复请求
    const fetchingRef = useRef(false);
    
    // 从缓存读取数据
    const loadFromCache = useCallback((): FieldNameMapping | null => {
        if (!enableCache || typeof window === 'undefined') return null;
        
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;
            
            const { data, timestamp } = JSON.parse(cached);
            const now = Date.now();
            
            // 检查缓存是否过期
            if (now - timestamp > cacheExpiration) {
                localStorage.removeItem(CACHE_KEY);
                return null;
            }
            
            return data;
        } catch (error) {
            console.warn('读取字段名映射缓存失败:', error);
            localStorage.removeItem(CACHE_KEY);
            return null;
        }
    }, [enableCache, cacheExpiration]);
    
    // 保存数据到缓存
    const saveToCache = useCallback((data: FieldNameMapping) => {
        if (!enableCache || typeof window === 'undefined') return;
        
        try {
            const cacheData = {
                data,
                timestamp: Date.now(),
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('保存字段名映射缓存失败:', error);
        }
    }, [enableCache]);
    
    // 延迟函数
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    // 获取字段名映射数据
    const fetchFieldNameMapping = useCallback(async (currentRetry = 0): Promise<void> => {
        if (fetchingRef.current) return;
        
        try {
            fetchingRef.current = true;
            setIsLoading(true);
            setError(null);
            
            console.log(`正在获取字段名映射配置... (第${currentRetry + 1}次尝试)`);
            
            const response = await fetch('/api/activity/get-ext-config-name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result: FieldNameMappingResponse = await response.json();
            
            if (result.success && result.data) {
                console.log('成功获取字段名映射配置:', {
                    fallback: result.fallback,
                    dataKeys: Object.keys(result.data).length,
                });
                
                setFieldNameMapping(result.data);
                setIsFallback(result.fallback || false);
                
                // 只有非兜底数据才缓存
                if (!result.fallback) {
                    saveToCache(result.data);
                }
                
                setError(null);
            } else {
                throw new Error(result.message || '获取字段名映射配置失败');
            }
        } catch (error) {
            console.error(`获取字段名映射配置失败 (第${currentRetry + 1}次尝试):`, error);
            
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            
            // 重试逻辑
            if (currentRetry < retryCount - 1) {
                console.log(`将在 ${retryDelay}ms 后重试...`);
                await delay(retryDelay);
                return fetchFieldNameMapping(currentRetry + 1);
            }
            
            // 所有重试都失败，使用兜底数据
            console.warn('所有重试都失败，使用本地兜底配置');
            setFieldNameMapping(fallbackMapping);
            setIsFallback(true);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
            fetchingRef.current = false;
        }
    }, [retryCount, retryDelay, saveToCache]);
    
    // 重新获取数据
    const refetch = useCallback(async () => {
        // 清除缓存
        if (enableCache && typeof window !== 'undefined') {
            localStorage.removeItem(CACHE_KEY);
        }
        
        await fetchFieldNameMapping();
    }, [fetchFieldNameMapping, enableCache]);
    
    // 获取显示字段名
    const getDisplayFieldName = useCallback((fieldName: string): string => {
        return fieldNameMapping[fieldName] || fieldName;
    }, [fieldNameMapping]);
    
    // 判断是否为纯英文
    const isPureEnglish = useCallback((str: string): boolean => {
        return /^[a-zA-Z0-9_]+$/.test(str);
    }, []);
    
    // 组件初始化时获取数据
    useEffect(() => {
        let mounted = true;
        
        const initializeMapping = async () => {
            // 如果启用缓存，先尝试从缓存加载
            if (enableCache) {
                const cachedData = loadFromCache();
                if (cachedData) {
                    console.log('使用缓存的字段名映射配置');
                    setFieldNameMapping(cachedData);
                    setIsFallback(false);
                    return;
                }
            }
            
            // 缓存未启用、不存在或过期，从服务器获取最新数据
            if (mounted) {
                console.log('从服务器获取最新字段名映射配置（缓存已禁用）');
                await fetchFieldNameMapping();
            }
        };
        
        initializeMapping();
        
        return () => {
            mounted = false;
        };
    }, [loadFromCache, fetchFieldNameMapping, enableCache]);
    
    return {
        fieldNameMapping,
        getDisplayFieldName,
        isPureEnglish,
        isLoading,
        error,
        isFallback,
        refetch,
    };
}