'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    SecurityLogEntry, 
    SecurityStatistics, 
    SecurityLogListParams,
    SecurityApiResponse,
    SecurityLogListResponse,
    calculateThreatLevel,
    getThreatLevelWeight
} from '../../types/security-logs';
import { postToNextjsApi } from '../../utils/frontendApiClient';
import { useToast } from '../ToastProvider';
import StatisticsCards from './StatisticsCards';
import FilterPanel from './FilterPanel';
import SecurityLogsTable from './SecurityLogsTable';
import TrendChart from './TrendChart';
import TopIPsList from './TopIPsList';
import ThreatDistribution from './ThreatDistribution';
import BannedIPsList from './BannedIPsList';

interface SecurityLogsPageProps {
    activityId: string;
}

type SortField = 'log_time' | 'threat_level';
type SortOrder = 'asc' | 'desc';

export default function SecurityLogsPage({ activityId }: SecurityLogsPageProps) {
    const [logs, setLogs] = useState<SecurityLogEntry[]>([]);
    const [statistics, setStatistics] = useState<SecurityStatistics | null>(null);
    const [loading, setLoading] = useState(false);
    const [statisticsLoading, setStatisticsLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [sortField, setSortField] = useState<SortField>('log_time');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [filters, setFilters] = useState<SecurityLogListParams>({
        page: 1,
        page_size: 20,
        start_date: new Date().toISOString().split('T')[0], // 默认今天
        end_date: new Date().toISOString().split('T')[0],
        sort_field: 'log_time',
        sort_order: 'desc'
    });

    const { showSuccess, showError } = useToast();

    // 获取安全日志列表
    const fetchSecurityLogs = async (searchFilters?: SecurityLogListParams) => {
        setLoading(true);
        try {
            const requestParams = searchFilters || filters;
            
            console.log('开始获取安全日志列表:', requestParams);
            
            const response = await postToNextjsApi('/api/security-logs/list', requestParams);
            
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
            }
            
            let result: SecurityApiResponse<SecurityLogListResponse>;
            try {
                result = await response.json();
            } catch (jsonError) {
                console.error('解析响应JSON失败:', jsonError);
                throw new Error('服务器响应格式错误');
            }
            
            console.log('获取安全日志列表响应:', result);
            
            if (result.success) {
                const logsList = result.data.list || [];
                console.log('日志列表数据类型检查:', {
                    isArray: Array.isArray(logsList),
                    type: typeof logsList,
                    length: logsList.length,
                    data: logsList
                });
                setLogs(logsList);
                setTotal(result.data.total || 0);
                console.log('成功获取安全日志列表:', result.data);
            } else {
                const errorMsg = result.message || '获取安全日志列表失败';
                console.error('获取安全日志列表失败:', errorMsg);
                showError(`获取安全日志列表失败: ${errorMsg}`);
                setLogs([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('获取安全日志列表出错:', error);
            const errorMsg = error instanceof Error ? error.message : '未知错误';
            showError(`获取安全日志列表时发生错误: ${errorMsg}`);
            setLogs([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    // 获取统计数据
    const fetchStatistics = async (dateFilters?: { start_date?: string; end_date?: string }) => {
        setStatisticsLoading(true);
        try {
            const requestParams = {
                start_date: dateFilters?.start_date || filters.start_date,
                end_date: dateFilters?.end_date || filters.end_date
            };
            
            console.log('开始获取安全日志统计:', requestParams);
            
            const response = await postToNextjsApi('/api/security-logs/statistics', requestParams);
            
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
            }
            
            let result: SecurityApiResponse<SecurityStatistics>;
            try {
                result = await response.json();
            } catch (jsonError) {
                console.error('解析统计响应JSON失败:', jsonError);
                throw new Error('服务器响应格式错误');
            }
            
            console.log('获取安全日志统计响应:', result);
            
            if (result.success) {
                setStatistics(result.data);
                console.log('成功获取安全日志统计:', result.data);
            } else {
                const errorMsg = result.message || '获取统计数据失败';
                console.error('获取统计数据失败:', errorMsg);
                showError(`获取统计数据失败: ${errorMsg}`);
            }
        } catch (error) {
            console.error('获取统计数据出错:', error);
            const errorMsg = error instanceof Error ? error.message : '未知错误';
            showError(`获取统计数据时发生错误: ${errorMsg}`);
        } finally {
            setStatisticsLoading(false);
        }
    };

    // 处理筛选条件变化
    const handleFiltersChange = useCallback((newFilters: SecurityLogListParams) => {
        setFilters(newFilters);
    }, []);

    // 处理搜索
    const handleSearch = useCallback(() => {
        fetchSecurityLogs(filters);
        fetchStatistics({ start_date: filters.start_date, end_date: filters.end_date });
    }, [filters]);

    // 计算并排序日志数据
    const sortedLogs = useMemo(() => {
        // 先为每条日志计算威胁等级
        const logsWithThreatLevel = logs.map(log => ({
            ...log,
            threat_level: calculateThreatLevel(log)
        }));

        // 根据排序配置进行排序
        const sorted = [...logsWithThreatLevel].sort((a, b) => {
            if (sortField === 'log_time') {
                const timeA = new Date(a.log_time).getTime();
                const timeB = new Date(b.log_time).getTime();
                return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
            } else if (sortField === 'threat_level') {
                const weightA = getThreatLevelWeight(a.threat_level);
                const weightB = getThreatLevelWeight(b.threat_level);
                return sortOrder === 'desc' ? weightB - weightA : weightA - weightB;
            }
            return 0;
        });

        return sorted;
    }, [logs, sortField, sortOrder]);

    // 处理排序切换
    const handleSortChange = useCallback((field: SortField) => {
        if (sortField === field) {
            // 同一字段，切换排序方向
            setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
        } else {
            // 不同字段，设置为降序
            setSortField(field);
            setSortOrder('desc');
        }
    }, [sortField]);

    // 处理分页
    const handlePageChange = useCallback((page: number) => {
        const newFilters = { ...filters, page };
        setFilters(newFilters);
        fetchSecurityLogs(newFilters);
    }, [filters]);

    // 初始加载 - 只执行一次
    useEffect(() => {
        const initialFilters = {
            page: 1,
            page_size: 20,
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0],
            sort_field: 'log_time',
            sort_order: 'desc' as const
        };
        fetchSecurityLogs(initialFilters);
        fetchStatistics({ 
            start_date: initialFilters.start_date, 
            end_date: initialFilters.end_date 
        });
    }, []); // 空依赖数组，只在组件挂载时执行一次

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">安全威胁监控</h1>
                        <p className="mt-2 text-gray-600">
                            监控和分析服务器恶意请求与攻击行为，识别潜在的安全威胁
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                                实时监控中
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                fetchSecurityLogs();
                                fetchStatistics();
                                setRefreshTrigger(prev => prev + 1);
                            }}
                            disabled={loading || statisticsLoading}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            <svg className={`w-4 h-4 mr-2 ${(loading || statisticsLoading) ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            刷新数据
                        </button>
                    </div>
                </div>
                
                {/* 数据说明 */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                                数据说明
                            </h3>
                            <div className="mt-1 text-sm text-blue-700">
                                <p>
                                    此监控面板展示的是从Nginx访问日志中筛选出的可疑和恶意请求，不包含正常的业务请求。
                                    所有数据都代表潜在的安全威胁，包括敏感文件访问、注入攻击、暴力破解等恶意行为。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 筛选面板 - 移到上方 */}
            <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
                loading={loading}
            />

            {/* 统计卡片 */}
            <StatisticsCards 
                statistics={statistics} 
                loading={statisticsLoading} 
            />

            {/* 24小时攻击趋势 - 独占一行 */}
            <TrendChart refreshTrigger={refreshTrigger} />
            
            {/* Top 攻击IP - 独占一行 */}
            <TopIPsList refreshTrigger={refreshTrigger} />

            {/* 已封禁IP名单 - 独占一行 */}
            <BannedIPsList refreshTrigger={refreshTrigger} />

            {/* 威胁分布 */}
            <ThreatDistribution 
                statistics={statistics} 
                loading={statisticsLoading} 
            />

            {/* 日志列表 */}
            <SecurityLogsTable
                logs={sortedLogs}
                loading={loading}
                total={total}
                currentPage={filters.page || 1}
                pageSize={filters.page_size || 20}
                onPageChange={handlePageChange}
                sortField={sortField}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
            />
        </div>
    );
}
