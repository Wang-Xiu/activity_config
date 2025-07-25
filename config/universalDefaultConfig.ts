import { UniversalConfig } from '../types/config';
import { defaultConfig } from './defaultConfig';

export const universalDefaultConfig: UniversalConfig = {
    send_msg_config: {
        send_msg: 1,
    },
    '活动告警配置↓↓↓': ' ',
    send_warning_config: {
        send_warning: 1,
    },
    '活动配置 ↓↓↓': ' ',
    act_config: defaultConfig.act_config, // 继承原有的活动配置
    red_packet_config: defaultConfig.red_packet_config, // 继承原有的红包配置
};