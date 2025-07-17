// 年中活动配置类型定义

// 发送消息配置类型 (复用现有类型)
import { SendMsgConfig, SendWarningConfig } from './config';

// 榜单玩法配置类型
export interface GiftInfo {
    gift_id: string;
    gift_type: string;
    gift_num: string;
    real_probability: string;
    format_price?: string;
    remark: string;
}

export interface FamilyRankMission {
    desc: string;
    need: string;
    sort: string;
    get_rank_value: string;
    get_prop?: string;
}

export interface FamilyRankMissionList {
    master: {
        [key: string]: FamilyRankMission;
    };
    member: {
        [key: string]: FamilyRankMission;
    };
}

export interface StageConfig {
    start_time: string;
    end_time: string;
    winner_need_value?: string;
}

export interface GiftRankShow {
    [key: string]: GiftInfo;
}

export interface FamilyRankConfig {
    intro_msg: string;
    spare_msg: string;
    spare_msg_2: string;
    start_time: string;
    end_time: string;
    rank_value_ratio: string;
    rank_gift: number[];
    mission_list: FamilyRankMissionList;
    first_stage: StageConfig;
    second_stage: StageConfig;
    last_stage: StageConfig;
    gift_rank_show: GiftRankShow;
}

export interface UserRankMission {
    desc: string;
    need: string;
    sort: string;
    get_rank_value?: string;
    get_prop?: string;
    gift_info?: GiftInfo;
}

export interface UserRankMissionList {
    [key: string]: UserRankMission;
}

export interface UserRankConfig {
    intro_msg: string;
    spare_msg: string;
    spare_msg_2: string;
    start_time: string;
    end_time: string;
    rank_value_ratio: string;
    rank_gift: number[];
    patch_in_prize_need_value?: string;
    mission_list?: UserRankMissionList;
    gift_rank_show: GiftRankShow;
}

export interface SkillRankMissionList {
    skill: {
        [key: string]: UserRankMission;
    };
    member: {
        [key: string]: UserRankMission;
    };
}

export interface SkillRankConfig {
    intro_msg: string;
    spare_msg: string;
    spare_msg_2: string;
    start_time: string;
    end_time: string;
    rank_value_ratio: string;
    rank_gift: number[];
    mission_list: SkillRankMissionList;
    gift_rank_show: GiftRankShow;
}

export interface StarUserRankConfig {
    intro_msg: string;
    spare_msg: string;
    spare_msg_2: string;
    start_time: string;
    end_time: string;
    rank_value_ratio: string;
    rank_gift: number[];
    mission_list: UserRankMissionList;
    gift_rank_show: GiftRankShow;
}

export interface RankGameConfig {
    family_rank_config: FamilyRankConfig;
    user_rank_config: UserRankConfig;
    skill_rank_config: SkillRankConfig;
    star_user_rank_config: StarUserRankConfig;
}

// 签到玩法配置类型
export interface TotalSignInPrize {
    [key: string]: {
        need_num: string;
        gift_list: {
            [key: string]: GiftInfo;
        };
    };
}

export interface PrizeList {
    [day: string]: {
        [key: string]: GiftInfo;
    };
}

export interface SignInConfig {
    remedy_sign_in_max_num: string;
    remedy_sign_in_need_rmb: string;
    total_sign_in_prize: TotalSignInPrize;
    prize_list: PrizeList;
}

export interface SignGameConfig {
    rich_sign_in: SignInConfig;
    user_sign_in: SignInConfig;
}

// 抽奖玩法配置类型
export interface PayPropGift {
    [key: string]: GiftInfo & { need_price: string };
}

export interface DrawGameConfig {
    start_time: string;
    end_time: string;
    game_msg: string;
    change_pool_time: string[];
    pay_prop_gift: PayPropGift;
}

// 掐架玩法配置类型
export interface NumList {
    [key: string]: {
        num: string;
        probability: string;
    };
}

export interface ExtraPropConfig {
    [key: string]: {
        probability: string;
        num_list: NumList;
    };
}

export interface PoolOpenTime {
    [key: string]: {
        start: string;
        end: string;
    };
}

export interface MsgConfig {
    start_msg: string[];
    attack_msg: string[];
    dodge_msg: string[];
    attack_msg_special: {
        [key: string]: string[];
    };
    kungfu_list: string[];
    kungfu_list_special: {
        [key: string]: string[];
    };
}

export interface AttributeConfig {
    [key: string]: {
        hp: string;
        damage: {
            min: string;
            max: string;
        };
        dodge_probability: string;
        alias: string;
    };
}

export interface FightConfig {
    max_round: string;
    msg_config: MsgConfig;
    attribute_config: AttributeConfig;
}

export interface FightGameConfig {
    start_time: string;
    end_time: string;
    pk_game_start: string;
    pk_game_end: string;
    game_msg_draw: string;
    game_msg_fight: string;
    extra_prop_config: ExtraPropConfig;
    pool_8_open_time: PoolOpenTime;
    fight_config: FightConfig;
    pay_prop_gift: GiftInfo & { need_price: string };
    comment_prize: {
        [key: string]: GiftInfo;
    };
    rich_day_prize: {
        [key: string]: GiftInfo;
    };
    join_need_prize: GiftInfo;
    success_prize: GiftInfo;
    extra_gift: GiftInfo;
}

// 年中活动配置类型
export interface MidYearActConfig {
    import_gifts: number[];
    rank_game_config: RankGameConfig;
    sign_game_config: SignGameConfig;
    draw_game_config: DrawGameConfig;
    fight_game_config: FightGameConfig;
}

// 主配置类型
export interface MidYearConfig {
    send_msg_config: SendMsgConfig;
    send_warning_config: SendWarningConfig;
    act_config: MidYearActConfig;
}