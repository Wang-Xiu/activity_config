'use client';

import { useState } from 'react';
import { Activity } from '../../types/activity';
import useActivityConfig from '../../utils/useActivityConfig';
import { MainConfig } from '../../types/config';

interface RedPacketActivityConfigProps {
    activity: Activity;
    onStatusChange?: (status: string) => void;
}

export default function RedPacketActivityConfig({ activity, onStatusChange }: RedPacketActivityConfigProps) {
    const [activeConfigTab, setActiveConfigTab] = useState('send_msg');
    const { config, setConfig, apiStatus, fetchConfig, submitConfig } = useActivityConfig<MainConfig>({
        activity,
        onStatusChange,
    });

    if (!config) {
        return <div className="flex items-center justify-center h-full">加载中...</div>;
    }

    return (
        <div className="flex flex-col h-full">
            {/* 配置管理子菜单 */}
            <div className="flex space-x-4 mb-4">
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
            <div className="flex-1 bg-white p-4 rounded-lg shadow">
                {/* 根据activeConfigTab渲染不同的配置组件 */}
                {activeConfigTab === 'send_msg' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">发送消息配置</h3>
                        {/* 添加发送消息相关的配置表单 */}
                    </div>
                )}
                {activeConfigTab === 'alert' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">告警配置</h3>
                        {/* 添加告警相关的配置表单 */}
                    </div>
                )}
                {activeConfigTab === 'task_pool' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">任务池配置</h3>
                        {/* 添加任务池相关的配置表单 */}
                    </div>
                )}
                {activeConfigTab === 'red_packet' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">红包配置</h3>
                        {/* 添加红包相关的配置表单 */}
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
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify(config, null, 2)}
                </pre>
            </div>
        </div>
    );
}