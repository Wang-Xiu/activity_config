'use client';

import { useState, useEffect } from 'react';
import { defaultConfig } from '../config/defaultConfig';
import { MainConfig } from '../types/config';
import { MonitorData } from '../types/monitor';
import { buildApiUrl } from '../config/environment';

export default function Page() {
    const [config, setConfig] = useState<MainConfig>(defaultConfig);
    const [activeTab, setActiveTab] = useState('config');
    const [activeConfigTab, setActiveConfigTab] = useState('send_msg');
    const [apiStatus, setApiStatus] = useState('');
    const [monitorData, setMonitorData] = useState<MonitorData | null>(null);
    const [monitorDateType, setMonitorDateType] = useState<'daily' | 'total'>('daily');
    const [monitorDate, setMonitorDate] = useState(new Date().toISOString().split('T')[0]);

    // 页面初始化时获取数据
    useEffect(() => {
        fetchData();
    }, []);

    // 从API获取配置数据 - 调用真实的后端接口
    const fetchData = async () => {
        setApiStatus('正在获取数据...');
        try {
            // 直接调用后端API
            // const apiUrl = buildApiUrl('getConfig');
            // console.log('正在调用API:', apiUrl);

            const response = await fetch('/api/config/get', {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
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
            // 直接调用后端API
            const apiUrl = buildApiUrl('saveConfig');
            console.log('正在调用保存API:', apiUrl);

            // 构建表单数据，按照后端要求传递config参数
            const formData = new FormData();
            formData.append('config', JSON.stringify(config));

            const response = await fetch(apiUrl, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: formData,
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

    // 获取监控数据
    const fetchMonitorData = async () => {
        setApiStatus('正在获取监控数据...');
        try {
            const response = await fetch(
                `/api/monitor?dateType=${monitorDateType}&date=${monitorDate}`,
                {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setMonitorData(result.data);
            setApiStatus('监控数据获取成功');
            console.log('监控数据获取成功:', result);

            setTimeout(() => setApiStatus(''), 2000);
        } catch (error) {
            console.error('获取监控数据失败:', error);
            setApiStatus('获取监控数据失败: ' + (error as Error).message);
            setTimeout(() => setApiStatus(''), 3000);
        }
    };

    // 当监控相关参数变化时重新获取数据
    useEffect(() => {
        if (activeTab === 'monitor') {
            fetchMonitorData();
        }
    }, [activeTab, monitorDateType, monitorDate]);

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
        <div className="space-y-6" data-oid="n:suy0h">
            <h3 className="text-lg font-medium mb-4" data-oid="6mzt44g">
                发送消息配置
            </h3>

            <div data-oid="wqu6_zg">
                <label className="block text-sm font-medium mb-2" data-oid="bw883b4">
                    是否开启发送通知
                </label>
                <select
                    value={config.send_msg_config.send_msg}
                    onChange={(e) =>
                        updateConfig('send_msg_config.send_msg', parseInt(e.target.value))
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                    data-oid="d5329ih"
                >
                    <option value={1} data-oid="1za5ymp">
                        开启
                    </option>
                    <option value={0} data-oid="mh4v5f5">
                        关闭
                    </option>
                </select>
            </div>

            <div className="space-y-4" data-oid="6:03a3z">
                <h4 className="font-medium" data-oid="85j5trq">
                    通知消息内容
                </h4>

                <div data-oid="zjcfpfo">
                    <label className="block text-sm font-medium mb-2" data-oid="83vhv4d">
                        匹配完成消息
                    </label>
                    <textarea
                        value={config.send_msg_config.send_msg_info.match_done}
                        onChange={(e) =>
                            updateConfig('send_msg_config.send_msg_info.match_done', e.target.value)
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                        data-oid=":1tp6p6"
                    />
                </div>

                <div data-oid="xabcawq">
                    <label className="block text-sm font-medium mb-2" data-oid="q2co2mm">
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
                        data-oid="v-zqog2"
                    />
                </div>

                <div data-oid="w0rq1bv">
                    <label className="block text-sm font-medium mb-2" data-oid="n:lvt2t">
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
                        data-oid="9ezy:.q"
                    />
                </div>

                <div data-oid="e77w5bi">
                    <label className="block text-sm font-medium mb-2" data-oid="vob_w-p">
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
                        data-oid="w4_aoka"
                    />
                </div>

                <div data-oid="oi94own">
                    <label className="block text-sm font-medium mb-2" data-oid=":da_wz7">
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
                        data-oid="j_w.6_g"
                    />
                </div>
            </div>
        </div>
    );

    const renderWarningConfig = () => (
        <div className="space-y-6" data-oid="5z93asf">
            <h3 className="text-lg font-medium mb-4" data-oid=":_m8:5j">
                活动告警配置
            </h3>

            <div data-oid="dkiux6h">
                <label className="block text-sm font-medium mb-2" data-oid="v2sxxrw">
                    是否开启告警邮件发送
                </label>
                <select
                    value={config.send_warning_config.send_warning}
                    onChange={(e) =>
                        updateConfig('send_warning_config.send_warning', parseInt(e.target.value))
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                    data-oid="h:d.eg6"
                >
                    <option value={1} data-oid="grquw_j">
                        开启
                    </option>
                    <option value={0} data-oid="4th19r8">
                        关闭
                    </option>
                </select>
            </div>

            <div data-oid="yutx2tt">
                <label className="block text-sm font-medium mb-2" data-oid=":-bmw4s">
                    告警产生的活动名
                </label>
                <input
                    type="text"
                    value={config.send_warning_config.send_warning_act_name}
                    onChange={(e) =>
                        updateConfig('send_warning_config.send_warning_act_name', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="t.5yvqb"
                />
            </div>

            <div data-oid="qyp5zs5">
                <label className="block text-sm font-medium mb-2" data-oid="ow_gqjw">
                    告警邮件发送间隔(秒)
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.send_warning_interval}
                    onChange={(e) =>
                        updateConfig('send_warning_config.send_warning_interval', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="u_-4slh"
                />
            </div>

            <div data-oid="cyb38nm">
                <label className="block text-sm font-medium mb-2" data-oid="x55-xae">
                    接口访问次数风控告警-指定时间内(秒)
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.report_time}
                    onChange={(e) =>
                        updateConfig('send_warning_config.report_time', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="puypni2"
                />
            </div>

            <div data-oid="h8ca8eq">
                <label className="block text-sm font-medium mb-2" data-oid="qi6os:2">
                    接口访问次数风控告警-访问次数阈值
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.report_num}
                    onChange={(e) => updateConfig('send_warning_config.report_num', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid=".z1v04."
                />
            </div>

            <div data-oid="xodyczy">
                <label className="block text-sm font-medium mb-2" data-oid="1d.d-9e">
                    告警消息模板
                </label>
                <textarea
                    value={config.send_warning_config.msg_1}
                    onChange={(e) => updateConfig('send_warning_config.msg_1', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                    data-oid="s9cwy2a"
                />
            </div>

            <div data-oid="9kg3ypd">
                <label className="block text-sm font-medium mb-2" data-oid="q0cq6n_">
                    礼物数量阈值
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.give_gift_num}
                    onChange={(e) =>
                        updateConfig('send_warning_config.give_gift_num', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="v3glsjg"
                />
            </div>
        </div>
    );

    const renderMissionPoolConfig = () => (
        <div className="space-y-8" data-oid="lauqck2">
            <h3 className="text-lg font-medium mb-4" data-oid="vszvm:.">
                任务池配置
            </h3>

            {/* 新用户任务池 */}
            <div data-oid="cl3ymln">
                <h4 className="font-medium mb-4 text-blue-600" data-oid="6qs2-sy">
                    新用户任务池
                </h4>
                <div className="space-y-4" data-oid="bopvltr">
                    {Object.entries(config.act_config.mission_pool.new_user).map(([key, task]) => (
                        <div
                            key={key}
                            className="border border-gray-200 rounded p-4"
                            data-oid="ek.he_w"
                        >
                            <h5 className="font-medium mb-3" data-oid="asw2n4d">
                                {key}
                            </h5>
                            <div className="grid grid-cols-3 gap-4" data-oid="7r58trh">
                                <div data-oid=":3ovaij">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="burwwa8"
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
                                        data-oid="04y7:38"
                                    />
                                </div>
                                <div data-oid="oh_.ob7">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="u256rqr"
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
                                        data-oid=".tc.xia"
                                    />
                                </div>
                                <div data-oid="0idfq1_">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="l6hbv13"
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
                                        data-oid="nfmrfy1"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 老用户任务池 */}
            <div data-oid="2jnb9js">
                <h4 className="font-medium mb-4 text-green-600" data-oid="w6hvs1z">
                    老用户任务池
                </h4>
                <div className="space-y-4" data-oid="eb2w31z">
                    {Object.entries(config.act_config.mission_pool.old_user).map(([key, task]) => (
                        <div
                            key={key}
                            className="border border-gray-200 rounded p-4"
                            data-oid="pzx_27m"
                        >
                            <h5 className="font-medium mb-3" data-oid="dfsh7dp">
                                {key}
                            </h5>
                            <div className="grid grid-cols-3 gap-4" data-oid="q8s3up1">
                                <div data-oid="51y42se">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="cf:ml-r"
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
                                        data-oid="_5r0qfj"
                                    />
                                </div>
                                <div data-oid="q_7mo-7">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="zhcx.-n"
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
                                        data-oid="rsx93lw"
                                    />
                                </div>
                                <div data-oid="oow.l1g">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="pfr2ler"
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
                                        data-oid="c1z39ce"
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
        <div className="space-y-6" data-oid="3os4jfc">
            <h3 className="text-lg font-medium mb-4" data-oid="4mf3jla">
                开宝箱配置
            </h3>

            {/* 免费时段配置 */}
            <div data-oid="js:slgq">
                <h4 className="font-medium mb-3" data-oid="m1_43_k">
                    免费时段配置
                </h4>
                <div className="grid grid-cols-2 gap-6" data-oid="8ct0isc">
                    <div data-oid="bmzdo6u">
                        <label className="block text-sm font-medium mb-2" data-oid="7.3hy6z">
                            免费时段1
                        </label>
                        <div className="flex space-x-2" data-oid="m735jxb">
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
                                data-oid="e.lf8xw"
                            />

                            <span className="self-center" data-oid="ewfrmlh">
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
                                data-oid="g144p3z"
                            />
                        </div>
                    </div>
                    <div data-oid="nw7u4y6">
                        <label className="block text-sm font-medium mb-2" data-oid="fkz-q9a">
                            免费时段2
                        </label>
                        <div className="flex space-x-2" data-oid="0c7:_ay">
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
                                data-oid="vwc417f"
                            />

                            <span className="self-center" data-oid="ue_i8ur">
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
                                data-oid="uurtjvl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 送礼得宝箱配置 */}
            <div data-oid=":wluzi7">
                <h4 className="font-medium mb-3" data-oid="t:j-jnh">
                    送礼得宝箱配置
                </h4>
                <div className="grid grid-cols-2 gap-4" data-oid="fyrfnj:">
                    <div data-oid="rgls0hh">
                        <label className="block text-sm font-medium mb-2" data-oid="1swp2hh">
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
                            data-oid="wa.y0vt"
                        />
                    </div>
                    <div data-oid="i1uwrrd">
                        <label className="block text-sm font-medium mb-2" data-oid="4y_u4vg">
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
                            data-oid="xacp01s"
                        />
                    </div>
                    <div data-oid="ptbf9fz">
                        <label className="block text-sm font-medium mb-2" data-oid="2--f0tz">
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
                            data-oid="y6ezvh8"
                        />
                    </div>
                    <div data-oid="_s0hq2l">
                        <label className="block text-sm font-medium mb-2" data-oid="n01p:lx">
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
                            data-oid="bypy11q"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderGiftHatConfig = () => (
        <div className="space-y-6" data-oid="-0scbol">
            <h3 className="text-lg font-medium mb-4" data-oid="5q49t4v">
                收礼送尾巴配置
            </h3>

            <div className="grid grid-cols-3 gap-4" data-oid="nel7jol">
                <div data-oid="j6byzlc">
                    <label className="block text-sm font-medium mb-2" data-oid="ffslmdh">
                        收到礼物ID
                    </label>
                    <input
                        type="text"
                        value={config.act_config.get_gift_send_hat.get_gift_id}
                        onChange={(e) =>
                            updateConfig('act_config.get_gift_send_hat.get_gift_id', e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        data-oid="-w9hjcl"
                    />
                </div>
                <div data-oid="5xebvyg">
                    <label className="block text-sm font-medium mb-2" data-oid="5cj:7om">
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
                        data-oid="nd_0wp3"
                    />
                </div>
                <div data-oid="ipnqh5o">
                    <label className="block text-sm font-medium mb-2" data-oid="fu7vrud">
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
                        data-oid="06oinj2"
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
            <div className="space-y-6" data-oid="lkffavt">
                <h3 className="text-lg font-medium mb-4" data-oid="bm2r5-f">
                    生日配置
                </h3>

                {/* 价格配置 */}
                <div className="grid grid-cols-2 gap-4" data-oid="drx0g96">
                    <div data-oid="jc3pn12">
                        <label className="block text-sm font-medium mb-2" data-oid="b:u-hs1">
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
                            data-oid="trc-9jr"
                        />
                    </div>
                    <div data-oid="bv-w.q5">
                        <label className="block text-sm font-medium mb-2" data-oid="zb9uku1">
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
                            data-oid="kyauuru"
                        />
                    </div>
                </div>

                {/* 任务列表配置 */}
                <div data-oid="9k.8.77">
                    <h4 className="font-medium mb-3" data-oid="36z:og0">
                        任务列表配置
                    </h4>
                    <div className="space-y-4" data-oid="e1jz2p:">
                        {Object.entries(config.act_config.happy_birthday_config.mission_list).map(
                            ([key, mission]) => (
                                <div
                                    key={key}
                                    className="border border-gray-200 rounded p-4"
                                    data-oid="x.681ne"
                                >
                                    <h5 className="font-medium mb-3" data-oid="lnlhlnn">
                                        {key}
                                    </h5>
                                    <div className="grid grid-cols-4 gap-4" data-oid="w-lrmtz">
                                        <div data-oid="cy8-je8">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid="bq17fie"
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
                                                data-oid="ipdm:m."
                                            />
                                        </div>
                                        <div data-oid="275:_9r">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid="aoppjts"
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
                                                data-oid="3kojzua"
                                            />
                                        </div>
                                        <div data-oid="c4fej7z">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid="a5zaf6r"
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
                                                data-oid="5317ink"
                                            />
                                        </div>
                                        <div data-oid="yvd37ro">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid="51sv69a"
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
                                                data-oid="a99xwjo"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>

                {/* 生日消息列表 */}
                <div data-oid="a74x86r">
                    <h4 className="font-medium mb-3" data-oid="xa-5gi1">
                        生日祝福消息列表
                    </h4>
                    <div className="space-y-2" data-oid="_6rx:7k">
                        {config.act_config.happy_birthday_config.msg_list.map((msg, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2"
                                data-oid="6fgj8g8"
                            >
                                <span className="text-sm text-gray-500 w-8" data-oid="3s5antq">
                                    #{index + 1}
                                </span>
                                <input
                                    type="text"
                                    value={msg}
                                    onChange={(e) => updateBirthdayMessage(index, e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 flex-1"
                                    placeholder="输入生日祝福消息"
                                    data-oid="hwkh66p"
                                />

                                <button
                                    onClick={() => removeBirthdayMessage(index)}
                                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                    data-oid="o84r2cm"
                                >
                                    删除
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addBirthdayMessage}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            data-oid=":shuk:q"
                        >
                            添加消息
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderWashHandsConfig = () => (
        <div className="space-y-6" data-oid="..xj:_7">
            <h3 className="text-lg font-medium mb-4" data-oid="7y3bunp">
                洗手池晨辉配置
            </h3>

            <div data-oid="ay5rg64">
                <label className="block text-sm font-medium mb-2" data-oid="ru4xuti">
                    每日次数
                </label>
                <input
                    type="text"
                    value={config.act_config.wash_hands_config.day_chance}
                    onChange={(e) =>
                        updateConfig('act_config.wash_hands_config.day_chance', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="qp6q1l4"
                />
            </div>

            <div data-oid="mt1sckl">
                <h4 className="font-medium mb-3" data-oid="txbzq.z">
                    奖励池配置
                </h4>
                <div className="space-y-3" data-oid="in_p96v">
                    {Object.entries(config.act_config.wash_hands_config.pool).map(([key, pool]) => (
                        <div
                            key={key}
                            className="flex space-x-4 items-center border border-gray-200 rounded p-3"
                            data-oid="3bu3hid"
                        >
                            <span className="w-12 text-sm font-medium" data-oid="vxslj3p">
                                池子{key}
                            </span>
                            <div data-oid="j:-z3r8">
                                <label
                                    className="block text-xs text-gray-500 mb-1"
                                    data-oid="9q_d6x1"
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
                                    data-oid="2ckn9gh"
                                />
                            </div>
                            <div data-oid="x.1sset">
                                <label
                                    className="block text-xs text-gray-500 mb-1"
                                    data-oid="_o08fle"
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
                                    data-oid="k-7klrx"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPropImgConfig = () => (
        <div className="space-y-6" data-oid="ntzq_ep">
            <h3 className="text-lg font-medium mb-4" data-oid="mqd4pz-">
                晨辉图片配置
            </h3>

            <div data-oid="8te_v2u">
                <label className="block text-sm font-medium mb-2" data-oid="7n17_6s">
                    晨辉图片文件名
                </label>
                <input
                    type="text"
                    value={config.act_config.prop_img}
                    onChange={(e) => updateConfig('act_config.prop_img', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    placeholder="例如: fjlw_xyq_0111.png"
                    data-oid="99lwj8j"
                />
            </div>
        </div>
    );

    const renderStoneConfig = () => (
        <div className="space-y-6" data-oid="ouzt8p7">
            <h3 className="text-lg font-medium mb-4" data-oid="9r47mg0">
                12个月石头配置
            </h3>
            <div className="grid grid-cols-1 gap-4" data-oid="nayr9bw">
                {Object.entries(config.act_config.all_stone).map(([month, stone]) => (
                    <div
                        key={month}
                        className="border border-gray-200 rounded p-4"
                        data-oid="9ai2rrq"
                    >
                        <h4 className="font-medium mb-2" data-oid="ttl:h.2">
                            {month}月 - {stone.name}
                        </h4>
                        <div data-oid="lq8vr32">
                            <label className="block text-sm font-medium mb-2" data-oid="4u3xgj_">
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
                                data-oid="wv9kofo"
                            />
                        </div>
                        <div data-oid="hy4kk.x">
                            <label className="block text-sm font-medium mb-2" data-oid="q9xt.3z">
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
                                data-oid="dadkkos"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderMonitorPage = () => {
        if (!monitorData) {
            return (
                <div className="flex items-center justify-center h-64" data-oid="mjipdtm">
                    <div className="text-gray-500" data-oid="whgrjn.">
                        正在加载监控数据...
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-8" data-oid=":j68r8c">
                <div className="flex items-center justify-between mb-6" data-oid="znl5xew">
                    <h3 className="text-lg font-medium" data-oid="jtnr_1u">
                        数据监控
                    </h3>
                    <div className="flex items-center space-x-4" data-oid="ot67oai">
                        <div className="flex items-center space-x-2" data-oid="p0joqhi">
                            <label className="text-sm font-medium" data-oid="g:w0r2i">
                                数据类型:
                            </label>
                            <select
                                value={monitorDateType}
                                onChange={(e) =>
                                    setMonitorDateType(e.target.value as 'daily' | 'total')
                                }
                                className="border border-gray-300 rounded px-3 py-1 text-sm"
                                data-oid="w13eeve"
                            >
                                <option value="daily" data-oid="h1oe8c0">
                                    每日数据
                                </option>
                                <option value="total" data-oid="ftpylyj">
                                    总数据
                                </option>
                            </select>
                        </div>
                        {monitorDateType === 'daily' && (
                            <div className="flex items-center space-x-2" data-oid="cyd:l7_">
                                <label className="text-sm font-medium" data-oid="e78ychq">
                                    日期:
                                </label>
                                <input
                                    type="date"
                                    value={monitorDate}
                                    onChange={(e) => setMonitorDate(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                                    data-oid="4v6nn.s"
                                />
                            </div>
                        )}
                        <button
                            onClick={fetchMonitorData}
                            className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
                            data-oid="9:w8i8f"
                        >
                            刷新数据
                        </button>
                    </div>
                </div>

                {/* 宝箱数据概览 */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    data-oid="-btibr-"
                >
                    <div className="bg-blue-50 p-4 rounded-lg border" data-oid="f3k_osf">
                        <h4 className="font-medium text-blue-800 mb-2" data-oid="dsryy9z">
                            光华宝箱
                        </h4>
                        <div className="space-y-1 text-sm" data-oid="y60zhbf">
                            <div data-oid="9b7c7d8">
                                产出:{' '}
                                <span className="font-medium" data-oid="obap.ja">
                                    {monitorData.guanghua_box.output.toLocaleString()}
                                </span>
                            </div>
                            <div data-oid="g7betxw">
                                人数:{' '}
                                <span className="font-medium" data-oid="g0him3w">
                                    {monitorData.guanghua_box.users.toLocaleString()}
                                </span>
                            </div>
                            <div data-oid="2ezms45">
                                次数:{' '}
                                <span className="font-medium" data-oid="evqdi5g">
                                    {monitorData.guanghua_box.times.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border" data-oid="yy5a69m">
                        <h4 className="font-medium text-purple-800 mb-2" data-oid="nz25id-">
                            月华宝箱
                        </h4>
                        <div className="space-y-1 text-sm" data-oid="8.kmagj">
                            <div data-oid="62iodiu">
                                产出:{' '}
                                <span className="font-medium" data-oid="nt5fmjh">
                                    {monitorData.yuehua_box.output.toLocaleString()}
                                </span>
                            </div>
                            <div data-oid="pr5iw7g">
                                人数:{' '}
                                <span className="font-medium" data-oid=".p71s0m">
                                    {monitorData.yuehua_box.users.toLocaleString()}
                                </span>
                            </div>
                            <div data-oid="kkq6czs">
                                次数:{' '}
                                <span className="font-medium" data-oid="z.ow_q2">
                                    {monitorData.yuehua_box.times.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border" data-oid="vfjpt.w">
                        <h4 className="font-medium text-green-800 mb-2" data-oid="5sdl.k6">
                            活动总产出
                        </h4>
                        <div className="space-y-1 text-sm" data-oid="0co1pj8">
                            <div data-oid="bo0f..h">
                                产出:{' '}
                                <span className="font-medium" data-oid="fnep.45">
                                    {monitorData.total_output.output.toLocaleString()}
                                </span>
                            </div>
                            <div data-oid="cdmck_5">
                                人数:{' '}
                                <span className="font-medium" data-oid="c1l7.w-">
                                    {monitorData.total_output.users.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border" data-oid="b3zlvin">
                        <h4 className="font-medium text-orange-800 mb-2" data-oid="ilgfdv8">
                            特殊数据
                        </h4>
                        <div className="space-y-1 text-sm" data-oid="yhau08s">
                            <div data-oid="j4z40tv">
                                点亮宝石:{' '}
                                <span className="font-medium" data-oid="hpczsx1">
                                    {monitorData.light_gem_users.toLocaleString()}
                                </span>
                            </div>
                            <div data-oid="1alsosc">
                                特别报名:{' '}
                                <span className="font-medium" data-oid=":wysgdv">
                                    {monitorData.special_signup.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 任务完成情况表格 */}
                <div className="bg-white rounded-lg border" data-oid="j8jfeu4">
                    <div className="p-4 border-b" data-oid="j49.8vn">
                        <h4 className="font-medium" data-oid="aodn2y-">
                            任务完成情况
                        </h4>
                    </div>
                    <div className="overflow-x-auto" data-oid="wo-e648">
                        <table className="w-full" data-oid="ineful8">
                            <thead className="bg-gray-50" data-oid="9.vc-n3">
                                <tr data-oid="ox5ay:9">
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="jt0iqh3"
                                    >
                                        任务名称
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="riedrnp"
                                    >
                                        完成人数
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid=".4nhp9p"
                                    >
                                        完成次数
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200" data-oid="kksm8w5">
                                {Object.entries(monitorData.mission_completion).map(
                                    ([key, data]) => (
                                        <tr key={key} data-oid="vsojkvk">
                                            <td className="px-4 py-2 text-sm" data-oid="afdukc_">
                                                {key}
                                            </td>
                                            <td
                                                className="px-4 py-2 text-sm font-medium"
                                                data-oid="h72f8:z"
                                            >
                                                {data.users.toLocaleString()}
                                            </td>
                                            <td
                                                className="px-4 py-2 text-sm font-medium"
                                                data-oid="0ok0wk5"
                                            >
                                                {data.times.toLocaleString()}
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 入口PV/UV数据表格 */}
                <div className="bg-white rounded-lg border" data-oid="6vsqsd4">
                    <div className="p-4 border-b" data-oid="cx9ge7c">
                        <h4 className="font-medium" data-oid="b7j6fuq">
                            入口PV/UV数据
                        </h4>
                    </div>
                    <div className="overflow-x-auto" data-oid="_71ser1">
                        <table className="w-full" data-oid="aq96po.">
                            <thead className="bg-gray-50" data-oid="ew:qth6">
                                <tr data-oid="ay:5h7y">
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="t0.mjjm"
                                    >
                                        入口名称
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="7b8xtfb"
                                    >
                                        PV
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="bpl_-69"
                                    >
                                        UV
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200" data-oid="32d2ndq">
                                {Object.entries(monitorData.entrance_data).map(([key, data]) => (
                                    <tr key={key} data-oid="wr:zms0">
                                        <td className="px-4 py-2 text-sm" data-oid="uq4w268">
                                            {key}
                                        </td>
                                        <td
                                            className="px-4 py-2 text-sm font-medium"
                                            data-oid="ray8a.6"
                                        >
                                            {data.pv.toLocaleString()}
                                        </td>
                                        <td
                                            className="px-4 py-2 text-sm font-medium"
                                            data-oid="h0cla_t"
                                        >
                                            {data.uv.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 用户道具数据表格 */}
                <div className="bg-white rounded-lg border" data-oid="fr7l3-2">
                    <div className="p-4 border-b" data-oid="hwpbkqb">
                        <h4 className="font-medium" data-oid="c8a0pt2">
                            用户道具数据
                        </h4>
                    </div>
                    <div className="overflow-x-auto" data-oid="k77zx4j">
                        <table className="w-full" data-oid="wrwiypk">
                            <thead className="bg-gray-50" data-oid="v7ajwhr">
                                <tr data-oid="fjrelkf">
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="xc1dp99"
                                    >
                                        道具类型
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="rfh-2r2"
                                    >
                                        总数量
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="o_.v-du"
                                    >
                                        已使用
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="ypbhqpq"
                                    >
                                        使用率
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200" data-oid="7s7usfo">
                                {Object.entries(monitorData.user_props).map(([key, data]) => (
                                    <tr key={key} data-oid="3rff6tf">
                                        <td className="px-4 py-2 text-sm" data-oid="eb0az02">
                                            {key}
                                        </td>
                                        <td
                                            className="px-4 py-2 text-sm font-medium"
                                            data-oid="jlzbb:1"
                                        >
                                            {data.total.toLocaleString()}
                                        </td>
                                        <td
                                            className="px-4 py-2 text-sm font-medium"
                                            data-oid="43.668a"
                                        >
                                            {data.used.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 text-sm" data-oid="f_v6h6e">
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${
                                                    data.used / data.total > 0.7
                                                        ? 'bg-green-100 text-green-800'
                                                        : data.used / data.total > 0.4
                                                          ? 'bg-yellow-100 text-yellow-800'
                                                          : 'bg-red-100 text-red-800'
                                                }`}
                                                data-oid="c1xp.y9"
                                            >
                                                {((data.used / data.total) * 100).toFixed(1)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 其他数据 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-oid="h3vmyx-">
                    <div className="bg-white rounded-lg border p-4" data-oid="9x2b5cg">
                        <h4 className="font-medium mb-3" data-oid="x6mo:8y">
                            洗手池数据
                        </h4>
                        <div className="space-y-2 text-sm" data-oid="nvbx7ih">
                            <div className="flex justify-between" data-oid="xqfxmz2">
                                <span data-oid="2q8tis0">PV:</span>
                                <span className="font-medium" data-oid="k2mnxwo">
                                    {monitorData.wash_hands.pv.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between" data-oid="be89-y9">
                                <span data-oid="til3yl8">UV:</span>
                                <span className="font-medium" data-oid="8veqvw5">
                                    {monitorData.wash_hands.uv.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4" data-oid="u7hqu8v">
                        <h4 className="font-medium mb-3" data-oid="ys-._zg">
                            寿星奖励数据
                        </h4>
                        <div className="space-y-2 text-sm" data-oid="r3tre82">
                            <div className="flex justify-between" data-oid="d:8x-4y">
                                <span data-oid="b9-8-_1">领取人数:</span>
                                <span className="font-medium" data-oid="26r.4oe">
                                    {monitorData.birthday_reward.users.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between" data-oid="d0yaxf.">
                                <span data-oid="hbxau5b">领取次数:</span>
                                <span className="font-medium" data-oid="f2an1sj">
                                    {monitorData.birthday_reward.times.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4" data-oid="3kbas4o">
                        <h4 className="font-medium mb-3" data-oid="223dgv8">
                            宝石点亮数据
                        </h4>
                        <div className="space-y-2 text-sm" data-oid="wtmy3u8">
                            <div className="flex justify-between" data-oid="wkpw8j6">
                                <span data-oid="bejz9kh">点亮用户数:</span>
                                <span className="font-medium" data-oid="70962f9">
                                    {monitorData.light_gem_users.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex" data-oid="93eusr7">
            {/* 侧边栏 */}
            <div className="w-64 bg-gray-800 text-white" data-oid="na_.0ya">
                <div className="p-4" data-oid="p5t-c:v">
                    <div className="flex items-center mb-8" data-oid="v_.h6i:">
                        <div className="w-4 h-4 bg-gray-600 rounded mr-2" data-oid="vz80..g"></div>
                        <span className="text-sm" data-oid="cs8:b65">
                            宝石活动配置管理
                        </span>
                    </div>

                    <nav className="space-y-2" data-oid="ud1k-7-">
                        {/* 主导航 - 配置管理 */}
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'config' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('config')}
                            data-oid="c1:6gvm"
                        >
                            <div
                                className="w-4 h-4 bg-blue-500 rounded-sm mr-2"
                                data-oid="ckw1z__"
                            ></div>
                            <span className="text-sm" data-oid="20554eo">
                                配置管理
                            </span>
                        </div>

                        {/* 配置管理子菜单 */}
                        {activeTab === 'config' && (
                            <div className="ml-6 space-y-1" data-oid="g9qf6gu">
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'send_msg'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('send_msg')}
                                    data-oid="z6wm7xg"
                                >
                                    <div
                                        className="w-3 h-3 bg-blue-400 rounded-sm mr-2"
                                        data-oid="u5crf2d"
                                    ></div>
                                    <span data-oid="8k.s--u">发送消息配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'warning'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('warning')}
                                    data-oid="gg8-q3l"
                                >
                                    <div
                                        className="w-3 h-3 bg-red-400 rounded-sm mr-2"
                                        data-oid="2nt-3g1"
                                    ></div>
                                    <span data-oid="c_vjl_9">活动告警配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'mission_pool'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('mission_pool')}
                                    data-oid="rqu9ikp"
                                >
                                    <div
                                        className="w-3 h-3 bg-green-400 rounded-sm mr-2"
                                        data-oid="azabipo"
                                    ></div>
                                    <span data-oid="0k_7.2x">任务池配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'open_box'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('open_box')}
                                    data-oid="n8hhccy"
                                >
                                    <div
                                        className="w-3 h-3 bg-yellow-400 rounded-sm mr-2"
                                        data-oid="xtc.ejc"
                                    ></div>
                                    <span data-oid="onjoaso">开宝箱配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'gift_hat'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('gift_hat')}
                                    data-oid="bmn57ub"
                                >
                                    <div
                                        className="w-3 h-3 bg-pink-400 rounded-sm mr-2"
                                        data-oid="xgs2_ad"
                                    ></div>
                                    <span data-oid="rype6e4">收礼送尾巴</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'birthday'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('birthday')}
                                    data-oid="b32bh1q"
                                >
                                    <div
                                        className="w-3 h-3 bg-orange-400 rounded-sm mr-2"
                                        data-oid=".wut1:q"
                                    ></div>
                                    <span data-oid="tjneebl">生日配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'stones'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('stones')}
                                    data-oid="q7ob0re"
                                >
                                    <div
                                        className="w-3 h-3 bg-purple-400 rounded-sm mr-2"
                                        data-oid="7qjf242"
                                    ></div>
                                    <span data-oid="zt2e3z.">石头配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'wash_hands'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('wash_hands')}
                                    data-oid="ofoshv9"
                                >
                                    <div
                                        className="w-3 h-3 bg-cyan-400 rounded-sm mr-2"
                                        data-oid="6uf:ejs"
                                    ></div>
                                    <span data-oid="u4sq7wx">洗手池配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'prop_img'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('prop_img')}
                                    data-oid="d7h1uuv"
                                >
                                    <div
                                        className="w-3 h-3 bg-indigo-400 rounded-sm mr-2"
                                        data-oid="z3qdp_q"
                                    ></div>
                                    <span data-oid="v2fjift">晨辉图片</span>
                                </div>
                            </div>
                        )}

                        {/* 主导航 - 数据监控 */}
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'monitor' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('monitor')}
                            data-oid="o16egl3"
                        >
                            <div
                                className="w-4 h-4 bg-green-500 rounded-sm mr-2"
                                data-oid="bemq0nf"
                            ></div>
                            <span className="text-sm" data-oid="_i52:3l">
                                数据监控
                            </span>
                        </div>
                    </nav>
                </div>
            </div>

            {/* 主内容区 */}
            <div className="flex-1 p-6" data-oid=":kc2lj2">
                <div className="bg-white rounded-lg shadow-sm" data-oid="x0wvrb6">
                    {/* 头部 */}
                    <div className="border-b border-gray-200 p-6" data-oid="l6fem5e">
                        <h1 className="text-2xl font-medium text-gray-800 mb-2" data-oid="y.ln4cx">
                            宝石活动配置管理
                        </h1>
                        <div className="text-sm text-gray-500" data-oid="c:dem7g">
                            {/* 操作员：Wang-Xiu 当前时间：{new Date().toLocaleString('zh-CN')} */}
                        </div>
                    </div>

                    <div className="p-6" data-oid="3k_xp_8">
                        {/* 内容区域 */}
                        <div className="bg-gray-50 rounded-lg p-6" data-oid="o0h8yce">
                            {activeTab === 'config' && (
                                <>
                                    {/* 配置内容 */}
                                    <div data-oid="f_vyx_n">
                                        {activeConfigTab === 'send_msg' && renderSendMsgConfig()}
                                        {activeConfigTab === 'warning' && renderWarningConfig()}
                                        {activeConfigTab === 'mission_pool' &&
                                            renderMissionPoolConfig()}
                                        {activeConfigTab === 'open_box' && renderOpenBoxConfig()}
                                        {activeConfigTab === 'gift_hat' && renderGiftHatConfig()}
                                        {activeConfigTab === 'birthday' && renderBirthdayConfig()}
                                        {activeConfigTab === 'stones' && renderStoneConfig()}
                                        {activeConfigTab === 'wash_hands' &&
                                            renderWashHandsConfig()}
                                        {activeConfigTab === 'prop_img' && renderPropImgConfig()}
                                    </div>

                                    {/* API操作和状态 */}
                                    <div
                                        className="flex items-center justify-between pt-6 border-t mt-6"
                                        data-oid="2nlufta"
                                    >
                                        <div className="flex space-x-4" data-oid="-upvi0x">
                                            <button
                                                onClick={fetchData}
                                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                                                data-oid="8ki2vsa"
                                            >
                                                获取配置
                                            </button>
                                            <button
                                                onClick={submitData}
                                                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                                                data-oid="5x0se4v"
                                            >
                                                保存配置
                                            </button>
                                            <button
                                                onClick={() => setConfig(defaultConfig)}
                                                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                                                data-oid="p6vqxua"
                                            >
                                                重置配置
                                            </button>
                                        </div>
                                        {apiStatus && (
                                            <div
                                                className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded"
                                                data-oid="mi4qqm9"
                                            >
                                                {apiStatus}
                                            </div>
                                        )}
                                    </div>

                                    {/* JSON预览 */}
                                    <div className="mt-8" data-oid="2rm28o_">
                                        <h3 className="text-lg font-medium mb-4" data-oid="2lnx-_d">
                                            配置JSON预览
                                        </h3>
                                        <pre
                                            className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96 border"
                                            data-oid="2d-_5uc"
                                        >
                                            {JSON.stringify(config, null, 2)}
                                        </pre>
                                    </div>
                                </>
                            )}

                            {activeTab === 'monitor' && renderMonitorPage()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
