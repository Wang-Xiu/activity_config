import { MainConfig } from '../types/config';

export const defaultConfig: MainConfig = {
    send_msg_config: {
        '是否开启发送通知(1开启。0关闭)↓↓↓': ' ',
        send_msg: 1,
        '通知发送内容 ↓↓↓': ' ',
        send_msg_info: {
            match_done:
                '亲爱的用户，您期待的缘分已就位！今日0:05分，我们为您精准匹配了「特别的TA」——<ml>点击</ml>开启这场浪漫邂逅，或许故事就从此刻开始✨',
            thursday_tips:
                '亲爱的用户，本周已进行到第4天，您累计的辰辉值还差{diffValue}点即可解锁【周阶奖励】！当前进度条已加载至80%，点击这里完成任务轻松补足差额🔥',
            need_20_value:
                '亲爱的用户，您当前「{stage}阶」成就达成（{showValue}），仅差20点即可领取【周阶奖励】！完成任务即可轻松达标🔥',
            two_days_tips:
                '🔥【进度告急】您的辰辉值已停滞2天，速抢最后冲刺机会！亲爱的用户，监测到您的辰辉值连续2天0增长！当前仅需完成1个简单任务（或购买限时礼包）即可激活进度，解锁本周奖励！',
            fourth_week:
                '活动倒计时7天！检测到您本期宝石还未点亮，当前进度大幅落后全服90%用户！立即行动可领取周阶奖励哦~',
        },
    },
    '活动告警配置↓↓↓': ' ',
    send_warning_config: {
        '是否开启告警邮件发送(1开启。0关闭)↓↓↓': ' ',
        send_warning: 1,
        '告警产生的活动名 ↓↓↓': ' ',
        send_warning_act_name: '宝石活动',
        '告警邮件发送间隔↓↓↓': ' ',
        send_warning_interval: '300',
        '告警礼物时间间隔配置 ↓↓↓': ' ',
        interval_warning_time: {
            '111': '10',
        },
        '告警礼物数量阈值配置 ↓↓↓': ' ',
        interval_warning_prize: {
            '111': '4',
        },
        '接口访问次数风控告警-指定时间内(秒) ↓↓↓': ' ',
        report_time: '60',
        '接口访问次数风控告警-访问次数阈值 ↓↓↓': ' ',
        report_num: '20',
        msg_1: '宝石活动---{uid}在{seconds}秒内发放礼物数量大于阈值：{setCount}！',
        give_gift_num: '500',
    },
    '活动配置 ↓↓↓': ' ',
    act_config: {
        '新老用户任务池 ↓↓↓': ' ',
        mission_pool: {
            new_user: {
                first_recharge_page: {
                    desc: '访问首充礼包页面',
                    need: '1',
                    get: '1',
                    type: 'first_recharge_page',
                },
                shi_tu_page: {
                    desc: '访问师徒页面',
                    need: '1',
                    get: '1',
                    type: 'shi_tu_page',
                },
                gift_pack_page: {
                    desc: '访问特惠礼包页面',
                    need: '1',
                    get: '1',
                    type: 'gift_pack_page',
                },
                user_home_page: {
                    desc: '访问任意用户主页',
                    need: '1',
                    get: '1',
                    type: 'user_home_page',
                },
                attention_user: {
                    desc: '任意关注一名用户',
                    need: '1',
                    get: '1',
                    type: 'attention_user',
                },
                room_stay: {
                    desc: '房间停留3分钟',
                    need: '3',
                    get: '1',
                    type: 'room_stay',
                },
                user_chat: {
                    desc: '与任意用户私聊1条消息',
                    need: '1',
                    get: '1',
                    type: 'user_chat',
                },
            },
            old_user: {
                guard: {
                    desc: '加入1次技能者守护',
                    need: '1',
                    get: '1',
                    type: 'guard',
                },
                recharge: {
                    desc: '充值6元以上',
                    need: '6',
                    get: '1',
                    type: 'recharge',
                },
                gift: {
                    desc: '收到或送出赤匣石5个',
                    need: '5',
                    get: '1',
                    type: 'gift',
                    gift_id: '24',
                },
                fight_star: {
                    desc: '购买一个传说之环',
                    need: '1',
                    get: '1',
                    type: 'fight_star',
                },
                mike: {
                    desc: '家族房或技能者房上麦10分钟',
                    need: '10',
                    get: '1',
                    type: 'mike',
                },
                send_gold_gift: {
                    desc: '送出200金币礼物',
                    need: '200',
                    get: '1',
                    type: 'send_gold_gift',
                },
                send_small_gift: {
                    desc: '送出5个棒棒糖',
                    need: '5',
                    get: '1',
                    type: 'send_small_gift',
                    gift_id: '24',
                },
                auction: {
                    desc: '结成一个亲密关系',
                    need: '1',
                    get: '1',
                    type: 'auction',
                },
                moonlight: {
                    desc: '购买1个新月宝盒',
                    need: '1',
                    get: '1',
                    type: 'moonlight',
                },
            },
        },
        '首页开宝箱玩法配置 free_box_time免费领宝箱时间 send_gift_get_box送礼得月华宝箱钥匙(填礼物id) ↓↓↓':
            ' ',
        open_box_config: {
            free_box_time_1: {
                start: '10:00:00',
                end: '12:00:00',
            },
            free_box_time_2: {
                start: '15:00:00',
                end: '19:00:00',
            },
            send_gift_get_box: {
                gift_id: '26',
                gift_name: '玫瑰',
                gift_img: 'my_gift_y_1_v1.jpg',
                get_prop_num: '1',
            },
        },
        '收到指定礼物送指定尾巴配置 ↓↓↓': ' ',
        get_gift_send_hat: {
            get_gift_id: '26',
            get_gift_img: 'my_gift_y_1_v1.jpg',
            get_gift_name: '玫瑰',
            hat_gift_info: {
                gift_id: '26',
                gift_type: '1',
                gift_num: '1',
                real_probability: '35',
                tag: '0',
                format_price: '个',
                remark: '收礼得尾巴',
            },
        },
        '寿星报名玩法配置 oringin_prize原费用 now_prize现费用 mission_list任务列表 get_flower_prize收到鲜花奖励 ↓↓↓':
            ' ',
        happy_birthday_config: {
            origin_price: '3000',
            now_price: '0',
            mission_list: {
                send_msg: {
                    desc: '主动打招呼1次(与匹配用户)',
                    need: '1',
                    get: 20,
                    sort: '1',
                },
                send_msg_agent: {
                    desc: '与昨日打过招呼的用户互道早安(与匹配用户)',
                    need: '1',
                    get: 20,
                    sort: '2',
                },
                send_many_msg: {
                    desc: '每与匹配用户互聊10条消息',
                    need: '10',
                    get: 20,
                    sort: '3',
                },
                gift: {
                    desc: '赠送或收到任意匹配用户的双倍亲密值礼物',
                    need: '1',
                    get: 50,
                    sort: '4',
                    need_gift_ids: [26, 26, 26],
                },
            },
            msg_list: [
                '愿你岁岁平安，朝朝欢喜，生日这天全世界的美好都与你相拥！',
                '新的一岁，愿生活明朗如星光，未来璀璨似骄阳，生日快乐！',
                '蛋糕烛光皆甜意，岁月赠你满心期，生日快乐，万事胜意！',
                '愿时光厚待，所念皆成真；愿前程似锦，所行化坦途！',
                '一岁一礼，一寸欢喜，愿你遍历山河，仍觉人间值得！',
                '愿岁并谢，与友长兮；愿心无忧，笑颜永驻！',
                '春去秋往万事胜意，山高水长终有回甘，生日快乐！',
                '愿星河入眼，山海可平；愿岁月无忧，余生尽欢！',
                '一岁一礼皆如意，半梦半醒亦清欢，生辰吉乐！',
                '愿岁岁年年，万喜万般宜；愿朝朝暮暮，有光有温暖！',
                '愿长夜里星辰作伴，人海中温暖常随！',
                '愿君长似少年时，初心不忘乐相知。',
                '愿所得皆所期，所失皆无碍！',
                '今朝风日好，生辰正当宜，愿君如松柏，夭矫历千岁！',
                '祝你往后，梦想光芒，野蛮生长，永不仿徨。',
            ],
            get_flower_prize: {
                '1': {
                    gift_id: '26',
                    gift_type: '1',
                    gift_num: '1',
                    real_probability: '35',
                    tag: '0',
                    format_price: '个',
                    need_flower: '2',
                    remark: '寿星福利(need_flower)',
                },
                '2': {
                    gift_id: '26',
                    gift_type: '1',
                    gift_num: '1',
                    real_probability: '35',
                    tag: '0',
                    format_price: '个',
                    need_flower: '5',
                    remark: '寿星福利(need_flower)',
                },
                '3': {
                    gift_id: '26',
                    gift_type: '1',
                    gift_num: '1',
                    real_probability: '35',
                    tag: '0',
                    format_price: '个',
                    need_flower: '10',
                    remark: '寿星福利(need_flower)',
                },
            },
        },
        '12个月每个月的石头名 ↓↓↓': ' ',
        all_stone: {
            '01': {
                name: '石榴石（友爱）',
                desc: '石榴石的红光刺破冬夜，匣中第一道裂痕泄露命运起点',
            },
            '02': {
                name: '紫水晶（美满）',
                desc: '紫水晶在霜雾中低语，解冻的溪流载着前世记忆碎片',
            },
            '03': {
                name: '海蓝宝（聪明）',
                desc: '海蓝宝石封印潮汐，溺亡的春日将在第49次涨落中复活',
            },
            '04': {
                name: '钻石（纯净）',
                desc: '钻石星尘飘向焦土，灰烬里长出说谎者的纯真之心',
            },
            '05': {
                name: '祖母绿（幸运）',
                desc: '祖母绿帷幕后蛇影游动，禁果的香气诱发第7次悖论轮回',
            },
            '06': {
                name: '月光石（长寿）',
                desc: '月光石髓液注入沙漏，涨落潮汐困住第13次重复的夏至',
            },
            '07': {
                name: '红宝石（仁爱）',
                desc: '红宝石在日光下高速旋转，编织出吞噬下午1:07-1:23的时茧',
            },
            '08': {
                name: '橄榄石（幸福）',
                desc: '橄榄石液渗入年轮第214圈，所有蝉蜕内壁刻着你的声纹倒放密码',
            },
            '09': {
                name: '蓝宝石（慈爱）',
                desc: '蓝宝石折射月光时，会拓印对视者瞳孔中未说出口的承诺',
            },
            '10': {
                name: '欧泊（神秘）',
                desc: '欧泊虹光啃食古籍墨迹，被腐蚀的文字重组为你的未来坐标方程',
            },
            '11': {
                name: '托帕石（希望）',
                desc: '托帕石炼成丰收光脉，金穗落地处涌出永续沃土循环',
            },
            '12': {
                name: '坦桑石（成功）',
                desc: '坦桑石大雪掩埋编年史，冰层下新纪元正用谎言孵化',
            },
        },
        '洗手池晨辉概率配置 day_chance每日次数 value获得晨辉 probability概率(只支持0.1) ↓↓↓': ' ',
        wash_hands_config: {
            day_chance: '3',
            pool: {
                '1': {
                    value: '100',
                    probability: '80',
                },
                '2': {
                    value: '1000',
                    probability: '10',
                },
                '3': {
                    value: '10000',
                    probability: '10',
                },
            },
        },
        '晨辉的图片 ↓↓↓': ' ',
        prop_img: 'fjlw_xyq_0111.png',
        quarter_prize: {
            '1': {
                '1': {
                    gift_id: '26',
                    gift_type: '1',
                    gift_num: '1',
                    real_probability: '35',
                    tag: '0',
                    format_price: '个',
                    remark: '点亮春季石头奖励',
                },
                '2': {
                    gift_id: '26',
                    gift_type: '1',
                    gift_num: '1',
                    real_probability: '26.1',
                    tag: '0',
                    format_price: '个',
                    remark: '点亮春季石头奖励',
                },
            },
            '2': {
                '1': {
                    gift_id: '26',
                    gift_type: '1',
                    gift_num: '1',
                    real_probability: '35',
                    tag: '0',
                    format_price: '个',
                    remark: '点亮夏季石头奖励',
                },
                '2': {
                    gift_id: '26',
                    gift_type: '1',
                    gift_num: '1',
                    real_probability: '26.1',
                    tag: '0',
                    format_price: '个',
                    remark: '点亮夏季石头奖励',
                },
            },
            '3': {
                '1': {
                    gift_id: '26',
                    gift_type: '1',
                    gift_num: '1',
                    real_probability: '35',
                    tag: '0',
                    format_price: '个',
                    remark: '点亮秋季石头奖励',
                },
                '2': {
                    gift_id: '26',
                    gift_type: '1',
                    gift_num: '1',
                    real_probability: '26.1',
                    tag: '0',
                    format_price: '个',
                    remark: '点亮秋季石头奖励',
                },
            },
            '4': {
                '1': {
                    gift_id: '26',
                    gift_type: '1',
                    gift_num: '1',
                    real_probability: '35',
                    tag: '0',
                    format_price: '个',
                    remark: '点亮冬季石头奖励',
                },
                '2': {
                    gift_id: '26',
                    gift_type: '1',
                    gift_num: '1',
                    real_probability: '26.1',
                    tag: '0',
                    format_price: '个',
                    remark: '点亮冬季石头奖励',
                },
            },
        },
    },
};
