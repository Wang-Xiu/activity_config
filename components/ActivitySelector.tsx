'use client';

import { useState, useEffect } from 'react';
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
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (activity: Activity) => {
        onActivitySelect(activity);
        setIsOpen(false);
    };

    // 服务器端渲染时的简化版本
    if (!mounted) {
        return (
            <div className="relative inline-block text-left">
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700"
                    disabled
                >
                    选择活动
                    <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="activity-menu"
                    aria-expanded="true"
                    aria-haspopup="true"
                    onClick={toggleDropdown}
                >
                    {selectedActivity ? (
                        <span className="flex items-center">
                            <span className="mr-2">{selectedActivity.icon}</span>
                            {selectedActivity.name}
                        </span>
                    ) : (
                        '选择活动'
                    )}
                    <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="activity-menu"
                >
                    <div className="py-1" role="none">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className={`
                                    px-4 py-3 cursor-pointer hover:bg-gray-100 flex items-center
                                    ${activity.status === 'inactive' ? 'opacity-50' : ''}
                                    ${activity.status === 'pending' ? 'opacity-75' : ''}
                                `}
                                onClick={() => handleSelect(activity)}
                                role="menuitem"
                            >
                                <span className="text-2xl mr-3">{activity.icon}</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {activity.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{activity.description}</p>
                                </div>
                                {activity.status === 'active' && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        运行中
                                    </span>
                                )}
                                {activity.status === 'pending' && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        待上线
                                    </span>
                                )}
                                {activity.status === 'inactive' && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        已下线
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
