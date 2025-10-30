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
    type: 'gem' | 'midyear' | 'universal' | 'shenhao' | 'security-logs' | 'data-scripts';
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
    {
        id: 'shenhao',
        name: '神壕列表',
        description: '神壕用户管理与配置',
        icon: '👑',
        color: 'yellow',
        status: 'active',
        configUrl: '/api/shenhao/list',
        monitorUrl: '/api/shenhao/list',
        type: 'shenhao',
    },
    {
        id: 'security-logs',
        name: '安全威胁监控',
        description: '监控和分析服务器恶意请求与攻击行为',
        icon: '🛡️',
        color: 'red',
        status: 'active',
        configUrl: '/api/security-logs/list',
        monitorUrl: '/api/security-logs/statistics',
        type: 'security-logs',
    },
    {
        id: 'data-scripts',
        name: '数据脚本',
        description: '管理和访问后端数据查询脚本',
        icon: '📜',
        color: 'purple',
        status: 'active',
        configUrl: '/api/data-scripts/list',
        monitorUrl: '/api/data-scripts/list',
        type: 'data-scripts',
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
