import { useState, useCallback, useRef } from 'react';
import {
    ApiInfo,
    ApiDiscoveryResponse,
    StressTestConfig,
    StressTestResult,
    StressTestStatus,
    RequestResult,
    UseStressTestReturn
} from '../types/stress-test';
import { getCurrentApiConfig } from '../config/environment';

/**
 * 压力测试Hook
 * 支持API发现、压力测试执行和结果分析
 */
export default function useStressTest(): UseStressTestReturn {
    // API列表相关状态
    const [apis, setApis] = useState<ApiInfo[]>([]);
    const [isLoadingApis, setIsLoadingApis] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    
    // 测试状态
    const [testStatus, setTestStatus] = useState<StressTestStatus>({
        isRunning: false,
        progress: 0,
        currentRequests: 0,
        elapsedTime: 0,
        currentRPS: 0,
    });
    
    const [testResult, setTestResult] = useState<StressTestResult | null>(null);
    
    // 控制测试的引用
    const abortControllerRef = useRef<AbortController | null>(null);
    const testStartTimeRef = useRef<number>(0);
    const resultsRef = useRef<RequestResult[]>([]);
    
    // 获取活动的API列表
    const fetchApis = useCallback(async (activityId: string) => {
        if (!activityId.trim()) {
            setApiError('活动ID不能为空');
            return;
        }
        
        try {
            setIsLoadingApis(true);
            setApiError(null);
            
            console.log(`正在获取活动ID ${activityId} 的API列表...`);
            
            const { postToNextjsApi } = await import('./frontendApiClient');
            const response = await postToNextjsApi('/api/activity/get-apis', { activityId });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success && result.data) {
                console.log('成功获取API列表:', {
                    controller: result.data.controller,
                    total: result.data.total,
                    apis: result.data.apis.length
                });
                
                setApis(result.data.apis);
                setApiError(null);
            } else {
                throw new Error(result.message || '获取API列表失败');
            }
        } catch (error) {
            console.error('获取API列表失败:', error);
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            setApiError(errorMessage);
            setApis([]);
        } finally {
            setIsLoadingApis(false);
        }
    }, []);
    
    // 构建PHP接口URL
    const buildPhpApiUrl = useCallback((apiInfo: ApiInfo, customParameters: { [key: string]: any }): string => {
        const apiConfig = getCurrentApiConfig();
        const baseUrl = apiConfig.baseUrl;
        
        // 直接使用 url_pattern，前面拼接 activity
        // url_pattern 格式如: "/city-gift/base-data"
        // 构建 r 参数格式: "activity/city-gift/base-data"
        const urlPattern = apiInfo.url_pattern;
        const rParam = `activity${urlPattern}`;
        
        // 构建完整的参数对象
        const allParams = {
            r: rParam,
            uid: '100056',
            auth: '1',
            debug: '1',
            ...customParameters
        };
        
        // 构建URL参数字符串 - 手动构建避免过度编码
        const paramPairs: string[] = [];
        Object.entries(allParams).forEach(([key, value]) => {
            // r 参数不进行编码，其他参数正常编码
            if (key === 'r') {
                paramPairs.push(`${key}=${value}`);
            } else {
                paramPairs.push(`${key}=${encodeURIComponent(String(value))}`);
            }
        });
        
        const fullUrl = `${baseUrl}/index.php?${paramPairs.join('&')}`;
        
        console.log(`构建PHP接口URL:`, {
            原始urlPattern: urlPattern,
            构建的rParam: rParam,
            完整URL: fullUrl
        });
        
        return fullUrl;
    }, []);

    // 执行单个请求
    const executeRequest = useCallback(async (
        apiInfo: ApiInfo,
        config: StressTestConfig,
        signal: AbortSignal
    ): Promise<RequestResult> => {
        const startTime = Date.now();
        
        try {
            // 构建PHP接口URL
            const fullUrl = buildPhpApiUrl(apiInfo, config.customParameters);
            
            const response = await fetch(fullUrl, {
                method: config.method,
                headers: config.headers,
                signal,
                // 添加连接控制选项
                keepalive: false, // 禁用keep-alive，避免连接池耗尽
            });
            
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            // 获取响应大小
            const responseText = await response.text();
            const responseSize = new Blob([responseText]).size;
            
            const result = {
                success: response.ok,
                responseTime,
                statusCode: response.status,
                responseSize,
                error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
            };
            
            // 调试信息：记录429状态码
            if (response.status === 429) {
                console.log('检测到429限流响应:', result);
            }
            
            return result;
        } catch (error) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            if (error instanceof Error && error.name === 'AbortError') {
                throw error; // 重新抛出取消错误
            }
            
            // 尝试从错误信息中提取状态码
            let statusCode: number | undefined = undefined;
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            
            // 对于 "Failed to fetch" 错误，很可能是被CORS阻止的429响应
            // 我们需要特别处理这种情况
            if (errorMessage === 'Failed to fetch') {
                // 由于浏览器开发者工具显示429，但fetch被阻止，我们假定这是429错误
                statusCode = 429;
                console.log('检测到被CORS阻止的429响应 (Failed to fetch)');
                return {
                    success: false,
                    responseTime,
                    statusCode: 429,
                    error: 'Rate Limited (429) - 服务器限流',
                };
            }
            
            // 检查是否是fetch相关的HTTP错误
            if (errorMessage.includes('429')) {
                statusCode = 429;
                console.log('从catch块中检测到429错误:', errorMessage);
            } else if (errorMessage.includes('404')) {
                statusCode = 404;
            } else if (errorMessage.includes('500')) {
                statusCode = 500;
            } else if (errorMessage.includes('502')) {
                statusCode = 502;
            } else if (errorMessage.includes('503')) {
                statusCode = 503;
            } else if (errorMessage.includes('504')) {
                statusCode = 504;
            }
            
            return {
                success: false,
                responseTime,
                statusCode,
                error: errorMessage,
            };
        }
    }, [buildPhpApiUrl]);
    
    // 计算测试结果统计
    const calculateResults = useCallback((results: RequestResult[], duration: number): StressTestResult => {
        // 分类统计不同类型的请求
        const successResults = results.filter(r => r.success);
        const failedResults = results.filter(r => !r.success);
        
        // 区分限流和其他错误
        const rateLimitResults = results.filter(r => r.statusCode === 429);
        const otherFailedResults = failedResults.filter(r => r.statusCode !== 429);
        
        // 只使用成功请求计算响应时间统计（排除失败请求）
        const successResponseTimes = successResults.map(r => r.responseTime).sort((a, b) => a - b);
        const validResponseTimes = successResponseTimes.length > 0 ? successResponseTimes : [0];
        
        // 专业的分位数计算函数
        const getPercentile = (arr: number[], percentile: number): number => {
            if (arr.length === 0) return 0;
            const index = (percentile / 100) * (arr.length - 1);
            const lower = Math.floor(index);
            const upper = Math.ceil(index);
            const weight = index % 1;
            
            if (upper >= arr.length) return arr[arr.length - 1];
            return arr[lower] * (1 - weight) + arr[upper] * weight;
        };
        
        // 计算平均响应时间（只基于成功请求）
        const averageResponseTime = validResponseTimes.length > 0 
            ? validResponseTimes.reduce((sum, time) => sum + time, 0) / validResponseTimes.length 
            : 0;
        
        // 计算标准差
        const variance = validResponseTimes.length > 0
            ? validResponseTimes.reduce((sum, time) => sum + Math.pow(time - averageResponseTime, 2), 0) / validResponseTimes.length
            : 0;
        const standardDeviation = Math.sqrt(variance);
        
        // 错误类型统计（更详细的分类）
        const errorTypes: { [key: string]: number } = {};
        failedResults.forEach(result => {
            let errorType = 'Unknown Error';
            
            if (result.statusCode === 429) {
                errorType = 'Rate Limiting (429)';
            } else if (result.statusCode === 404) {
                errorType = 'Not Found (404)';
            } else if (result.statusCode === 500) {
                errorType = 'Internal Server Error (500)';
            } else if (result.statusCode === 502) {
                errorType = 'Bad Gateway (502)';
            } else if (result.statusCode === 503) {
                errorType = 'Service Unavailable (503)';
            } else if (result.statusCode === 504) {
                errorType = 'Gateway Timeout (504)';
            } else if (result.statusCode && result.statusCode >= 400 && result.statusCode < 500) {
                errorType = `Client Error (${result.statusCode})`;
            } else if (result.statusCode && result.statusCode >= 500) {
                errorType = `Server Error (${result.statusCode})`;
            } else if (result.error?.includes('timeout')) {
                errorType = 'Request Timeout';
            } else if (result.error?.includes('network')) {
                errorType = 'Network Error';
            } else if (result.error) {
                errorType = result.error;
            }
            
            errorTypes[errorType] = (errorTypes[errorType] || 0) + 1;
        });
        
        // 计算成功率和有效吞吐量
        const successRate = results.length > 0 ? (successResults.length / results.length) * 100 : 0;
        const effectiveRPS = successResults.length / (duration / 1000); // 只计算成功请求的RPS
        const totalRPS = results.length / (duration / 1000); // 总RPS（包括失败请求）
        
        // 调试信息
        console.log('压力测试结果统计:', {
            总请求数: results.length,
            成功请求数: successResults.length,
            失败请求数: failedResults.length,
            限流请求数: rateLimitResults.length,
            其他失败请求数: otherFailedResults.length,
            状态码分布: results.reduce((acc: any, r) => {
                const code = r.statusCode || 'unknown';
                acc[code] = (acc[code] || 0) + 1;
                return acc;
            }, {})
        });
        
        // 详细调试：显示所有unknown状态码的请求
        const unknownResults = results.filter(r => !r.statusCode);
        if (unknownResults.length > 0) {
            console.log('Unknown状态码的请求详情（通常是网络连接失败）:', unknownResults.map(r => ({
                success: r.success,
                statusCode: r.statusCode,
                error: r.error,
                responseTime: r.responseTime
            })));
            
            // 分析错误类型
            const errorTypes = unknownResults.reduce((acc: any, r) => {
                const errorType = r.error || 'Unknown';
                acc[errorType] = (acc[errorType] || 0) + 1;
                return acc;
            }, {});
            console.log('Unknown错误类型分布:', errorTypes);
        }
        
        // 详细调试：显示所有429状态码的请求
        const rate429Results = results.filter(r => r.statusCode === 429);
        if (rate429Results.length > 0) {
            console.log('429状态码的请求详情:', rate429Results.map(r => ({
                success: r.success,
                statusCode: r.statusCode,
                error: r.error,
                responseTime: r.responseTime
            })));
        }
        
        return {
            startTime: new Date(testStartTimeRef.current).toISOString(),
            endTime: new Date().toISOString(),
            duration,
            totalRequests: results.length,
            successRequests: successResults.length,
            failedRequests: failedResults.length,
            rateLimitRequests: rateLimitResults.length,
            otherFailedRequests: otherFailedResults.length,
            successRate,
            averageResponseTime,
            minResponseTime: validResponseTimes.length > 0 ? Math.min(...validResponseTimes) : 0,
            maxResponseTime: validResponseTimes.length > 0 ? Math.max(...validResponseTimes) : 0,
            standardDeviation,
            p50ResponseTime: getPercentile(validResponseTimes, 50),
            p90ResponseTime: getPercentile(validResponseTimes, 90),
            p95ResponseTime: getPercentile(validResponseTimes, 95),
            p99ResponseTime: getPercentile(validResponseTimes, 99),
            p99_9ResponseTime: getPercentile(validResponseTimes, 99.9),
            requestsPerSecond: totalRPS,
            effectiveRequestsPerSecond: effectiveRPS,
            errorTypes,
            results,
        };
    }, []);
    
    // 开始压力测试
    const startTest = useCallback(async (config: StressTestConfig) => {
        // 重置状态
        setTestResult(null);
        resultsRef.current = [];
        abortControllerRef.current = new AbortController();
        testStartTimeRef.current = Date.now();
        
        setTestStatus({
            isRunning: true,
            progress: 0,
            currentRequests: 0,
            elapsedTime: 0,
            currentRPS: 0,
        });
        
        try {
            console.log('开始压力测试:', {
                api: config.apiInfo.url_pattern,
                concurrency: config.concurrency,
                totalRequests: config.totalRequests,
            });
            
            // 执行压力测试 - 新逻辑：totalRequests 轮次，每轮 concurrency 个并发请求
            const totalRounds = config.totalRequests;  // 执行轮次
            const requestsPerRound = config.concurrency; // 每轮的并发请求数
            const totalRequestCount = totalRounds * requestsPerRound; // 总请求数
            
            console.log('压力测试参数:', {
                totalRounds,
                requestsPerRound,
                totalRequestCount,
                说明: `将执行${totalRounds}轮测试，每轮并发${requestsPerRound}个请求，总计${totalRequestCount}个请求`
            });
            
            for (let roundIndex = 0; roundIndex < totalRounds; roundIndex++) {
                if (abortControllerRef.current?.signal.aborted) {
                    break;
                }
                
                console.log(`执行第${roundIndex + 1}轮: ${requestsPerRound}个并发请求`);
                
                // 并发执行当前轮次的请求
                const roundPromises = Array.from({ length: requestsPerRound }, () =>
                    executeRequest(config.apiInfo, config, abortControllerRef.current!.signal)
                );
                
                const batchResults = await Promise.allSettled(roundPromises);
                
                // 处理批次结果
                const validResults = batchResults
                    .filter(result => result.status === 'fulfilled')
                    .map(result => (result as PromiseFulfilledResult<RequestResult>).value);
                
                resultsRef.current.push(...validResults);
                
                // 更新进度
                const currentRequests = resultsRef.current.length;
                const progress = (currentRequests / config.totalRequests) * 100;
                const elapsedTime = Date.now() - testStartTimeRef.current;
                const currentRPS = currentRequests / (elapsedTime / 1000);
                
                setTestStatus({
                    isRunning: true,
                    progress,
                    currentRequests,
                    elapsedTime,
                    currentRPS,
                });
                
                // 检查是否被取消
                if (abortControllerRef.current?.signal.aborted) {
                    break;
                }
            }
            
            // 计算最终结果
            const totalDuration = Date.now() - testStartTimeRef.current;
            const finalResult = calculateResults(resultsRef.current, totalDuration);
            
            setTestResult(finalResult);
            setTestStatus(prev => ({ ...prev, isRunning: false }));
            
            console.log('压力测试完成:', {
                totalRequests: finalResult.totalRequests,
                successRequests: finalResult.successRequests,
                averageResponseTime: finalResult.averageResponseTime,
                requestsPerSecond: finalResult.requestsPerSecond,
            });
            
        } catch (error) {
            console.error('压力测试执行失败:', error);
            setTestStatus(prev => ({ ...prev, isRunning: false }));
            
            if (resultsRef.current.length > 0) {
                const totalDuration = Date.now() - testStartTimeRef.current;
                const partialResult = calculateResults(resultsRef.current, totalDuration);
                setTestResult(partialResult);
            }
        }
    }, [executeRequest, calculateResults]);
    
    // 停止测试
    const stopTest = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        setTestStatus(prev => ({ ...prev, isRunning: false }));
        
        if (resultsRef.current.length > 0) {
            const totalDuration = Date.now() - testStartTimeRef.current;
            const finalResult = calculateResults(resultsRef.current, totalDuration);
            setTestResult(finalResult);
        }
        
        console.log('压力测试已停止');
    }, [calculateResults]);
    
    // 重置测试
    const resetTest = useCallback(() => {
        if (testStatus.isRunning) {
            stopTest();
        }
        
        setTestResult(null);
        setTestStatus({
            isRunning: false,
            progress: 0,
            currentRequests: 0,
            elapsedTime: 0,
            currentRPS: 0,
        });
        
        resultsRef.current = [];
        console.log('压力测试状态已重置');
    }, [testStatus.isRunning, stopTest]);
    
    return {
        apis,
        isLoadingApis,
        apiError,
        testStatus,
        testResult,
        fetchApis,
        startTest,
        stopTest,
        resetTest,
    };
}
