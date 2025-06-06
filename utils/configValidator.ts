import { MainConfig } from '../types/config';

export function validateConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config || typeof config !== 'object') {
        errors.push('配置数据必须是一个对象');
        return { isValid: false, errors };
    }

    // 验证发送消息配置
    if (!config.send_msg_config) {
        errors.push('缺少发送消息配置');
    } else {
        if (typeof config.send_msg_config.send_msg !== 'number') {
            errors.push('send_msg 必须是数字');
        }
        if (!config.send_msg_config.send_msg_info) {
            errors.push('缺少消息内容配置');
        }
    }

    // 验证告警配置
    if (!config.send_warning_config) {
        errors.push('缺少告警配置');
    } else {
        if (typeof config.send_warning_config.send_warning !== 'number') {
            errors.push('send_warning 必须是数字');
        }
    }

    // 验证活动配置
    if (!config.act_config) {
        errors.push('缺少活动配置');
    } else {
        if (!config.act_config.mission_pool) {
            errors.push('缺少任务池配置');
        }
        if (!config.act_config.open_box_config) {
            errors.push('缺少开宝箱配置');
        }
        if (!config.act_config.all_stone) {
            errors.push('缺少石头配置');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export function sanitizeConfig(config: any): MainConfig {
    // 这里可以添加数据清理逻辑
    // 例如：移除不需要的字段、格式化数据等
    return config as MainConfig;
}
