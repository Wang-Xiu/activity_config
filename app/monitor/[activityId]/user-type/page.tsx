'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserTypeDashboard from '../../../../components/monitor/UserTypeDashboard';
import { LoadingSpinner } from '../../../../components/ui/loading';

interface UserTypePageProps {
    params: {
        activityId: string;
    };
}

export const dynamic = 'force-dynamic';

export default function UserTypePage({ params }: UserTypePageProps) {
    const { activityId } = params;
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex flex-col items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-4">
                    <div className="text-center">
                        <LoadingSpinner size="xl" color="purple" className="mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            正在加载用户群体数据
                        </h2>
                        <p className="text-gray-600 mb-4">
                            活动ID: <span className="font-medium text-purple-600">{activityId}</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
            {/* 顶部导航栏 */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* 面包屑导航 */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.back()}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
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
                                            <button
                                                onClick={() => router.push(`/monitor/${activityId}`)}
                                                className="text-sm text-gray-500 hover:text-gray-700"
                                            >
                                                监控数据
                                            </button>
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
                                                用户群体
                                            </span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                        </div>

                        {/* 活动ID显示 */}
                        <div className="flex items-center space-x-4">
                            <div className="bg-purple-50 px-3 py-1 rounded-full">
                                <span className="text-sm font-medium text-purple-800">
                                    活动ID: {activityId}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 主要内容区域 */}
            <UserTypeDashboard activityId={activityId} />
        </div>
    );
}

