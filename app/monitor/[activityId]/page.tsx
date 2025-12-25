'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MonitorDashboard from '../../../components/monitor/MonitorDashboard';
import { useToast } from '../../../components/ToastProvider';
import { LoadingSpinner } from '../../../components/ui/loading';

interface MonitorPageProps {
    params?: {
        activityId?: string;
    };
}

export const dynamic = 'force-dynamic';

export default function MonitorPage({ params }: MonitorPageProps) {
    const router = useRouter();
    const urlParams = useParams();
    const [mounted, setMounted] = useState(false);
    const { toasts, removeToast } = useToast();
    
    // 从多个来源获取 activityId，确保能正确获取
    const activityId = (params?.activityId || urlParams?.activityId || '') as string;

    useEffect(() => {
        setMounted(true);
        
        // 验证活动ID是否存在
        if (!activityId) {
            console.error('活动ID为空，无法加载监控数据');
        }
    }, [activityId]);
    
    // 如果活动ID为空，显示错误提示
    if (!activityId) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-4">
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            活动ID为空
                        </h2>
                        <p className="text-gray-600 mb-4">
                            无法加载监控数据，请返回并重新输入活动ID
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            返回首页
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-4">
                    <div className="text-center">
                        <LoadingSpinner size="xl" color="blue" className="mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            正在加载监控数据
                        </h2>
                        <p className="text-gray-600 mb-4">
                            活动ID: <span className="font-medium text-blue-600">{activityId}</span>
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full animate-pulse"
                                style={{ width: '60%' }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">正在获取数据，请稍候...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 顶部导航栏 */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* 面包屑导航 */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.back()}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                返回
                            </button>
                            <nav className="flex" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-2">
                                    <li>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            活动配置
                                        </div>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <svg
                                                className="w-4 h-4 text-gray-400 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span className="text-sm text-gray-900 font-medium">
                                                监控数据
                                            </span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                        </div>

                        {/* 活动ID显示和操作按钮 */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push(`/monitor/${activityId}/user-type`)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                查看参与活动用户基本群体
                            </button>
                            <button
                                onClick={() => router.push(`/monitor/${activityId}/user-spend`)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                查看参与活动用户充值和积分情况
                            </button>
                            <div className="bg-blue-50 px-3 py-1 rounded-full">
                                <span className="text-sm font-medium text-blue-800">
                                    活动ID: {activityId}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 主要内容区域 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <MonitorDashboard activityId={activityId} />
            </div>

        </div>
    );
}
