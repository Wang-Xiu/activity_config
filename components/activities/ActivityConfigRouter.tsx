'use client';

import { useState, useEffect } from 'react';
import { Activity } from '../../types/activity';
import GemActivityConfig from './GemActivityConfig';
import MidYearActivityConfig from './MidYearActivityConfig';
// 导入通用活动配置组件
import UniversalActivityConfig from './UniversalActivityConfig';
// 导入神壕列表组件
import ShenhaoList from '../shenhao/ShenhaoList';
// 导入安全日志组件
import SecurityLogsPage from '../security-logs/SecurityLogsPage';

interface ActivityConfigRouterProps {
    activity: Activity;
    onStatusChange?: (status: string) => void;
}

export default function ActivityConfigRouter({
    activity,
    onStatusChange,
}: ActivityConfigRouterProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 服务器端渲染时显示加载状态
    if (!mounted) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">加载活动配置...</span>
            </div>
        );
    }

    // 根据活动类型返回对应的配置组件
    switch (activity.type) {
        case 'gem':
            return <GemActivityConfig activity={activity} onStatusChange={onStatusChange} />;
        case 'midyear':
            return <MidYearActivityConfig activity={activity} onStatusChange={onStatusChange} />;
        case 'universal':
            return <UniversalActivityConfig activity={activity} onStatusChange={onStatusChange} />;
        case 'shenhao':
            return <ShenhaoList activityId={activity.id} />;
        case 'security-logs':
            return <SecurityLogsPage activityId={activity.id} />;
        default:
            return (
                <div className="flex items-center justify-center h-full text-red-500">
                    未知的活动类型：{activity.type}
                </div>
            );
    }
}
