// 监控数据类型定义
export interface MonitorData {
    // 光华宝箱数据
    guanghua_box: {
        output: number;
        users: number;
        times: number;
    };
    // 月华宝箱数据
    yuehua_box: {
        output: number;
        users: number;
        times: number;
    };
    // 活动总产出
    total_output: {
        output: number;
        users: number;
    };
    // 任务完成数据
    mission_completion: {
        [key: string]: {
            users: number;
            times: number;
        };
    };
    // 入口PV/UV数据
    entrance_data: {
        [key: string]: {
            pv: number;
            uv: number;
        };
    };
    // 用户道具数据
    user_props: {
        [key: string]: {
            total: number;
            used: number;
        };
    };
    // 洗手池数据
    wash_hands: {
        pv: number;
        uv: number;
    };
    // 点亮宝石用户数
    light_gem_users: number;
    // 寿星奖励数据
    birthday_reward: {
        users: number;
        times: number;
    };
    // 你最特别报名人数
    special_signup: number;
}

// 图表数据类型
export interface ChartData {
    name: string;
    value: number;
    [key: string]: any;
}

// 表格数据类型
export interface TableData {
    key: string;
    name: string;
    users?: number;
    times?: number;
    pv?: number;
    uv?: number;
    total?: number;
    used?: number;
    [key: string]: any;
}