// 数据脚本类型定义

// 参数类型
export type ParamType = 'text' | 'number' | 'date' | 'datetime' | 'select' | 'boolean';

// 脚本参数
export interface ScriptParam {
    name: string;           // 参数名
    label: string;          // 显示标签
    type: ParamType;        // 参数类型
    required: boolean;      // 是否必填
    default?: string | number | boolean;  // 默认值
    options?: Array<{       // select 类型的选项
        label: string;
        value: string | number;
    }>;
    placeholder?: string;   // 输入提示
    description?: string;   // 参数说明
}

// 数据脚本
export interface DataScript {
    id: number;
    name: string;           // 脚本名称
    description: string;    // 脚本描述
    url: string;            // 脚本URL
    params: ScriptParam[];  // 参数列表
    icon?: string;          // 图标
    created_at: string;
    updated_at: string;
}

// 参数配置（用户选择的参数）
export interface ParamConfig {
    name: string;
    enabled: boolean;       // 是否启用
    value: string | number | boolean;
}

// 脚本执行配置
export interface ScriptExecuteConfig {
    [paramName: string]: {
        enabled: boolean;
        value: string | number | boolean;
    };
}


