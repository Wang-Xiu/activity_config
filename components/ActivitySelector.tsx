'use client';

import { Activity } from '../types/activity';

interface ActivitySelectorProps {
    activities: Activity[];
    selectedActivity: Activity | null;
    onActivitySelect: (activity: Activity) => void;
}

export default function ActivitySelector({
    activities,
    selectedActivity,
    onActivitySelect,
}: ActivitySelectorProps) {
    return (
        <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
            data-oid="w.et:bd"
        >
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className={`
                        relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg
                        ${
                            selectedActivity?.id === activity.id
                                ? `border-${activity.color}-500 bg-${activity.color}-50 shadow-md`
                                : 'border-gray-200 bg-white hover:border-gray-300'
                        }
                        ${activity.status === 'inactive' ? 'opacity-50' : ''}
                        ${activity.status === 'pending' ? 'opacity-75' : ''}
                    `}
                    onClick={() => onActivitySelect(activity)}
                    data-oid="s--:u7n"
                >
                    {/* 状态标识 */}
                    <div className="absolute top-2 right-2" data-oid="srqj7h_">
                        {activity.status === 'active' && (
                            <span
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                data-oid="9qt1b_p"
                            >
                                运行中
                            </span>
                        )}
                        {activity.status === 'pending' && (
                            <span
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                                data-oid="9f0nt6f"
                            >
                                待上线
                            </span>
                        )}
                        {activity.status === 'inactive' && (
                            <span
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                data-oid="e028356"
                            >
                                已下线
                            </span>
                        )}
                    </div>

                    {/* 活动图标 */}
                    <div
                        className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-4xl"
                        data-oid="9b6xqmo"
                    >
                        {activity.icon}
                    </div>

                    {/* 活动信息 */}
                    <div className="text-center" data-oid="98yl7pd">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2" data-oid="gjppdon">
                            {activity.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4" data-oid="m4jp1ei">
                            {activity.description}
                        </p>

                        {/* 操作按钮 */}
                        <div className="flex space-x-2 justify-center" data-oid="6ourbaf">
                            <button
                                className={`
                                    px-3 py-1 rounded text-xs font-medium transition-colors
                                    ${
                                        activity.status === 'active'
                                            ? `bg-${activity.color}-500 text-white hover:bg-${activity.color}-600`
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }
                                `}
                                disabled={activity.status !== 'active'}
                                data-oid="pd763i-"
                            >
                                配置管理
                            </button>
                            <button
                                className={`
                                    px-3 py-1 rounded text-xs font-medium transition-colors
                                    ${
                                        activity.status === 'active'
                                            ? `bg-green-500 text-white hover:bg-green-600`
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }
                                `}
                                disabled={activity.status !== 'active'}
                                data-oid="0mktucc"
                            >
                                数据监控
                            </button>
                        </div>
                    </div>

                    {/* 选中指示器 */}
                    {selectedActivity?.id === activity.id && (
                        <div
                            className={`absolute inset-0 rounded-lg border-2 border-${activity.color}-500 pointer-events-none`}
                            data-oid="ile520-"
                        >
                            <div
                                className={`absolute top-2 left-2 w-3 h-3 bg-${activity.color}-500 rounded-full`}
                                data-oid="w8t140x"
                            ></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
