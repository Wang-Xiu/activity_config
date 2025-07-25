'use client';

import { Activity } from '../../types/activity';
import GemActivityConfig from './GemActivityConfig';
import MidYearActivityConfig from './MidYearActivityConfig';
// 导入通用活动配置组件
import UniversalActivityConfig from './UniversalActivityConfig';

interface ActivityConfigRouterProps {
    activity: Activity;
    onStatusChange?: (status: string) => void;
}

export default function ActivityConfigRouter({ activity, onStatusChange }: ActivityConfigRouterProps) {
    // 根据活动类型返回对应的配置组件
    switch (activity.type) {
        case 'gem':
            return <GemActivityConfig activity={activity} onStatusChange={onStatusChange} />;
        case 'midyear':
            return <MidYearActivityConfig activity={activity} onStatusChange={onStatusChange} />;
        case 'universal':
            return <UniversalActivityConfig activity={activity} onStatusChange={onStatusChange} />;
        default:
            return (
                <div className="flex items-center justify-center h-full text-red-500">
                    未知的活动类型：{activity.type}
                </div>
            );
    }
}