'use client';

import { useState, useEffect } from 'react';
import { DataScript } from '../../types/data-scripts';
import { useToast } from '../ToastProvider';
import { postToNextjsApi } from '../../utils/frontendApiClient';
import LoadingSpinner from '../ui/loading/LoadingSpinner';
import ScriptCard from './ScriptCard';

interface DataScriptListProps {
    activityId: string;
}

export default function DataScriptList({ activityId }: DataScriptListProps) {
    const [scripts, setScripts] = useState<DataScript[]>([]);
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useToast();

    // 获取数据脚本列表
    const fetchScripts = async () => {
        setLoading(true);
        try {
            console.log('开始获取数据脚本列表...');
            
            const response = await postToNextjsApi('/api/data-scripts/list', {});

            if (!response.ok) {
                throw new Error(`获取数据脚本列表失败: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('数据脚本列表响应:', result);
            
            if (result.success && result.data) {
                const scriptList = Array.isArray(result.data) ? result.data : [];
                setScripts(scriptList);
                console.log(`成功获取 ${scriptList.length} 个数据脚本`);
            } else {
                throw new Error(result.message || '获取数据脚本列表失败');
            }
        } catch (error) {
            console.error('获取数据脚本列表出错:', error);
            const errorMsg = error instanceof Error ? error.message : '未知错误';
            showError(`获取数据脚本列表失败: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    // 初始加载
    useEffect(() => {
        fetchScripts();
    }, []);

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">数据脚本</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            配置参数并访问后端数据查询脚本
                        </p>
                    </div>
                    <button
                        onClick={fetchScripts}
                        disabled={loading}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg 
                            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                            />
                        </svg>
                        <span>刷新</span>
                    </button>
                </div>
            </div>

            {/* 脚本列表 */}
            {loading ? (
                <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
                    <LoadingSpinner size="lg" />
                </div>
            ) : scripts.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <svg 
                        className="mx-auto h-12 w-12 text-gray-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">暂无数据脚本</h3>
                    <p className="mt-1 text-sm text-gray-500">当前没有可用的数据脚本</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {scripts.map(script => (
                        <ScriptCard key={script.id} script={script} />
                    ))}
                </div>
            )}
        </div>
    );
}


