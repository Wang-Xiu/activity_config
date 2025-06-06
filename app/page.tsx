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
=======
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
        <div className="space-y-6" data-oid=".j9s094">
            <h3 className="text-lg font-medium mb-4" data-oid="a9v-oku">
                发送消息配置
            </h3>

            <div data-oid="e:bwxkr">
                <label className="block text-sm font-medium mb-2" data-oid="_qkr0dh">
                    是否开启发送通知
                </label>
                <select
                    value={config.send_msg_config.send_msg}
                    onChange={(e) =>
                        updateConfig('send_msg_config.send_msg', parseInt(e.target.value))
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                    data-oid=":h-fdk."
                >
                    <option value={1} data-oid="ctjsx-5">
                        开启
                    </option>
                    <option value={0} data-oid="cwprh2-">
                        关闭
                    </option>
                </select>
            </div>

            <div className="space-y-4" data-oid="biwvbs_">
                <h4 className="font-medium" data-oid="py61htv">
                    通知消息内容
                </h4>

                <div data-oid="5e1o94f">
                    <label className="block text-sm font-medium mb-2" data-oid="aflft1q">
                        匹配完成消息
                    </label>
                    <textarea
                        value={config.send_msg_config.send_msg_info.match_done}
                        onChange={(e) =>
                            updateConfig('send_msg_config.send_msg_info.match_done', e.target.value)
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                        data-oid="d62::w."
                    />
                </div>

                <div data-oid="jocayki">
                    <label className="block text-sm font-medium mb-2" data-oid="ggtr-21">
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
                        data-oid="oba27.4"
                    />
                </div>

                <div data-oid="eem6xwl">
                    <label className="block text-sm font-medium mb-2" data-oid="k19_67d">
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
                        data-oid="erhi9ez"
                    />
                </div>

                <div data-oid="xzequp6">
                    <label className="block text-sm font-medium mb-2" data-oid="223ze5f">
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
                        data-oid="0o0fvtw"
                    />
                </div>

                <div data-oid="82mr9cl">
                    <label className="block text-sm font-medium mb-2" data-oid="nbd3cxe">
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
                        data-oid="purt8x4"
                    />
                </div>
            </div>
        </div>
    );

    const renderWarningConfig = () => (
        <div className="space-y-6" data-oid="q04hcye">
            <h3 className="text-lg font-medium mb-4" data-oid="djl1_:z">
                活动告警配置
            </h3>

            <div data-oid="klaec51">
                <label className="block text-sm font-medium mb-2" data-oid="mqkrkq2">
                    是否开启告警邮件发送
                </label>
                <select
                    value={config.send_warning_config.send_warning}
                    onChange={(e) =>
                        updateConfig('send_warning_config.send_warning', parseInt(e.target.value))
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                    data-oid="c6_7.5:"
                >
                    <option value={1} data-oid="3t54mks">
                        开启
                    </option>
                    <option value={0} data-oid="ce_s1kd">
                        关闭
                    </option>
                </select>
            </div>

            <div data-oid="psew31p">
                <label className="block text-sm font-medium mb-2" data-oid="g11ngle">
                    告警产生的活动名
                </label>
                <input
                    type="text"
                    value={config.send_warning_config.send_warning_act_name}
                    onChange={(e) =>
                        updateConfig('send_warning_config.send_warning_act_name', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="i0jac2:"
                />
            </div>

            <div data-oid="11vg8ez">
                <label className="block text-sm font-medium mb-2" data-oid="zt8pvld">
                    告警邮件发送间隔(秒)
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.send_warning_interval}
                    onChange={(e) =>
                        updateConfig('send_warning_config.send_warning_interval', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="r8fj4r3"
                />
            </div>

            <div data-oid="b6z:p_0">
                <label className="block text-sm font-medium mb-2" data-oid="k:vqefz">
                    接口访问次数风控告警-指定时间内(秒)
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.report_time}
                    onChange={(e) =>
                        updateConfig('send_warning_config.report_time', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="7k8qeh4"
                />
            </div>

            <div data-oid="zrxu6a3">
                <label className="block text-sm font-medium mb-2" data-oid="714m-61">
                    接口访问次数风控告警-访问次数阈值
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.report_num}
                    onChange={(e) => updateConfig('send_warning_config.report_num', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="y.1sjiw"
                />
            </div>

            <div data-oid="3y6-vdi">
                <label className="block text-sm font-medium mb-2" data-oid="bt1qd94">
                    告警消息模板
                </label>
                <textarea
                    value={config.send_warning_config.msg_1}
                    onChange={(e) => updateConfig('send_warning_config.msg_1', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                    data-oid="h:n6jfl"
                />
            </div>

            <div data-oid="_yhetau">
                <label className="block text-sm font-medium mb-2" data-oid="3c4-11r">
                    礼物数量阈值
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.give_gift_num}
                    onChange={(e) =>
                        updateConfig('send_warning_config.give_gift_num', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="ayv6cd3"
                />
            </div>
        </div>
    );

    const renderMissionPoolConfig = () => (
        <div className="space-y-8" data-oid="_10id-3">
            <h3 className="text-lg font-medium mb-4" data-oid="jqmrf9w">
                任务池配置
            </h3>

            {/* 新用户任务池 */}
            <div data-oid="rbaaju0">
                <h4 className="font-medium mb-4 text-blue-600" data-oid="m9cfbdo">
                    新用户任务池
                </h4>
                <div className="space-y-4" data-oid="x7bd8pw">
                    {Object.entries(config.act_config.mission_pool.new_user).map(([key, task]) => (
                        <div
                            key={key}
                            className="border border-gray-200 rounded p-4"
                            data-oid="c-5i80a"
                        >
                            <h5 className="font-medium mb-3" data-oid="jy1mzje">
                                {key}
                            </h5>
                            <div className="grid grid-cols-3 gap-4" data-oid="4qnad1:">
                                <div data-oid="1a2x4.4">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="rdork-b"
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
                                        data-oid="nas:m77"
                                    />
                                </div>
                                <div data-oid="mp-y513">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="vwivc80"
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
                                        data-oid="_t.a20z"
                                    />
                                </div>
                                <div data-oid="t_s43-y">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="huj_9_w"
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
                                        data-oid="og98x.s"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 老用户任务池 */}
            <div data-oid="1-7rr.3">
                <h4 className="font-medium mb-4 text-green-600" data-oid="8n6i337">
                    老用户任务池
                </h4>
                <div className="space-y-4" data-oid="4wl1r7s">
                    {Object.entries(config.act_config.mission_pool.old_user).map(([key, task]) => (
                        <div
                            key={key}
                            className="border border-gray-200 rounded p-4"
                            data-oid="d5o05co"
                        >
                            <h5 className="font-medium mb-3" data-oid="84bw7rq">
                                {key}
                            </h5>
                            <div className="grid grid-cols-3 gap-4" data-oid="bk6:.xv">
                                <div data-oid="8xxg58z">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="31_iuyh"
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
                                        data-oid="ks-tb1q"
                                    />
                                </div>
                                <div data-oid="yshy81s">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="mo93g.u"
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
                                        data-oid="0.jcr7u"
                                    />
                                </div>
                                <div data-oid="jzi5fc.">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="80wk96d"
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
                                        data-oid="2q-dqgh"
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
        <div className="space-y-6" data-oid="fkz0m7_">
            <h3 className="text-lg font-medium mb-4" data-oid="e8_m-ku">
                开宝箱配置
            </h3>

            {/* 免费时段配置 */}
            <div data-oid="27rw8sy">
                <h4 className="font-medium mb-3" data-oid="_j8.5ug">
                    免费时段配置
                </h4>
                <div className="grid grid-cols-2 gap-6" data-oid="q4420sz">
                    <div data-oid="_:ja3ms">
                        <label className="block text-sm font-medium mb-2" data-oid="bfl:h4l">
                            免费时段1
                        </label>
                        <div className="flex space-x-2" data-oid=":t_gfpf">
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
                                data-oid="s6c.ll0"
                            />

                            <span className="self-center" data-oid="31hts1n">
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
                                data-oid="hto779_"
                            />
                        </div>
                    </div>
                    <div data-oid="cmcwh3q">
                        <label className="block text-sm font-medium mb-2" data-oid="w1-4n_.">
                            免费时段2
                        </label>
                        <div className="flex space-x-2" data-oid="glr17gf">
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
                                data-oid="1v8g:ln"
                            />

                            <span className="self-center" data-oid="w0s:-r8">
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
                                data-oid="_fdjmqz"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 送礼得宝箱配置 */}
            <div data-oid="p0a-v-0">
                <h4 className="font-medium mb-3" data-oid="49tjm.2">
                    送礼得宝箱配置
                </h4>
                <div className="grid grid-cols-2 gap-4" data-oid="4dh_n18">
                    <div data-oid="laxire:">
                        <label className="block text-sm font-medium mb-2" data-oid="i-nd2et">
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
                            data-oid="qmzzmz:"
                        />
                    </div>
                    <div data-oid="wefvkaz">
                        <label className="block text-sm font-medium mb-2" data-oid="jg:v.ge">
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
                            data-oid="y68seul"
                        />
                    </div>
                    <div data-oid="3cbsfck">
                        <label className="block text-sm font-medium mb-2" data-oid="if1mlub">
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
                            data-oid="9s96hxu"
                        />
                    </div>
                    <div data-oid="rp0r7a.">
                        <label className="block text-sm font-medium mb-2" data-oid="0k1voul">
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
                            data-oid="-gkma4l"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderGiftHatConfig = () => (
        <div className="space-y-6" data-oid="35jkzvj">
            <h3 className="text-lg font-medium mb-4" data-oid="ky.m5js">
                收礼送尾巴配置
            </h3>

            <div className="grid grid-cols-3 gap-4" data-oid="ock2vlc">
                <div data-oid="_k454pa">
                    <label className="block text-sm font-medium mb-2" data-oid="u17q.nn">
                        收到礼物ID
                    </label>
                    <input
                        type="text"
                        value={config.act_config.get_gift_send_hat.get_gift_id}
                        onChange={(e) =>
                            updateConfig('act_config.get_gift_send_hat.get_gift_id', e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        data-oid="mz9r34s"
                    />
                </div>
                <div data-oid="pagzd.o">
                    <label className="block text-sm font-medium mb-2" data-oid="8kwrfm7">
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
                        data-oid="tkgmq7e"
                    />
                </div>
                <div data-oid="34a545n">
                    <label className="block text-sm font-medium mb-2" data-oid="-s7cpw1">
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
                        data-oid="p6zj74w"
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
            <div className="space-y-6" data-oid="ea64zns">
                <h3 className="text-lg font-medium mb-4" data-oid="-61d0p9">
                    生日配置
                </h3>

                {/* 价格配置 */}
                <div className="grid grid-cols-2 gap-4" data-oid="60m5s0m">
                    <div data-oid="h_950ah">
                        <label className="block text-sm font-medium mb-2" data-oid="dwlw1hz">
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
                            data-oid="zj:cya-"
                        />
                    </div>
                    <div data-oid="a0wbihc">
                        <label className="block text-sm font-medium mb-2" data-oid="3bjspy-">
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
                            data-oid="2tgypz2"
                        />
                    </div>
                </div>

                {/* 任务列表配置 */}
                <div data-oid="13615cz">
                    <h4 className="font-medium mb-3" data-oid="pul1u.c">
                        任务列表配置
                    </h4>
                    <div className="space-y-4" data-oid="9ltbin5">
                        {Object.entries(config.act_config.happy_birthday_config.mission_list).map(
                            ([key, mission]) => (
                                <div
                                    key={key}
                                    className="border border-gray-200 rounded p-4"
                                    data-oid="tjxr7zx"
                                >
                                    <h5 className="font-medium mb-3" data-oid="t3r5dr9">
                                        {key}
                                    </h5>
                                    <div className="grid grid-cols-4 gap-4" data-oid="_7x4qtj">
                                        <div data-oid="f8_mse6">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid="sqw0m.0"
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
                                                data-oid="6k-cc0x"
                                            />
                                        </div>
                                        <div data-oid=":d58ttg">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid="d381un_"
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
                                                data-oid="c54shqr"
                                            />
                                        </div>
                                        <div data-oid="37p0ksl">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid=".vl2db-"
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
                                                data-oid="h80fu7n"
                                            />
                                        </div>
                                        <div data-oid="ddt2s.e">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid="jwswk:d"
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
                                                data-oid="-0xi8_n"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>

                {/* 生日消息列表 */}
                <div data-oid="iy7719.">
                    <h4 className="font-medium mb-3" data-oid="x4b6dc9">
                        生日祝福消息列表
                    </h4>
                    <div className="space-y-2" data-oid="4615bt-">
                        {config.act_config.happy_birthday_config.msg_list.map((msg, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2"
                                data-oid="j:1t_mm"
                            >
                                <span className="text-sm text-gray-500 w-8" data-oid="t9jyqaz">
                                    #{index + 1}
                                </span>
                                <input
                                    type="text"
                                    value={msg}
                                    onChange={(e) => updateBirthdayMessage(index, e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 flex-1"
                                    placeholder="输入生日祝福消息"
                                    data-oid="76im1dr"
                                />

                                <button
                                    onClick={() => removeBirthdayMessage(index)}
                                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                    data-oid="5s2ow_4"
                                >
                                    删除
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addBirthdayMessage}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            data-oid="r5nc:lm"
                        >
                            添加消息
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderWashHandsConfig = () => (
        <div className="space-y-6" data-oid="3ws5:kt">
            <h3 className="text-lg font-medium mb-4" data-oid="3q23t_l">
                洗手池晨辉配置
            </h3>

            <div data-oid="jj5iv.v">
                <label className="block text-sm font-medium mb-2" data-oid="i2l4--m">
                    每日次数
                </label>
                <input
                    type="text"
                    value={config.act_config.wash_hands_config.day_chance}
                    onChange={(e) =>
                        updateConfig('act_config.wash_hands_config.day_chance', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="qg842wn"
                />
            </div>

            <div data-oid="jw-j-5s">
                <h4 className="font-medium mb-3" data-oid="5vsr72y">
                    奖励池配置
                </h4>
                <div className="space-y-3" data-oid="v8i48gc">
                    {Object.entries(config.act_config.wash_hands_config.pool).map(([key, pool]) => (
                        <div
                            key={key}
                            className="flex space-x-4 items-center border border-gray-200 rounded p-3"
                            data-oid="kmh4h0i"
                        >
                            <span className="w-12 text-sm font-medium" data-oid="gqa-wsk">
                                池子{key}
                            </span>
                            <div data-oid="w7bid5f">
                                <label
                                    className="block text-xs text-gray-500 mb-1"
                                    data-oid="1::ds.u"
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
                                    data-oid="58810l2"
                                />
                            </div>
                            <div data-oid="xea-qgh">
                                <label
                                    className="block text-xs text-gray-500 mb-1"
                                    data-oid="9xxxbii"
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
                                    data-oid="9xddco."
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPropImgConfig = () => (
        <div className="space-y-6" data-oid="z83_sbw">
            <h3 className="text-lg font-medium mb-4" data-oid="b51o7kr">
                晨辉图片配置
            </h3>

            <div data-oid="z0knb3u">
                <label className="block text-sm font-medium mb-2" data-oid="3pgjs_j">
                    晨辉图片文件名
                </label>
                <input
                    type="text"
                    value={config.act_config.prop_img}
                    onChange={(e) => updateConfig('act_config.prop_img', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    placeholder="例如: fjlw_xyq_0111.png"
                    data-oid="4w_i063"
                />
            </div>
        </div>
    );

    const renderStoneConfig = () => (
        <div className="space-y-6" data-oid="xlus4i1">
            <h3 className="text-lg font-medium mb-4" data-oid="m_geoes">
                12个月石头配置
            </h3>
            <div className="grid grid-cols-1 gap-4" data-oid="6ik.b52">
                {Object.entries(config.act_config.all_stone).map(([month, stone]) => (
                    <div
                        key={month}
                        className="border border-gray-200 rounded p-4"
                        data-oid="v0l5mlq"
                    >
                        <h4 className="font-medium mb-2" data-oid="qz9fgys">
                            {month}月 - {stone.name}
                        </h4>
                        <div data-oid=".44x-sd">
                            <label className="block text-sm font-medium mb-2" data-oid="eu_c_p.">
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
                                data-oid="pjfbmuw"
                            />
                        </div>
                        <div data-oid="al-xe40">
                            <label className="block text-sm font-medium mb-2" data-oid="c24wmzn">
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
                                data-oid="6n_deg1"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex" data-oid="ck__995">
            {/* 侧边栏 */}
            <div className="w-64 bg-gray-800 text-white" data-oid="nvub4jl">
                <div className="p-4" data-oid="jqm:fep">
                    <div className="flex items-center mb-8" data-oid="a-h4x6s">
                        <div className="w-4 h-4 bg-gray-600 rounded mr-2" data-oid="tr7oj-u"></div>
                        <span className="text-sm" data-oid="j47-b:q">
                            宝石活动配置管理
                        </span>
                    </div>

                    <nav className="space-y-2" data-oid=".q8aq1a">
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'send_msg' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('send_msg')}
                            data-oid="e7b2m9k"
                        >
                            <div
                                className="w-4 h-4 bg-blue-500 rounded-sm mr-2"
                                data-oid="m.pcbt9"
                            ></div>
                            <span className="text-sm" data-oid="96l8zu2">
                                发送消息配置
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'warning' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('warning')}
                            data-oid="13wunj2"
                        >
                            <div
                                className="w-4 h-4 bg-red-500 rounded-sm mr-2"
                                data-oid="lrfq6kw"
                            ></div>
                            <span className="text-sm" data-oid="0f4q48y">
                                活动告警配置
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'mission_pool' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('mission_pool')}
                            data-oid="mission-tab"
                        >
                            <div
                                className="w-4 h-4 bg-green-500 rounded-sm mr-2"
                                data-oid="mission-icon"
                            ></div>
                            <span className="text-sm" data-oid="mission-text">
                                任务池配置
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'open_box' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('open_box')}
                            data-oid="openbox-tab"
                        >
                            <div
                                className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"
                                data-oid="openbox-icon"
                            ></div>
                            <span className="text-sm" data-oid="openbox-text">
                                开宝箱配置
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'gift_hat' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('gift_hat')}
                            data-oid="gifthat-tab"
                        >
                            <div
                                className="w-4 h-4 bg-pink-500 rounded-sm mr-2"
                                data-oid="gifthat-icon"
                            ></div>
                            <span className="text-sm" data-oid="gifthat-text">
                                收礼送尾巴
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'birthday' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('birthday')}
                            data-oid="birthday-tab"
                        >
                            <div
                                className="w-4 h-4 bg-orange-500 rounded-sm mr-2"
                                data-oid="birthday-icon"
                            ></div>
                            <span className="text-sm" data-oid="birthday-text">
                                生日配置
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'stones' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('stones')}
                            data-oid="stones-tab"
                        >
                            <div
                                className="w-4 h-4 bg-purple-500 rounded-sm mr-2"
                                data-oid="stones-icon"
                            ></div>
                            <span className="text-sm" data-oid="stones-text">
                                石头配置
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'wash_hands' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('wash_hands')}
                            data-oid="washhands-tab"
                        >
                            <div
                                className="w-4 h-4 bg-cyan-500 rounded-sm mr-2"
                                data-oid="washhands-icon"
                            ></div>
                            <span className="text-sm" data-oid="washhands-text">
                                洗手池配置
                            </span>
                        </div>
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'prop_img' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('prop_img')}
                            data-oid="propimg-tab"
                        >
                            <div
                                className="w-4 h-4 bg-indigo-500 rounded-sm mr-2"
                                data-oid="propimg-icon"
                            ></div>
                            <span className="text-sm" data-oid="propimg-text">
                                晨辉图片
                            </span>
                        </div>
                    </nav>
                </div>
            </div>

            {/* 主内容区 */}
            <div className="flex-1 p-6" data-oid=":ei-9t4">
                <div className="bg-white rounded-lg shadow-sm" data-oid="-ub5gff">
                    {/* 头部 */}
                    <div className="border-b border-gray-200 p-6" data-oid="gaa-6:1">
                        <h1 className="text-2xl font-medium text-gray-800 mb-2" data-oid="fnq6hob">
                            宝石活动配置管理
                        </h1>
                        <div className="text-sm text-gray-500" data-oid="dx_xphm">
                            操作员：Wang-Xiu 当前时间：{new Date().toLocaleString('zh-CN')}
                        </div>
                    </div>

                    <div className="p-6" data-oid="s10iugi">
                        {/* 配置内容 */}
                        <div className="bg-gray-50 rounded-lg p-6" data-oid="config-content">
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
                            data-oid="::20-4d"
                        >
                            <div className="flex space-x-4" data-oid="l45p-ko">
                                <button
                                    onClick={fetchData}
                                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                                    data-oid="de3t39j"
                                >
                                    获取配置
                                </button>
                                <button
                                    onClick={submitData}
                                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                                    data-oid="uz7:yvk"
                                >
                                    保存配置
                                </button>
                                <button
                                    onClick={() => setConfig(defaultConfig)}
                                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                                    data-oid="reset-btn"
                                >
                                    重置配置
                                </button>
                            </div>
                            {apiStatus && (
                                <div
                                    className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded"
                                    data-oid="bsu:t2q"
                                >
                                    {apiStatus}
                                </div>
                            )}
                        </div>

                        {/* JSON预览 */}
                        <div className="mt-8" data-oid=".4ep7us">
                            <h3 className="text-lg font-medium mb-4" data-oid="mq1ji_z">
                                配置JSON预览
                            </h3>
                            <pre
                                className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96 border"
                                data-oid="rw-5qb9"
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
