import { MainConfig, GiftInfo } from './config';

interface RankGameConfig {
    rank_game_gift_info: GiftInfo[];
    rank_game_prize_info: GiftInfo[];
    family_rank_config: {
        first_stage: {
            start_time: string;
            end_time: string;
            winner_need_value: string;
        };
        second_stage: {
            start_time: string;
            end_time: string;
            winner_need_value: string;
        };
    };
    user_rank_config: {
        intro_msg: string;
        spare_msg: string;
        spare_msg_2: string;
        start_time: string;
        end_time: string;
        rank_value_ratio: string;
        rank_gift: string[];
        patch_in_prize_need_value: string;
    };
}

interface DrawGameConfig {
    draw_game_gift_info: GiftInfo[];
    draw_game_prize_info: GiftInfo[];
    start_time: string;
    end_time: string;
    game_msg: string;
    change_pool_time: string[];
    pay_prop_gift: Record<string, GiftInfo>;
}

interface FightGameConfig {
    fight_game_gift_info: GiftInfo[];
    fight_game_prize_info: GiftInfo[];
    start_time: string;
    end_time: string;
    pk_game_start: string;
    pk_game_end: string;
    game_msg_draw: string;
    game_msg_fight: string;
    fight_config: {
        max_round: string;
        msg_config: {
            start_msg: string[];
            attack_msg: string[];
            kungfu_list: string[];
        };
    };
    join_need_prize: GiftInfo;
    success_prize: GiftInfo;
    extra_gift: GiftInfo;
}

interface SignGameConfig {
    sign_game_gift_info: GiftInfo[];
    sign_game_prize_info: GiftInfo[];
    rich_sign_in: {
        remedy_sign_in_max_num: string;
        remedy_sign_in_need_rmb: string;
        total_sign_in_prize: Record<string, GiftInfo>;
    };
    user_sign_in: {
        remedy_sign_in_max_num: string;
        remedy_sign_in_need_rmb: string;
        total_sign_in_prize: Record<string, GiftInfo>;
        prize_list: Record<string, GiftInfo[]>;
    };
}

interface MidYearActConfig {
    rank_game_config: RankGameConfig;
    draw_game_config: DrawGameConfig;
    fight_game_config: FightGameConfig;
    sign_game_config: SignGameConfig;
    pay_prop_gift: GiftInfo & { need_price: string };
    import_gifts?: string[];
}

export interface MidYearConfig extends Omit<MainConfig, 'act_config'> {
    act_config: MidYearActConfig;
}