// 活动类型定义
export interface Activity {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    status: 'active' | 'inactive' | 'pending';
    configUrl: string;
    monitorUrl: string;
    type: 'gem' | 'midyear' | 'universal';
}

// 活动配置
export const ACTIVITIES: Activity[] = [
    {
        id: 'gemstone',
        name: '宝石活动',
        description: '宝石收集与兑换活动配置管理',
        icon: '💎',
        color: 'blue',
        status: 'active',
        configUrl: '/api/gemstone/config',
        monitorUrl: '/api/gemstone/monitor',
        type: 'gem',
    },
    {
        id: 'midyear',
        name: '年中活动',
        description: '年中盛典活动配置管理',
        icon: '🎭',
        color: 'red',
        status: 'active',
        configUrl: '/api/midyear/config',
        monitorUrl: '/api/midyear/monitor',
        type: 'midyear',
    },
    {
        id: 'universal',
        name: '通用配置',
        description: '通用活动配置管理（自动适配）',
        icon: '⚙️',
        color: 'indigo',
        status: 'active',
        configUrl: '/api/midyear/config',
        monitorUrl: '/api/midyear/monitor',
        type: 'universal',
    },
];

// 根据ID获取活动信息
export const getActivityById = (id: string): Activity | undefined => {
    return ACTIVITIES.find((activity) => activity.id === id);
};

// 获取活跃的活动列表
export const getActiveActivities = (): Activity[] => {
    return ACTIVITIES.filter((activity) => activity.status === 'active');
};
