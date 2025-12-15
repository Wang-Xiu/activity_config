// 活动用户群体数据类型定义

export interface ActUserTypeData {
    month_data: {
        [key: string]: number; // 键可能是 "year_Ago", "64", "66", "14", "0" 等
    };
    small_data: number;
    total_user: string[]; // 用户ID数组
}

export interface ActUserTypeResponse {
    success: boolean;
    message: string;
    data: ActUserTypeData;
    timestamp?: string;
}

