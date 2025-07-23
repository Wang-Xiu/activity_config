'use client';

import { useState } from 'react';
import { Activity } from '../../types/activity';
import useActivityConfig from '../../utils/useActivityConfig';
import { MainConfig, TaskConfig } from '../../types/config';

interface GemActivityConfigProps {
    activity: Activity;
    onStatusChange?: (status: string) => void;
}

export default function GemActivityConfig({ activity, onStatusChange }: GemActivityConfigProps) {
    const [activeConfigTab, setActiveConfigTab] = useState('send_msg');
    const { config, setConfig, apiStatus, fetchConfig, submitConfig } = useActivityConfig<MainConfig>({
        activity,
        onStatusChange,
    });

    // 类型断言，确保config是MainConfig类型
    const mainConfig = config as MainConfig;

    // 更新配置字段的处理函数
    const handleConfigChange = (path: string[], value: any) => {
        if (!mainConfig) return;
        
        // 创建配置的深拷贝
        const newConfig = JSON.parse(JSON.stringify(mainConfig));
        
        // 根据路径更新配置
        let current = newConfig;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
        
        // 更新配置状态
        setConfig(newConfig);
    };

    // 渲染文本输入字段
    const renderTextField = (label: string, path: string[], value: string | number) => {
        return (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => handleConfigChange(path, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        );
    };

    // 渲染开关字段
    const renderToggle = (label: string, path: string[], value: number) => {
        return (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="flex items-center space-x-4">
                    <button
                        className={`px-3 py-1 rounded ${value === 1 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleConfigChange(path, 1)}
                    >
                        开启
                    </button>
                    <button
                        className={`px-3 py-1 rounded ${value === 0 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleConfigChange(path, 0)}
                    >
                        关闭
                    </button>
                </div>
            </div>
        );
    };

    if (!mainConfig) {
        return <div className="flex items-center justify-center h-full">加载中...</div>;
    }

    return (
        <div className="flex flex-col h-full">
            {/* 配置管理子菜单 */}
            <div className="flex space-x-4 mb-4 overflow-x-auto pb-2">
                <button
                    className={`px-4 py-2 rounded ${activeConfigTab === 'send_msg' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveConfigTab('send_msg')}
                >
                    发送消息
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeConfigTab === 'alert' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveConfigTab('alert')}
                >
                    告警
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeConfigTab === 'task_pool' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveConfigTab('task_pool')}
                >
                    任务池
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeConfigTab === 'open_box' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveConfigTab('open_box')}
                >
                    开宝箱
                </button>
            </div>

            {/* 配置内容区域 */}
            <div className="flex-1 bg-white p-4 rounded-lg shadow overflow-y-auto">
                {/* 发送消息配置 */}
                {activeConfigTab === 'send_msg' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">发送消息配置</h3>
                        <div className="space-y-6">
                            {renderToggle('是否开启发送通知', ['send_msg_config', 'send_msg'], mainConfig.send_msg_config.send_msg)}

                            <div className="border-t pt-4">
                                <h4 className="font-medium text-gray-800 mb-3">通知发送内容</h4>
                                {renderTextField('匹配完成通知', ['send_msg_config', 'send_msg_info', 'match_done'],
                                    mainConfig.send_msg_config.send_msg_info.match_done)}
                                {renderTextField('周四提示通知', ['send_msg_config', 'send_msg_info', 'thursday_tips'],
                                    mainConfig.send_msg_config.send_msg_info.thursday_tips)}
                                {renderTextField('差20点提示', ['send_msg_config', 'send_msg_info', 'need_20_value'],
                                    mainConfig.send_msg_config.send_msg_info.need_20_value)}
                                {renderTextField('两天提示', ['send_msg_config', 'send_msg_info', 'two_days_tips'],
                                    mainConfig.send_msg_config.send_msg_info.two_days_tips)}
                                {renderTextField('第四周提示', ['send_msg_config', 'send_msg_info', 'fourth_week'],
                                    mainConfig.send_msg_config.send_msg_info.fourth_week)}
                            </div>
                        </div>
                    </div>
                )}

                {/* 告警配置 */}
                {activeConfigTab === 'alert' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">告警配置</h3>
                        <div className="space-y-6">
                            {renderToggle('是否开启告警邮件发送', ['send_warning_config', 'send_warning'],
                                mainConfig.send_warning_config.send_warning)}

                            {renderTextField('告警产生的活动名', ['send_warning_config', 'send_warning_act_name'],
                                mainConfig.send_warning_config.send_warning_act_name)}

                            {renderTextField('告警邮件发送间隔(秒)', ['send_warning_config', 'send_warning_interval'],
                                mainConfig.send_warning_config.send_warning_interval)}

                            <div className="border-t pt-4">
                                <h4 className="font-medium text-gray-800 mb-3">告警礼物时间间隔配置</h4>
                                {Object.entries(mainConfig.send_warning_config.interval_warning_time).map(([key, value]) => (
                                    <div key={key} className="flex items-center space-x-2 mb-2">
                                        <span className="text-sm text-gray-600 w-24">礼物ID: {key}</span>
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => {
                                                const newIntervalWarningTime = {...mainConfig.send_warning_config.interval_warning_time};
                                                newIntervalWarningTime[key] = e.target.value;
                                                handleConfigChange(['send_warning_config', 'interval_warning_time'], newIntervalWarningTime);
                                            }}
                                            className="flex-1 px-2 py-1 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t pt-4">
                                <h4 className="font-medium text-gray-800 mb-3">告警礼物数量阈值配置</h4>
                                {Object.entries(mainConfig.send_warning_config.interval_warning_prize).map(([key, value]) => (
                                    <div key={key} className="flex items-center space-x-2 mb-2">
                                        <span className="text-sm text-gray-600 w-24">礼物ID: {key}</span>
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => {
                                                const newIntervalWarningPrize = {...mainConfig.send_warning_config.interval_warning_prize};
                                                newIntervalWarningPrize[key] = e.target.value;
                                                handleConfigChange(['send_warning_config', 'interval_warning_prize'], newIntervalWarningPrize);
                                            }}
                                            className="flex-1 px-2 py-1 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                ))}
                            </div>

                            {renderTextField('接口访问次数风控告警-指定时间内(秒)', ['send_warning_config', 'report_time'],
                                mainConfig.send_warning_config.report_time)}

                            {renderTextField('接口访问次数风控告警-访问次数阈值', ['send_warning_config', 'report_num'],
                                mainConfig.send_warning_config.report_num)}

                            {renderTextField('告警消息模板', ['send_warning_config', 'msg_1'],
                                mainConfig.send_warning_config.msg_1)}

                            {renderTextField('礼物发放数量', ['send_warning_config', 'give_gift_num'],
                                mainConfig.send_warning_config.give_gift_num)}
                        </div>
                    </div>
                )}

                {/* 任务池配置 */}
                {activeConfigTab === 'task_pool' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">任务池配置</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-medium text-gray-800 mb-3">新用户任务</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(mainConfig.act_config.mission_pool.new_user).map(([key, task]) => {
                                        const taskConfig = task as TaskConfig;
                                        return (
                                        <div key={key} className="border p-3 rounded-md">
                                            <div className="font-medium mb-2">{taskConfig.desc}</div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-xs text-gray-500">需要完成</label>
                                                    <input
                                                        type="text"
                                                        value={taskConfig.need}
                                                        onChange={(e) => {
                                                            const newTask = {...taskConfig, need: e.target.value};
                                                            const newNewUser = {...mainConfig.act_config.mission_pool.new_user};
                                                            newNewUser[key] = newTask;
                                                            handleConfigChange(['act_config', 'mission_pool', 'new_user'], newNewUser);
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500">获得奖励</label>
                                                    <input
                                                        type="text"
                                                        value={taskConfig.get}
                                                        onChange={(e) => {
                                                            const newTask = {...taskConfig, get: e.target.value};
                                                            const newNewUser = {...mainConfig.act_config.mission_pool.new_user};
                                                            newNewUser[key] = newTask;
                                                            handleConfigChange(['act_config', 'mission_pool', 'new_user'], newNewUser);
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                    })}
                                </div>
                            </div>
                            
                            <div className="border-t pt-4">
                                <h4 className="font-medium text-gray-800 mb-3">老用户任务</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(mainConfig.act_config.mission_pool.old_user).map(([key, task]) => {
                                        const taskConfig = task as TaskConfig;
                                        return (
                                        <div key={key} className="border p-3 rounded-md">
                                            <div className="font-medium mb-2">{taskConfig.desc}</div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-xs text-gray-500">需要完成</label>
                                                    <input
                                                        type="text"
                                                        value={taskConfig.need}
                                                        onChange={(e) => {
                                                            const newTask = {...taskConfig, need: e.target.value};
                                                            const newOldUser = {...mainConfig.act_config.mission_pool.old_user};
                                                            newOldUser[key] = newTask;
                                                            handleConfigChange(['act_config', 'mission_pool', 'old_user'], newOldUser);
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500">获得奖励</label>
                                                    <input
                                                        type="text"
                                                        value={taskConfig.get}
                                                        onChange={(e) => {
                                                            const newTask = {...taskConfig, get: e.target.value};
                                                            const newOldUser = {...mainConfig.act_config.mission_pool.old_user};
                                                            newOldUser[key] = newTask;
                                                            handleConfigChange(['act_config', 'mission_pool', 'old_user'], newOldUser);
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            </div>
                                            {taskConfig.gift_id && (
                                                <div className="mt-2">
                                                    <label className="text-xs text-gray-500">礼物ID</label>
                                                    <input
                                                        type="text"
                                                        value={taskConfig.gift_id}
                                                        onChange={(e) => {
                                                            const newTask = {...taskConfig, gift_id: e.target.value};
                                                            const newOldUser = {...mainConfig.act_config.mission_pool.old_user};
                                                            newOldUser[key] = newTask;
                                                            handleConfigChange(['act_config', 'mission_pool', 'old_user'], newOldUser);
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 开宝箱配置 */}
                {activeConfigTab === 'open_box' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">开宝箱配置</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-medium text-gray-800 mb-3">免费领宝箱时间1</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">开始时间</label>
                                        <input
                                            type="text"
                                            value={mainConfig.act_config.open_box_config.free_box_time_1.start}
                                            onChange={(e) => handleConfigChange(
                                                ['act_config', 'open_box_config', 'free_box_time_1', 'start'], 
                                                e.target.value
                                            )}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">结束时间</label>
                                        <input
                                            type="text"
                                            value={mainConfig.act_config.open_box_config.free_box_time_1.end}
                                            onChange={(e) => handleConfigChange(
                                                ['act_config', 'open_box_config', 'free_box_time_1', 'end'], 
                                                e.target.value
                                            )}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-medium text-gray-800 mb-3">免费领宝箱时间2</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">开始时间</label>
                                        <input
                                            type="text"
                                            value={mainConfig.act_config.open_box_config.free_box_time_2.start}
                                            onChange={(e) => handleConfigChange(
                                                ['act_config', 'open_box_config', 'free_box_time_2', 'start'], 
                                                e.target.value
                                            )}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">结束时间</label>
                                        <input
                                            type="text"
                                            value={mainConfig.act_config.open_box_config.free_box_time_2.end}
                                            onChange={(e) => handleConfigChange(
                                                ['act_config', 'open_box_config', 'free_box_time_2', 'end'], 
                                                e.target.value
                                            )}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-t pt-4">
                                <h4 className="font-medium text-gray-800 mb-3">送礼得月华宝箱钥匙</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">礼物ID</label>
                                        <input
                                            type="text"
                                            value={mainConfig.act_config.open_box_config.send_gift_get_box.gift_id}
                                            onChange={(e) => handleConfigChange(
                                                ['act_config', 'open_box_config', 'send_gift_get_box', 'gift_id'], 
                                                e.target.value
                                            )}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">礼物名称</label>
                                        <input
                                            type="text"
                                            value={mainConfig.act_config.open_box_config.send_gift_get_box.gift_name}
                                            onChange={(e) => handleConfigChange(
                                                ['act_config', 'open_box_config', 'send_gift_get_box', 'gift_name'], 
                                                e.target.value
                                            )}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <label className="text-sm text-gray-600">礼物图片</label>
                                        <input
                                            type="text"
                                            value={mainConfig.act_config.open_box_config.send_gift_get_box.gift_img}
                                            onChange={(e) => handleConfigChange(
                                                ['act_config', 'open_box_config', 'send_gift_get_box', 'gift_img'], 
                                                e.target.value
                                            )}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">获得道具数量</label>
                                        <input
                                            type="text"
                                            value={mainConfig.act_config.open_box_config.send_gift_get_box.get_prop_num}
                                            onChange={(e) => handleConfigChange(
                                                ['act_config', 'open_box_config', 'send_gift_get_box', 'get_prop_num'], 
                                                e.target.value
                                            )}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* API操作按钮和状态 */}
            <div className="mt-4 flex items-center justify-between">
                <div className="space-x-4">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={fetchConfig}
                    >
                        获取配置
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={submitConfig}
                    >
                        保存配置
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={() => setConfig(null)}
                    >
                        重置配置
                    </button>
                </div>
                {apiStatus && (
                    <div className="text-sm text-gray-600">{apiStatus}</div>
                )}
            </div>

            {/* JSON预览区域 */}
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">配置预览</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                    {JSON.stringify(mainConfig, null, 2)}
                </pre>
            </div>
        </div>
    );
}