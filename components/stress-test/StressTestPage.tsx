'use client';

import { useState, useEffect, useMemo } from 'react';
import { ApiInfo, StressTestConfig } from '../../types/stress-test';
import useStressTest from '../../utils/useStressTest';
import { LoadingButton, LoadingSpinner } from '../ui/loading';
import { useToast } from '../ToastProvider';

interface StressTestPageProps {
    activityId: string;
}

export default function StressTestPage({ activityId }: StressTestPageProps) {
    const [selectedApi, setSelectedApi] = useState<ApiInfo | null>(null);
    const [testConfig, setTestConfig] = useState<Partial<StressTestConfig>>({
        concurrency: 10,
        totalRequests: 100,
        method: 'GET',
        timeout: 5000,
        customParameters: {},
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const [customParams, setCustomParams] = useState<string>('');
    const [showResults, setShowResults] = useState(false);

    const {
        apis,
        isLoadingApis,
        apiError,
        testStatus,
        testResult,
        fetchApis,
        startTest,
        stopTest,
        resetTest,
    } = useStressTest();

    const { showSuccess, showError, showWarning, showInfo } = useToast();

    // 加载API列表
    useEffect(() => {
        if (activityId) {
            fetchApis(activityId);
        }
    }, [activityId, fetchApis]);

    // 解析自定义参数
    const parsedCustomParams = useMemo(() => {
        if (!customParams.trim()) return {};
        
        try {
            return JSON.parse(customParams);
        } catch {
            // 尝试解析为URL参数格式
            const params: { [key: string]: string } = {};
            customParams.split('&').forEach(param => {
                const [key, value] = param.split('=');
                if (key && value) {
                    params[key.trim()] = decodeURIComponent(value.trim());
                }
            });
            return params;
        }
    }, [customParams]);

    // 开始测试
    const handleStartTest = async () => {
        if (!selectedApi) {
            showWarning('请先选择要测试的API');
            return;
        }

        if (!testConfig.concurrency || !testConfig.totalRequests) {
            showWarning('请填写并发数和总请求数');
            return;
        }

        const config: StressTestConfig = {
            apiInfo: selectedApi,
            baseUrl: '', // 不再需要，会从环境配置中自动获取
            concurrency: testConfig.concurrency!,
            totalRequests: testConfig.totalRequests!,
            duration: testConfig.duration,
            customParameters: {
                ...parsedCustomParams,
                actId: activityId,
                // uid, auth, debug 等参数会在 buildPhpApiUrl 中自动添加
            },
            method: testConfig.method!,
            headers: testConfig.headers!,
            timeout: testConfig.timeout!,
        };

        try {
            setShowResults(true);
            showInfo('压力测试已开始...');
            await startTest(config);
            showSuccess('压力测试完成');
        } catch (error) {
            console.error('压力测试失败:', error);
            showError('压力测试执行失败');
        }
    };

    // 停止测试
    const handleStopTest = () => {
        stopTest();
        showInfo('压力测试已停止');
    };

    // 重置测试
    const handleResetTest = () => {
        resetTest();
        setShowResults(false);
        showInfo('测试状态已重置');
    };

    // 格式化时间
    const formatTime = (ms: number) => {
        if (ms < 1000) return `${ms.toFixed(2)}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    // 格式化数字
    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-900">
                    压力测试 - 活动ID: {activityId}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    选择API接口并配置参数进行压力测试，查看性能指标和响应时间分析
                </p>
            </div>

            {/* API列表 */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">API接口列表</h3>
                
                {isLoadingApis ? (
                    <div className="flex items-center justify-center py-8">
                        <LoadingSpinner />
                        <span className="ml-2 text-gray-600">加载API列表...</span>
                    </div>
                ) : apiError ? (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">加载失败</h3>
                                <p className="mt-1 text-sm text-red-700">{apiError}</p>
                                <button
                                    onClick={() => fetchApis(activityId)}
                                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                                >
                                    重试
                                </button>
                            </div>
                        </div>
                    </div>
                ) : apis.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        暂无可用的API接口
                    </div>
                ) : (
                    <div className="space-y-2">
                        {apis.map((api, index) => (
                            <div
                                key={index}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                    selectedApi === api
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                                onClick={() => setSelectedApi(api)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            {api.action} ({api.method_name})
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">{api.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {api.http_methods} {api.url_pattern}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {api.controller}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 测试配置 */}
            {selectedApi && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">测试配置</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 基本配置 */}
                        <div className="space-y-4">
                            <h4 className="font-medium text-gray-700">基本配置</h4>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    每轮并发数
                                    <span className="text-xs text-gray-500">每轮同时发送的请求数</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={testConfig.concurrency || ''}
                                    onChange={(e) => setTestConfig(prev => ({
                                        ...prev,
                                        concurrency: parseInt(e.target.value) || 1
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="同时发送的请求数"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    测试轮次
                                    <span className="text-xs text-gray-500">执行多少轮压力测试</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={testConfig.totalRequests || ''}
                                    onChange={(e) => setTestConfig(prev => ({
                                        ...prev,
                                        totalRequests: parseInt(e.target.value) || 1
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="测试轮次数"
                                />
                            </div>
                            
                            {/* 测试说明 */}
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="text-sm text-blue-700">
                                    <span className="font-medium">测试说明：</span>
                                    将执行 <span className="font-medium text-blue-800">{testConfig.totalRequests || 0}</span> 轮测试，
                                    每轮并发 <span className="font-medium text-blue-800">{testConfig.concurrency || 0}</span> 个请求，
                                    总计 <span className="font-medium text-blue-800">{(testConfig.totalRequests || 0) * (testConfig.concurrency || 0)}</span> 个请求
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    请求方法
                                </label>
                                <select
                                    value={testConfig.method || 'GET'}
                                    onChange={(e) => setTestConfig(prev => ({
                                        ...prev,
                                        method: e.target.value as 'GET' | 'POST'
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    超时时间 (毫秒)
                                </label>
                                <input
                                    type="number"
                                    min="1000"
                                    value={testConfig.timeout || ''}
                                    onChange={(e) => setTestConfig(prev => ({
                                        ...prev,
                                        timeout: parseInt(e.target.value) || 5000
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="请求超时时间"
                                />
                            </div>
                        </div>
                        
                        {/* 自定义参数 */}
                        <div className="space-y-4">
                            <h4 className="font-medium text-gray-700">自定义参数</h4>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    请求参数
                                </label>
                                <textarea
                                    rows={8}
                                    value={customParams}
                                    onChange={(e) => setCustomParams(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="支持JSON格式或URL参数格式：&#10;JSON: {&quot;key1&quot;: &quot;value1&quot;, &quot;key2&quot;: &quot;value2&quot;}&#10;URL: key1=value1&key2=value2&#10;&#10;注意：以下参数会自动添加：&#10;- r: PHP路由参数（从API路径自动生成）&#10;- act_id: 活动ID&#10;- uid: 100056&#10;- auth: 1&#10;- debug: 1"
                                />
                            </div>
                            
                            {Object.keys(parsedCustomParams).length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        解析结果预览
                                    </label>
                                    <div className="bg-gray-50 p-3 rounded-md text-sm">
                                        <pre>{JSON.stringify(parsedCustomParams, null, 2)}</pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* 操作按钮 */}
                    <div className="mt-6 flex items-center space-x-4">
                        <LoadingButton
                            loading={testStatus.isRunning}
                            loadingText="测试中..."
                            onClick={handleStartTest}
                            disabled={!selectedApi || testStatus.isRunning}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            开始测试
                        </LoadingButton>
                        
                        {testStatus.isRunning && (
                            <button
                                onClick={handleStopTest}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                            >
                                停止测试
                            </button>
                        )}
                        
                        <button
                            onClick={handleResetTest}
                            disabled={testStatus.isRunning}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors disabled:opacity-50"
                        >
                            重置
                        </button>
                    </div>
                </div>
            )}

            {/* 测试进度 */}
            {(testStatus.isRunning || showResults) && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">测试进度</h3>
                    
                    {testStatus.isRunning && (
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>进度</span>
                                    <span>{testStatus.progress.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${testStatus.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">已完成请求</span>
                                    <div className="font-medium">{formatNumber(testStatus.currentRequests)}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600">已用时间</span>
                                    <div className="font-medium">{formatTime(testStatus.elapsedTime)}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600">当前RPS</span>
                                    <div className="font-medium">{testStatus.currentRPS.toFixed(2)}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600">状态</span>
                                    <div className="font-medium text-green-600">运行中</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 测试结果 */}
            {testResult && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">测试结果</h3>
                    
                    {/* 概览统计 */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="text-center bg-blue-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {formatNumber(testResult.totalRequests)}
                            </div>
                            <div className="text-sm text-gray-600">总请求数</div>
                        </div>
                        <div className="text-center bg-green-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {formatNumber(testResult.successRequests)}
                            </div>
                            <div className="text-sm text-gray-600">成功请求</div>
                            <div className="text-xs text-green-500 mt-1">
                                {testResult.successRate.toFixed(1)}%
                            </div>
                        </div>
                        <div className="text-center bg-yellow-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">
                                {formatNumber(testResult.rateLimitRequests)}
                            </div>
                            <div className="text-sm text-gray-600">限流请求</div>
                            <div className="text-xs text-yellow-500 mt-1">429错误</div>
                        </div>
                        <div className="text-center bg-red-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                                {formatNumber(testResult.otherFailedRequests)}
                            </div>
                            <div className="text-sm text-gray-600">其他失败</div>
                            <div className="text-xs text-red-500 mt-1">非限流错误</div>
                        </div>
                        <div className="text-center bg-purple-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {testResult.effectiveRequestsPerSecond.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">有效RPS</div>
                            <div className="text-xs text-purple-500 mt-1">
                                总RPS: {testResult.requestsPerSecond.toFixed(2)}
                            </div>
                        </div>
                    </div>
                    
                    {/* 响应时间分析 */}
                    <div className="mb-6">
                        <h4 className="font-medium text-gray-700 mb-3">响应时间分析 (基于成功请求)</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                                <div className="text-center">
                                    <span className="text-gray-600 block">平均</span>
                                    <div className="font-bold text-lg text-blue-600">{formatTime(testResult.averageResponseTime)}</div>
                                </div>
                                <div className="text-center">
                                    <span className="text-gray-600 block">最小</span>
                                    <div className="font-bold text-lg text-green-600">{formatTime(testResult.minResponseTime)}</div>
                                </div>
                                <div className="text-center">
                                    <span className="text-gray-600 block">最大</span>
                                    <div className="font-bold text-lg text-red-600">{formatTime(testResult.maxResponseTime)}</div>
                                </div>
                                <div className="text-center">
                                    <span className="text-gray-600 block">标准差</span>
                                    <div className="font-bold text-lg text-purple-600">{formatTime(testResult.standardDeviation)}</div>
                                </div>
                                <div className="text-center">
                                    <span className="text-gray-600 block">测试时长</span>
                                    <div className="font-bold text-lg text-gray-600">{formatTime(testResult.duration)}</div>
                                </div>
                            </div>
                            
                            <div className="border-t pt-4">
                                <h5 className="font-medium text-gray-700 mb-2">响应时间分位数分析</h5>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-sm">
                                    <div className="bg-white p-2 rounded text-center">
                                        <span className="text-gray-500 block">P50</span>
                                        <div className="font-medium">{formatTime(testResult.p50ResponseTime)}</div>
                                    </div>
                                    <div className="bg-white p-2 rounded text-center">
                                        <span className="text-gray-500 block">P90</span>
                                        <div className="font-medium">{formatTime(testResult.p90ResponseTime)}</div>
                                    </div>
                                    <div className="bg-white p-2 rounded text-center">
                                        <span className="text-gray-500 block">P95</span>
                                        <div className="font-medium">{formatTime(testResult.p95ResponseTime)}</div>
                                    </div>
                                    <div className="bg-white p-2 rounded text-center">
                                        <span className="text-gray-500 block">P99</span>
                                        <div className="font-medium">{formatTime(testResult.p99ResponseTime)}</div>
                                    </div>
                                    <div className="bg-white p-2 rounded text-center">
                                        <span className="text-gray-500 block">P99.9</span>
                                        <div className="font-medium">{formatTime(testResult.p99_9ResponseTime)}</div>
                                    </div>
                                    <div className="bg-white p-2 rounded text-center">
                                        <span className="text-gray-500 block">样本数</span>
                                        <div className="font-medium">{formatNumber(testResult.successRequests)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* 错误统计 */}
                    {Object.keys(testResult.errorTypes).length > 0 && (
                        <div>
                            <h4 className="font-medium text-gray-700 mb-3">错误统计与分析</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid gap-3">
                                    {Object.entries(testResult.errorTypes)
                                        .sort(([,a], [,b]) => b - a) // 按错误数量排序
                                        .map(([error, count]) => {
                                            const percentage = ((count / testResult.totalRequests) * 100).toFixed(2);
                                            const isRateLimit = error.includes('429');
                                            const isServerError = error.includes('50') || error.includes('Server Error');
                                            const isClientError = error.includes('40') || error.includes('Client Error');
                                            
                                            let bgColor = 'bg-red-50 border-red-200';
                                            let textColor = 'text-red-800';
                                            let countColor = 'text-red-600';
                                            let icon = '❌';
                                            
                                            if (isRateLimit) {
                                                bgColor = 'bg-yellow-50 border-yellow-200';
                                                textColor = 'text-yellow-800';
                                                countColor = 'text-yellow-600';
                                                icon = '⚠️';
                                            } else if (isServerError) {
                                                bgColor = 'bg-red-50 border-red-200';
                                                textColor = 'text-red-800';
                                                countColor = 'text-red-600';
                                                icon = '🔥';
                                            } else if (isClientError) {
                                                bgColor = 'bg-orange-50 border-orange-200';
                                                textColor = 'text-orange-800';
                                                countColor = 'text-orange-600';
                                                icon = '⚡';
                                            }
                                            
                                            return (
                                                <div key={error} className={`flex justify-between items-center p-3 border rounded-lg ${bgColor}`}>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-lg">{icon}</span>
                                                        <div>
                                                            <span className={`text-sm font-medium ${textColor}`}>{error}</span>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {isRateLimit && '服务器限流保护，属于正常现象'}
                                                                {isServerError && '服务器内部错误，需要检查服务器状态'}
                                                                {isClientError && '客户端请求错误，检查请求参数'}
                                                                {!isRateLimit && !isServerError && !isClientError && '网络或其他错误'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-sm font-bold ${countColor}`}>
                                                            {formatNumber(count)} 次
                                                        </span>
                                                        <div className="text-xs text-gray-500">
                                                            {percentage}%
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                                
                                {testResult.rateLimitRequests > 0 && (
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-start space-x-2">
                                            <span className="text-blue-500">ℹ️</span>
                                            <div className="text-sm">
                                                <div className="font-medium text-blue-800">关于限流 (429 错误)</div>
                                                <div className="text-blue-700 mt-1">
                                                    限流是服务器的保护机制，表明您的压力测试已经达到或超过了服务器的处理能力。
                                                    这些请求被服务器主动拒绝以保护系统稳定性，是正常的压力测试现象。
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {testResult.otherFailedRequests > 0 && Object.keys(testResult.errorTypes).some(error => error.includes('Failed to fetch')) && (
                                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                        <div className="flex items-start space-x-2">
                                            <span className="text-orange-500">⚠️</span>
                                            <div className="text-sm">
                                                <div className="font-medium text-orange-800">关于网络连接失败 (Failed to fetch)</div>
                                                <div className="text-orange-700 mt-1">
                                                    <p>"Failed to fetch" 错误通常表示：</p>
                                                    <ul className="mt-1 list-disc list-inside space-y-1">
                                                        <li>并发连接数超过浏览器或服务器限制</li>
                                                        <li>网络连接在建立时失败</li>
                                                        <li>服务器连接池已满，拒绝新连接</li>
                                                    </ul>
                                                    <p className="mt-2 font-medium">建议：降低并发数（推荐5-10个）或检查网络连接。</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
