/**
 * 神壕列表相关类型定义
 */

// 神壕用户信息
export interface ShenhaoUser {
    uid: string;                    // 用户ID
    username: string;               // 用户名
    nickname?: string;              // 昵称
    avatar?: string;                // 头像URL
    phone?: string;                 // 手机号
    register_time?: string;         // 注册时间
    last_login_time?: string;       // 最后登录时间
}

// 神壕信息
export interface ShenhaoInfo {
    id: number;
    uid: string;                    // 关联的用户ID
    level: number;                  // 神壕等级
    total_consume: number;          // 总消耗金币数
    total_recharge: number;         // 总充值金额
    expected_expire_time?: string;  // 预计过期时间
    status: 'active' | 'inactive' | 'banned'; // 状态
    created_time: string;           // 创建时间
    updated_time: string;           // 更新时间
    created_by: string;             // 创建者
    updated_by?: string;            // 更新者
}

// 完整的神壕数据（包含用户信息和神壕信息）
export interface ShenhaoData {
    user: ShenhaoUser;
    shenhao: ShenhaoInfo;
}

// 神壕列表响应
export interface ShenhaoListResponse {
    success: boolean;
    message: string;
    data: {
        list: ShenhaoData[];
        total: number;
        page: number;
        pageSize: number;
    };
}

// 神壕创建/编辑表单数据
export interface ShenhaoFormData {
    // 神壕信息
    uid: string;
    level: number;
}

// 神壕操作响应
export interface ShenhaoOperationResponse {
    success: boolean;
    message: string;
    data?: ShenhaoData;
}

// 神壕列表查询参数
export interface ShenhaoListParams {
    page?: number;
    page_size?: number;
    uid?: string;                  // UID搜索
    level?: number;                // 神壕等级筛选
}

// 神壕等级配置
export const SHENHAO_LEVELS = [
    { value: 1, label: '初级神壕' },
    { value: 2, label: '中级神壕' },
    { value: 3, label: '高级神壕' },
    { value: 4, label: '尊贵神壕' },
] as const;

// 神壕状态选项
export const SHENHAO_STATUS_OPTIONS = [
    { value: 'active', label: '激活', color: 'green' },
    { value: 'inactive', label: '未激活', color: 'gray' },
    { value: 'banned', label: '已封禁', color: 'red' },
] as const;

