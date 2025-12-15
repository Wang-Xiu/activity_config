// 用户充值和积分数据类型定义

export interface UserSpendData {
    uid: number;
    has_recharge: number; // 0 或 1，表示是否有充值行为
    act_time: number[]; // 活动时间戳数组
    action_time: number[]; // 操作时间戳数组（充值或积分的时间）
    action_num: number; // 活动期间符合此条件的总次数
}

export interface UserSpendResponse {
    success: boolean;
    message: string;
    data: UserSpendData[];
    timestamp?: string;
}

