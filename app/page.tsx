'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../components/auth/AuthProvider';

export const dynamic = 'force-dynamic';
import { MonitorData } from '../types/monitor';
import { Activity, ACTIVITIES } from '../types/activity';
import ActivitySelector from '../components/ActivitySelector';
import ActivityConfigRouter from '../components/activities/ActivityConfigRouter';

export default function Page() {
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [apiStatus, setApiStatus] = useState('');
    const [mounted, setMounted] = useState(false);
    const { user, logout } = useAuth();

    // 确保组件已挂载
    useEffect(() => {
        setMounted(true);
    }, []);

    // 处理活动选择
    const handleActivitySelect = (activity: Activity) => {
        setSelectedActivity(activity);
    };

    // 处理API状态变更
    const handleStatusChange = (status: string) => {
        setApiStatus(status);
    };

    // 处理登出
    const handleLogout = () => {
        if (confirm('确定要退出登录吗？')) {
            logout();
        }
    };

    // 服务器端渲染时显示加载状态
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h1 className="text-2xl font-bold">活动配置管理</h1>
                        <p className="mt-2 text-gray-600">加载中...</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* 页面头部 */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold">活动配置管理</h1>
                            <ActivitySelector
                                activities={ACTIVITIES}
                                selectedActivity={selectedActivity}
                                onActivitySelect={handleActivitySelect}
                            />
                        </div>

                        {/* 用户信息和操作 */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <div className="font-medium text-gray-900">
                                        {user?.username}
                                    </div>
                                    <div className="text-gray-500">管理员</div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
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
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                退出登录
                            </button>
                        </div>
                    </div>
                    {selectedActivity && (
                        <p className="mt-2 text-gray-600">当前位置：{selectedActivity.name}</p>
                    )}
                </div>

                {/* 主要内容区域 */}
                <div className="bg-white rounded-lg shadow p-6">
                    {selectedActivity ? (
                        <ActivityConfigRouter
                            activity={selectedActivity}
                            onStatusChange={handleStatusChange}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                            <span className="text-4xl mb-4">👆</span>
                            <p className="text-xl">请选择一个活动</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
