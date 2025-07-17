import { NextRequest, NextResponse } from 'next/server';
import { MidYearConfig } from '../../../../types/midyear-config';

// 模拟的年中活动配置数据
const mockMidYearConfig: MidYearConfig = {
  send_msg_config: {
    '是否开启发送通知(1开启。0关闭)↓↓↓': '',
    send_msg: 1,
    '通知发送内容 ↓↓↓': '',
    send_msg_info: {
      match_done: '匹配完成通知内容',
      thursday_tips: '周四提示通知内容',
      need_20_value: '差20点提示内容',
      two_days_tips: '两天提示内容',
      fourth_week: '第四周提示内容'
    }
  },
  send_warning_config: {
    '是否开启告警邮件发送(1开启。0关闭)↓↓↓': '',
    send_warning: 1,
    '告警产生的活动名 ↓↓↓': '',
    send_warning_act_name: '年中活动',
    '告警邮件发送间隔↓↓↓': '',
    send_warning_interval: '3600',
    '告警礼物时间间隔配置 ↓↓↓': '',
    interval_warning_time: {
      '8001780': '300',
      '1224': '300'
    },
    '告警礼物数量阈值配置 ↓↓↓': '',
    interval_warning_prize: {
      '8001780': '1000',
      '1224': '1000'
    },
    '接口访问次数风控告警-指定时间内(秒) ↓↓↓': '',
    report_time: '60',
    '接口访问次数风控告警-访问次数阈值 ↓↓↓': '',
    report_num: '100',
    msg_1: '告警消息模板',
    give_gift_num: '10'
  },
  act_config: {
    import_gifts: [224, 109, 208, 4316, 2849, 2888, 4317, 2853, 3315, 2939, 4318, 2259, 3239, 2174, 4319, 3961, 2050, 2329, 1518, 4320],
    rank_game_config: {
      family_rank_config: {
        intro_msg: "所有家族无需报名，直接加入荣耀家族战\n家族房间内有人送出指定礼物 ，或家族成员完成指定任务\n就能助力家族获得参与赛程，突破重围荣登王者宝座，赢取年中大奖！",
        spare_msg: "在家族房内送出以上礼物（武林争霸与神笔绘梦玩法内产出的也算）按照礼物金币价值1：10可以增加该家族荣耀值。",
        spare_msg_2: "预选赛期间，只需要家族荣耀值达到12323213即可晋级。正式赛期间，只需要家族荣耀值达到n即可晋级。",
        start_time: "2025-07-15 21:05:00",
        end_time: "2025-07-19 17:50:00",
        rank_value_ratio: "10",
        rank_gift: [8001780],
        mission_list: {
          master: {
            sign_in: {
              desc: "家族成员100人完成年中盛典内签到",
              need: "100",
              sort: "1",
              get_rank_value: "20000"
            },
            get_gift: {
              desc: "家族成员30人收到年中盛典活动礼物",
              need: "30",
              sort: "2",
              get_rank_value: "50000"
            },
            play_game: {
              desc: "家族成员30人参与武林争霸或神笔绘梦",
              need: "30",
              sort: "3",
              get_rank_value: "50000"
            }
          },
          member: {
            sign_in: {
              desc: "年中盛典内签到1次",
              need: "1",
              sort: "1",
              get_rank_value: "500",
              get_prop: "1"
            },
            stay_room: {
              desc: "任意房间内停留30分钟以上",
              need: "30",
              sort: "2",
              get_rank_value: "500",
              get_prop: "30"
            },
            apprentice: {
              desc: "今日收5名徒弟",
              need: "5",
              sort: "3",
              get_rank_value: "5000",
              get_prop: "1"
            },
            recharge: {
              desc: "完成1次6元以上任意充值",
              need: "1",
              sort: "4",
              get_rank_value: "1000",
              get_prop: "1"
            },
            play_game: {
              desc: "参与1次武林争霸或神笔绘梦玩法",
              need: "1",
              sort: "5",
              get_rank_value: "1000",
              get_prop: "1"
            },
            graduate: {
              desc: "完成出师1次（整个活动期间限1次）",
              need: "1",
              sort: "6",
              get_rank_value: "3000",
              get_prop: "1"
            }
          }
        },
        first_stage: {
          start_time: "2025-07-15 21:05:00",
          end_time: "2025-07-17 15:18:30",
          winner_need_value: "300"
        },
        second_stage: {
          start_time: "2025-07-18 15:18:30",
          end_time: "2025-07-18 16:24:00",
          winner_need_value: "20000"
        },
        last_stage: {
          start_time: "2025-07-18 16:24:00",
          end_time: "2025-07-19 16:50:00"
        },
        gift_rank_show: {
          "1": {
            gift_id: "31",
            gift_type: "1",
            gift_num: "1",
            real_probability: "0",
            remark: "家族赛上榜礼物展示(纯展示)"
          },
          "2": {
            gift_id: "24",
            gift_type: "1",
            gift_num: "1",
            real_probability: "0",
            remark: "家族赛上榜礼物展示(纯展示)"
          },
          "3": {
            gift_id: "24",
            gift_type: "1",
            gift_num: "1",
            real_probability: "0",
            remark: "家族赛上榜礼物展示(纯展示)"
          }
        }
      },
      user_rank_config: {
        intro_msg: "所有用户自动参与，只需送出活动指定礼物，就可加入风云人物榜单赛",
        spare_msg: "送出以上礼物（武林争霸与神笔绘梦玩法内产出的也算）按照礼物金币价值1：10可以增加风云值。",
        spare_msg_2: "风云值达到21321321以上，可获得参与奖（不与排名奖重叠）",
        start_time: "2025-07-15 18:30:00",
        end_time: "2025-07-20 17:56:00",
        rank_value_ratio: "10",
        rank_gift: [1224],
        patch_in_prize_need_value: "1000",
        gift_rank_show: {
          "1": {
            gift_id: "26",
            gift_type: "1",
            gift_num: "1",
            real_probability: "0",
            remark: "风云榜上榜礼物展示(纯展示)"
          },
          "2": {
            gift_id: "24",
            gift_type: "1",
            gift_num: "1",
            real_probability: "0",
            remark: "风云榜上榜礼物展示(纯展示)"
          },
          "3": {
            gift_id: "24",
            gift_type: "1",
            gift_num: "1",
            real_probability: "0",
            remark: "风云榜上榜礼物展示(纯展示)"
          }
        }
      },
      skill_rank_config: {
        intro_msg: "该榜单只有技能者才可以参与\n活动期间，完成任务以及收到指定礼物可增加天选值参与榜单竞争",
        spare_msg: "送出以上礼物（武林争霸与神笔绘梦玩法内产出的也算）按照礼物价值1：5可以增加天选值。",
        spare_msg_2: "天选值达到21321321以上，可获得参与奖（不与排名奖重叠）",
        start_time: "2025-07-19 17:50:00",
        end_time: "2025-07-19 18:25:00",
        rank_value_ratio: "10",
        rank_gift: [8001987, 8002019],
        mission_list: {
          skill: {
            guard: {
              desc: "增加10个守护者",
              need: "10",
              sort: "1",
              get_rank_value: "12000",
              get_prop: "1"
            },
            guard_sign_in: {
              desc: "20个守护在年中盛典内签到",
              need: "20",
              sort: "2",
              get_rank_value: "8000",
              get_prop: "1"
            },
            apprentice: {
              desc: "收5位徒弟",
              need: "5",
              sort: "3",
              get_rank_value: "10000",
              get_prop: "1"
            }
          },
          member: {
            stay_skill_room: {
              desc: "前往任意技能者房间停留30分钟以上",
              need: "30",
              sort: "1",
              get_prop: "1",
              gift_info: {
                gift_id: "24",
                gift_type: "1",
                gift_num: "1",
                real_probability: "0",
                remark: "天选之声普通用户任务奖励-技能者房停留"
              }
            },
            send_gift: {
              desc: "给任意技能者赠送8002019礼物",
              need: "8002019",
              sort: "2",
              get_prop: "3",
              gift_info: {
                gift_id: "24",
                gift_type: "1",
                gift_num: "2",
                real_probability: "0",
                remark: "天选之声普通用户任务奖励-给技能者送礼"
              }
            },
            sign_in: {
              desc: "年中盛典内签到1次",
              need: "1",
              sort: "3",
              get_prop: "1",
              gift_info: {
                gift_id: "24",
                gift_type: "1",
                gift_num: "3",
                real_probability: "0",
                remark: "天选之声普通用户任务奖励-签到"
              }
            },
            apprentice: {
              desc: "今日完成收徒5位",
              need: "5",
              sort: "4",
              get_prop: "3",
              gift_info: {
                gift_id: "24",
                gift_type: "1",
                gift_num: "4",
                real_probability: "0",
                remark: "天选之声普通用户任务奖励-收徒"
              }
            },
            recharge: {
              desc: "完成1次6元以上任意充值",
              need: "1",
              sort: "5",
              get_prop: "3",
              gift_info: {
                gift_id: "24",
                gift_type: "1",
                gift_num: "5",
                real_probability: "0",
                remark: "天选之声普通用户任务奖励-充值"
              }
            },
            guard: {
              desc: "加入或续费守护1次",
              need: "1",
              sort: "6",
              get_prop: "1",
              gift_info: {
                gift_id: "24",
                gift_type: "1",
                gift_num: "6",
                real_probability: "0",
                remark: "天选之声普通用户任务奖励-加守护"
              }
            }
          }
        },
        gift_rank_show: {
          "1": {
            gift_id: "838",
            gift_type: "1",
            gift_num: "1",
            real_probability: "0",
            remark: "技能者榜上榜礼物展示(纯展示)"
          },
          "2": {
            gift_id: "24",
            gift_type: "1",
            gift_num: "1",
            real_probability: "0",
            remark: "技能者榜上榜礼物展示(纯展示)"
          },
          "3": {
            gift_id: "24",
            gift_type: "1",
            gift_num: "1",
            real_probability: "0",
            remark: "技能者榜上榜礼物展示(纯展示)"
          }
        }
      },
      star_user_rank_config: {
        intro_msg: "活动期间，完成任务以及收到指定礼物可增加名望值参与榜单竞争",
        spare_msg: "收到以上礼物（该榜单开始时月光宝盒与乐动星球玩法内产出的也算）按照礼物价值1：10可以增加名望值。",
        spare_msg_2: "名望值达到21321321以上，可获得参与奖（不与排名奖重叠）",
        start_time: "2025-07-19 18:25:00",
        end_time: "2025-07-19 18:30:00",
        rank_value_ratio: "10",
        rank_gift: [1225],
        mission_list: {
          stay_room: {
            desc: "任意房间内停留30分钟以上",
            need: "30",
            sort: "1",
            get_prop: "10",
            get_rank_value: "500"
          },
          recharge: {
            desc: "完成1次6元以上任意充值",
            need: "1",
            sort: "2",
            get_prop: "3",
            get_rank_value: "1000"
          },
          apprentice: {
            desc: "今日收5名徒弟",
            need: "5",
            sort: "3",
            get_prop: "3",
            get_rank_value: "5000"
          },
          sign_in: {
            desc: "年中盛典内签到1次（含补签）",
            need: "1",
            sort: "4",
            get_prop: "1",
            get_rank_value: "500"
          },
          dipper_moonlight: {
            desc: "参与1次月光或者乐动星球",
            need: "1",
            sort: "5",
            get_prop: "3",
            get_rank_value: "1000"
          }
        },
        gift_rank_show: {
          "1": {
            gift_id: "49",
            gift_type: "1",
            gift_num: "1",
            real_probability: "0",
            remark: "名人榜上榜礼物展示(纯展示)"
          },
          "2": {
            gift_id: "24",
            gift_type: "1",
            gift_num: "1",
            real_probability: "0",
            remark: "名人榜上榜礼物展示(纯展示)"
          },
          "3": {
            gift_id: "24",
            gift_type: "1",
            gift_num: "1",
            real_probability: "0",
            remark: "名人榜上榜礼物展示(纯展示)"
          }
        }
      }
    },
    sign_game_config: {
      rich_sign_in: {
        remedy_sign_in_max_num: "10",
        remedy_sign_in_need_rmb: "60",
        total_sign_in_prize: {
          "1": {
            need_num: "3",
            gift_list: {
              "1": {
                gift_id: "90",
                gift_type: "4",
                gift_num: "6",
                real_probability: "0",
                remark: "神豪累计签到奖励-3天"
              }
            }
          },
          "2": {
            need_num: "4",
            gift_list: {
              "1": {
                gift_id: "955",
                gift_type: "2",
                gift_num: "24",
                real_probability: "0",
                remark: "神豪累计签到奖励-4天"
              }
            }
          },
          "3": {
            need_num: "5",
            gift_list: {
              "1": {
                gift_id: "95",
                gift_type: "4",
                gift_num: "1",
                real_probability: "0",
                remark: "神豪累计签到奖励-5天"
              }
            }
          }
        },
        prize_list: {
          "1": {
            "1": {
              gift_id: "90",
              gift_type: "4",
              gift_num: "2",
              real_probability: "0",
              format_price: "个",
              remark: "神豪签到-第1天"
            },
            "2": {
              gift_id: "1217",
              gift_type: "2",
              gift_num: "24",
              real_probability: "0",
              format_price: "个",
              remark: "神豪签到-第1天"
            }
          },
          "2": {
            "1": {
              gift_id: "22",
              gift_type: "4",
              gift_num: "1",
              real_probability: "0",
              format_price: "个",
              remark: "神豪签到-第2天"
            },
            "2": {
              gift_id: "1258",
              gift_type: "2",
              gift_num: "24",
              real_probability: "0",
              format_price: "个",
              remark: "神豪签到-第2天"
            }
          },
          "3": {
            "1": {
              gift_id: "22",
              gift_type: "4",
              gift_num: "1",
              real_probability: "0",
              format_price: "个",
              remark: "神豪签到-第3天"
            },
            "2": {
              gift_id: "49",
              gift_type: "1",
              gift_num: "1",
              real_probability: "0",
              format_price: "个",
              remark: "神豪签到-第3天"
            }
          }
        }
      },
      user_sign_in: {
        remedy_sign_in_max_num: "10",
        remedy_sign_in_need_rmb: "6",
        total_sign_in_prize: {
          "1": {
            need_num: "3",
            gift_list: {
              "1": {
                gift_id: "99",
                gift_type: "4",
                gift_num: "1",
                real_probability: "0",
                remark: "普通用户累计签到奖励-3天"
              }
            }
          },
          "2": {
            need_num: "4",
            gift_list: {
              "1": {
                gift_id: "978",
                gift_type: "2",
                gift_num: "24",
                real_probability: "0",
                remark: "普通用户累计签到奖励-4天"
              }
            }
          },
          "3": {
            need_num: "5",
            gift_list: {
              "1": {
                gift_id: "80",
                gift_type: "1",
                gift_num: "1",
                real_probability: "0",
                remark: "普通用户累计签到奖励-5天"
              }
            }
          }
        },
        prize_list: {
          "1": {
            "1": {
              gift_id: "90",
              gift_type: "4",
              gift_num: "1",
              real_probability: "0",
              format_price: "个",
              remark: "普通用户签到-第1天"
            },
            "2": {
              gift_id: "1258",
              gift_type: "2",
              gift_num: "24",
              real_probability: "0",
              format_price: "个",
              remark: "普通用户签到-第1天"
            }
          },
          "2": {
            "1": {
              gift_id: "91",
              gift_type: "4",
              gift_num: "1",
              real_probability: "0",
              format_price: "个",
              remark: "普通用户签到-第2天"
            },
            "2": {
              gift_id: "37",
              gift_type: "1",
              gift_num: "1",
              real_probability: "0",
              format_price: "个",
              remark: "普通用户签到-第2天"
            }
          },
          "3": {
            "1": {
              gift_id: "96",
              gift_type: "4",
              gift_num: "1",
              real_probability: "0",
              format_price: "个",
              remark: "普通用户签到-第3天"
            },
            "2": {
              gift_id: "980",
              gift_type: "2",
              gift_num: "24",
              real_probability: "0",
              format_price: "个",
              remark: "普通用户签到-第3天"
            }
          }
        }
      }
    },
    draw_game_config: {
      start_time: "2025-07-05 00:00:00",
      end_time: "2025-07-20 00:00:00",
      game_msg: "啊啊啊啊啊啊啊啊啊啊啊文案",
      change_pool_time: ["2025-07-07 16:56:00", "2025-07-07 17:00:00", "2025-07-16 18:42:00"],
      pay_prop_gift: {
        "1": {
          gift_id: "129",
          gift_type: "1",
          gift_num: "1",
          real_probability: "0",
          need_price: "100",
          remark: "购买某笔1"
        },
        "2": {
          gift_id: "894",
          gift_type: "1",
          gift_num: "1",
          real_probability: "0",
          need_price: "200",
          remark: "购买某笔2"
        },
        "3": {
          gift_id: "223",
          gift_type: "1",
          gift_num: "1",
          real_probability: "0",
          need_price: "300",
          remark: "购买某笔3"
        },
        "4": {
          gift_id: "594",
          gift_type: "1",
          gift_num: "1",
          real_probability: "0",
          need_price: "400",
          remark: "购买某笔4"
        }
      }
    },
    fight_game_config: {
      start_time: "2025-07-09 00:00:00",
      end_time: "2025-07-20 00:00:00",
      pk_game_start: "09:30:00",
      pk_game_end: "20:00:00",
      game_msg_draw: "抽奖区域文案",
      game_msg_fight: "掐架区域文案",
      extra_prop_config: {
        "5": {
          probability: "100",
          num_list: {
            "1": {
              num: "1",
              probability: "100"
            },
            "2": {
              num: "2",
              probability: "0"
            },
            "3": {
              num: "3",
              probability: "0"
            }
          }
        },
        "6": {
          probability: "0",
          num_list: {
            "1": {
              num: "1",
              probability: "30"
            },
            "2": {
              num: "2",
              probability: "30"
            },
            "3": {
              num: "3",
              probability: "30"
            }
          }
        }
      },
      pool_8_open_time: {
        "1": {
          start: "10:00:00",
          end: "12:00:00"
        },
        "2": {
          start: "14:00:00",
          end: "16:00:00"
        },
        "3": {
          start: "17:00:00",
          end: "20:00:00"
        }
      },
      fight_config: {
        max_round: "50",
        msg_config: {
          start_msg: ["{nick1}{alias1}-{kungfuName}-{nick2}{alias2}准备开始文案"],
          attack_msg: ["{nick1}用奇怪的眼神盯着{nick2}一直看然后打出{kungfuName},{nick2}难以承受", "{nick2}用{kungfuName}对{nick1}发起了攻击,{nick2}", "{nick2}看{nick1}不顺眼摆好架势用出了{kungfuName},{nick1}"],
          dodge_msg: ["{nick1}{alias1}-{kungfuName}-{nick2}{alias2}闪避文案"],
          attack_msg_special: {
            "116788": ["{nick1}召唤出神兽草泥马,人马合一，发动{kungfuName},{nick2}觉得脑子被侮辱了，一气之下精神受创", "{nick1}智商终于管用了，施展出{kungfuName}打的{nick2}气血翻腾"]
          },
          kungfu_list: ["蛤蟆功第九层", "大姨妈的召唤", "哦哟不错功", "geigei，你女朋友不会吃醋吧功", "地爆天星"],
          kungfu_list_special: {
            "116788": ["嘎嘎功", "咕咕日天大法", "抓破你脸功", "你走不进内心功"]
          }
        },
        attribute_config: {
          "115620": {
            hp: "2000",
            damage: {
              min: "10",
              max: "30"
            },
            dodge_probability: "10",
            alias: "咕咕侠"
          },
          "116788": {
            hp: "2000",
            damage: {
              min: "1",
              max: "15"
            },
            dodge_probability: "10",
            alias: "白眉大王"
          },
          default: {
            hp: "200",
            damage: {
              min: "10",
              max: "30"
            },
            dodge_probability: "10",
            alias: "大侠"
          }
        }
      },
      pay_prop_gift: {
        gift_id: "81",
        gift_type: "1",
        gift_num: "1",
        real_probability: "0",
        need_price: "50",
        remark: "购买武林道具"
      },
      comment_prize: {
        "1": {
          gift_id: "199",
          gift_type: "1",
          gift_num: "1",
          real_probability: "0",
          remark: "评价奖励"
        },
        "2": {
          gift_id: "1314",
          gift_type: "1",
          gift_num: "1",
          real_probability: "0",
          remark: "评价奖励"
        }
      },
      rich_day_prize: {
        "1": {
          gift_id: "597",
          gift_type: "1",
          gift_num: "1",
          real_probability: "0",
          remark: "神豪每日奖励"
        },
        "2": {
          gift_id: "418",
          gift_type: "1",
          gift_num: "1",
          real_probability: "0",
          remark: "神豪每日奖励"
        }
      },
      join_need_prize: {
        gift_id: "246",
        gift_type: "1",
        gift_num: "1",
        real_probability: "32.62",
        remark: "下注所需礼物"
      },
      success_prize: {
        gift_id: "28",
        gift_type: "1",
        gift_num: "1",
        real_probability: "32.62",
        remark: "下注成功奖励"
      },
      extra_gift: {
        gift_id: "246",
        gift_type: "1",
        gift_num: "1",
        real_probability: "32.62",
        remark: "抽奖额外获得的礼物"
      }
    }
  }
};

// GET 请求处理函数
export async function GET(request: NextRequest) {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({
    code: 0,
    message: 'success',
    data: mockMidYearConfig
  });
}

// POST 请求处理函数
export async function POST(request: NextRequest) {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    const body = await request.json();
    
    // 这里可以添加保存配置的逻辑
    
    return NextResponse.json({
      code: 0,
      message: 'success',
      data: body.config
    });
  } catch (error) {
    return NextResponse.json({
      code: 1,
      message: 'Invalid request body',
      data: null
    }, { status: 400 });
  }
}