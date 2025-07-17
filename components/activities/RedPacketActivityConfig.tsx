'use client';

import { useState } from 'react';
import { Activity } from '../../types/activity';
import ActivityConfigPage from '../ActivityConfigPage';
import { MainConfig } from '../../types/config';

interface RedPacketActivityConfigProps {
    activity: Activity;
    onStatusChange?: (status: string) => void;
}

export default function RedPacketActivityConfig({ activity, onStatusChange }: RedPacketActivityConfigProps) {
    const [activeConfigTab, setActiveConfigTab] = useState('send_msg');
    const { config, setConfig, apiStatus, fetchConfig, submitConfig } = ActivityConfigPage({
        activity,
        onStatusChange,
    });

    // 更新配置字段的处理函数
    const handleConfigChange = (path: string[], value: any) => {
        if (!config) return;
        
        // 创建配置的深拷贝
        const newConfig = JSON.parse(JSON.stringify(config));
        
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

    if (!config) {
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
                    className={`px-4 py-2 rounded ${activeConfigTab === 'red_packet' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveConfigTab('red_packet')}
                >
                    红包配置
                </button>
            </div>

            {/* 配置内容区域 */}
            <div className="flex-1 bg-white p-4 rounded-lg shadow overflow-y-auto">
                {/* 发送消息配置 */}
                {activeConfigTab === 'send_msg' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">发送消息配置</h3>
                        <div className="space-y-6">
                            {renderToggle('是否开启发送通知', ['send_msg_config', 'send_msg'], config.send_msg_config.send_msg)}
                            
                            <div className="border-t pt-4">
                                <h4 className="font-medium text-gray-800 mb-3">通知发送内容</h4>
                                {renderTextField('匹配完成通知', ['send_msg_config', 'send_msg_info', 'match_done'], 
                                    config.send_msg_config.send_msg_info.match_done)}
                                {renderTextField('周四提示通知', ['send_msg_config', 'send_msg_info', 'thursday_tips'], 
                                    config.send_msg_config.send_msg_info.thursday_tips)}
                                {renderTextField('差20点提示', ['send_msg_config', 'send_msg_info', 'need_20_value'], 
                                    config.send_msg_config.send_msg_info.need_20_value)}
                                {renderTextField('两天提示', ['send_msg_config', 'send_msg_info', 'two_days_tips'], 
                                    config.send_msg_config.send_msg_info.two_days_tips)}
                                {renderTextField('第四周提示', ['send_msg_config', 'send_msg_info', 'fourth_week'], 
                                    config.send_msg_config.send_msg_info.fourth_week)}
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
                                config.send_warning_config.send_warning)}
                            
                            {renderTextField('告警产生的活动名', ['send_warning_config', 'send_warning_act_name'], 
                                config.send_warning_config.send_warning_act_name)}
                            
                            {renderTextField('告警邮件发送间隔(秒)', ['send_warning_config', 'send_warning_interval'], 
                                config.send_warning_config.send_warning_interval)}
                            
                            <div className="border-t pt-4">
                                <h4 className="font-medium text-gray-800 mb-3">告警礼物时间间隔配置</h4>
                                {Object.entries(config.send_warning_config.interval_warning_time).map(([key, value]) => (
                                    <div key={key} className="flex items-center space-x-2 mb-2">
                                        <span className="text-sm text-gray-600 w-24">礼物ID: {key}</span>
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => {
                                                const newIntervalWarningTime = {...config.send_warning_config.interval_warning_time};
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
                                {Object.entries(config.send_warning_config.interval_warning_prize).map(([key, value]) => (
                                    <div key={key} className="flex items-center space-x-2 mb-2">
                                        <span className="text-sm text-gray-600 w-24">礼物ID: {key}</span>
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => {
                                                const newIntervalWarningPrize = {...config.send_warning_config.interval_warning_prize};
                                                newIntervalWarningPrize[key] = e.target.value;
                                                handleConfigChange(['send_warning_config', 'interval_warning_prize'], newIntervalWarningPrize);
                                            }}
                                            className="flex-1 px-2 py-1 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                ))}
                            </div>
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
                                    {Object.entries(config.act_config.mission_pool.new_user).map(([key, task]) => (
                                        <div key={key} className="border p-3 rounded-md">
                                            <div className="font-medium mb-2">{task.desc}</div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-xs text-gray-500">需要完成</label>
                                                    <input
                                                        type="text"
                                                        value={task.need}
                                                        onChange={(e) => {
                                                            const newTask = {...task, need: e.target.value};
                                                            const newNewUser = {...config.act_config.mission_pool.new_user};
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
                                                        value={task.get}
                                                        onChange={(e) => {
                                                            const newTask = {...task, get: e.target.value};
                                                            const newNewUser = {...config.act_config.mission_pool.new_user};
                                                            newNewUser[key] = newTask;
                                                            handleConfigChange(['act_config', 'mission_pool', 'new_user'], newNewUser);
                                                        }}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 红包配置 */}
                {activeConfigTab === 'red_packet' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">红包配置</h3>
                        <div className="space-y-6">
                            <div className="border p-4 rounded-md">
                                <h4 className="font-medium text-gray-800 mb-3">红包基础配置</h4>
                                {renderTextField('红包活动名称', ['red_packet_config', 'name'], 
                                    config.red_packet_config?.name || '红包活动')}
                                {renderTextField('红包活动描述', ['red_packet_config', 'description'], 
                                    config.red_packet_config?.description || '发红包活动')}
                                {renderToggle('是否开启红包活动', ['red_packet_config', 'enabled'], 
                                    config.red_packet_config?.enabled || 1)}
                            </div>
                            
                            <div className="border p-4 rounded-md">
                                <h4 className="font-medium text-gray-800 mb-3">红包金额配置</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">最小金额(元)</label>
                                        <input
                                            type="text"
                                            value={config.red_packet_config?.min_amount || '1'}
                                            onChange={(e) => handleConfigChange(['red_packet_config', 'min_amount'], e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">最大金额(元)</label>
                                        <input
                                            type="text"
                                            value={config.red_packet_config?.max_amount || '100'}
                                            onChange={(e) => handleConfigChange(['red_packet_config', 'max_amount'], e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border p-4 rounded-md">
                                <h4 className="font-medium text-gray-800 mb-3">红包数量配置</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">最小数量</label>
                                        <input
                                            type="text"
                                            value={config.red_packet_config?.min_count || '1'}
                                            onChange={(e) => handleConfigChange(['red_packet_config', 'min_count'], e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">最大数量</label>
                                        <input
                                            type="text"
                                            value={config.red_packet_config?.max_count || '10'}
                                            onChange={(e) => handleConfigChange(['red_packet_config', 'max_count'], e.target.value)}
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
                    {JSON.stringify(config, null, 2)}
                </pre>
            </div>
        </div>
    );
}