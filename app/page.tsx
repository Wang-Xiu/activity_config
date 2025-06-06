'use client';

import { useState } from 'react';
import { defaultConfig } from '../config/defaultConfig';
import { MainConfig } from '../types/config';

export default function Page() {
    const [config, setConfig] = useState<MainConfig>(defaultConfig);
    const [activeTab, setActiveTab] = useState('send_msg');
    const [apiStatus, setApiStatus] = useState('');

    // 模拟API请求
    const fetchData = async () => {
        setApiStatus('正在获取数据...');
        try {
            setTimeout(() => {
                setApiStatus('数据获取成功');
                setTimeout(() => setApiStatus(''), 2000);
            }, 1000);
        } catch (error) {
            setApiStatus('获取数据失败');
        }
    };

    const submitData = async () => {
        setApiStatus('正在提交数据...');
        try {
            setTimeout(() => {
                setApiStatus('数据提交成功');
                setTimeout(() => setApiStatus(''), 2000);
            }, 1000);
        } catch (error) {
            setApiStatus('提交数据失败');
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

    const renderActivityConfig = () => (
        <div className="space-y-6" data-oid="7_hfq2_">
            <h3 className="text-lg font-medium mb-4" data-oid="t.g50-o">
                活动配置
            </h3>

            <div data-oid="yzflppl">
                <h4 className="font-medium mb-3" data-oid="d.amo5p">
                    开宝箱时间配置
                </h4>
                <div className="grid grid-cols-2 gap-4" data-oid="rqmoim8">
                    <div data-oid="_zw7ijq">
                        <label className="block text-sm font-medium mb-2" data-oid="yeo2-zw">
                            免费时段1
                        </label>
                        <div className="flex space-x-2" data-oid="5d0wiye">
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
                                data-oid="1w8shgz"
                            />

                            <span className="self-center" data-oid="e7lvtk6">
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
                                data-oid="e.8d:4:"
                            />
                        </div>
                    </div>
                    <div data-oid="ktxmpql">
                        <label className="block text-sm font-medium mb-2" data-oid=".jvhh8v">
                            免费时段2
                        </label>
                        <div className="flex space-x-2" data-oid="sw:g67_">
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
                                data-oid="ste:zmt"
                            />

                            <span className="self-center" data-oid="dvs9039">
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
                                data-oid="w4reanq"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div data-oid="jevpk51">
                <h4 className="font-medium mb-3" data-oid="p:1_.3-">
                    洗手池晨辉配置
                </h4>
                <div data-oid="xmmsxrx">
                    <label className="block text-sm font-medium mb-2" data-oid="w3t:x_-">
                        每日次数
                    </label>
                    <input
                        type="number"
                        value={config.act_config.wash_hands_config.day_chance}
                        onChange={(e) =>
                            updateConfig('act_config.wash_hands_config.day_chance', e.target.value)
                        }
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        data-oid="q1n1e.."
                    />
                </div>

                <div className="mt-4" data-oid="yj68da9">
                    <label className="block text-sm font-medium mb-2" data-oid="t.8w4_:">
                        奖励池配置
                    </label>
                    <div className="space-y-2" data-oid="ttiyy.a">
                        {Object.entries(config.act_config.wash_hands_config.pool).map(
                            ([key, pool]) => (
                                <div
                                    key={key}
                                    className="flex space-x-4 items-center"
                                    data-oid="wzg:.0_"
                                >
                                    <span className="w-8" data-oid=".q_pqt9">
                                        #{key}
                                    </span>
                                    <div data-oid="b:ti-x4">
                                        <label className="text-xs" data-oid="o71sk-k">
                                            晨辉值
                                        </label>
                                        <input
                                            type="number"
                                            value={pool.value}
                                            onChange={(e) =>
                                                updateConfig(
                                                    `act_config.wash_hands_config.pool.${key}.value`,
                                                    e.target.value,
                                                )
                                            }
                                            className="border border-gray-300 rounded px-2 py-1 w-20"
                                            data-oid="_xo34ja"
                                        />
                                    </div>
                                    <div data-oid="sk.jf6v">
                                        <label className="text-xs" data-oid="oh8hpah">
                                            概率(%)
                                        </label>
                                        <input
                                            type="number"
                                            value={pool.probability}
                                            onChange={(e) =>
                                                updateConfig(
                                                    `act_config.wash_hands_config.pool.${key}.probability`,
                                                    e.target.value,
                                                )
                                            }
                                            className="border border-gray-300 rounded px-2 py-1 w-20"
                                            data-oid="zvdf:j6"
                                        />
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </div>

            <div data-oid="qjd2276">
                <h4 className="font-medium mb-3" data-oid="n6e.msn">
                    生日配置
                </h4>
                <div className="grid grid-cols-2 gap-4" data-oid="-dmvs6e">
                    <div data-oid="vssdm0p">
                        <label className="block text-sm font-medium mb-2" data-oid="lrg3831">
                            原价格
                        </label>
                        <input
                            type="number"
                            value={config.act_config.happy_birthday_config.origin_price}
                            onChange={(e) =>
                                updateConfig(
                                    'act_config.happy_birthday_config.origin_price',
                                    e.target.value,
                                )
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            data-oid="tfm4b32"
                        />
                    </div>
                    <div data-oid="boyg5xv">
                        <label className="block text-sm font-medium mb-2" data-oid="60g:_x8">
                            现价格
                        </label>
                        <input
                            type="number"
                            value={config.act_config.happy_birthday_config.now_price}
                            onChange={(e) =>
                                updateConfig(
                                    'act_config.happy_birthday_config.now_price',
                                    e.target.value,
                                )
                            }
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            data-oid="j7030y1"
                        />
                    </div>
                </div>
            </div>

            <div data-oid=":g3tc1f">
                <label className="block text-sm font-medium mb-2" data-oid="cu4-lv_">
                    晨辉图片
                </label>
                <input
                    type="text"
                    value={config.act_config.prop_img}
                    onChange={(e) => updateConfig('act_config.prop_img', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    data-oid="ns.00.4"
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
                                activeTab === 'activity' ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => setActiveTab('activity')}
                            data-oid="activity-tab"
                        >
                            <div
                                className="w-4 h-4 bg-green-500 rounded-sm mr-2"
                                data-oid="activity-icon"
                            ></div>
                            <span className="text-sm" data-oid="activity-text">
                                活动配置
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
