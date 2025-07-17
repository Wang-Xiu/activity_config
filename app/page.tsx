'use client';

import { useState, useEffect } from 'react';
import { defaultConfig } from '../config/defaultConfig';
import { MainConfig } from '../types/config';
import { MonitorData } from '../types/monitor';
import { Activity, ACTIVITIES, getActivityById } from '../types/activity';
import { buildApiUrl } from '../config/environment';
import ActivitySelector from '../components/ActivitySelector';

export default function Page() {
    // 主要状态
    const [currentView, setCurrentView] = useState<'dashboard' | 'activity'>('dashboard');
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [activeTab, setActiveTab] = useState('config');
    const [activeConfigTab, setActiveConfigTab] = useState('send_msg');

    // 配置相关状态
    const [config, setConfig] = useState<MainConfig>(defaultConfig);
    const [apiStatus, setApiStatus] = useState('');

    // 监控相关状态
    const [monitorData, setMonitorData] = useState<MonitorData | null>(null);
    const [monitorDateType, setMonitorDateType] = useState<'daily' | 'total'>('daily');
    const [monitorDate, setMonitorDate] = useState(new Date().toISOString().split('T')[0]);

    // 页面初始化时获取数据（仅当选择了活动时）
    useEffect(() => {
        if (selectedActivity && currentView === 'activity') {
            fetchData();
        }
    }, [selectedActivity, currentView]);

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

    // 活动选择处理
    const handleActivitySelect = (activity: Activity) => {
        setSelectedActivity(activity);
        setCurrentView('activity');
        setActiveTab('config');
        setActiveConfigTab('send_msg');
    };

    // 返回活动选择页面
    const handleBackToDashboard = () => {
        setCurrentView('dashboard');
        setSelectedActivity(null);
        setConfig(defaultConfig);
        setMonitorData(null);
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
        <div className="space-y-6" data-oid="e._yrrj">
            <h3 className="text-lg font-medium mb-4" data-oid="u0sv5wz">
                发送消息配置
            </h3>

            <div data-oid="riu.wlc">
                <label className="block text-sm font-medium mb-2" data-oid="mck-ats">
                    是否开启发送通知
                </label>
                <select
                    value={config.send_msg_config.send_msg}
                    onChange={(e) =>
                        updateConfig('send_msg_config.send_msg', parseInt(e.target.value))
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                    data-oid="_qq.wew"
                >
                    <option value={1} data-oid="kn055su">
                        开启
                    </option>
                    <option value={0} data-oid="n0rgp8n">
                        关闭
                    </option>
                </select>
            </div>

            <div className="space-y-4" data-oid="j7ee1ct">
                <h4 className="font-medium" data-oid=":_mz_7o">
                    通知消息内容
                </h4>

                <div data-oid="upbhvci">
                    <label className="block text-sm font-medium mb-2" data-oid="s.7n251">
                        匹配完成消息
                    </label>
                    <textarea
                        value={config.send_msg_config.send_msg_info.match_done}
                        onChange={(e) =>
                            updateConfig('send_msg_config.send_msg_info.match_done', e.target.value)
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                        data-oid="zz7-0ik"
                    />
                </div>

                <div data-oid="q_6c7ac">
                    <label className="block text-sm font-medium mb-2" data-oid="w.o6yvt">
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
                        data-oid="s3mr260"
                    />
                </div>

                <div data-oid="ozo.kku">
                    <label className="block text-sm font-medium mb-2" data-oid="zsj6nwz">
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
                        data-oid="wix.9td"
                    />
                </div>

                <div data-oid="e.xj5kg">
                    <label className="block text-sm font-medium mb-2" data-oid="e0qy:ah">
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
                        data-oid="ur23m36"
                    />
                </div>

                <div data-oid="arv-igj">
                    <label className="block text-sm font-medium mb-2" data-oid="w1_ve0l">
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
                        data-oid="lwzm7-m"
                    />
                </div>
            </div>
        </div>
    );

    const renderWarningConfig = () => (
        <div className="space-y-6" data-oid="mmcp_4j">
            <h3 className="text-lg font-medium mb-4" data-oid="g.d0oto">
                活动告警配置
            </h3>

            <div data-oid="7rlqi_7">
                <label className="block text-sm font-medium mb-2" data-oid=".r0jv6d">
                    是否开启告警邮件发送
                </label>
                <select
                    value={config.send_warning_config.send_warning}
                    onChange={(e) =>
                        updateConfig('send_warning_config.send_warning', parseInt(e.target.value))
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                    data-oid="jb40scz"
                >
                    <option value={1} data-oid="_uqd4wa">
                        开启
                    </option>
                    <option value={0} data-oid="pvcayh7">
                        关闭
                    </option>
                </select>
            </div>

            <div data-oid="3_u425v">
                <label className="block text-sm font-medium mb-2" data-oid="tqo4n3p">
                    告警产生的活动名
                </label>
                <input
                    type="text"
                    value={config.send_warning_config.send_warning_act_name}
                    onChange={(e) =>
                        updateConfig('send_warning_config.send_warning_act_name', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="k5adc:8"
                />
            </div>

            <div data-oid="78jdnz2">
                <label className="block text-sm font-medium mb-2" data-oid="djxx.1l">
                    告警邮件发送间隔(秒)
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.send_warning_interval}
                    onChange={(e) =>
                        updateConfig('send_warning_config.send_warning_interval', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid=":kmlv3u"
                />
            </div>

            <div data-oid=":wnmmrc">
                <label className="block text-sm font-medium mb-2" data-oid="af3b01b">
                    接口访问次数风控告警-指定时间内(秒)
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.report_time}
                    onChange={(e) =>
                        updateConfig('send_warning_config.report_time', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="h28i9fc"
                />
            </div>

            <div data-oid="1z9biaf">
                <label className="block text-sm font-medium mb-2" data-oid="b2tdomh">
                    接口访问次数风控告警-访问次数阈值
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.report_num}
                    onChange={(e) => updateConfig('send_warning_config.report_num', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="ewc_r38"
                />
            </div>

            <div data-oid="p19gqv9">
                <label className="block text-sm font-medium mb-2" data-oid="rcyh8zn">
                    告警消息模板
                </label>
                <textarea
                    value={config.send_warning_config.msg_1}
                    onChange={(e) => updateConfig('send_warning_config.msg_1', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                    data-oid="9wyp6df"
                />
            </div>

            <div data-oid="8dqsqqw">
                <label className="block text-sm font-medium mb-2" data-oid="uobf7de">
                    礼物数量阈值
                </label>
                <input
                    type="number"
                    value={config.send_warning_config.give_gift_num}
                    onChange={(e) =>
                        updateConfig('send_warning_config.give_gift_num', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="_fh3qbe"
                />
            </div>
        </div>
    );

    const renderMissionPoolConfig = () => (
        <div className="space-y-8" data-oid="yothdwe">
            <h3 className="text-lg font-medium mb-4" data-oid="o8haet2">
                任务池配置
            </h3>

            {/* 新用户任务池 */}
            <div data-oid="r0-.r1m">
                <h4 className="font-medium mb-4 text-blue-600" data-oid="366ls17">
                    新用户任务池
                </h4>
                <div className="space-y-4" data-oid="xtx4-8l">
                    {Object.entries(config.act_config.mission_pool.new_user).map(([key, task]) => (
                        <div
                            key={key}
                            className="border border-gray-200 rounded p-4"
                            data-oid="hfbppu4"
                        >
                            <h5 className="font-medium mb-3" data-oid="off-ovi">
                                {key}
                            </h5>
                            <div className="grid grid-cols-3 gap-4" data-oid="olklc6f">
                                <div data-oid="yf1j14_">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="augm-cv"
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
                                        data-oid=":16k4qr"
                                    />
                                </div>
                                <div data-oid="p-p7yd0">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="d15zo9d"
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
                                        data-oid="hdqx1qe"
                                    />
                                </div>
                                <div data-oid="hgq3-:a">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="_4b7vhm"
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
                                        data-oid="u2ygirf"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 老用户任务池 */}
            <div data-oid="81b7ddv">
                <h4 className="font-medium mb-4 text-green-600" data-oid="-9lnl-f">
                    老用户任务池
                </h4>
                <div className="space-y-4" data-oid="6m7w3ok">
                    {Object.entries(config.act_config.mission_pool.old_user).map(([key, task]) => (
                        <div
                            key={key}
                            className="border border-gray-200 rounded p-4"
                            data-oid="xl.6jlj"
                        >
                            <h5 className="font-medium mb-3" data-oid="zzmvp3-">
                                {key}
                            </h5>
                            <div className="grid grid-cols-3 gap-4" data-oid="_1kplxa">
                                <div data-oid="5_7:z-m">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="md52003"
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
                                        data-oid="u76jx-r"
                                    />
                                </div>
                                <div data-oid="7ev0..t">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="v8r:o-3"
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
                                        data-oid="if3be03"
                                    />
                                </div>
                                <div data-oid="aab.t8_">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        data-oid="lhzvhty"
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
                                        data-oid="w-k1:6."
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
        <div className="space-y-6" data-oid="hz.4eks">
            <h3 className="text-lg font-medium mb-4" data-oid="_o6ez0c">
                开宝箱配置
            </h3>

            {/* 免费时段配置 */}
            <div data-oid="tpqt2a1">
                <h4 className="font-medium mb-3" data-oid="z_7zkjf">
                    免费时段配置
                </h4>
                <div className="grid grid-cols-2 gap-6" data-oid="740s1ps">
                    <div data-oid="0mkghy2">
                        <label className="block text-sm font-medium mb-2" data-oid="g2j63f8">
                            免费时段1
                        </label>
                        <div className="flex space-x-2" data-oid="rdcidxr">
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
                                data-oid="r6x:yzu"
                            />

                            <span className="self-center" data-oid="dbyrzyh">
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
                                data-oid="dybkw6t"
                            />
                        </div>
                    </div>
                    <div data-oid="m5n7mg:">
                        <label className="block text-sm font-medium mb-2" data-oid="lleu-eo">
                            免费时段2
                        </label>
                        <div className="flex space-x-2" data-oid="6uycoll">
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
                                data-oid="x2sz31t"
                            />

                            <span className="self-center" data-oid="py3f-.p">
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
                                data-oid=":lu0h0."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 送礼得宝箱配置 */}
            <div data-oid="g4kbj7i">
                <h4 className="font-medium mb-3" data-oid="jnjvogf">
                    送礼得宝箱配置
                </h4>
                <div className="grid grid-cols-2 gap-4" data-oid=":gwg6c0">
                    <div data-oid="mhf4un2">
                        <label className="block text-sm font-medium mb-2" data-oid="ntebwgo">
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
                            data-oid="qu16f7f"
                        />
                    </div>
                    <div data-oid="r06q9e1">
                        <label className="block text-sm font-medium mb-2" data-oid="fj1__3a">
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
                            data-oid="hjn.zje"
                        />
                    </div>
                    <div data-oid="lv9.m5:">
                        <label className="block text-sm font-medium mb-2" data-oid="u.6dt72">
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
                            data-oid="p:45e4b"
                        />
                    </div>
                    <div data-oid="paazdur">
                        <label className="block text-sm font-medium mb-2" data-oid="b_vl3w3">
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
                            data-oid="_8kqmfk"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderGiftHatConfig = () => (
        <div className="space-y-6" data-oid="hkij835">
            <h3 className="text-lg font-medium mb-4" data-oid="aaitkeo">
                收礼送尾巴配置
            </h3>

            <div className="grid grid-cols-3 gap-4" data-oid="-aca1gc">
                <div data-oid="sbetx22">
                    <label className="block text-sm font-medium mb-2" data-oid="c8zuvzr">
                        收到礼物ID
                    </label>
                    <input
                        type="text"
                        value={config.act_config.get_gift_send_hat.get_gift_id}
                        onChange={(e) =>
                            updateConfig('act_config.get_gift_send_hat.get_gift_id', e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        data-oid="wegl6.5"
                    />
                </div>
                <div data-oid=":4on3:y">
                    <label className="block text-sm font-medium mb-2" data-oid="c:.piyu">
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
                        data-oid="i.-.8of"
                    />
                </div>
                <div data-oid="j6alzgv">
                    <label className="block text-sm font-medium mb-2" data-oid="t7ofveg">
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
                        data-oid="6ad6w9w"
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
            <div className="space-y-6" data-oid="sxnx6.s">
                <h3 className="text-lg font-medium mb-4" data-oid="x20og.e">
                    生日配置
                </h3>

                {/* 价格配置 */}
                <div className="grid grid-cols-2 gap-4" data-oid="z_qelwo">
                    <div data-oid="6::ts-i">
                        <label className="block text-sm font-medium mb-2" data-oid="ahr5zuq">
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
                            data-oid="c0pudt9"
                        />
                    </div>
                    <div data-oid="_5jje1o">
                        <label className="block text-sm font-medium mb-2" data-oid="k-6_uy5">
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
                            data-oid="2wy0lf8"
                        />
                    </div>
                </div>

                {/* 任务列表配置 */}
                <div data-oid="-qf8dxf">
                    <h4 className="font-medium mb-3" data-oid="he5xl4k">
                        任务列表配置
                    </h4>
                    <div className="space-y-4" data-oid="4o933rs">
                        {Object.entries(config.act_config.happy_birthday_config.mission_list).map(
                            ([key, mission]) => (
                                <div
                                    key={key}
                                    className="border border-gray-200 rounded p-4"
                                    data-oid="9o3qhb5"
                                >
                                    <h5 className="font-medium mb-3" data-oid="w5kokb6">
                                        {key}
                                    </h5>
                                    <div className="grid grid-cols-4 gap-4" data-oid="d9qe-_h">
                                        <div data-oid="y5kicrf">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid="8058-nf"
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
                                                data-oid="xkjyivk"
                                            />
                                        </div>
                                        <div data-oid="2tlcyw-">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid="in2lm-a"
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
                                                data-oid="m1nzb44"
                                            />
                                        </div>
                                        <div data-oid="ytiwtoe">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid="a7s0l_x"
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
                                                data-oid="8xomgay"
                                            />
                                        </div>
                                        <div data-oid="lyspsjm">
                                            <label
                                                className="block text-sm font-medium mb-2"
                                                data-oid="l_cq9_b"
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
                                                data-oid=".ny3s.3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>

                {/* 生日消息列表 */}
                <div data-oid="5-5tle0">
                    <h4 className="font-medium mb-3" data-oid="j:o_wo4">
                        生日祝福消息列表
                    </h4>
                    <div className="space-y-2" data-oid="jfd3eic">
                        {config.act_config.happy_birthday_config.msg_list.map((msg, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2"
                                data-oid=":dyy6nz"
                            >
                                <span className="text-sm text-gray-500 w-8" data-oid="u0ekn84">
                                    #{index + 1}
                                </span>
                                <input
                                    type="text"
                                    value={msg}
                                    onChange={(e) => updateBirthdayMessage(index, e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 flex-1"
                                    placeholder="输入生日祝福消息"
                                    data-oid="aeqvl-n"
                                />

                                <button
                                    onClick={() => removeBirthdayMessage(index)}
                                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                    data-oid="d7j_m6d"
                                >
                                    删除
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addBirthdayMessage}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            data-oid="5b76t:e"
                        >
                            添加消息
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderWashHandsConfig = () => (
        <div className="space-y-6" data-oid="p2x0bnb">
            <h3 className="text-lg font-medium mb-4" data-oid="tg:21wb">
                洗手池晨辉配置
            </h3>

            <div data-oid="h34xouu">
                <label className="block text-sm font-medium mb-2" data-oid="gy1hvm.">
                    每日次数
                </label>
                <input
                    type="text"
                    value={config.act_config.wash_hands_config.day_chance}
                    onChange={(e) =>
                        updateConfig('act_config.wash_hands_config.day_chance', e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="0b_3vxx"
                />
            </div>

            <div data-oid="-d3cbs4">
                <h4 className="font-medium mb-3" data-oid="2k0z_gk">
                    奖励池配置
                </h4>
                <div className="space-y-3" data-oid="50xyg55">
                    {Object.entries(config.act_config.wash_hands_config.pool).map(([key, pool]) => (
                        <div
                            key={key}
                            className="flex space-x-4 items-center border border-gray-200 rounded p-3"
                            data-oid="i63w359"
                        >
                            <span className="w-12 text-sm font-medium" data-oid="qqrj4vs">
                                池子{key}
                            </span>
                            <div data-oid="u24e61:">
                                <label
                                    className="block text-xs text-gray-500 mb-1"
                                    data-oid=":vnly.n"
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
                                    data-oid="g-nzrnv"
                                />
                            </div>
                            <div data-oid="3:axr0e">
                                <label
                                    className="block text-xs text-gray-500 mb-1"
                                    data-oid="1p9gct2"
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
                                    data-oid="xzha::b"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPropImgConfig = () => (
        <div className="space-y-6" data-oid="vjbcy:t">
            <h3 className="text-lg font-medium mb-4" data-oid="1gvnz6u">
                晨辉图片配置
            </h3>

            <div data-oid="35grwm9">
                <label className="block text-sm font-medium mb-2" data-oid="goqc-uf">
                    晨辉图片文件名
                </label>
                <input
                    type="text"
                    value={config.act_config.prop_img}
                    onChange={(e) => updateConfig('act_config.prop_img', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    placeholder="例如: fjlw_xyq_0111.png"
                    data-oid="w9dq:-b"
                />
            </div>
        </div>
    );

    const renderStoneConfig = () => (
        <div className="space-y-6" data-oid="s7wjrjp">
            <h3 className="text-lg font-medium mb-4" data-oid="z2z_-qu">
                12个月石头配置
            </h3>
            <div className="grid grid-cols-1 gap-4" data-oid="yij7z0.">
                {Object.entries(config.act_config.all_stone).map(([month, stone]) => (
                    <div
                        key={month}
                        className="border border-gray-200 rounded p-4"
                        data-oid="09.cou9"
                    >
                        <h4 className="font-medium mb-2" data-oid="ms2kh2i">
                            {month}月 - {stone.name}
                        </h4>
                        <div data-oid="pqtl_27">
                            <label className="block text-sm font-medium mb-2" data-oid="k8fz:ng">
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
                                data-oid="cwtrm-f"
                            />
                        </div>
                        <div data-oid="ss2psd9">
                            <label className="block text-sm font-medium mb-2" data-oid="54xenrd">
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
                                data-oid="28eizvf"
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
                <div className="flex items-center justify-center h-64" data-oid="s98yxdl">
                    <div className="text-gray-500" data-oid="nca4wa6">
                        正在加载监控数据...
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-8" data-oid="5zs9dd8">
                <div className="flex items-center justify-between mb-6" data-oid="935:k.:">
                    <h3 className="text-lg font-medium" data-oid="32axceu">
                        数据监控
                    </h3>
                    <div className="flex items-center space-x-4" data-oid="94.h26p">
                        <div className="flex items-center space-x-2" data-oid="naw001j">
                            <label className="text-sm font-medium" data-oid=":nhbaa:">
                                数据类型:
                            </label>
                            <select
                                value={monitorDateType}
                                onChange={(e) =>
                                    setMonitorDateType(e.target.value as 'daily' | 'total')
                                }
                                className="border border-gray-300 rounded px-3 py-1 text-sm"
                                data-oid="-rqn5j-"
                            >
                                <option value="daily" data-oid="xmeu9.v">
                                    每日数据
                                </option>
                                <option value="total" data-oid="15vcu16">
                                    总数据
                                </option>
                            </select>
                        </div>
                        {monitorDateType === 'daily' && (
                            <div className="flex items-center space-x-2" data-oid="_l_fy32">
                                <label className="text-sm font-medium" data-oid="olhm1s0">
                                    日期:
                                </label>
                                <input
                                    type="date"
                                    value={monitorDate}
                                    onChange={(e) => setMonitorDate(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                                    data-oid="s7kcwj-"
                                />
                            </div>
                        )}
                        <button
                            onClick={fetchMonitorData}
                            className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
                            data-oid="2f2c4s-"
                        >
                            刷新数据
                        </button>
                    </div>
                </div>

                {/* 宝箱数据概览 */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    data-oid="uz.ch76"
                >
                    <div className="bg-blue-50 p-4 rounded-lg border" data-oid="pc20k31">
                        <h4 className="font-medium text-blue-800 mb-2" data-oid="qvw0-hy">
                            光华宝箱
                        </h4>
                        <div className="space-y-1 text-sm" data-oid="-u31sf2">
                            <div data-oid="8hl3l2x">
                                产出:{' '}
                                <span className="font-medium" data-oid="kihn1ui">
                                    {monitorData.guanghua_box.output.toLocaleString()}
                                </span>
                            </div>
                            <div data-oid="-7_ghcj">
                                人数:{' '}
                                <span className="font-medium" data-oid="28ix2ri">
                                    {monitorData.guanghua_box.users.toLocaleString()}
                                </span>
                            </div>
                            <div data-oid="z8bl7ml">
                                次数:{' '}
                                <span className="font-medium" data-oid="kaqpfzw">
                                    {monitorData.guanghua_box.times.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border" data-oid="mc36:a_">
                        <h4 className="font-medium text-purple-800 mb-2" data-oid="ntqadrc">
                            月华宝箱
                        </h4>
                        <div className="space-y-1 text-sm" data-oid="rai71j_">
                            <div data-oid="yp30cej">
                                产出:{' '}
                                <span className="font-medium" data-oid="sat-c5:">
                                    {monitorData.yuehua_box.output.toLocaleString()}
                                </span>
                            </div>
                            <div data-oid="_frttc-">
                                人数:{' '}
                                <span className="font-medium" data-oid="jl7itmg">
                                    {monitorData.yuehua_box.users.toLocaleString()}
                                </span>
                            </div>
                            <div data-oid="0habmba">
                                次数:{' '}
                                <span className="font-medium" data-oid="3jyxi8z">
                                    {monitorData.yuehua_box.times.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border" data-oid="l7fmqpm">
                        <h4 className="font-medium text-green-800 mb-2" data-oid="kkcgyk6">
                            活动总产出
                        </h4>
                        <div className="space-y-1 text-sm" data-oid="kqh.:uo">
                            <div data-oid="1ya4xog">
                                产出:{' '}
                                <span className="font-medium" data-oid="oc4-9wg">
                                    {monitorData.total_output.output.toLocaleString()}
                                </span>
                            </div>
                            <div data-oid="_il:aq1">
                                人数:{' '}
                                <span className="font-medium" data-oid="-h3t2.h">
                                    {monitorData.total_output.users.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border" data-oid="v_j:83s">
                        <h4 className="font-medium text-orange-800 mb-2" data-oid="jelfns8">
                            特殊数据
                        </h4>
                        <div className="space-y-1 text-sm" data-oid="jbhf97-">
                            <div data-oid="np7sp.r">
                                点亮宝石:{' '}
                                <span className="font-medium" data-oid="tdiamik">
                                    {monitorData.light_gem_users.toLocaleString()}
                                </span>
                            </div>
                            <div data-oid="o9zofpz">
                                特别报名:{' '}
                                <span className="font-medium" data-oid="wm5l8kj">
                                    {monitorData.special_signup.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 任务完成情况表格 */}
                <div className="bg-white rounded-lg border" data-oid="mkf3dpo">
                    <div className="p-4 border-b" data-oid=".cc3ovn">
                        <h4 className="font-medium" data-oid="lfjdicm">
                            任务完成情况
                        </h4>
                    </div>
                    <div className="overflow-x-auto" data-oid="5ros4pq">
                        <table className="w-full" data-oid="5wuca5b">
                            <thead className="bg-gray-50" data-oid="u8dbk7m">
                                <tr data-oid="jfflnlu">
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="yia4i2t"
                                    >
                                        任务名称
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="htmu:2j"
                                    >
                                        完成人数
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="kua3ulo"
                                    >
                                        完成次数
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200" data-oid="8xhu6ga">
                                {Object.entries(monitorData.mission_completion).map(
                                    ([key, data]) => (
                                        <tr key={key} data-oid="-l4l9hf">
                                            <td className="px-4 py-2 text-sm" data-oid="0wbzgka">
                                                {key}
                                            </td>
                                            <td
                                                className="px-4 py-2 text-sm font-medium"
                                                data-oid="dmh47k5"
                                            >
                                                {data.users.toLocaleString()}
                                            </td>
                                            <td
                                                className="px-4 py-2 text-sm font-medium"
                                                data-oid="dzg3tnk"
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
                <div className="bg-white rounded-lg border" data-oid="j1bezpm">
                    <div className="p-4 border-b" data-oid="dtf41yu">
                        <h4 className="font-medium" data-oid="m0rt7g4">
                            入口PV/UV数据
                        </h4>
                    </div>
                    <div className="overflow-x-auto" data-oid="whk_0yq">
                        <table className="w-full" data-oid="7_3d6d9">
                            <thead className="bg-gray-50" data-oid="pn591:e">
                                <tr data-oid="m8t3i_7">
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="3j3at3-"
                                    >
                                        入口名称
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="ifxqdnv"
                                    >
                                        PV
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="d67w-v6"
                                    >
                                        UV
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200" data-oid="7-twz8y">
                                {Object.entries(monitorData.entrance_data).map(([key, data]) => (
                                    <tr key={key} data-oid="frddg_i">
                                        <td className="px-4 py-2 text-sm" data-oid="zr:8bgw">
                                            {key}
                                        </td>
                                        <td
                                            className="px-4 py-2 text-sm font-medium"
                                            data-oid="bfad72d"
                                        >
                                            {data.pv.toLocaleString()}
                                        </td>
                                        <td
                                            className="px-4 py-2 text-sm font-medium"
                                            data-oid="v8l.fnq"
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
                <div className="bg-white rounded-lg border" data-oid="ro_d4i0">
                    <div className="p-4 border-b" data-oid="to0m:62">
                        <h4 className="font-medium" data-oid="a1-m5rs">
                            用户道具数据
                        </h4>
                    </div>
                    <div className="overflow-x-auto" data-oid="z0lrxl1">
                        <table className="w-full" data-oid="vvy2cha">
                            <thead className="bg-gray-50" data-oid="v4f-iob">
                                <tr data-oid="a60ywli">
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="t--fn_5"
                                    >
                                        道具类型
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="k4fluaa"
                                    >
                                        总数量
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="g_ugv8z"
                                    >
                                        已使用
                                    </th>
                                    <th
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                        data-oid="d5bgsg3"
                                    >
                                        使用率
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200" data-oid="hd:n2gd">
                                {Object.entries(monitorData.user_props).map(([key, data]) => (
                                    <tr key={key} data-oid="6v1n.vx">
                                        <td className="px-4 py-2 text-sm" data-oid="8107:tz">
                                            {key}
                                        </td>
                                        <td
                                            className="px-4 py-2 text-sm font-medium"
                                            data-oid="tk0ln49"
                                        >
                                            {data.total.toLocaleString()}
                                        </td>
                                        <td
                                            className="px-4 py-2 text-sm font-medium"
                                            data-oid="qu0hc0k"
                                        >
                                            {data.used.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 text-sm" data-oid="k9.6ki5">
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${
                                                    data.used / data.total > 0.7
                                                        ? 'bg-green-100 text-green-800'
                                                        : data.used / data.total > 0.4
                                                          ? 'bg-yellow-100 text-yellow-800'
                                                          : 'bg-red-100 text-red-800'
                                                }`}
                                                data-oid="5r3t:to"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-oid="9jpk3r2">
                    <div className="bg-white rounded-lg border p-4" data-oid=":a:-rvd">
                        <h4 className="font-medium mb-3" data-oid="ku9-rxo">
                            洗手池数据
                        </h4>
                        <div className="space-y-2 text-sm" data-oid="pjfk_nw">
                            <div className="flex justify-between" data-oid="gk8m53p">
                                <span data-oid="8gkmrzf">PV:</span>
                                <span className="font-medium" data-oid="9fypmzc">
                                    {monitorData.wash_hands.pv.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between" data-oid="m_g0ag3">
                                <span data-oid="oadwgxr">UV:</span>
                                <span className="font-medium" data-oid="jd6.cdb">
                                    {monitorData.wash_hands.uv.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4" data-oid="q8vxiqn">
                        <h4 className="font-medium mb-3" data-oid="oo6rsla">
                            寿星奖励数据
                        </h4>
                        <div className="space-y-2 text-sm" data-oid="5gzqb0l">
                            <div className="flex justify-between" data-oid="bgzeyjr">
                                <span data-oid="jvwa940">领取人数:</span>
                                <span className="font-medium" data-oid="gc1h-by">
                                    {monitorData.birthday_reward.users.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between" data-oid="a6p7e-t">
                                <span data-oid="zple5.c">领取次数:</span>
                                <span className="font-medium" data-oid="c8kt67u">
                                    {monitorData.birthday_reward.times.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4" data-oid="z:mkhyn">
                        <h4 className="font-medium mb-3" data-oid="sj.us.r">
                            宝石点亮数据
                        </h4>
                        <div className="space-y-2 text-sm" data-oid="xd.3tif">
                            <div className="flex justify-between" data-oid="l-s7isz">
                                <span data-oid="vyfc-n7">点亮用户数:</span>
                                <span className="font-medium" data-oid="ebvbu_2">
                                    {monitorData.light_gem_users.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 渲染仪表板页面
    const renderDashboard = () => (
        <div className="min-h-screen bg-gray-50" data-oid="uln3oqv">
            {/* 头部 */}
            <div className="bg-white shadow-sm border-b" data-oid="lgov532">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="--_zeqq">
                    <div className="flex items-center justify-between h-16" data-oid="jlijkji">
                        <div className="flex items-center" data-oid="2o3glls">
                            <div className="flex-shrink-0" data-oid="02bak:q">
                                <div
                                    className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
                                    data-oid="4t4-gx_"
                                >
                                    <span
                                        className="text-white font-bold text-sm"
                                        data-oid="97jp01y"
                                    >
                                        AM
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4" data-oid="1.pgjx8">
                                <h1
                                    className="text-xl font-semibold text-gray-900"
                                    data-oid="hy5hsvm"
                                >
                                    活动管理后台
                                </h1>
                                <p className="text-sm text-gray-500" data-oid="75gij5b">
                                    Activity Management System
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4" data-oid="-y_-.1_">
                            <div className="text-sm text-gray-500" data-oid="rzfzxok">
                                操作员：Wang-Xiu
                            </div>
                            <div className="text-sm text-gray-500" data-oid="re7go0v">
                                {new Date().toLocaleString('zh-CN')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 统计概览 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-oid="d-67u3s">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-oid="j:pdsrt">
                    <div className="bg-white rounded-lg shadow p-6" data-oid="4yl93jj">
                        <div className="flex items-center" data-oid="x:rmhoe">
                            <div className="flex-shrink-0" data-oid="h:sykps">
                                <div
                                    className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center"
                                    data-oid="s600x.e"
                                >
                                    <span className="text-white text-sm" data-oid="s9ro-gh">
                                        ✓
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4" data-oid="m:o0q32">
                                <p className="text-sm font-medium text-gray-500" data-oid="mzef7-g">
                                    运行中活动
                                </p>
                                <p
                                    className="text-2xl font-semibold text-gray-900"
                                    data-oid="-emv4qk"
                                >
                                    {ACTIVITIES.filter((a) => a.status === 'active').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6" data-oid=":fa1jbf">
                        <div className="flex items-center" data-oid="vvfl6d2">
                            <div className="flex-shrink-0" data-oid="2fwzst8">
                                <div
                                    className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center"
                                    data-oid="vlkl:1w"
                                >
                                    <span className="text-white text-sm" data-oid="7wqbh.l">
                                        ⏳
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4" data-oid="fa1-7ti">
                                <p className="text-sm font-medium text-gray-500" data-oid="ki5_pok">
                                    待上线活动
                                </p>
                                <p
                                    className="text-2xl font-semibold text-gray-900"
                                    data-oid="31u6pwg"
                                >
                                    {ACTIVITIES.filter((a) => a.status === 'pending').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6" data-oid="xw7naud">
                        <div className="flex items-center" data-oid="-06m7jc">
                            <div className="flex-shrink-0" data-oid="je9phdw">
                                <div
                                    className="w-8 h-8 bg-gray-500 rounded-md flex items-center justify-center"
                                    data-oid="trrzau5"
                                >
                                    <span className="text-white text-sm" data-oid="9mwz8:_">
                                        ⏸
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4" data-oid="z8l2nd7">
                                <p className="text-sm font-medium text-gray-500" data-oid="-1gcmrf">
                                    已下线活动
                                </p>
                                <p
                                    className="text-2xl font-semibold text-gray-900"
                                    data-oid="wjrias."
                                >
                                    {ACTIVITIES.filter((a) => a.status === 'inactive').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6" data-oid="glhnvjv">
                        <div className="flex items-center" data-oid="d42v833">
                            <div className="flex-shrink-0" data-oid="jwy6iue">
                                <div
                                    className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center"
                                    data-oid="zdac.tk"
                                >
                                    <span className="text-white text-sm" data-oid="-s4t965">
                                        📊
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4" data-oid="79rzijm">
                                <p className="text-sm font-medium text-gray-500" data-oid=":975qtg">
                                    总活动数
                                </p>
                                <p
                                    className="text-2xl font-semibold text-gray-900"
                                    data-oid="6d24jw2"
                                >
                                    {ACTIVITIES.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 活动选择区域 */}
                <div className="bg-white rounded-lg shadow" data-oid="bto:m-v">
                    <div className="px-6 py-4 border-b border-gray-200" data-oid="lnhax6i">
                        <h2 className="text-lg font-medium text-gray-900" data-oid="9ks46ni">
                            选择要管理的活动
                        </h2>
                        <p className="text-sm text-gray-500 mt-1" data-oid="92zgjb-">
                            点击下方活动卡片进入对应的配置管理页面
                        </p>
                    </div>
                    <ActivitySelector
                        activities={ACTIVITIES}
                        selectedActivity={selectedActivity}
                        onActivitySelect={handleActivitySelect}
                        data-oid="xda.bmo"
                    />
                </div>
            </div>
        </div>
    );

    // 渲染活动管理页面
    const renderActivityManagement = () => (
        <div className="min-h-screen bg-gray-100 flex" data-oid="84t9eal">
            {/* 侧边栏 */}
            <div className="w-64 bg-gray-800 text-white" data-oid="f4qydc5">
                <div className="p-4" data-oid="7sko05k">
                    {/* 返回按钮 */}
                    <button
                        onClick={handleBackToDashboard}
                        className="flex items-center w-full p-2 mb-4 text-sm bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                        data-oid=".olfjh1"
                    >
                        <span className="mr-2" data-oid="tlezncr">
                            ←
                        </span>
                        返回活动选择
                    </button>

                    {/* 当前活动信息 */}
                    <div
                        className="flex items-center mb-8 p-3 bg-gray-700 rounded"
                        data-oid="-0r:ogj"
                    >
                        <div className="text-2xl mr-3" data-oid="-2kjofa">
                            {selectedActivity?.icon}
                        </div>
                        <div data-oid="ug_73y4">
                            <div className="text-sm font-medium" data-oid="m4.e6d4">
                                {selectedActivity?.name}
                            </div>
                            <div className="text-xs text-gray-300" data-oid="2bjez9m">
                                配置管理
                            </div>
                        </div>
                    </div>

                    <nav className="space-y-2" data-oid="w28y54p">
                        {/* 主导航 - 配置管理 */}
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'config' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('config')}
                            data-oid="0.q645c"
                        >
                            <div
                                className="w-4 h-4 bg-blue-500 rounded-sm mr-2"
                                data-oid="5n-lq4t"
                            ></div>
                            <span className="text-sm" data-oid=".y:i7d_">
                                配置管理
                            </span>
                        </div>

                        {/* 配置管理子菜单 */}
                        {activeTab === 'config' && selectedActivity?.id === 'gemstone' && (
                            <div className="ml-6 space-y-1" data-oid="xye1id6">
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'send_msg'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('send_msg')}
                                    data-oid="9ut0x7t"
                                >
                                    <div
                                        className="w-3 h-3 bg-blue-400 rounded-sm mr-2"
                                        data-oid="f.7f01o"
                                    ></div>
                                    <span data-oid="qnrg7h1">发送消息配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'warning'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('warning')}
                                    data-oid=":djqdg."
                                >
                                    <div
                                        className="w-3 h-3 bg-red-400 rounded-sm mr-2"
                                        data-oid="_.8a3jn"
                                    ></div>
                                    <span data-oid="rfnt7v_">活动告警配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'mission_pool'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('mission_pool')}
                                    data-oid=":32orhf"
                                >
                                    <div
                                        className="w-3 h-3 bg-green-400 rounded-sm mr-2"
                                        data-oid="7.vhiv3"
                                    ></div>
                                    <span data-oid="pg-r3us">任务池配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'open_box'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('open_box')}
                                    data-oid="nu6zo_3"
                                >
                                    <div
                                        className="w-3 h-3 bg-yellow-400 rounded-sm mr-2"
                                        data-oid="0_aen8l"
                                    ></div>
                                    <span data-oid="fx6vuht">开宝箱配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'gift_hat'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('gift_hat')}
                                    data-oid="ot_rr0y"
                                >
                                    <div
                                        className="w-3 h-3 bg-pink-400 rounded-sm mr-2"
                                        data-oid="ks6hswm"
                                    ></div>
                                    <span data-oid="h2eg5uq">收礼送尾巴</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'birthday'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('birthday')}
                                    data-oid="o5hwpww"
                                >
                                    <div
                                        className="w-3 h-3 bg-orange-400 rounded-sm mr-2"
                                        data-oid="ja9fu.f"
                                    ></div>
                                    <span data-oid="0pk2lrn">生日配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'stones'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('stones')}
                                    data-oid="712vrl8"
                                >
                                    <div
                                        className="w-3 h-3 bg-purple-400 rounded-sm mr-2"
                                        data-oid="la792zw"
                                    ></div>
                                    <span data-oid="m-e.jny">石头配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'wash_hands'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('wash_hands')}
                                    data-oid="oroj-0n"
                                >
                                    <div
                                        className="w-3 h-3 bg-cyan-400 rounded-sm mr-2"
                                        data-oid="5t771f1"
                                    ></div>
                                    <span data-oid="xt90.-a">洗手池配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'prop_img'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('prop_img')}
                                    data-oid="apur0ij"
                                >
                                    <div
                                        className="w-3 h-3 bg-indigo-400 rounded-sm mr-2"
                                        data-oid="j0f0o_2"
                                    ></div>
                                    <span data-oid="4yo44t2">晨辉图片</span>
                                </div>
                            </div>
                        )}

                        {/* 其他活动的配置菜单可以在这里添加 */}
                        {activeTab === 'config' && selectedActivity?.id !== 'gemstone' && (
                            <div className="ml-6 space-y-1" data-oid="r518mhq">
                                <div
                                    className="flex items-center p-2 text-xs text-gray-400"
                                    data-oid="v228s1x"
                                >
                                    <div
                                        className="w-3 h-3 bg-gray-500 rounded-sm mr-2"
                                        data-oid="1ij6.hd"
                                    ></div>
                                    <span data-oid="fbe-6n-">配置功能开发中...</span>
                                </div>
                            </div>
                        )}

                        {/* 主导航 - 数据监控 */}
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'monitor' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('monitor')}
                            data-oid="n9qbwbo"
                        >
                            <div
                                className="w-4 h-4 bg-green-500 rounded-sm mr-2"
                                data-oid="26dsf6h"
                            ></div>
                            <span className="text-sm" data-oid="u2ghgkw">
                                数据监控
                            </span>
                        </div>
                    </nav>
                </div>
            </div>

            {/* 主内容区 */}
            <div className="flex-1 p-6" data-oid="8b:v:84">
                <div className="bg-white rounded-lg shadow-sm" data-oid="dv.v29p">
                    {/* 头部 */}
                    <div className="border-b border-gray-200 p-6" data-oid="r_5gacd">
                        <h1 className="text-2xl font-medium text-gray-800 mb-2" data-oid="v9uedno">
                            {selectedActivity?.name} - 配置管理
                        </h1>
                        <div className="text-sm text-gray-500" data-oid="go87_s.">
                            操作员：Wang-Xiu 当前时间：{new Date().toLocaleString('zh-CN')}
                        </div>
                    </div>

                    <div className="p-6" data-oid="n1el7yt">
                        {/* 内容区域 */}
                        <div className="bg-gray-50 rounded-lg p-6" data-oid="qm2htfm">
                            {activeTab === 'config' && selectedActivity?.id === 'gemstone' && (
                                <>
                                    {/* 宝石活动配置内容 */}
                                    <div data-oid="j:mcbsr">
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
                                        data-oid="tm9.hiz"
                                    >
                                        <div className="flex space-x-4" data-oid="lv7c38q">
                                            <button
                                                onClick={fetchData}
                                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                                                data-oid="9cf9mvr"
                                            >
                                                获取配置
                                            </button>
                                            <button
                                                onClick={submitData}
                                                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                                                data-oid="ltkc-ht"
                                            >
                                                保存配置
                                            </button>
                                            <button
                                                onClick={() => setConfig(defaultConfig)}
                                                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                                                data-oid="lo0bcr6"
                                            >
                                                重置配置
                                            </button>
                                        </div>
                                        {apiStatus && (
                                            <div
                                                className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded"
                                                data-oid=":-rjas8"
                                            >
                                                {apiStatus}
                                            </div>
                                        )}
                                    </div>

                                    {/* JSON预览 */}
                                    <div className="mt-8" data-oid="0tr-2:c">
                                        <h3 className="text-lg font-medium mb-4" data-oid="qhoi9js">
                                            配置JSON预览
                                        </h3>
                                        <pre
                                            className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96 border"
                                            data-oid="imlsxz2"
                                        >
                                            {JSON.stringify(config, null, 2)}
                                        </pre>
                                    </div>
                                </>
                            )}

                            {activeTab === 'config' && selectedActivity?.id !== 'gemstone' && (
                                <div className="text-center py-12" data-oid="mztu5ii">
                                    <div className="text-6xl mb-4" data-oid="as2jg.p">
                                        🚧
                                    </div>
                                    <h3
                                        className="text-lg font-medium text-gray-900 mb-2"
                                        data-oid="utid-l6"
                                    >
                                        功能开发中
                                    </h3>
                                    <p className="text-gray-500" data-oid="sr9r1o9">
                                        {selectedActivity?.name} 的配置功能正在开发中，敬请期待...
                                    </p>
                                </div>
                            )}

                            {activeTab === 'monitor' &&
                                selectedActivity?.id === 'gemstone' &&
                                renderMonitorPage()}

                            {activeTab === 'monitor' && selectedActivity?.id !== 'gemstone' && (
                                <div className="text-center py-12" data-oid="oz0c36n">
                                    <div className="text-6xl mb-4" data-oid="6bmqv7e">
                                        📊
                                    </div>
                                    <h3
                                        className="text-lg font-medium text-gray-900 mb-2"
                                        data-oid="wt6:brp"
                                    >
                                        监控功能开发中
                                    </h3>
                                    <p className="text-gray-500" data-oid=".jo3g48">
                                        {selectedActivity?.name}{' '}
                                        的数据监控功能正在开发中，敬请期待...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex" data-oid="yiomsc6">
            {/* 侧边栏 */}
            <div className="w-64 bg-gray-800 text-white" data-oid="i5ylp6c">
                <div className="p-4" data-oid="wrcm:3m">
                    <div className="flex items-center mb-8" data-oid="jkedsyc">
                        <div className="w-4 h-4 bg-gray-600 rounded mr-2" data-oid="k7tge2."></div>
                        <span className="text-sm" data-oid="-:tp.g:">
                            宝石活动配置管理
                        </span>
                    </div>

                    <nav className="space-y-2" data-oid="hl_a0kk">
                        {/* 主导航 - 配置管理 */}
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'config' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('config')}
                            data-oid="bis_xna"
                        >
                            <div
                                className="w-4 h-4 bg-blue-500 rounded-sm mr-2"
                                data-oid="g_btulz"
                            ></div>
                            <span className="text-sm" data-oid="u5buksc">
                                配置管理
                            </span>
                        </div>

                        {/* 配置管理子菜单 */}
                        {activeTab === 'config' && (
                            <div className="ml-6 space-y-1" data-oid="xe8.lx4">
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'send_msg'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('send_msg')}
                                    data-oid="_bzyktg"
                                >
                                    <div
                                        className="w-3 h-3 bg-blue-400 rounded-sm mr-2"
                                        data-oid="l_djem_"
                                    ></div>
                                    <span data-oid="gbbqktr">发送消息配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'warning'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('warning')}
                                    data-oid="x30v0__"
                                >
                                    <div
                                        className="w-3 h-3 bg-red-400 rounded-sm mr-2"
                                        data-oid="n20q.i1"
                                    ></div>
                                    <span data-oid="59whyqo">活动告警配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'mission_pool'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('mission_pool')}
                                    data-oid=":p2iwa1"
                                >
                                    <div
                                        className="w-3 h-3 bg-green-400 rounded-sm mr-2"
                                        data-oid="oly67iv"
                                    ></div>
                                    <span data-oid="30yzbmw">任务池配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'open_box'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('open_box')}
                                    data-oid="69-f8b1"
                                >
                                    <div
                                        className="w-3 h-3 bg-yellow-400 rounded-sm mr-2"
                                        data-oid="c5:iaxi"
                                    ></div>
                                    <span data-oid="ooj1b_v">开宝箱配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'gift_hat'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('gift_hat')}
                                    data-oid="8.dipdo"
                                >
                                    <div
                                        className="w-3 h-3 bg-pink-400 rounded-sm mr-2"
                                        data-oid="zfo:s:i"
                                    ></div>
                                    <span data-oid="961-5e8">收礼送尾巴</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'birthday'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('birthday')}
                                    data-oid="3w9-ilz"
                                >
                                    <div
                                        className="w-3 h-3 bg-orange-400 rounded-sm mr-2"
                                        data-oid="e1093t:"
                                    ></div>
                                    <span data-oid="3pe05nk">生日配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'stones'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('stones')}
                                    data-oid="-v.na3m"
                                >
                                    <div
                                        className="w-3 h-3 bg-purple-400 rounded-sm mr-2"
                                        data-oid="zrnf7hf"
                                    ></div>
                                    <span data-oid="w3prq9g">石头配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'wash_hands'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('wash_hands')}
                                    data-oid="29h67ax"
                                >
                                    <div
                                        className="w-3 h-3 bg-cyan-400 rounded-sm mr-2"
                                        data-oid="4xqozik"
                                    ></div>
                                    <span data-oid="z4l8v:e">洗手池配置</span>
                                </div>
                                <div
                                    className={`flex items-center p-2 rounded cursor-pointer text-xs ${
                                        activeConfigTab === 'prop_img'
                                            ? 'bg-gray-600'
                                            : 'hover:bg-gray-600'
                                    }`}
                                    onClick={() => setActiveConfigTab('prop_img')}
                                    data-oid="hs-o0:8"
                                >
                                    <div
                                        className="w-3 h-3 bg-indigo-400 rounded-sm mr-2"
                                        data-oid="hw1a:cx"
                                    ></div>
                                    <span data-oid="_12aab-">晨辉图片</span>
                                </div>
                            </div>
                        )}

                        {/* 主导航 - 数据监控 */}
                        <div
                            className={`flex items-center p-2 rounded cursor-pointer ${
                                activeTab === 'monitor' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('monitor')}
                            data-oid="91by06f"
                        >
                            <div
                                className="w-4 h-4 bg-green-500 rounded-sm mr-2"
                                data-oid="0wpdrv9"
                            ></div>
                            <span className="text-sm" data-oid="rx7dm79">
                                数据监控
                            </span>
                        </div>
                    </nav>
                </div>
            </div>

            {/* 主内容区 */}
            <div className="flex-1 p-6" data-oid="gqsgrtb">
                <div className="bg-white rounded-lg shadow-sm" data-oid="1r-ed_5">
                    {/* 头部 */}
                    <div className="border-b border-gray-200 p-6" data-oid="6m:chp_">
                        <h1 className="text-2xl font-medium text-gray-800 mb-2" data-oid="6oicn6m">
                            宝石活动配置管理
                        </h1>
                        <div className="text-sm text-gray-500" data-oid="m-86lgj">
                            {/* 操作员：Wang-Xiu 当前时间：{new Date().toLocaleString('zh-CN')} */}
                        </div>
                    </div>

                    <div className="p-6" data-oid="o83kr.q">
                        {/* 内容区域 */}
                        <div className="bg-gray-50 rounded-lg p-6" data-oid="o:78is9">
                            {activeTab === 'config' && (
                                <>
                                    {/* 配置内容 */}
                                    <div data-oid="vuz48ky">
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
                                        data-oid="cfbi._v"
                                    >
                                        <div className="flex space-x-4" data-oid="8z9btpe">
                                            <button
                                                onClick={fetchData}
                                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                                                data-oid="kkco__9"
                                            >
                                                获取配置
                                            </button>
                                            <button
                                                onClick={submitData}
                                                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                                                data-oid="wbbx:fp"
                                            >
                                                保存配置
                                            </button>
                                            <button
                                                onClick={() => setConfig(defaultConfig)}
                                                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                                                data-oid="5y6n08_"
                                            >
                                                重置配置
                                            </button>
                                        </div>
                                        {apiStatus && (
                                            <div
                                                className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded"
                                                data-oid="eye35pd"
                                            >
                                                {apiStatus}
                                            </div>
                                        )}
                                    </div>

                                    {/* JSON预览 */}
                                    <div className="mt-8" data-oid="hjqhp99">
                                        <h3 className="text-lg font-medium mb-4" data-oid="z:05ly0">
                                            配置JSON预览
                                        </h3>
                                        <pre
                                            className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96 border"
                                            data-oid="wwzun_u"
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
