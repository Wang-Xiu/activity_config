'use client';

import { useState, useEffect } from 'react';
import { MonitorData } from '../types/monitor';
import { Activity, ACTIVITIES } from '../types/activity';
import ActivitySelector from '../components/ActivitySelector';
import ActivityConfigRouter from '../components/activities/ActivityConfigRouter';

export default function Page() {
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [apiStatus, setApiStatus] = useState('');

    // 监控相关状态
    const [monitorData, setMonitorData] = useState<MonitorData | null>(null);
    const [monitorDateType, setMonitorDateType] = useState<'daily' | 'total'>('daily');
    const [monitorDate, setMonitorDate] = useState(new Date().toISOString().split('T')[0]);

    // 处理活动选择
    const handleActivitySelect = (activity: Activity) => {
        setSelectedActivity(activity);
    };

    // 处理API状态变更
    const handleStatusChange = (status: string) => {
        setApiStatus(status);
    };

    // 获取监控数据
    const fetchMonitorData = async () => {
        if (!selectedActivity) return;
        setApiStatus('正在获取监控数据...');
        try {
            const response = await fetch(
                `${selectedActivity.monitorUrl}?dateType=${monitorDateType}&date=${monitorDate}`,
                {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setMonitorData(result.data);
            setApiStatus('监控数据获取成功');
            console.log('监控数据获取成功:', result);

            setTimeout(() => setApiStatus(''), 2000);
        } catch (error) {
            console.error('获取监控数据失败:', error);
            setApiStatus('获取监控数据失败: ' + (error as Error).message);
            setTimeout(() => setApiStatus(''), 3000);
        }
    };

    // 当监控相关参数变化时重新获取数据
    useEffect(() => {
        if (selectedActivity) {
            fetchMonitorData();
        }
    }, [selectedActivity, monitorDateType, monitorDate]);

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
