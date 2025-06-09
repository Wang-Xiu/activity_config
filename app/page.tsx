'use client';

import { useState, useEffect } from 'react';
import { defaultConfig } from '../config/defaultConfig';
import { MainConfig } from '../types/config';
import { getApiUrl, API_ENDPOINTS, ENV_CONFIG } from '../config/env';
import DataMonitoring from '../components/DataMonitoring';

export default function Page() {
    const [config, setConfig] = useState<MainConfig>(defaultConfig);
    const [activeTab, setActiveTab] = useState('send_msg');
    const [activeMainTab, setActiveMainTab] = useState('config');
    const [apiStatus, setApiStatus] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setApiStatus('正在获取数据...');
        try {
            const apiUrl = getApiUrl(API_ENDPOINTS.GET_CONFIG);
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success && result.data) {
                setConfig(result.data);
                setApiStatus('数据获取成功');
                console.log('获取成功:', result);
            } else {
                throw new Error('API返回数据格式错误');
            }

            setTimeout(() => setApiStatus(''), 2000);
        } catch (error) {
            console.error('获取失败:', error);
            setApiStatus('获取数据失败: ' + (error as Error).message);
            setConfig(defaultConfig);
            setTimeout(() => setApiStatus(''), 3000);
        }
    };

    const submitData = async () => {
        setApiStatus('正在提交数据...');
        try {
            const apiUrl = getApiUrl(API_ENDPOINTS.SAVE_CONFIG);
            const formData = new FormData();
            formData.append('config', JSON.stringify(config));

            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                setApiStatus('数据提交成功');
                console.log('保存成功:', result);
            } else {
                throw new Error('保存失败');
            }

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

    // Render functions would go here...
    // (I'll add them in the next message due to length)

    return (
        <div className="min-h-screen bg-gray-100 flex" data-oid="2:-vmro">
            <div className="w-64 bg-gray-800 text-white" data-oid="fa:pxu0">
                <div className="p-4" data-oid="me-j-6u">
                    <div className="flex items-center mb-8" data-oid="lz9b:nv">
                        <div className="w-4 h-4 bg-gray-600 rounded mr-2" data-oid="3sh34lg"></div>
                        <span className="text-sm" data-oid="4wiokwd">
                            宝石活动配置管理
                        </span>
                    </div>
                    <nav className="space-y-2" data-oid="3rebv7p">
                        {/* Navigation items */}
                    </nav>
                </div>
            </div>
            <div className="flex-1 p-6" data-oid="g6dvrgk">
                <div className="bg-white rounded-lg shadow-sm" data-oid="l3gzt_u">
                    <div className="border-b border-gray-200 p-6" data-oid="ri13ekl">
                        <h1 className="text-2xl font-medium text-gray-800 mb-2" data-oid="5t64htr">
                            宝石活动配置管理
                        </h1>
                        <div className="text-sm text-gray-500" data-oid="4h0vfh7">
                            {/* 操作员：Wang-Xiu 当前时间：{new Date().toLocaleString('zh-CN')} */}
                        </div>
                    </div>
                    <div className="p-6" data-oid="xjy27_s">
                        <div className="bg-gray-50 rounded-lg p-6" data-oid="_6ake:p">
                            {activeMainTab === 'config' && <>{/* Config content */}</>}
                            {activeMainTab === 'monitoring' && (
                                <DataMonitoring data-oid="mso0sft" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
