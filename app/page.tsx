'use client';

import { useState, useEffect, useRef } from 'react';
import { MonitorData } from '../types/monitor';
import { Activity, ACTIVITIES } from '../types/activity';
import ActivitySelector from '../components/ActivitySelector';
import ActivityConfigRouter from '../components/activities/ActivityConfigRouter';

export default function Page() {
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [apiStatus, setApiStatus] = useState('');
    const [mounted, setMounted] = useState(false);

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
                        <h1 className="text-2xl font-bold">活动配置管理</h1>
                        <ActivitySelector 
                            activities={ACTIVITIES}
                            selectedActivity={selectedActivity}
                            onActivitySelect={handleActivitySelect}
                        />
                    </div>
                    {selectedActivity && (
                        <p className="mt-2 text-gray-600">当前活动：{selectedActivity.name}</p>
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
