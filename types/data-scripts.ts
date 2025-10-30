/**
 * 数据脚本相关类型定义
 */

/**
 * 脚本参数定义（后端返回格式）
 */
export interface ScriptParameter {
    /** 参数名称 */
    name: string;
    /** 参数标签 */
    label: string;
    /** 参数类型 */
    type: string;
    /** 是否必填 */
    required: boolean;
    /** 默认值 */
    default: string;
    /** 占位符 */
    placeholder?: string;
    /** 参数说明 */
    description?: string;
}

/**
 * 数据脚本定义（后端返回格式）
 */
export interface DataScript {
    /** 脚本ID */
    id: number;
    /** 脚本名称 */
    name: string;
    /** 脚本URL */
    url: string;
    /** 脚本说明 */
    description?: string;
    /** 参数列表 */
    params: ScriptParameter[];
}

/**
 * API响应格式
 */
export interface DataScriptApiResponse<T = any> {
    code: number;
    msg?: string;
    message?: string;
    data: T;
}

