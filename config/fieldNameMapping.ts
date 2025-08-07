/**
 * 通用活动配置字段名称映射
 * 用于将英文字段名映射为中文显示名称
 */
export const fieldNameMapping: { [key: string]: string } = {
    // 通用活动字段
    'import_gifts': '导入礼物',
    'draw_game_config': '抽奖游戏配置',
    'game_msg': '游戏消息',
    'change_pool_time': '切换奖池时间',
    'pay_prop_gift': '付费道具礼物',
    'need_price': '需要价格',
    
    // 任务相关配置
    'mission_pool': '任务池配置',
    'new_user': '新用户',
    'old_user': '老用户',
    'mission_list': '任务列表',
    'desc': '描述',
    'need': '需要',
    'get': '获得',
    'type': '类型',
    'sort': '排序',
    'need_gift_ids': '需要的礼物ID',

    // 开宝箱配置
    'open_box_config': '开宝箱配置',
    'free_box_time_1': '免费宝箱时间1',
    'free_box_time_2': '免费宝箱时间2',
    'send_gift_get_box': '送礼得宝箱',
    'start': '开始',
    'end': '结束',

    // 礼物相关配置
    'get_gift_send_hat': '收礼送尾巴',
    'gift_id': '礼物ID',
    'gift_type': '礼物类型',
    'gift_num': '礼物数量',
    'gift_name': '礼物名称',
    'gift_img': '礼物图片',
    'get_prop_num': '获得道具数量',
    'hat_gift_info': '尾巴礼物信息',
    'real_probability': '真实概率',
    'format_price': '格式化价格',

    // 生日配置
    'happy_birthday_config': '生日配置',
    'origin_price': '原价',
    'now_price': '现价',
    'get_flower_prize': '鲜花奖励',
    'need_flower': '所需鲜花',
    'msg_list': '消息列表',

    // 宝石配置
    'all_stone': '宝石配置',
    'name': '名称',

    // 洗手池配置
    'wash_hands_config': '洗手池配置',
    'day_chance': '每日次数',
    'pool': '奖池',
    'value': '数值',
    'probability': '概率',

    // 道具配置
    'prop_img': '道具图片',
    'quarter_prize': '季度奖励',

    // 通用字段
    'remark': '备注',
    'tag': '标签',
    'id': 'ID',
    'status': '状态',
    'created_at': '创建时间',
    'updated_at': '更新时间'
};

/**
 * 判断字符串是否为纯英文（包含字母、数字、下划线）
 */
export const isPureEnglish = (str: string): boolean => {
    return /^[a-zA-Z0-9_]+$/.test(str);
};

/**
 * 获取字段显示名称
 */
export const getDisplayFieldName = (fieldName: string): string => {
    return fieldNameMapping[fieldName] || fieldName;
};