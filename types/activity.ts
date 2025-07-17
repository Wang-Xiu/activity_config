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
    },
    {
        id: 'lottery',
        name: '抽奖活动',
        description: '幸运抽奖活动配置管理',
        icon: '🎰',
        color: 'purple',
        status: 'active',
        configUrl: '/api/lottery/config',
        monitorUrl: '/api/lottery/monitor',
    },
    {
        id: 'signin',
        name: '签到活动',
        description: '每日签到活动配置管理',
        icon: '📅',
        color: 'green',
        status: 'active',
        configUrl: '/api/signin/config',
        monitorUrl: '/api/signin/monitor',
    },
    {
        id: 'recharge',
        name: '充值活动',
        description: '充值返利活动配置管理',
        icon: '💰',
        color: 'yellow',
        status: 'active',
        configUrl: '/api/recharge/config',
        monitorUrl: '/api/recharge/monitor',
    },
    {
        id: 'task',
        name: '任务活动',
        description: '每日任务活动配置管理',
        icon: '📋',
        color: 'indigo',
        status: 'active',
        configUrl: '/api/task/config',
        monitorUrl: '/api/task/monitor',
    },
    {
        id: 'festival',
        name: '节日活动',
        description: '节日特殊活动配置管理',
        icon: '🎉',
        color: 'pink',
        status: 'pending',
        configUrl: '/api/festival/config',
        monitorUrl: '/api/festival/monitor',
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
