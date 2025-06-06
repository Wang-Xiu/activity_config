// 发送消息配置类型
export interface SendMsgInfo {
    match_done: string;
    thursday_tips: string;
    need_20_value: string;
    two_days_tips: string;
    fourth_week: string;
}

export interface SendMsgConfig {
    '是否开启发送通知(1开启。0关闭)↓↓↓': string;
    send_msg: number;
    '通知发送内容 ↓↓↓': string;
    send_msg_info: SendMsgInfo;
}

// 活动告警配置类型
export interface IntervalWarningTime {
    [key: string]: string;
}

export interface IntervalWarningPrize {
    [key: string]: string;
}

export interface SendWarningConfig {
    '是否开启告警邮件发送(1开启。0关闭)↓↓↓': string;
    send_warning: number;
    '告警产生的活动名 ↓↓↓': string;
    send_warning_act_name: string;
    '告警邮件发送间隔↓↓↓': string;
    send_warning_interval: string;
    '告警礼物时间间隔配置 ↓↓↓': string;
    interval_warning_time: IntervalWarningTime;
    '告警礼物数量阈值配置 ↓↓↓': string;
    interval_warning_prize: IntervalWarningPrize;
    '接口访问次数风控告警-指定时间内(秒) ↓↓↓': string;
    report_time: string;
    '接口访问次数风控告警-访问次数阈值 ↓↓↓': string;
    report_num: string;
    msg_1: string;
    give_gift_num: string;
}

// 任务配置类型
export interface TaskConfig {
    desc: string;
    need: string | number;
    get: string | number;
    type: string;
    gift_id?: string;
}

export interface MissionPool {
    new_user: {
        [key: string]: TaskConfig;
    };
    old_user: {
        [key: string]: TaskConfig;
    };
}

// 开宝箱配置类型
export interface FreeBoxTime {
    start: string;
    end: string;
}

export interface SendGiftGetBox {
    gift_id: string;
    gift_name: string;
    gift_img: string;
    get_prop_num: string;
}

export interface OpenBoxConfig {
    free_box_time_1: FreeBoxTime;
    free_box_time_2: FreeBoxTime;
    send_gift_get_box: SendGiftGetBox;
}

// 礼物配置类型
export interface GiftInfo {
    gift_id: string;
    gift_type: string;
    gift_num: string;
    real_probability: string;
    tag: string;
    format_price: string;
    remark: string;
}

export interface GetGiftSendHat {
    get_gift_id: string;
    get_gift_img: string;
    get_gift_name: string;
    hat_gift_info: GiftInfo;
}

// 生日配置类型
export interface BirthdayMission {
    desc: string;
    need: string | number;
    get: number;
    sort: string;
    need_gift_ids?: number[];
}

export interface BirthdayMissionList {
    [key: string]: BirthdayMission;
}

export interface GetFlowerPrize {
    [key: string]: GiftInfo & { need_flower: string };
}

export interface HappyBirthdayConfig {
    origin_price: string;
    now_price: string;
    mission_list: BirthdayMissionList;
    msg_list: string[];
    get_flower_prize: GetFlowerPrize;
}

// 石头配置类型
export interface StoneInfo {
    name: string;
    desc: string;
}

export interface AllStone {
    [key: string]: StoneInfo;
}

// 洗手池配置类型
export interface WashHandsPool {
    [key: string]: {
        value: string;
        probability: string;
    };
}

export interface WashHandsConfig {
    day_chance: string;
    pool: WashHandsPool;
}

// 季度奖励配置类型
export interface QuarterPrize {
    [quarter: string]: {
        [level: string]: GiftInfo;
    };
}

// 活动配置类型
export interface ActConfig {
    '新老用户任务池 ↓↓↓': string;
    mission_pool: MissionPool;
    '首页开宝箱玩法配置 free_box_time免费领宝箱时间 send_gift_get_box送礼得月华宝箱钥匙(填礼物id) ↓↓↓': string;
    open_box_config: OpenBoxConfig;
    '收到指定礼物送指定尾巴配置 ↓↓↓': string;
    get_gift_send_hat: GetGiftSendHat;
    '寿星报名玩法配置 oringin_prize原费用 now_prize现费用 mission_list任务列表 get_flower_prize收到鲜花奖励 ↓↓↓': string;
    happy_birthday_config: HappyBirthdayConfig;
    '12个月每个月的石头名 ↓↓↓': string;
    all_stone: AllStone;
    '洗手池晨辉概率配置 day_chance每日次数 value获得晨辉 probability概率(只支持0.1) ↓↓↓': string;
    wash_hands_config: WashHandsConfig;
    '晨辉的图片 ↓↓↓': string;
    prop_img: string;
    quarter_prize: QuarterPrize;
}

// 主配置类型
export interface MainConfig {
    send_msg_config: SendMsgConfig;
    '活动告警配置↓↓↓': string;
    send_warning_config: SendWarningConfig;
    '活动配置 ↓↓↓': string;
    act_config: ActConfig;
}
