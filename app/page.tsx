'use client';

import { useState } from 'react';
import { defaultConfig } from '../config/defaultConfig';
import { MainConfig } from '../types/config';

export default function Page() {
    const [config, setConfig] = useState<MainConfig>(defaultConfig);
    const [activeTab, setActiveTab] = useState('send_msg');
    const [apiStatus, setApiStatus] = useState('');

    // 从API获取配置数据
    const fetchData = async () => {
        setApiStatus('正在获取数据...');
        try {
            const response = await fetch('/api/config/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setConfig(result.data || defaultConfig);
            setApiStatus('数据获取成功');
            console.log('获取成功:', result);

            setTimeout(() => setApiStatus(''), 2000);
        } catch (error) {
            console.error('获取失败:', error);
            setApiStatus('获取数据失败: ' + (error as Error).message);
            setTimeout(() => setApiStatus(''), 3000);
        }
    };

    const submitData = async () => {
        setApiStatus('正在提交数据...');
        try {
            // 调用真实的API接口
            const response = await fetch('/api/config/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setApiStatus('数据提交成功');
            console.log('保存成功:', result);

            setTimeout(() => setApiStatus(''), 2000);
        } catch (error) {
            console.error('保存失败:', error);
            setApiStatus('提交数据失败: ' + (error as Error).message);
            setTimeout(() => setApiStatus(''), 3000);
        }
    };

    const updateConfig = (path: string, value: any) => {
        const newConfig = { ...config };
        const keys = path.split('.');
        let current: any = newConfig;

        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        setConfig(newConfig);
    };

    const renderSendMsgConfig = () => (
        <div className="space-y-6" data-oid="h45_h0o">
            <h3 className="text-lg font-medium mb-4" data-oid="yj214ik">
                发送消息配置
            </h3>

            <div data-oid="r-ri7_.">
                <label className="block text-sm font-medium mb-2" data-oid=":jvjrpx">
                    是否开启发送通知
                </label>
                <select
                    value={config.send_msg_config.send_msg}
                    onChange={(e) =>
                        updateConfig('send_msg_config.send_msg', parseInt(e.target.value))
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                    data-oid="ylz65x8"
                >
                    <option value={1} data-oid="wcl-70q">
                        开启
                    </option>
                    <option value={0} data-oid="kdfpyy8">
                        关闭
                    </option>
                </select>
            </div>

            <div className="space-y-4" data-oid=":glcxty">
                <h4 className="font-medium" data-oid="ysk9w3m">
                    通知消息内容
                </h4>

                <div data-oid="e3rxg7:">
                    <label className="block text-sm font-medium mb-2" data-oid="ystf0dl">
                        匹配完成消息
                    </label>
                    <textarea
                        value={config.send_msg_config.send_msg_info.match_done}
                        onChange={(e) =>
                            updateConfig('send_msg_config.send_msg_info.match_done', e.target.value)
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                        data-oid="w6jrzqm"
                    />
                </div>

                <div data-oid="myyiq:p">
                    <label className="block text-sm font-medium mb-2" data-oid=":cw.2wh">
                        周四提醒消息
                    </label>
                    <textarea
                        value={config.send_msg_config.send_msg_info.thursday_tips}
                        onChange={(e) =>
                            updateConfig(
                                'send_msg_config.send_msg_info.thursday_tips',
                                e.target.value,
                            )
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                        data-oid="z-4ax3x"
                    />
                </div>

                <div data-oid="jmjvjy0">
                    <label className="block text-sm font-medium mb-2" data-oid="o7od1ic">
                        差20点提醒消息
                    </label>
                    <textarea
                        value={config.send_msg_config.send_msg_info.need_20_value}
                        onChange={(e) =>
                            updateConfig(
                                'send_msg_config.send_msg_info.need_20_value',
                                e.target.value,
                            )
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                        data-oid="l7g2f-g"
                    />
                </div>

                <div data-oid="uhae2wo">
                    <label className="block text-sm font-medium mb-2" data-oid="0udz46g">
                        两天停滞提醒
                    </label>
                    <textarea
                        value={config.send_msg_config.send_msg_info.two_days_tips}
                        onChange={(e) =>
                            updateConfig(
                                'send_msg_config.send_msg_info.two_days_tips',
                                e.target.value,
                            )
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                        data-oid="nda0xvf"
                    />
                </div>

                <div data-oid="r-harkf">
                    <label className="block text-sm font-medium mb-2" data-oid="8p-3k30">
                        第四周提醒
                    </label>
                    <textarea
                        value={config.send_msg_config.send_msg_info.fourth_week}
                        onChange={(e) =>
                            updateConfig(
                                'send_msg_config.send_msg_info.fourth_week',
                                e.target.value,
                            )
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                        data-oid=":p1ul25"
                    />
                </div>
            </div>
        </div>
    );

    const renderWarningConfig = () => (
        <div className="space-y-6" data-oid="d6cfn.j">
            <h3 className="text-lg font-medium mb-4" data-oid="x9wrwh7">
                活动告警配置
            </h3>

            <div data-oid="o349ejl">
                <label className="block text-sm font-medium mb-2" data-oid="o7y84a-">
                    是否开启告警邮件发送
                </label>
                <select
                    value={config.send_warning_config.send_warning}
                    onChange={(e) =>
                        updateConfig('send_warning_config.send_warning', parseInt(e.target.value))
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                    data-oid="sgn.o2u"
                >
                    <option value={1} data-oid="da:mxig">
                        开启
                    </option>
                    <option value={0} data-oid="b3vne19">
                        关闭
                    </option>
                </select>
            </div>

            <div data-oid="4lf7q0n">
                <label className="block text-sm font-medium mb-2" data-oid="20gxg90">
                    告警产生的活动名
                </label>
                <input
                    type="text"
                    value={config.send_warning_config.send_warning_act_name}
                    onChange={(e) =>
                        updateConfig('send_warning_config.send_warning_act_name', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="7ln.a.j"
                />
            </div>

            <div data-oid="bsim2fn">
                <label className="block text-sm font-medium mb-2" data-oid="o7-8.mz">
                    告警邮件发送间隔(秒)
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.send_warning_interval}
                    onChange={(e) =>
                        updateConfig('send_warning_config.send_warning_interval', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="v7wtde-"
                />
            </div>

            <div data-oid="xxlcoce">
                <label className="block text-sm font-medium mb-2" data-oid="cljvv.0">
                    接口访问次数风控告警-指定时间内(秒)
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.report_time}
                    onChange={(e) =>
                        updateConfig('send_warning_config.report_time', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="tz8nlse"
                />
            </div>

            <div data-oid="p7u3z2t">
                <label className="block text-sm font-medium mb-2" data-oid="6:-7qbc">
                    接口访问次数风控告警-访问次数阈值
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.report_num}
                    onChange={(e) => updateConfig('send_warning_config.report_num', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="t27ywhr"
                />
            </div>

            <div data-oid="z080ssy">
                <label className="block text-sm font-medium mb-2" data-oid="mm4th-u">
                    告警消息模板
                </label>
                <textarea
                    value={config.send_warning_config.msg_1}
                    onChange={(e) => updateConfig('send_warning_config.msg_1', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                    data-oid="f2zj0lx"
                />
            </div>

            <div data-oid="j7f439s">
                <label className="block text-sm font-medium mb-2" data-oid="47_.mhw">
                    礼物数量阈值
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.give_gift_num}
                    onChange={(e) =>
                        updateConfig('send_warning_config.give_gift_num', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="1btitxv"
                />
            </div>
        </div>
    );

    const renderMissionPoolConfig = () => (
        <div className="space-y-8" data-oid="duy06_r">
            <h3 className="text-lg font-medium mb-4" data-oid="d5e1v1u">
                任务池配置
            </h3>

            {/* 新用户任务池 */}
            <div data-oid="5c94j5m">
                <h4 className="font-medium mb-4 text-blue-600" data-oid="ynweh7c">
                    新用户任务池
                </h4>
                <div className="space-y-4" data-oid="60mj.kw">
                    {Object.entries(config.act_config.mission_pool.new_user).map(([key, task]) => (
                        <div
                            key={key}
                            className="border border-gray-200 rounded p-4"
                            data-oid="puj8uuz"
                        >
                            <h5 className="font-medium mb-3" data-oid="do63c5p">
                                {key}
                            </h5>
                            <div className="grid grid-cols-3 gap-4" data-oid="uuwi0mq">
                                <div data-oid="tydvu.:">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="2urkfel"
                                    >
                                        描述
                                    </label>
                                    <input
                                        type="text"
                                        value={task.desc}
                                        onChange={(e) =>
                                            updateConfig(
                                                `act_config.mission_pool.new_user.${key}.desc`,
                                                e.target.value,
                                            )
                                        }
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        data-oid="x8jlome"
                                    />
                                </div>
                                <div data-oid="bl7s_7h">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="yic3y4-"
                                    >
                                        需要
                                    </label>
                                    <input
                                        type="text"
                                        value={task.need}
                                        onChange={(e) =>
                                            updateConfig(
                                                `act_config.mission_pool.new_user.${key}.need`,
                                                e.target.value,
                                            )
                                        }
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        data-oid="2.kcs2o"
                                    />
                                </div>
                                <div data-oid="k1vx7ad">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="l676cl1"
                                    >
                                        获得
                                    </label>
                                    <input
                                        type="text"
                                        value={task.get}
                                        onChange={(e) =>
                                            updateConfig(
                                                `act_config.mission_pool.new_user.${key}.get`,
                                                e.target.value,
                                            )
                                        }
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        data-oid="3k4jz7."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 老用户任务池 */}
            <div data-oid="7fv4-vh">
                <h4 className="font-medium mb-4 text-green-600" data-oid="zydlhms">
                    老用户任务池
                </h4>
                <div className="space-y-4" data-oid="w_wh3mf">
                    {Object.entries(config.act_config.mission_pool.old_user).map(([key, task]) => (
                        <div
                            key={key}
                            className="border border-gray-200 rounded p-4"
                            data-oid="nijq7bc"
                        >
                            <h5 className="font-medium mb-3" data-oid="n2-hbca">
                                {key}
                            </h5>
                            <div className="grid grid-cols-3 gap-4" data-oid="up.7pcn">
                                <div data-oid="n6.usi2">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="o1fc:6i"
                                    >
                                        描述
                                    </label>
                                    <input
                                        type="text"
                                        value={task.desc}
                                        onChange={(e) =>
                                            updateConfig(
                                                `act_config.mission_pool.old_user.${key}.desc`,
                                                e.target.value,
                                            )
                                        }
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        data-oid="ek3.f1b"
                                    />
                                </div>
                                <div data-oid="qnbgc:-">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="_4k0_fg"
                                    >
                                        需要
                                    </label>
                                    <input
                                        type="text"
                                        value={task.need}
                                        onChange={(e) =>
                                            updateConfig(
                                                `act_config.mission_pool.old_user.${key}.need`,
                                                e.target.value,
                                            )
                                        }
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        data-oid=".gz-llc"
                                    />
                                </div>
                                <div data-oid="o88z3fj">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="jgal7-y"
                                    >
                                        获得
                                    </label>
                                    <input
                                        type="text"
                                        value={task.get}
                                        onChange={(e) =>
                                            updateConfig(
                                                `act_config.mission_pool.old_user.${key}.get`,
                                                e.target.value,
                                            )
                                        }
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        data-oid="u_10.5r"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderOpenBoxConfig = () => (
        <div className="space-y-6" data-oid="ty6wja2">
            <h3 className="text-lg font-medium mb-4" data-oid="_e.:x9u">
                开宝箱配置
            </h3>

            {/* 免费时段配置 */}
            <div data-oid="3ya-c6x">
                <h4 className="font-medium mb-3" data-oid="0kw:94v">
                    免费时段配置
                </h4>
                <div className="grid grid-cols-2 gap-6" data-oid="g1m304l">
                    <div data-oid="2a2yobo">
                        <label className="block text-sm font-medium mb-2" data-oid="i61a055">
                            免费时段1
                        </label>
                        <div className="flex space-x-2" data-oid="eo6rj9.">
                            <input
                                type="time"
                                value={config.act_config.open_box_config.free_box_time_1.start}
                                onChange={(e) =>
                                    updateConfig(
                                        'act_config.open_box_config.free_box_time_1.start',
                                        e.target.value,
                                    )
                                }
                                className="border border-gray-300 rounded px-3 py-2"
                                data-oid="nvx-6hq"
                            />

                            <span className="self-center" data-oid="6243w.2">
                                至
                            </span>
                            <input
                                type="time"
                                value={config.act_config.open_box_config.free_box_time_1.end}
                                onChange={(e) =>
                                    updateConfig(
                                        'act_config.open_box_config.free_box_time_1.end',
                                        e.target.value,
                                    )
                                }
                                className="border border-gray-300 rounded px-3 py-2"
                                data-oid="jfznt5u"
                            />
                        </div>
                    </div>
                    <div data-oid="-w4j:h2">
                        <label className="block text-sm font-medium mb-2" data-oid="6f9kcof">
                            免费时段2
                        </label>
                        <div className="flex space-x-2" data-oid="11y1dyf">
                            <input
                                type="time"
                                value={config.act_config.open_box_config.free_box_time_2.start}
                                onChange={(e) =>
                                    updateConfig(
                                        'act_config.open_box_config.free_box_time_2.start',
                                        e.target.value,
                                    )
                                }
                                className="border border-gray-300 rounded px-3 py-2"
                                data-oid="efexlqp"
                            />

                            <span className="self-center" data-oid="emvrk0m">
                                至
                            </span>
                            <input
                                type="time"
                                value={config.act_config.open_box_config.free_box_time_2.end}
                                onChange={(e) =>
                                    updateConfig(
                                        'act_config.open_box_config.free_box_time_2.end',
                                        e.target.value,
                                    )
                                }
                                className="border border-gray-300 rounded px-3 py-2"
                                data-oid="zdblmms"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 送礼得宝箱配置 */}
            <div data-oid="1nw6fo5">
                <h4 className="font-medium mb-3" data-oid="bf0g6ku">
                    送礼得宝箱配置
                </h4>
                <div className="grid grid-cols-2 gap-4" data-oid="thi1.bj">
                    <div data-oid="g73-sio">
                        <label className="block text-sm font-medium mb-2" data-oid="lj:2qsl">
                            礼物ID
                        </label>
                        <input
                            type="text"
                            value={config.act_config.open_box_config.send_gift_get_box.gift_id}
                            onChange={(e) =>
                                updateConfig(
                                    'act_config.open_box_config.send_gift_get_box.gift_id',
                                    e.target.value,
                                )
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            data-oid="4gilcrz"
                        />
                    </div>
                    <div data-oid="zv3ofha">
                        <label className="block text-sm font-medium mb-2" data-oid=":xkjd2g">
                            礼物名称
                        </label>
                        <input
                            type="text"
                            value={config.act_config.open_box_config.send_gift_get_box.gift_name}
                            onChange={(e) =>
                                updateConfig(
                                    'act_config.open_box_config.send_gift_get_box.gift_name',
                                    e.target.value,
                                )
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            data-oid="b5ij_m."
                        />
                    </div>
                    <div data-oid="2xnfd:z">
                        <label className="block text-sm font-medium mb-2" data-oid="u9vevsg">
                            礼物图片
                        </label>
                        <input
                            type="text"
                            value={config.act_config.open_box_config.send_gift_get_box.gift_img}
                            onChange={(e) =>
                                updateConfig(
                                    'act_config.open_box_config.send_gift_get_box.gift_img',
                                    e.target.value,
                                )
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            data-oid="wmje4u7"
                        />
                    </div>
                    <div data-oid="xqj_5nq">
                        <label className="block text-sm font-medium mb-2" data-oid="os6js:o">
                            获得道具数量
                        </label>
                        <input
                            type="text"
                            value={config.act_config.open_box_config.send_gift_get_box.get_prop_num}
                            onChange={(e) =>
                                updateConfig(
                                    'act_config.open_box_config.send_gift_get_box.get_prop_num',
                                    e.target.value,
                                )
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            data-oid="d2b3:7l"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderGiftHatConfig = () => (
        <div className="space-y-6" data-oid="xht:ikh">
            <h3 className="text-lg font-medium mb-4" data-oid="kj6kvto">
                收礼送尾巴配置
            </h3>

            <div className="grid grid-cols-3 gap-4" data-oid="6oh2hl1">
                <div data-oid="qin7k6y">
                    <label className="block text-sm font-medium mb-2" data-oid="pd1ghzw">
                        收到礼物ID
                    </label>
                    <input
                        type="text"
                        value={config.act_config.get_gift_send_hat.get_gift_id}
                        onChange={(e) =>
                            updateConfig('act_config.get_gift_send_hat.get_gift_id', e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        data-oid="l944tws"
                    />
                </div>
                <div data-oid="w7jgje0">
                    <label className="block text-sm font-medium mb-2" data-oid="rsrn11l">
                        收到礼物图片
                    </label>
                    <input
                        type="text"
                        value={config.act_config.get_gift_send_hat.get_gift_img}
                        onChange={(e) =>
                            updateConfig(
                                'act_config.get_gift_send_hat.get_gift_img',
                                e.target.value,
                            )
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        data-oid="ahjnt1t"
                    />
                </div>
                <div data-oid="lugfzx6">
                    <label className="block text-sm font-medium mb-2" data-oid="9ivavlk">
                        收到礼物名称
                    </label>
                    <input
                        type="text"
                        value={config.act_config.get_gift_send_hat.get_gift_name}
                        onChange={(e) =>
                            updateConfig(
                                'act_config.get_gift_send_hat.get_gift_name',
                                e.target.value,
                            )
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        data-oid="105d_.r"
                    />
                </div>
            </div>
        </div>
    );

    const renderBirthdayConfig = () => {
        const addBirthdayMessage = () => {
            const newMsgList = [...config.act_config.happy_birthday_config.msg_list, ''];
            updateConfig('act_config.happy_birthday_config.msg_list', newMsgList);
        };

        const removeBirthdayMessage = (index: number) => {
            const newMsgList = config.act_config.happy_birthday_config.msg_list.filter(
                (_, i) => i !== index,
            );
            updateConfig('act_config.happy_birthday_config.msg_list', newMsgList);
        };

        const updateBirthdayMessage = (index: number, value: string) => {
            const newMsgList = [...config.act_config.happy_birthday_config.msg_list];
            newMsgList[index] = value;
            updateConfig('act_config.happy_birthday_config.msg_list', newMsgList);
        };

        return (
            <div className="space-y-6" data-oid="wfx63g-">
                <h3 className="text-lg font-medium mb-4" data-oid="x15:4pc">
                    生日配置
                </h3>

                {/* 价格配置 */}
                <div className="grid grid-cols-2 gap-4" data-oid="u03dmfh">
                    <div data-oid="1.67vx.">
                        <label className="block text-sm font-medium mb-2" data-oid="7ul:oya">
                            原价格
                        </label>
                        <input
                            type="text"
                            value={config.act_config.happy_birthday_config.origin_price}
                            onChange={(e) =>
                                updateConfig(
                                    'act_config.happy_birthday_config.origin_price',
                                    e.target.value,
                                )
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            data-oid="9goakkw"
                        />
                    </div>
                    <div data-oid="h4f8ib7">
                        <label className="block text-sm font-medium mb-2" data-oid="rdc31ya">
                            现价格
                        </label>
                        <input
                            type="text"
                            value={config.act_config.happy_birthday_config.now_price}
                            onChange={(e) =>
                                updateConfig(
                                    'act_config.happy_birthday_config.now_price',
                                    e.target.value,
                                )
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            data-oid="r1f499h"
                        />
                    </div>
                </div>

                {/* 任务列表配置 */}
                <div data-oid="vnzl_gu">
                    <h4 className="font-medium mb-3" data-oid="i8ylucc">
                        任务列表配置
                    </h4>
                    <div className="space-y-4" data-oid="9rhduj_">
                        {Object.entries(config.act_config.happy_birthday_config.mission_list).map(
                            ([key, mission]) => (
                                <div
                                    key={key}
                                    className="border border-gray-200 rounded p-4"
                                    data-oid="vtomoo0"
                                >
                                    <h5 className="font-medium mb-3" data-oid="252.kh:">
                                        {key}
                                    </h5>
                                    <div className="grid grid-cols-4 gap-4" data-oid="qwkxi45">
                                        <div data-oid="-k125:p">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid="6u8spg9"
                                            >
                                                描述
                                            </label>
                                            <input
                                                type="text"
                                                value={mission.desc}
                                                onChange={(e) =>
                                                    updateConfig(
                                                        `act_config.happy_birthday_config.mission_list.${key}.desc`,
                                                        e.target.value,
                                                    )
                                                }
                                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                                data-oid="6cg1_sz"
                                            />
                                        </div>
                                        <div data-oid="4jrje8z">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid="c.k_qcs"
                                            >
                                                需要
                                            </label>
                                            <input
                                                type="text"
                                                value={mission.need}
                                                onChange={(e) =>
                                                    updateConfig(
                                                        `act_config.happy_birthday_config.mission_list.${key}.need`,
                                                        e.target.value,
                                                    )
                                                }
                                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                                data-oid="m_4kc8m"
                                            />
                                        </div>
                                        <div data-oid=".auqbpe">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid="_yota8q"
                                            >
                                                获得
                                            </label>
                                            <input
                                                type="number"
                                                value={mission.get}
                                                onChange={(e) =>
                                                    updateConfig(
                                                        `act_config.happy_birthday_config.mission_list.${key}.get`,
                                                        parseInt(e.target.value),
                                                    )
                                                }
                                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                                data-oid="684oiue"
                                            />
                                        </div>
                                        <div data-oid="_5wolco">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid="pth2xhg"
                                            >
                                                排序
                                            </label>
                                            <input
                                                type="text"
                                                value={mission.sort}
                                                onChange={(e) =>
                                                    updateConfig(
                                                        `act_config.happy_birthday_config.mission_list.${key}.sort`,
                                                        e.target.value,
                                                    )
                                                }
                                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                                data-oid="1f1bx1n"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>

                {/* 生日消息列表 */}
                <div data-oid="4ql-pz6">
                    <h4 className="font-medium mb-3" data-oid="xs2p3pu">
                        生日祝福消息列表
                    </h4>
                    <div className="space-y-2" data-oid="jafl44r">
                        {config.act_config.happy_birthday_config.msg_list.map((msg, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2"
                                data-oid="c3s8y5m"
                            >
                                <span className="text-sm text-gray-500 w-8" data-oid="4t9knjn">
                                    #{index + 1}
                                </span>
                                <input
                                    type="text"
                                    value={msg}
                                    onChange={(e) => updateBirthdayMessage(index, e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 flex-1"
                                    placeholder="输入生日祝福消息"
                                    data-oid="lwcnb:4"
                                />

                                <button
                                    onClick={() => removeBirthdayMessage(index)}
                                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                    data-oid="87m8vh-"
                                >
                                    删除
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addBirthdayMessage}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            data-oid="58tzy2p"
                        >
                            添加消息
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderWashHandsConfig = () => (
        <div className="space-y-6" data-oid="d.wicj7">
            <h3 className="text-lg font-medium mb-4" data-oid="03onpww">
                洗手池晨辉配置
            </h3>

            <div data-oid="zkpwd6x">
                <label className="block text-sm font-medium mb-2" data-oid="awbejjj">
                    每日次数
                </label>
                <input
                    type="text"
                    value={config.act_config.wash_hands_config.day_chance}
                    onChange={(e) =>
                        updateConfig('act_config.wash_hands_config.day_chance', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="sj85:rk"
                />
            </div>

            <div data-oid="wnuptjj">
                <h4 className="font-medium mb-3" data-oid=":h18tjg">
                    奖励池配置
                </h4>
                <div className="space-y-3" data-oid="p:6qc57">
                    {Object.entries(config.act_config.wash_hands_config.pool).map(([key, pool]) => (
                        <div
                            key={key}
                            className="flex space-x-4 items-center border border-gray-200 rounded p-3"
                            data-oid="y9-1vqa"
                        >
                            <span className="w-12 text-sm font-medium" data-oid="zdpcgs8">
                                池子{key}
                            </span>
                            <div data-oid="yhuvcad">
                                <label
                                    className="block text-xs text-gray-500 mb-1"
                                    data-oid="j:7ya1s"
                                >
                                    晨辉值
                                </label>
                                <input
                                    type="text"
                                    value={pool.value}
                                    onChange={(e) =>
                                        updateConfig(
                                            `act_config.wash_hands_config.pool.${key}.value`,
                                            e.target.value,
                                        )
                                    }
                                    className="border border-gray-300 rounded px-2 py-1 w-24"
                                    data-oid="imjjwsp"
                                />
                            </div>
                            <div data-oid="3jyb-u7">
                                <label
                                    className="block text-xs text-gray-500 mb-1"
                                    data-oid="2uwh50l"
                                >
                                    概率
                                </label>
                                <input
                                    type="text"
                                    value={pool.probability}
                                    onChange={(e) =>
                                        updateConfig(
                                            `act_config.wash_hands_config.pool.${key}.probability`,
                                            e.target.value,
                                        )
                                    }
                                    className="border border-gray-300 rounded px-2 py-1 w-24"
                                    data-oid="leypcb1"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPropImgConfig = () => (
        <div className="space-y-6" data-oid="iqkp:d0">
            <h3 className="text-lg font-medium mb-4" data-oid="cla2pcf">
                晨辉图片配置
            </h3>

            <div data-oid="p7wa92k">
                <label className="block text-sm font-medium mb-2" data-oid="ai3-7de">
                    晨辉图片文件名
                </label>
                <input
                    type="text"
                    value={config.act_config.prop_img}
                    onChange={(e) => updateConfig('act_config.prop_img', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    placeholder="例如: fjlw_xyq_0111.png"
                    data-oid="kjmgwut"
                />
            </div>
        </div>
    );

    const renderStoneConfig = () => (
        <div className="space-y-6" data-oid="x-gkrv:">
            <h3 className="text-lg font-medium mb-4" data-oid="ym3ff1r">
                12个月石头配置
            </h3>
            <div className="grid grid-cols-1 gap-4" data-oid=":qp.1ur">
                {Object.entries(config.act_config.all_stone).map(([month, stone]) => (
                    <div
                        key={month}
                        className="border border-gray-200 rounded p-4"
                        data-oid="f_xc.l6"
                    >
                        <h4 className="font-medium mb-2" data-oid="q72j2xv">
                            {month}月 - {stone.name}
                        </h4>
                        <div data-oid="j0-0lje">
                            <label className="block text-sm font-medium mb-2" data-oid="hs1mo4s">
                                石头名称
                            </label>
                            <input
                                type="text"
                                value={stone.name}
                                onChange={(e) =>
                                    updateConfig(
                                        `act_config.all_stone.${month}.name`,
                                        e.target.value,
                                    )
                                }
                                className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
                                data-oid="5fa.143"
                            />
                        </div>
                        <div data-oid=":zjrtuj">
                            <label className="block text-sm font-medium mb-2" data-oid="mgb1ud6">
                                描述
                            </label>
                            <textarea
                                value={stone.desc}
                                onChange={(e) =>
                                    updateConfig(
                                        `act_config.all_stone.${month}.desc`,
                                        e.target.value,
                                    )
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                                data-oid="0nd6cmj"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex" data-oid="_p.:hkn">
            {/* 侧边栏 */}
            <div className="w-64 bg-gray-800 text-white" data-oid="4d1vqk:">
                <div className="p-4" data-oid="eb.s2lm">
                    <div className="flex items-center mb-8" data-oid="w:hsnuu">
                        <div className="w-4 h-4 bg-gray-600 rounded mr-2" data-oid="vt6alzf"></div>
                        <span className="text-sm" data-oid="vlgnz5n">
                            宝石活动配置管理
                        </span>
                    </div>

                    <nav className="space-y-2" data-oid="t6tnsxo">
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'send_msg' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('send_msg')}
                            data-oid=".ea4iwp"
                        >
                            <div
                                className="w-4 h-4 bg-blue-500 rounded-sm mr-2"
                                data-oid=":._i.da"
                            ></div>
                            <span className="text-sm" data-oid="ot-wp7k">
                                发送消息配置
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'warning' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('warning')}
                            data-oid="g9k_k69"
                        >
                            <div
                                className="w-4 h-4 bg-red-500 rounded-sm mr-2"
                                data-oid="-4fpnq."
                            ></div>
                            <span className="text-sm" data-oid="y9z_gg6">
                                活动告警配置
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'mission_pool' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('mission_pool')}
                            data-oid="ql4ckae"
                        >
                            <div
                                className="w-4 h-4 bg-green-500 rounded-sm mr-2"
                                data-oid="h_el1rh"
                            ></div>
                            <span className="text-sm" data-oid="t0p1rh2">
                                任务池配置
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'open_box' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('open_box')}
                            data-oid="c7lakqw"
                        >
                            <div
                                className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"
                                data-oid="sz_-pmu"
                            ></div>
                            <span className="text-sm" data-oid="jpe-grw">
                                开宝箱配置
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'gift_hat' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('gift_hat')}
                            data-oid="z1fddm_"
                        >
                            <div
                                className="w-4 h-4 bg-pink-500 rounded-sm mr-2"
                                data-oid="78wr8ya"
                            ></div>
                            <span className="text-sm" data-oid="h-rzjyf">
                                收礼送尾巴
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'birthday' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('birthday')}
                            data-oid="d5sp635"
                        >
                            <div
                                className="w-4 h-4 bg-orange-500 rounded-sm mr-2"
                                data-oid="nul_7rp"
                            ></div>
                            <span className="text-sm" data-oid="x9_2_om">
                                生日配置
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'stones' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('stones')}
                            data-oid="t74w8e3"
                        >
                            <div
                                className="w-4 h-4 bg-purple-500 rounded-sm mr-2"
                                data-oid="hhtmbob"
                            ></div>
                            <span className="text-sm" data-oid="nqfv-st">
                                石头配置
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'wash_hands' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('wash_hands')}
                            data-oid="ngj6dn."
                        >
                            <div
                                className="w-4 h-4 bg-cyan-500 rounded-sm mr-2"
                                data-oid="db5m2-e"
                            ></div>
                            <span className="text-sm" data-oid="dgc3k_-">
                                洗手池配置
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'prop_img' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('prop_img')}
                            data-oid="q9gwrgy"
                        >
                            <div
                                className="w-4 h-4 bg-indigo-500 rounded-sm mr-2"
                                data-oid="qo4:gr6"
                            ></div>
                            <span className="text-sm" data-oid="5hutn6s">
                                晨辉图片
                            </span>
                        </div>
                    </nav>
                </div>
            </div>

            {/* 主内容区 */}
            <div className="flex-1 p-6" data-oid="hwawr1c">
                <div className="bg-white rounded-lg shadow-sm" data-oid="o67vuu.">
                    {/* 头部 */}
                    <div className="border-b border-gray-200 p-6" data-oid="_hi56dn">
                        <h1 className="text-2xl font-medium text-gray-800 mb-2" data-oid="e2v9u9q">
                            宝石活动配置管理
                        </h1>
                        <div className="text-sm text-gray-500" data-oid=":944.-1">
                            {/* 操作员：Wang-Xiu 当前时间：{new Date().toLocaleString('zh-CN')} */}
                        </div>
                    </div>

                    <div className="p-6" data-oid="5.ids:p">
                        {/* 配置内容 */}
                        <div className="bg-gray-50 rounded-lg p-6" data-oid="ixs900d">
                            {activeTab === 'send_msg' && renderSendMsgConfig()}
                            {activeTab === 'warning' && renderWarningConfig()}
                            {activeTab === 'mission_pool' && renderMissionPoolConfig()}
                            {activeTab === 'open_box' && renderOpenBoxConfig()}
                            {activeTab === 'gift_hat' && renderGiftHatConfig()}
                            {activeTab === 'birthday' && renderBirthdayConfig()}
                            {activeTab === 'stones' && renderStoneConfig()}
                            {activeTab === 'wash_hands' && renderWashHandsConfig()}
                            {activeTab === 'prop_img' && renderPropImgConfig()}
                        </div>

                        {/* API操作和状态 */}
                        <div
                            className="flex items-center justify-between pt-6 border-t mt-6"
                            data-oid="96wjtki"
                        >
                            <div className="flex space-x-4" data-oid="r83.0sf">
                                <button
                                    onClick={fetchData}
                                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                                    data-oid="pog20km"
                                >
                                    获取配置
                                </button>
                                <button
                                    onClick={submitData}
                                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                                    data-oid="pufv2o1"
                                >
                                    保存配置
                                </button>
                                <button
                                    onClick={() => setConfig(defaultConfig)}
                                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                                    data-oid="wo80j1."
                                >
                                    重置配置
                                </button>
                            </div>
                            {apiStatus && (
                                <div
                                    className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded"
                                    data-oid="i7h5.s:"
                                >
                                    {apiStatus}
                                </div>
                            )}
                        </div>

                        {/* JSON预览 */}
                        <div className="mt-8" data-oid="l0vlcdg">
                            <h3 className="text-lg font-medium mb-4" data-oid="ywxleus">
                                配置JSON预览
                            </h3>
                            <pre
                                className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96 border"
                                data-oid="_v85fs."
                            >
                                {JSON.stringify(config, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
