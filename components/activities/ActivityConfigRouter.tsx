'use client';

import { Activity } from '../../types/activity';
import GemActivityConfig from './GemActivityConfig';
import RedPacketActivityConfig from './RedPacketActivityConfig';

interface ActivityConfigRouterProps {
    activity: Activity;
    onStatusChange?: (status: string) => void;
}

export default function ActivityConfigRouter({ activity, onStatusChange }: ActivityConfigRouterProps) {
    // 根据活动类型返回对应的配置组件
    switch (activity.type) {
        case 'gem':
            return <GemActivityConfig activity={activity} onStatusChange={onStatusChange} />;
        case 'red_packet':
            return <RedPacketActivityConfig activity={activity} onStatusChange={onStatusChange} />;
        case 'lottery':
        case 'signin':
        case 'recharge':
            // 临时使用宝石活动配置组件作为其他活动类型的配置组件
            // 实际项目中应该为每种活动类型创建对应的配置组件
            return <GemActivityConfig activity={activity} onStatusChange={onStatusChange} />;
        default:
            return (
                <div className="flex items-center justify-center h-full text-red-500">
                    未知的活动类型：{activity.type}
                </div>
            );
    }
}